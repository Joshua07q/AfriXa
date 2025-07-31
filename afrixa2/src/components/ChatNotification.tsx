"use client";
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../store/hooks';
import { formatDistanceToNow } from 'date-fns';
import { FiMessageCircle, FiX } from 'react-icons/fi';

export default function ChatNotification() {
  const { chats } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    timestamp: Date;
    type: 'new_chat' | 'new_message';
  }>>([]);

  useEffect(() => {
    // Check for new chats or messages
    const newChats = chats.filter(chat => {
      const lastMessageTime = chat.lastMessageAt;
      if (!lastMessageTime) return false;
      
      // Check if this is a recent chat (within last 5 minutes)
      const messageTime = lastMessageTime instanceof Date 
        ? lastMessageTime 
        : (lastMessageTime as { toDate: () => Date })?.toDate?.() || new Date();
      
      return Date.now() - messageTime.getTime() < 5 * 60 * 1000; // 5 minutes
    });

    const newNotifications = newChats.map(chat => {
      const otherMembers = chat.membersData?.filter(m => m.uid !== user?.uid) || [];
      const chatName = chat.isGroup 
        ? chat.groupName 
        : otherMembers.map(m => m.displayName).join(', ');
      
      return {
        id: chat.id,
        message: chat.isGroup 
          ? `New message in ${chatName}`
          : `New message from ${chatName}`,
        timestamp: new Date(),
        type: 'new_message' as const
      };
    });

    setNotifications(prev => {
      const existingIds = prev.map(n => n.id);
      const newOnes = newNotifications.filter(n => !existingIds.includes(n.id));
      return [...prev, ...newOnes].slice(-3); // Keep last 3 notifications
    });
  }, [chats, user]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="bg-surface border border-accent/20 rounded-lg p-4 shadow-lg max-w-sm animate-in slide-in-from-right-2"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <FiMessageCircle className="text-accent text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface">
                {notification.message}
              </p>
              <p className="text-xs text-on-surface/70 mt-1">
                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 p-1 hover:bg-accent/10 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <FiX className="text-on-surface/70 text-sm" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 