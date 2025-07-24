"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loadMessages, sendChatMessage, editChatMessage, deleteChatMessage, markMessageSeenThunk, addOptimisticMessage, markMessageDeleting, removeOptimisticMessage, updateOptimisticMessage } from './chatSlice';
import ChatWindowHeader from './ChatWindowHeader';
import Spinner from '../../components/Spinner';
import ErrorBanner from '../../components/ErrorBanner';
import EmptyState from '../../components/EmptyState';

export default function ChatWindow() {
  const dispatch = useAppDispatch();
  const { currentChat, messages, loading, error } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [replyTo, setReplyTo] = useState<any>(null);
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
    if (messages && user) {
      messages.forEach((msg) => {
        if (!msg.seenBy?.some((s: any) => s.uid === user.uid)) {
          dispatch(markMessageSeenThunk({ chatId: currentChat.id, messageId: msg.id, uid: user.uid }));
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
      const optimisticMsg = {
        id: tempId,
        text,
        imageFile: image,
        sender: user.uid,
        senderName: user.displayName,
        senderPhoto: user.photoURL,
        replyTo: replyTo ? replyTo.id : null,
        createdAt: new Date().toISOString(),
        pending: true,
      };
      dispatch(addOptimisticMessage(optimisticMsg));
      dispatch(
        sendChatMessage({
          chatId: currentChat.id,
          message: optimisticMsg,
        })
      ).unwrap().catch((err) => {
        setOptimisticError('Failed to send message');
        dispatch(removeOptimisticMessage(tempId));
      });
      setText('');
      setImage(null);
      setReplyTo(null);
    }
  };

  const handleReply = (msg: any) => setReplyTo(msg);
  const handleEdit = (msg: any) => {
    setEditingMsgId(msg.id);
    setEditText(msg.text);
  };
  const handleEditSave = (msg: any) => {
    dispatch(editChatMessage({ chatId: currentChat.id, messageId: msg.id, newContent: { text: editText } }));
    setEditingMsgId(null);
    setEditText('');
  };
  const handleDelete = (msg: any) => {
    if (window.confirm('Delete this message?')) {
      dispatch(markMessageDeleting(msg.id));
      dispatch(deleteChatMessage({ chatId: currentChat.id, messageId: msg.id }))
        .unwrap()
        .catch(() => {
          setOptimisticError('Failed to delete message');
        });
    }
  };

  if (!currentChat) return <div className="flex-1 flex items-center justify-center">Select a chat to start messaging</div>;

  return (
    <section className="flex-1 flex flex-col h-screen" aria-label="Chat window" role="main">
      <ChatWindowHeader />
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50" tabIndex={0} aria-label="Messages list">
        {loading && <Spinner label="Loading messages..." />}
        {error && <ErrorBanner message={error} />}
        {optimisticError && <ErrorBanner message={optimisticError} onClose={() => setOptimisticError(null)} />}
        {!loading && messages.length === 0 && <EmptyState message="No messages yet" icon={<span>💬</span>} />}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${msg.sender === user?.uid ? 'text-right' : 'text-left'} ${msg.deleting ? 'opacity-50 transition-opacity duration-500' : ''}`}
            tabIndex={0}
            role="listitem"
            aria-label={`Message from ${msg.senderName}${msg.pending ? ', sending' : ''}${msg.deleting ? ', deleting' : ''}`}
          >
            <div className="inline-block bg-white rounded p-2 shadow relative">
              <span className="font-semibold">{msg.senderName}:</span>
              {msg.replyTo && (
                <div className="text-xs text-gray-400 border-l-2 pl-2 my-1">Replying to message {msg.replyTo}</div>
              )}
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="sent" className="max-w-xs max-h-40 my-2 rounded" />
              )}
              {msg.pending && <Spinner label="Sending..." size={16} />}
              {editingMsgId === msg.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border p-1 rounded w-2/3 focus:outline focus:ring"
                    aria-label="Edit message text"
                  />
                  <button className="ml-2 text-green-600 focus:outline focus:ring" onClick={() => handleEditSave(msg)} aria-label="Save edit">Save</button>
                  <button className="ml-2 text-gray-400 focus:outline focus:ring" onClick={() => setEditingMsgId(null)} aria-label="Cancel edit">Cancel</button>
                </>
              ) : (
                <span> {msg.text}</span>
              )}
              {msg.editedAt && <span className="text-xs text-gray-400 ml-2">(edited)</span>}
              <div className="flex gap-2 text-xs text-gray-400 mt-1">
                <span>
                  {msg.seenBy?.length > 1
                    ? `Seen by ${msg.seenBy.length} users`
                    : msg.seenBy?.length === 1
                    ? 'Seen'
                    : 'Delivered'}
                </span>
                <button className="focus:outline focus:ring" onClick={() => handleReply(msg)} aria-label={`Reply to message from ${msg.senderName}`}>Reply</button>
                {msg.sender === user?.uid && !msg.pending && !msg.deleting && <button className="focus:outline focus:ring" onClick={() => handleEdit(msg)} aria-label="Edit message">Edit</button>}
                {msg.sender === user?.uid && !msg.pending && !msg.deleting && <button className="focus:outline focus:ring" onClick={() => handleDelete(msg)} aria-label="Delete message">Delete</button>}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {replyTo && (
        <div className="bg-blue-100 p-2 rounded mb-2 flex items-center gap-2">
          <span className="font-semibold">Replying to {replyTo.senderName}:</span>
          <span className="truncate">{replyTo.text}</span>
          <button className="ml-2 text-gray-400" onClick={() => setReplyTo(null)}>Cancel</button>
        </div>
      )}
      <footer className="p-4 bg-white border-t flex gap-2 items-center">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="hidden"
        />
        <button
          className="bg-gray-200 p-2 rounded"
          onClick={() => fileInputRef.current?.click()}
        >
          📎
        </button>
        <input
          type="text"
          className="flex-1 border rounded p-2"
          placeholder={replyTo ? `Replying to ${replyTo.senderName}` : "Type a message..."}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="bg-green-500 text-white p-2 rounded" onClick={handleSend}>
          Send
        </button>
      </footer>
    </section>
  );
} 