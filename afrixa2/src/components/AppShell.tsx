"use client";
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import Navigation from './Navigation';
import ReduxProvider from '../store/provider';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <ReduxProvider>
      <div className="min-h-screen bg-background">
        {user && <Navigation />}
        <main className={user ? "pt-16" : ""}>
          {children}
        </main>
      </div>
    </ReduxProvider>
  );
} 