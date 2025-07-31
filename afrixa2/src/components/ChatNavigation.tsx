"use client";
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '../store/hooks';
import ChatSidebar from '../features/chat/ChatSidebar';
import { 
  FiMessageCircle, 
  FiX,
  FiMenu
} from 'react-icons/fi';

export default function ChatNavigation() {
  const { user } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <>
      {/* Mobile Chat Toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-4 right-4 md:hidden bg-accent text-primary p-4 rounded-full shadow-lg z-40 hover:shadow-xl transition-all duration-200"
        aria-label="Open chat sidebar"
      >
        <FiMessageCircle className="text-xl" />
      </button>

      {/* Desktop Chat Sidebar */}
      <div className="hidden md:block">
        <ChatSidebar />
      </div>

      {/* Mobile Chat Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-80 bg-surface border-l border-accent/20 shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-accent/20">
              <h2 className="text-lg font-semibold text-on-surface">Chats</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
                aria-label="Close chat sidebar"
              >
                <FiX className="text-on-surface" />
              </button>
            </div>
            <div className="h-full overflow-hidden">
              <ChatSidebar />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 