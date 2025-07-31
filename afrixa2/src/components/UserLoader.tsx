"use client";
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loadChats } from '../features/chat/chatSlice';

export default function UserLoader() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user?.uid) {
      // Load user's chats which will also fetch member data
      dispatch(loadChats(user.uid));
    }
  }, [user, dispatch]);

  return null; // This component doesn't render anything
} 