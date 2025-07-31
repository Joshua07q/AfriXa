"use client";
import React from 'react';
import { useAppSelector } from '../store/hooks';
import Navigation from './Navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-background">
      {user && <Navigation />}
      <main className={user ? "pt-16" : ""}>
        {children}
      </main>
    </div>
  );
} 