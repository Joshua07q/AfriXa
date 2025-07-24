"use client";
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loadChats, selectChat } from './chatSlice';
import NewChatModal from './NewChatModal';
import { formatDistanceToNow } from 'date-fns';
import Spinner from '../../components/Spinner';
import ErrorBanner from '../../components/ErrorBanner';
import EmptyState from '../../components/EmptyState';
import Avatar from '../../components/Avatar';

export default function ChatSidebar() {
  const dispatch = useAppDispatch();
  const { chats, currentChat, loading, error } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(loadChats(user.uid));
    }
  }, [user, dispatch]);

  return (
    <aside className="w-72 bg-gray-100 h-screen p-4 overflow-y-auto" aria-label="Chat sidebar" role="complementary">
      <h2 className="text-xl font-bold mb-4" id="sidebar-heading">Chats</h2>
      <button className="mb-4 bg-green-500 text-white p-2 rounded w-full focus:outline focus:ring" onClick={() => setModalOpen(true)} aria-label="Start a new chat or group">+ New Chat / Group</button>
      {loading && <Spinner label="Loading chats..." />}
      {error && <ErrorBanner message={error} />}
      {!loading && chats.length === 0 && <EmptyState message="No chats yet" icon={<span>💬</span>} />}
      <ul aria-labelledby="sidebar-heading">
        {chats.map((chat) => {
          const isSelected = currentChat?.id === chat.id;
          return (
            <li
              key={chat.id}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer mb-2 ${isSelected ? 'bg-green-200' : 'hover:bg-gray-200'} focus:outline focus:ring`}
              onClick={() => dispatch(selectChat(chat))}
              tabIndex={0}
              role="option"
              aria-selected={isSelected}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  dispatch(selectChat(chat));
                }
              }}
            >
              <Avatar
                src={chat.isGroup ? chat.groupImage : (chat.membersData?.find((m: any) => m.uid !== user?.uid)?.photoURL)}
                name={chat.isGroup ? chat.groupName : chat.membersData?.filter((m: any) => m.uid !== user?.uid).map((m: any) => m.displayName).join(', ')}
                size={40}
              />
              <div className="flex-1">
                <div className="font-semibold">
                  {chat.isGroup ? chat.groupName : chat.membersData?.filter((m: any) => m.uid !== user?.uid).map((m: any) => m.displayName).join(', ')}
                </div>
                <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
              </div>
              <div className="text-xs text-gray-400 min-w-[60px] text-right">
                {chat.lastMessageAt?.seconds ? formatDistanceToNow(new Date(chat.lastMessageAt.seconds * 1000), { addSuffix: true }) : ''}
              </div>
            </li>
          );
        })}
      </ul>
      <NewChatModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </aside>
  );
} 