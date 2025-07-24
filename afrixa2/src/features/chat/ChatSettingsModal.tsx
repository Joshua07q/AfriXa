"use client";
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateChatSettingsThunk } from './chatSlice';

const durations = [
  { label: 'Off', value: 0 },
  { label: '1 hour', value: 60 * 60 * 1000 },
  { label: '1 day', value: 24 * 60 * 60 * 1000 },
  { label: '1 week', value: 7 * 24 * 60 * 60 * 1000 },
];

export default function ChatSettingsModal({ open, onClose }) {
  const { currentChat } = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();
  const [duration, setDuration] = useState(currentChat?.disappearingDuration || 0);

  if (!open || !currentChat) return null;

  const handleSave = () => {
    dispatch(updateChatSettingsThunk({ chatId: currentChat.id, settings: { disappearingDuration: duration } }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Chat Settings</h2>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Disappearing Messages</label>
          <select
            className="border p-2 rounded w-full"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            {durations.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <button className="bg-green-500 text-white p-2 rounded w-full mb-2" onClick={handleSave}>
          Save
        </button>
        <button className="bg-gray-300 p-2 rounded w-full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
} 