import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserChats as getUserChatsAPI, getMessages, sendMessage, updateMessage, deleteMessage, markMessageSeen, removeGroupMember, leaveGroup, updateGroupInfo, updateChatSettings, getUser, Chat, Message } from '../../firebase/firestoreHelpers';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
};

export const loadChats = createAsyncThunk('chat/loadChats', async (uid: string, { rejectWithValue }) => {
  return new Promise<Chat[]>(async (resolve) => {
    getUserChatsAPI(uid, async (chats) => {
      const enhancedChats = await Promise.all(
        chats.map(async (chat) => {
          const otherMembers = (chat.members || []).filter((m: string) => m !== uid);
          const membersData = await Promise.all(
            otherMembers.map(async (memberId: string) => await getUser(memberId))
          );
          return { ...chat, membersData };
        })
      );
      resolve(enhancedChats);
    });
  });
});

export const selectChat = createAsyncThunk('chat/selectChat', async (chat: Chat) => chat);

export const loadMessages = createAsyncThunk('chat/loadMessages', async (chatId: string, { rejectWithValue }) => {
  return new Promise<Message[]>((resolve) => {
    getMessages(chatId, (messages) => {
      resolve(messages);
    });
  });
});

export const sendChatMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, message }: { chatId: string; message: Message & { imageFile?: File } }, { rejectWithValue }) => {
    try {
      await sendMessage(chatId, message);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const editChatMessage = createAsyncThunk(
  'chat/editMessage',
  async ({ chatId, messageId, newContent }: { chatId: string; messageId: string; newContent: Partial<Message> }, { rejectWithValue }) => {
    try {
      await updateMessage(chatId, messageId, newContent);
      return { messageId, newContent };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChatMessage = createAsyncThunk(
  'chat/deleteMessage',
  async ({ chatId, messageId }: { chatId: string; messageId: string }, { rejectWithValue }) => {
    try {
      await deleteMessage(chatId, messageId);
      return messageId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markMessageSeenThunk = createAsyncThunk(
  'chat/markMessageSeen',
  async ({ chatId, messageId, uid }: { chatId: string; messageId: string; uid: string }, { rejectWithValue }) => {
    try {
      await markMessageSeen(chatId, messageId, uid);
      return { messageId, uid };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeGroupMemberThunk = createAsyncThunk(
  'chat/removeGroupMember',
  async ({ chatId, uid }: { chatId: string; uid: string }, { rejectWithValue }) => {
    try {
      await removeGroupMember(chatId, uid);
      return { chatId, uid };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const leaveGroupThunk = createAsyncThunk(
  'chat/leaveGroup',
  async ({ chatId, uid }: { chatId: string; uid: string }, { rejectWithValue }) => {
    try {
      await leaveGroup(chatId, uid);
      return { chatId, uid };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateGroupInfoThunk = createAsyncThunk(
  'chat/updateGroupInfo',
  async ({ chatId, groupName, groupImage }: { chatId: string; groupName: string; groupImage: string }, { rejectWithValue }) => {
    try {
      await updateGroupInfo(chatId, groupName, groupImage);
      return { chatId, groupName, groupImage };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateChatSettingsThunk = createAsyncThunk(
  'chat/updateChatSettings',
  async ({ chatId, settings }: { chatId: string; settings: Partial<Chat> }, { rejectWithValue }) => {
    try {
      await updateChatSettings(chatId, settings);
      return { chatId, settings };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addOptimisticMessage(state, action) {
      state.messages.push(action.payload);
    },
    markMessageDeleting(state, action) {
      const msg = state.messages.find((m) => m.id === action.payload);
      if (msg) msg.deleting = true;
    },
    removeOptimisticMessage(state, action) {
      state.messages = state.messages.filter((m) => m.id !== action.payload);
    },
    updateOptimisticMessage(state, action) {
      const { tempId, newData } = action.payload;
      state.messages = state.messages.map((m) =>
        m.id === tempId ? { ...m, ...newData, pending: false } : m
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(loadChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(selectChat.fulfilled, (state, action) => {
        state.currentChat = action.payload;
      })
      .addCase(loadMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editChatMessage.fulfilled, (state, action) => {
        const { messageId, newContent } = action.payload;
        state.messages = state.messages.map((msg) =>
          msg.id === messageId ? { ...msg, ...newContent, editedAt: new Date() } : msg
        );
      })
      .addCase(sendChatMessage.pending, () => {
        // handled in UI for now
      })
      .addCase(sendChatMessage.fulfilled, (state) => {
        // Remove pending messages on success (UI will reload messages)
        state.messages = state.messages.filter((m) => !m.pending);
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        // Remove pending messages on error
        state.messages = state.messages.filter((m) => !m.pending);
        state.error = action.payload as string;
      })
      .addCase(deleteChatMessage.pending, () => {
        // handled in UI for now
      })
      .addCase(deleteChatMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter((msg) => msg.id !== action.payload);
      })
      .addCase(deleteChatMessage.rejected, (state, action) => {
        // Restore deleting messages
        state.messages = state.messages.map((msg) =>
          msg.deleting ? { ...msg, deleting: false } : msg
        );
        state.error = action.payload as string;
      })
      .addCase(markMessageSeenThunk.fulfilled, (state, action) => {
        const { messageId, uid } = action.payload;
        state.messages = state.messages.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                seenBy: msg.seenBy ? [...msg.seenBy, { uid, seenAt: new Date() }] : [{ uid, seenAt: new Date() }],
              }
            : msg
        );
      })
      .addCase(removeGroupMemberThunk.fulfilled, (state, action) => {
        if (state.currentChat && state.currentChat.id === action.payload.chatId) {
          state.currentChat.members = state.currentChat.members.filter((m: string) => m !== action.payload.uid);
        }
      })
      .addCase(leaveGroupThunk.fulfilled, (state, action) => {
        if (state.currentChat && state.currentChat.id === action.payload.chatId) {
          state.currentChat.members = state.currentChat.members.filter((m: string) => m !== action.payload.uid);
        }
      })
      .addCase(updateGroupInfoThunk.fulfilled, (state, action) => {
        if (state.currentChat && state.currentChat.id === action.payload.chatId) {
          state.currentChat.groupName = action.payload.groupName;
          state.currentChat.groupImage = action.payload.groupImage;
        }
      })
      .addCase(updateChatSettingsThunk.fulfilled, (state, action) => {
        if (state.currentChat && state.currentChat.id === action.payload.chatId) {
          Object.assign(state.currentChat, action.payload.settings);
        }
      });
  },
});

export const { addOptimisticMessage, markMessageDeleting, removeOptimisticMessage, updateOptimisticMessage } = chatSlice.actions;

export default chatSlice.reducer; 