"use client";
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { auth } from '../../firebase';
import { setUser, serializeUser } from './authSlice';
import AuthForm from './AuthForm';
import ProfileSetup from './ProfileSetup';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      dispatch(setUser(serializeUser(firebaseUser)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <AuthForm />;
  if (!user.photoURL) return <ProfileSetup />;
  return <>{children}</>;
} 