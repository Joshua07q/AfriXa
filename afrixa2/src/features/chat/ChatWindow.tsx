"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loadMessages, sendChatMessage, editChatMessage, deleteChatMessage, markMessageSeenThunk, addOptimisticMessage, markMessageDeleting, removeOptimisticMessage } from './chatSlice';
import ChatWindowHeader from './ChatWindowHeader';
import Spinner from '../../components/Spinner';
import ErrorBanner from '../../components/ErrorBanner';
import EmptyState from '../../components/EmptyState';
import Image from 'next/image';
import { Message } from '../../types';
import { Timestamp } from 'firebase/firestore';

// Type for optimistic messages
interface OptimisticMessage extends Message {
  senderName: string;
  senderPhoto: string;
  imageFile?: File;
  replyTo?: string;
}

// Type for all messages in this component
type ChatMsg = Message | OptimisticMessage;

export default function ChatWindow() {
  const dispatch = useAppDispatch();
  const { currentChat, messages, loading, error } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMsg | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [optimisticError, setOptimisticError] = useState<string | null>(null);

  useEffect(() => {
    if (currentChat?.id) {
      dispatch(loadMessages(currentChat.id));
    }
  }, [currentChat, dispatch]);

  useEffect(() => {
    if (messages && user && currentChat) {
      messages.forEach((msg) => {
        if (!msg.seenBy?.some((s) => s.uid === user.uid)) {
          dispatch(markMessageSeenThunk({ chatId: currentChat.id ?? '', messageId: msg.id ?? '', uid: user.uid }));
        }
      });
    }
  }, [messages, user, currentChat, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if ((text.trim() || image) && currentChat && user) {
      const tempId = 'temp-' + Math.random().toString(36).substr(2, 9);
      const optimisticMsg: OptimisticMessage = {
        id: tempId,
        content: text,
        imageFile: image ?? undefined,
        senderId: user.uid,
        senderName: user.displayName ?? '',
        senderPhoto: user.photoURL ?? '',
        replyTo: replyTo ? replyTo.id ?? '' : undefined,
        timestamp: Timestamp.fromDate(new Date()),
        seenBy: [],
        pending: true,
      };
      dispatch(addOptimisticMessage(optimisticMsg));
      dispatch(
        sendChatMessage({
          chatId: currentChat.id ?? '',
          message: optimisticMsg,
        })
      ).unwrap().catch(() => {
        setOptimisticError('Failed to send message');
        dispatch(removeOptimisticMessage(tempId));
      });
      setText('');
      setImage(null);
      setReplyTo(null);
    }
  };

  const handleReply = (msg: ChatMsg) => setReplyTo(msg);
  const handleEdit = (msg: ChatMsg) => {
    setEditingMsgId(msg.id ?? '');
    setEditText(msg.content ?? '');
  };
  const handleEditSave = (msg: ChatMsg) => {
    if (!currentChat) return;
    dispatch(editChatMessage({ chatId: currentChat.id ?? '', messageId: msg.id ?? '', newContent: { content: editText } }));
    setEditingMsgId(null);
    setEditText('');
  };
  const handleDelete = (msg: ChatMsg) => {
    if (!currentChat) return;
    if (window.confirm('Delete this message?')) {
      dispatch(markMessageDeleting(msg.id ?? ''));
      dispatch(deleteChatMessage({ chatId: currentChat.id ?? '', messageId: msg.id ?? '' }))
        .unwrap()
        .catch(() => {
          setOptimisticError('Failed to delete message');
        });
    }
  };

  if (!currentChat) return <div className="flex-1 flex items-center justify-center">Select a chat to start messaging</div>;

  return (
    <section className="flex-1 flex flex-col h-screen bg-black/40 backdrop-blur-xl">
      <ChatWindowHeader />
      <div className="flex-1 overflow-y-auto p-4 bg-transparent">
        {loading && <Spinner label="Loading messages..." />}
        {error && <ErrorBanner message={error} />}
        {optimisticError && <ErrorBanner message={optimisticError} onClose={() => setOptimisticError(null)} />}
        {!loading && messages.length === 0 && <EmptyState message="No messages yet" icon={<span>💬</span>} />}
        {messages.map((msg: ChatMsg) => (
          <div
            key={msg.id}
            className={`mb-2 ${msg.senderId === user?.uid ? 'text-right' : 'text-left'} ${msg.deleting ? 'opacity-50 transition-opacity duration-500' : ''}`}
          >
            <div className="inline-block bg-black/60 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6 mb-4 relative max-w-xl">
              <span className="font-semibold text-accent">{'senderName' in msg ? msg.senderName : user?.displayName}:</span>
              {msg.replyTo && (
                <div className="text-xs text-accent border-l-2 pl-2 my-1">Replying to message {msg.replyTo}</div>
              )}
              {msg.imageUrl && (
                <Image src={msg.imageUrl} alt="sent" width={320} height={160} className="max-w-xs max-h-40 my-2 rounded" />
              )}
              {msg.pending && <Spinner label="Sending..." size={16} />}
              {editingMsgId === msg.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border p-1 rounded w-2/3 focus:outline focus:ring bg-black/40 text-gray-100"
                    aria-label="Edit message text"
                  />
                  <button className="ml-2 bg-accent text-black px-2 py-1 rounded focus:outline focus:ring" onClick={() => handleEditSave(msg)} aria-label="Save edit">Save</button>
                  <button className="ml-2 text-gray-400 focus:outline focus:ring" onClick={() => setEditingMsgId(null)} aria-label="Cancel edit">Cancel</button>
                </>
              ) : (
                <span> {msg.content}</span>
              )}
              {msg.editedAt && <span className="text-xs text-gray-400 ml-2">(edited)</span>}
              <div className="flex gap-2 text-xs text-gray-400 mt-1">
                <span>
                  {msg.seenBy && msg.seenBy.length > 1
                    ? `Seen by ${msg.seenBy.length} users`
                    : msg.seenBy && msg.seenBy.length === 1
                    ? 'Seen'
                    : 'Delivered'}
                </span>
                <button className="focus:outline focus:ring text-accent" onClick={() => handleReply(msg)} aria-label={`Reply to message from ${'senderName' in msg ? msg.senderName : user?.displayName}`}>Reply</button>
                {msg.senderId === user?.uid && !msg.pending && !msg.deleting && <button className="focus:outline focus:ring text-accent" onClick={() => handleEdit(msg)} aria-label="Edit message">Edit</button>}
                {msg.senderId === user?.uid && !msg.pending && !msg.deleting && <button className="focus:outline focus:ring text-red-400" onClick={() => handleDelete(msg)} aria-label="Delete message">Delete</button>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {replyTo && (
        <div className="bg-accent/20 p-2 rounded mb-2 flex items-center gap-2 bg-black/60 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6 mb-4">
          <span className="font-semibold text-accent">Replying to {'senderName' in replyTo ? replyTo.senderName : user?.displayName}:</span>
          <span className="truncate">{replyTo.content}</span>
          <button className="ml-2 text-gray-400 focus:outline focus:ring" onClick={() => setReplyTo(null)}>Cancel</button>
        </div>
      )}
      <footer className="p-4 bg-black/40 border-t border-white/10 flex gap-2 items-center bg-black/60 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6 mb-4">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="hidden"
        />
        <button
          className="bg-accent text-black p-2 rounded focus:outline focus:ring"
          onClick={() => fileInputRef.current?.click()}
        >
          📎
        </button>
        <input
          type="text"
          className="flex-1 border rounded p-2 bg-black/40 text-gray-100"
          placeholder={replyTo ? `Replying to ${'senderName' in replyTo ? replyTo.senderName : user?.displayName}` : "Type a message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="bg-accent text-black p-2 rounded focus:outline focus:ring font-bold" onClick={handleSend}>
          Send
        </button>
      </footer>
    </section>
  );
} 