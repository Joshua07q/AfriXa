"use client";
import React from 'react';
import ChatSidebar from '../../features/chat/ChatSidebar';
import ChatShortcuts from '../../features/chat/ChatShortcuts';
import LogoutButton from '../../features/auth/LogoutButton';

export default function AppIndex() {
  return (
    <div className="flex h-screen bg-background">
      {/* Chat Sidebar */}
      <ChatSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Shortcuts */}
        <ChatShortcuts />
        
        {/* Welcome Message */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-on-surface mb-4">
              Welcome to AfriXa
            </h1>
            <p className="text-lg text-on-surface/70 mb-8">
              Start a new chat or join an existing conversation
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-2xl">A</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold text-on-surface">AfriXa Chat</h3>
                <p className="text-sm text-on-surface/70">Connect with friends and family</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="p-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
} 