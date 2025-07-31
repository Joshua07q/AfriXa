"use client";
import React from 'react';
import { useAppSelector } from '../store/hooks';
import Navigation from './Navigation';
import ChatNavigation from './ChatNavigation';
import ChatNotification from './ChatNotification';
import UserLoader from './UserLoader';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-background">
      {user && <UserLoader />}
      {user && <Navigation />}
      <main className={user ? "pt-16" : ""}>
        {children}
      </main>
      {user && <ChatNavigation />}
      {user && <ChatNotification />}
    </div>
  );
} 