"use client";
import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { useRouter } from 'next/navigation';
import Avatar from '../../components/Avatar';
import { FiMessageCircle, FiUsers, FiClock } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import type { User as ChatUser } from '../../firebase/firestoreHelpers';
import { Chat } from '../../types';

interface ChatWithMembersData extends Chat {
  membersData?: ChatUser[];
}

export default function ChatShortcuts() {
  const { chats } = useAppSelector((state) => state.chat) as {
    chats: ChatWithMembersData[];
  };
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Get recent chats (last 5)
  const recentChats = chats
    .sort((a, b) => {
      if (!a.lastMessageTimestamp || !b.lastMessageTimestamp) return 0;
      const aTime = 'toDate' in a.lastMessageTimestamp ? a.lastMessageTimestamp.toDate().getTime() : 0;
      const bTime = 'toDate' in b.lastMessageTimestamp ? b.lastMessageTimestamp.toDate().getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  if (recentChats.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-surface border-b border-accent/20">
      <h3 className="text-lg font-semibold text-on-surface mb-4 flex items-center gap-2">
        <FiMessageCircle />
        Recent Chats
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {recentChats.map((chat) => {
          const otherMembers = chat.membersData?.filter((m: ChatUser) => m.uid !== user?.uid) || [];
          const chatName = chat.isGroup 
            ? chat.groupName 
            : otherMembers.map((m: ChatUser) => m.displayName).join(', ');
          const lastMessage = chat.lastMessage || 'No messages yet';
          
          return (
            <div
              key={chat.id}
              className="p-3 bg-primary/20 rounded-xl cursor-pointer hover:bg-accent/10 transition-all duration-200 group"
              onClick={() => router.push(chat.isGroup ? `/app/group/${chat.id}` : `/app/chat/${chat.id}`)}
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={chat.isGroup ? chat.groupImage : otherMembers[0]?.photoURL}
                  name={chatName}
                  size={40}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-on-surface truncate flex items-center gap-1">
                      {chat.isGroup && <FiUsers className="text-xs" />}
                      {chatName}
                    </h4>
                                         {chat.lastMessageTimestamp && 'toDate' in chat.lastMessageTimestamp && (
                       <span className="text-xs opacity-70 flex items-center gap-1">
                         <FiClock className="text-xs" />
                         {formatDistanceToNow(chat.lastMessageTimestamp.toDate(), { addSuffix: true })}
                       </span>
                     )}
                  </div>
                  <p className="text-sm opacity-70 truncate mt-1">
                    {lastMessage}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 