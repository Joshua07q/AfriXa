"use client";
import AuthGate from '../../../features/auth/AuthGate';
import LogoutButton from '../../../features/auth/LogoutButton';
import ChatSidebar from '../../../features/chat/ChatSidebar';
import ChatWindow from '../../../features/chat/ChatWindow';
import React, { useState } from 'react';

export default function MainApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <AuthGate>
      <div className="flex h-screen relative">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden absolute top-4 left-4 z-20 bg-white p-2 rounded shadow focus:outline focus:ring"
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
          <span className="block w-6 h-0.5 bg-gray-800 mb-1" />
          <span className="block w-6 h-0.5 bg-gray-800" />
        </button>
        {/* Sidebar */}
        <div
          className={`fixed inset-0 z-10 bg-black bg-opacity-40 transition-opacity md:static md:bg-transparent md:opacity-100 ${
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          } md:pointer-events-auto md:w-auto`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden={!sidebarOpen}
        >
          <aside
            className={`bg-white w-72 h-full shadow-lg transform transition-transform md:translate-x-0 md:static md:shadow-none ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } md:relative md:block`}
            onClick={e => e.stopPropagation()}
          >
            <button
              className="md:hidden absolute top-4 right-4 z-20 bg-white p-2 rounded shadow focus:outline focus:ring"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
            <ChatSidebar />
          </aside>
        </div>
        {/* Main content */}
        <main className="flex-1 flex flex-col h-full">
          <ChatWindow />
          <div className="absolute top-4 right-4 z-30">
            <LogoutButton />
          </div>
        </main>
      </div>
    </AuthGate>
  );
} 