import { db } from '.';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  Timestamp,
  FieldValue,
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Types
export interface User {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
}
export interface Chat {
  id?: string;
  members: string[];
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  createdAt?: Timestamp | FieldValue;
  lastMessage?: string;
  lastMessageAt?: Timestamp | FieldValue;
  expiresAt?: number | null;
}
export interface Message {
  id?: string;
  sender: string;
  text?: string;
  imageUrl?: string;
  createdAt?: Timestamp | FieldValue;
  editedAt?: Timestamp | FieldValue;
  seenBy?: { uid: string; seenAt: Timestamp | FieldValue }[];
  pending?: boolean;
  deleting?: boolean;
  replyTo?: string;
}
export interface Status {
  id?: string;
  uid: string;
  displayName: string;
  photoURL: string;
  text?: string;
  mediaUrl?: string;
  createdAt?: Timestamp | FieldValue;
  type?: string;
}

// USERS
export const createUser = async (user: User) => {
  await setDoc(doc(db, 'users', user.uid), user, { merge: true });
};

export const getUser = async (uid: string) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() as User : null;
};

export const searchUsers = async (search: string) => {
  const usersSnap = await getDocs(collection(db, 'users'));
  return usersSnap.docs.map(doc => doc.data() as User).filter((u) => u.displayName.toLowerCase().includes(search.toLowerCase()));
};

// CHATS
export const createChat = async (members: string[], isGroup = false, groupName = '', groupImage = '', expiresAt: number | null = null) => {
  const chatData: Chat = {
    members,
    isGroup,
    groupName,
    groupImage,
    createdAt: serverTimestamp(),
    lastMessage: '',
    lastMessageAt: serverTimestamp(),
    expiresAt: expiresAt ?? undefined,
  };
  const chatRef = await addDoc(collection(db, 'chats'), chatData);
  return chatRef.id;
};

export const getUserChats = (uid: string, callback: (chats: Chat[]) => void) => {
  const q = query(collection(db, 'chats'));
  return onSnapshot(q, (snapshot) => {
    const chats: Chat[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
    callback(chats.filter(chat => chat.members.includes(uid)));
  });
};

export const addGroupMember = async (chatId: string, uid: string) => {
  await updateDoc(doc(db, 'chats', chatId), {
    members: arrayUnion(uid),
  });
};

// MESSAGES
export const sendMessage = async (chatId: string, message: Message & { imageFile?: File }) => {
  let imageUrl = '';
  if (message.imageFile) {
    const storage = getStorage();
    const imgRef = storageRef(storage, `chat_images/${chatId}/${Date.now()}_${message.imageFile.name}`);
    await uploadBytes(imgRef, message.imageFile);
    imageUrl = await getDownloadURL(imgRef);
  }
  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    ...message,
    imageUrl: imageUrl || message.imageUrl || '',
    imageFile: undefined,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: message.text || (imageUrl ? 'Image' : ''),
    lastMessageAt: serverTimestamp(),
  });
};

export const getMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt'));
  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    callback(messages);
  });
};

export const updateMessage = async (chatId: string, messageId: string, newContent: Partial<Message>) => {
  await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
    ...newContent,
    editedAt: serverTimestamp(),
  });
};

export const deleteMessage = async (chatId: string, messageId: string) => {
  await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
};

export const markMessageSeen = async (chatId: string, messageId: string, uid: string) => {
  await updateDoc(doc(db, 'chats', chatId, 'messages', messageId), {
    seenBy: arrayUnion({ uid, seenAt: serverTimestamp() })
  });
};

export const removeGroupMember = async (chatId: string, uid: string) => {
  const chatRef = doc(db, 'chats', chatId);
  const chatSnap = await getDoc(chatRef);
  if (chatSnap.exists()) {
    const data = chatSnap.data() as Chat;
    await updateDoc(chatRef, {
      members: data.members.filter((m: string) => m !== uid),
    });
  }
};

export const leaveGroup = async (chatId: string, uid: string) => {
  await removeGroupMember(chatId, uid);
};

export const updateGroupInfo = async (chatId: string, groupName: string, groupImage: string) => {
  await updateDoc(doc(db, 'chats', chatId), {
    groupName,
    groupImage,
  });
};

export const createCall = async (callerId: string, calleeId: string, offer: unknown) => {
  const callRef = await addDoc(collection(db, 'calls'), {
    callerId,
    calleeId,
    offer,
    status: 'ringing',
    createdAt: serverTimestamp(),
  });
  return callRef.id;
};

export const answerCall = async (callId: string, answer: unknown) => {
  await updateDoc(doc(db, 'calls', callId), {
    answer,
    status: 'in-progress',
  });
};

export const endCall = async (callId: string) => {
  await updateDoc(doc(db, 'calls', callId), {
    status: 'ended',
  });
};

export const onCallUpdate = (callId: string, callback: (data: Record<string, unknown> | null) => void) => {
  return onSnapshot(doc(db, 'calls', callId), (docSnap) => {
    callback(docSnap.exists() ? docSnap.data() as Record<string, unknown> : null);
  });
};

export const deleteGroupAndMessages = async (chatId: string) => {
  const messagesSnap = await getDocs(collection(db, 'chats', chatId, 'messages'));
  for (const docSnap of messagesSnap.docs) {
    await deleteDoc(doc(db, 'chats', chatId, 'messages', docSnap.id));
  }
  await deleteDoc(doc(db, 'chats', chatId));
};

export const cleanUpExpiredGroups = async () => {
  const now = Date.now();
  const chatsSnap = await getDocs(collection(db, 'chats'));
  for (const chat of chatsSnap.docs) {
    const data = chat.data();
    if (data.isGroup && data.expiresAt && data.expiresAt < now) {
      await deleteGroupAndMessages(chat.id);
    }
  }
};

export const updateChatSettings = async (chatId: string, settings: Partial<Chat>) => {
  await updateDoc(doc(db, 'chats', chatId), settings);
};

export const cleanUpDisappearingMessages = async () => {
  const now = Date.now();
  const chatsSnap = await getDocs(collection(db, 'chats'));
  for (const chat of chatsSnap.docs) {
    const data = chat.data();
    if (data.disappearingDuration && data.disappearingDuration > 0) {
      const messagesSnap = await getDocs(collection(db, 'chats', chat.id, 'messages'));
      for (const msg of messagesSnap.docs) {
        const msgData = msg.data();
        if (msgData.createdAt && msgData.createdAt.toMillis && now - msgData.createdAt.toMillis() > data.disappearingDuration) {
          await deleteDoc(doc(db, 'chats', chat.id, 'messages', msg.id));
        }
      }
    }
  }
};

// Upload a status (image/video/text)
export const uploadStatus = async (user: User, file: File | null, text = '') => {
  let mediaUrl = '';
  if (file) {
    const storage = getStorage();
    const ext = file.name.split('.').pop();
    const fileRef = storageRef(storage, `statuses/${user.uid}_${Date.now()}.${ext}`);
    await uploadBytes(fileRef, file);
    mediaUrl = await getDownloadURL(fileRef);
  }
  await addDoc(collection(db, 'statuses'), {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    text,
    mediaUrl,
    createdAt: serverTimestamp(),
    type: file ? file.type : 'text',
  });
};

// Fetch all statuses (most recent first)
export const fetchStatuses = async () => {
  const q = query(collection(db, 'statuses'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}; 