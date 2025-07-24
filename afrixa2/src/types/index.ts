export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

import { Timestamp, FieldValue } from "firebase/firestore";

export interface Chat {
  id?:string;
  members: string[];
  membersData?: User[];
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  lastMessage?: string;
  lastMessageTimestamp?: Timestamp | FieldValue;
  disappearingDuration?: number;
  createdAt?: Timestamp | FieldValue;
  lastMessageAt?: Timestamp | FieldValue;
  expiresAt?: number;
}

export interface Message {
  id?: string;
  senderId: string;
  content: string;
  timestamp: Timestamp | FieldValue;
  seenBy: { uid: string; seenAt: Timestamp | FieldValue }[];
  deleting?: boolean;
  pending?: boolean;
  editedAt?: Timestamp | FieldValue;
  imageUrl?: string;
  replyTo?: string;
}

export interface Status {
  id?: string;
  uid: string;
  displayName: string;
  photoURL: string;
  text?: string;
  mediaUrl?: string;
  createdAt: Timestamp | FieldValue;
  type?: string;
}