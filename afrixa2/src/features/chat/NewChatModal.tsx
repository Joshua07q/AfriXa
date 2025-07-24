"use client";
import React, { useState } from 'react';
import { searchUsers, createChat } from '../../firebase/firestoreHelpers';
import { useAppSelector } from '../../store/hooks';
import Spinner from '../../components/Spinner';
import ErrorBanner from '../../components/ErrorBanner';
import EmptyState from '../../components/EmptyState';

export default function NewChatModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiresIn, setExpiresIn] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const users = await searchUsers(search);
      setResults(users.filter((u: any) => u.uid !== user.uid));
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (u: any) => {
    if (selected.some((s) => s.uid === u.uid)) {
      setSelected(selected.filter((s) => s.uid !== u.uid));
    } else {
      setSelected([...selected, u]);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      if (selected.length === 1) {
        await createChat([user.uid, selected[0].uid]);
      } else if (selected.length > 1) {
        let expiresAt = null;
        if (expiresIn) {
          expiresAt = Date.now() + parseInt(expiresIn) * 60 * 60 * 1000;
        }
        await createChat([user.uid, ...selected.map((u) => u.uid)], true, groupName, groupImage, expiresAt);
      }
      onClose();
    } catch (err) {
      setError('Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label="New chat or group modal">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4" id="new-chat-heading">New Chat / Group</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full mb-2 focus:outline focus:ring"
          aria-label="Search users"
        />
        <button className="bg-blue-500 text-white p-2 rounded w-full mb-2 focus:outline focus:ring" onClick={handleSearch} disabled={loading} aria-label="Search">
          Search
        </button>
        {loading && <Spinner label="Searching..." />}
        {error && <ErrorBanner message={error} />}
        {results.length === 0 && !loading && !error && <EmptyState message="No users found" icon={<span>🔍</span>} />}
        {results.length > 0 && (
          <ul className="mb-2 max-h-32 overflow-y-auto" aria-labelledby="new-chat-heading">
            {results.map((u) => (
              <li
                key={u.uid}
                className={`p-2 rounded cursor-pointer mb-1 ${selected.some((s) => s.uid === u.uid) ? 'bg-green-200' : 'hover:bg-gray-200'} focus:outline focus:ring`}
                onClick={() => handleSelect(u)}
                tabIndex={0}
                role="option"
                aria-selected={selected.some((s) => s.uid === u.uid)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSelect(u);
                  }
                }}
                aria-label={`User ${u.displayName}`}
              >
                {u.displayName}
              </li>
            ))}
          </ul>
        )}
        {selected.length > 1 && (
          <>
            <input
              type="text"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              placeholder="Group Image URL (optional)"
              value={groupImage}
              onChange={(e) => setGroupImage(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="number"
              placeholder="Expires in (hours, leave blank for normal group)"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              className="border p-2 rounded w-full mb-2"
              min={1}
            />
            <div className="text-xs text-gray-500 mb-2">Burner groups will be deleted automatically after the set time.</div>
          </>
        )}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className="flex gap-2">
          <button
            className="bg-green-500 text-white p-2 rounded flex-1"
            onClick={handleCreate}
            disabled={loading || selected.length === 0 || (selected.length > 1 && !groupName)}
          >
            {selected.length > 1 ? 'Create Group' : 'Start Chat'}
          </button>
          <button className="bg-gray-300 p-2 rounded flex-1" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 