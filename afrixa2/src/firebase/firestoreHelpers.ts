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
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// USERS
export const createUser = async (user: { uid: string; displayName: string; photoURL: string; email: string }) => {
  await setDoc(doc(db, 'users', user.uid), user, { merge: true });
};

export const getUser = async (uid: string) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() : null;
};

export const searchUsers = async (search: string) => {
  // For demo: fetch all users and filter client-side (for production, use Firestore indexing)
  const usersSnap = await getDocs(collection(db, 'users'));
  return usersSnap.docs.map(doc => doc.data()).filter(u => u.displayName.toLowerCase().includes(search.toLowerCase()));
};

// CHATS
export const createChat = async (members: string[], isGroup = false, groupName = '', groupImage = '', expiresAt = null) => {
  const chatData: any = {
    members,
    isGroup,
    groupName,
    groupImage,
    createdAt: serverTimestamp(),
    lastMessage: '',
    lastMessageAt: serverTimestamp(),
  };
  if (expiresAt) chatData.expiresAt = expiresAt;
  const chatRef = await addDoc(collection(db, 'chats'), chatData);
  return chatRef.id;
};

export const getUserChats = (uid: string, callback: (chats: any[]) => void) => {
  const q = query(collection(db, 'chats'));
  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(chats.filter(chat => chat.members.includes(uid)));
  });
};

export const addGroupMember = async (chatId: string, uid: string) => {
  await updateDoc(doc(db, 'chats', chatId), {
    members: arrayUnion(uid),
  });
};

// MESSAGES
export const sendMessage = async (chatId: string, message: any) => {
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

export const getMessages = (chatId: string, callback: (messages: any[]) => void) => {
  const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  });
};

export const updateMessage = async (chatId: string, messageId: string, newContent: any) => {
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
    const data = chatSnap.data();
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

export const createCall = async (callerId, calleeId, offer) => {
  const callRef = await addDoc(collection(db, 'calls'), {
    callerId,
    calleeId,
    offer,
    status: 'ringing',
    createdAt: serverTimestamp(),
  });
  return callRef.id;
};

export const answerCall = async (callId, answer) => {
  await updateDoc(doc(db, 'calls', callId), {
    answer,
    status: 'in-progress',
  });
};

export const endCall = async (callId) => {
  await updateDoc(doc(db, 'calls', callId), {
    status: 'ended',
  });
};

export const onCallUpdate = (callId, callback) => {
  return onSnapshot(doc(db, 'calls', callId), (docSnap) => {
    callback(docSnap.exists() ? docSnap.data() : null);
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

export const updateChatSettings = async (chatId, settings) => {
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