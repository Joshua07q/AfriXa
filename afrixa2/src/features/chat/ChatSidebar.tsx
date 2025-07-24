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
import { useRouter, usePathname } from 'next/navigation';
import { FiMessageCircle, FiUser, FiSettings, FiBook, FiPlus, FiHelpCircle, FiPhone, FiVideo } from 'react-icons/fi';
import type { User as ChatUser } from '../../firebase/firestoreHelpers';
import { Chat } from '../../types';

// Extend Chat type to include membersData
interface ChatWithMembersData extends Chat {
  membersData?: ChatUser[];
}

export default function ChatSidebar() {
  const dispatch = useAppDispatch();
  const { chats, currentChat, loading, error } = useAppSelector((state) => state.chat) as {
    chats: ChatWithMembersData[];
    currentChat: ChatWithMembersData | null;
    loading: boolean;
    error: string | null;
  };
  const { user } = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (user?.uid) {
      dispatch(loadChats(user.uid));
    }
  }, [user, dispatch]);

  return (
    <aside className="w-72 h-screen p-4 overflow-y-auto bg-black/60 backdrop-blur-lg rounded-xl shadow-lg border border-white/10" aria-label="Chat sidebar" role="complementary">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-on-primary">Afrixa</h1>
        <Image src="/logo.png" alt="Afrixa Logo" width={40} height={40} />
      </div>
      <button className="mb-4 bg-accent text-on-secondary p-3 rounded-lg w-full font-bold flex items-center gap-2 justify-center shadow-lg" onClick={() => setModalOpen(true)} aria-label="Start a new chat or group"><FiPlus /> New Chat / Group</button>
      <nav className="flex flex-col gap-2 mb-4">
        <button
          className={`flex items-center gap-3 text-left p-3 rounded-lg ${pathname === '/app' ? 'bg-accent text-on-secondary font-bold' : 'hover:bg-surface'}`}
          onClick={() => router.push('/app')}
        ><FiMessageCircle /> Chats</button>
        <button
          className={`flex items-center gap-3 text-left p-3 rounded-lg ${pathname === '/app/status' ? 'bg-accent text-on-secondary font-bold' : 'hover:bg-surface'}`}
          onClick={() => router.push('/app/status')}
        ><FiBook /> Status</button>
        <button
          className={`flex items-center gap-3 text-left p-3 rounded-lg ${pathname === '/app/settings' ? 'bg-accent text-on-secondary font-bold' : 'hover:bg-surface'}`}
          onClick={() => router.push('/app/settings')}
        ><FiSettings /> Settings</button>
        <button
          className={`flex items-center gap-3 text-left p-3 rounded-lg ${pathname === '/app/profile' ? 'bg-accent text-on-secondary font-bold' : 'hover:bg-surface'}`}
          onClick={() => router.push('/app/profile')}
        ><FiUser /> Profile</button>
        <button
          className={`flex items-center gap-3 text-left p-3 rounded-lg ${pathname === '/app/tutorial' ? 'bg-accent text-on-secondary font-bold' : 'hover:bg-surface'}`}
          onClick={() => router.push('/app/tutorial')}
        ><FiHelpCircle /> Tutorial</button>
      </nav>
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
              onClick={() => router.push(chat.isGroup ? `/app/group/${chat.id}` : `/app/chat/${chat.id}`)}
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
                src={chat.isGroup ? chat.groupImage : (chat.membersData?.find((m: ChatUser) => m.uid !== user?.uid)?.photoURL)}
                name={chat.isGroup ? chat.groupName : chat.membersData?.filter((m: ChatUser) => m.uid !== user?.uid).map((m: ChatUser) => m.displayName).join(', ')}
                size={40}
              />
              <div className="flex-1">
                <div className="font-semibold">
                  {chat.isGroup ? chat.groupName : chat.membersData?.filter((m: ChatUser) => m.uid !== user?.uid).map((m: ChatUser) => m.displayName).join(', ')}
                </div>
                <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
              </div>
              <div className="text-xs text-gray-400 min-w-[60px] text-right">
                {chat.lastMessageTimestamp && isDate(chat.lastMessageTimestamp)
                  ? formatDistanceToNow(chat.lastMessageTimestamp, { addSuffix: true })
                  : ''}
              </div>
            </li>
          );
        })}
      </ul>
      <NewChatModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </aside>
  );
}

// Type guard for Date
function isDate(obj: unknown): obj is Date {
  return obj instanceof Date;
} 