"use client";
import React, { useState, useEffect } from 'react';
import WelcomeLoader from './WelcomeLoader';
import ReduxProvider from '../store/provider';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  return showLoader ? <WelcomeLoader /> : <ReduxProvider>{children}</ReduxProvider>;
} 