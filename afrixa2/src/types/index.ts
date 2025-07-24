import { Timestamp, FieldValue } from 'firebase/firestore';

// Keep this in sync with the serializeUser function in authSlice.ts
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  phoneNumber: string | null;
}

export interface Chat {
  id?: string;
  members: string[];
  membersData?: User[];
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
