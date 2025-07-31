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
import { 
  FiMessageCircle, 
  FiUser, 
  FiSettings, 
  FiBook, 
  FiPlus, 
  FiSearch,
  FiUsers,
  FiClock,
  FiMoreVertical
} from 'react-icons/fi';
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
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (user?.uid) {
      dispatch(loadChats(user.uid));
    }
  }, [user, dispatch]);

  return (
    <aside className="w-full md:w-80 h-screen bg-surface border-r border-accent/20 flex flex-col" aria-label="Chat sidebar" role="complementary">
      {/* Header */}
      <div className="p-6 border-b border-accent/20 bg-surface">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-lg">A</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">AfriXa</h1>
          </div>
        </div>
        
        {/* New Chat Button */}
        <button 
          className="w-full bg-accent text-primary p-4 rounded-xl font-semibold flex items-center gap-3 justify-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
          onClick={() => setModalOpen(true)} 
          aria-label="Start a new chat or group"
        >
          <FiPlus className="text-lg" />
          <span>New Chat / Group</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 border-b border-accent/20">
        <div className="space-y-2">
          <button
            className={`w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all duration-200 ${
              pathname === '/app' 
                ? 'bg-accent text-primary font-semibold shadow-md' 
                : 'text-on-surface hover:bg-accent/10 hover:text-accent'
            }`}
            onClick={() => router.push('/app')}
          >
            <FiMessageCircle className="text-lg" />
            <span>Chats</span>
          </button>
          
          <button
            className={`w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all duration-200 ${
              pathname === '/app/status' 
                ? 'bg-accent text-primary font-semibold shadow-md' 
                : 'text-on-surface hover:bg-accent/10 hover:text-accent'
            }`}
            onClick={() => router.push('/app/status')}
          >
            <FiBook className="text-lg" />
            <span>Status</span>
          </button>
          
          <button
            className={`w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all duration-200 ${
              pathname === '/app/settings' 
                ? 'bg-accent text-primary font-semibold shadow-md' 
                : 'text-on-surface hover:bg-accent/10 hover:text-accent'
            }`}
            onClick={() => router.push('/app/settings')}
          >
            <FiSettings className="text-lg" />
            <span>Settings</span>
          </button>
          
          <button
            className={`w-full flex items-center gap-3 text-left p-3 rounded-xl transition-all duration-200 ${
              pathname === '/app/profile' 
                ? 'bg-accent text-primary font-semibold shadow-md' 
                : 'text-on-surface hover:bg-accent/10 hover:text-accent'
            }`}
            onClick={() => router.push('/app/profile')}
          >
            <FiUser className="text-lg" />
            <span>Profile</span>
          </button>
        </div>
      </nav>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading && <Spinner label="Loading chats..." />}
        {error && <ErrorBanner message={error} />}
        {!loading && chats.length === 0 && (
          <EmptyState 
            message="No chats yet" 
            icon={<FiMessageCircle className="text-4xl text-accent" />} 
          />
        )}
        
        <ul aria-labelledby="sidebar-heading" className="space-y-2">
          {chats.map((chat) => {
            const isSelected = currentChat?.id === chat.id;
            const otherMembers = chat.membersData?.filter((m: ChatUser) => m.uid !== user?.uid) || [];
            const chatName = chat.isGroup 
              ? chat.groupName 
              : otherMembers.map((m: ChatUser) => m.displayName).join(', ');
            const lastMessage = chat.lastMessage || 'No messages yet';
            
            return (
              <li
                key={chat.id}
                className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-accent text-primary shadow-md' 
                    : 'hover:bg-accent/10 hover:text-accent text-on-surface'
                }`}
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
                  src={chat.isGroup ? chat.groupImage : otherMembers[0]?.photoURL}
                  name={chatName}
                  size={48}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold truncate">{chatName}</h3>
                    {chat.lastMessageTimestamp && (
                      <span className="text-xs opacity-70 flex items-center gap-1">
                        <FiClock className="text-xs" />
                        {formatDistanceToNow(chat.lastMessageTimestamp.toDate(), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm opacity-70 truncate flex items-center gap-1">
                    {chat.isGroup && <FiUsers className="text-xs" />}
                    {lastMessage}
                  </p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiMoreVertical className="text-sm" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      
      <NewChatModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </aside>
  );
} 