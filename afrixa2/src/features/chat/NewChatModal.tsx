"use client";
import React, { useState } from 'react';
import { searchUsers, createChat } from '../../firebase/firestoreHelpers';
import { useAppSelector } from '../../store/hooks';
import Spinner from '../../components/Spinner';
import ErrorBanner from '../../components/ErrorBanner';
import EmptyState from '../../components/EmptyState';
import { User } from '../../types';
import { 
  FiSearch, 
  FiUsers, 
  FiUser, 
  FiX, 
  FiPlus, 
  FiImage,
  FiClock,
  FiCheck,
  FiMessageCircle,
  FiHash
} from 'react-icons/fi';

export default function NewChatModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAppSelector((state) => state.auth);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [selected, setSelected] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiresIn, setExpiresIn] = useState('');
  const [isGroup, setIsGroup] = useState(false);

  const handleSearch = async () => {
    if (!user || !search.trim()) return;
    setLoading(true);
    setError('');
    try {
      const users = await searchUsers(search);
      setResults(users.filter((u) => u.uid !== user.uid));
    } catch {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (u: User) => {
    if (selected.some((s) => s.uid === u.uid)) {
      setSelected(selected.filter((s) => s.uid !== u.uid));
    } else {
      setSelected([...selected, u]);
    }
  };

  const handleCreate = async () => {
    if (!user) return;
    
    // Validate group creation
    if (isGroup && selected.length < 2) {
      setError('Groups must have at least 2 members');
      return;
    }
    
    if (isGroup && !groupName.trim()) {
      setError('Group name is required');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      if (selected.length === 1 && !isGroup) {
        // Direct chat
        const chatId = await createChat([user.uid, selected[0].uid]);
        onClose();
        // Navigate to the new chat
        window.location.href = `/app/chat/${chatId}`;
      } else if (selected.length >= 2 && isGroup) {
        // Group chat
        let expiresAt = null;
        if (expiresIn) {
          expiresAt = Date.now() + parseInt(expiresIn) * 60 * 60 * 1000;
        }
        const chatId = await createChat([user.uid, ...selected.map((u) => u.uid)], true, groupName, groupImage, expiresAt);
        onClose();
        // Navigate to the new group
        window.location.href = `/app/group/${chatId}`;
      } else if (selected.length >= 2 && !isGroup) {
        // Multiple users selected but not group mode - create group anyway
        const chatId = await createChat([user.uid, ...selected.map((u) => u.uid)], true, `Group with ${selected.map(u => u.displayName).join(', ')}`, groupImage);
        onClose();
        window.location.href = `/app/group/${chatId}`;
      }
    } catch (_err) {
      setError('Failed to create chat');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSearch('');
    setResults([]);
    setSelected([]);
    setGroupName('');
    setGroupImage('');
    setError('');
    setExpiresIn('');
    setIsGroup(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="New chat or group modal">
      <div className="bg-surface border border-accent/20 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-accent/20 bg-surface">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-on-surface">New Chat</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <FiX className="text-on-surface text-xl" />
            </button>
          </div>
          
          {/* Chat Type Toggle */}
          <div className="flex bg-primary/20 rounded-xl p-1 mb-4">
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                !isGroup 
                  ? 'bg-accent text-primary shadow-md' 
                  : 'text-on-surface hover:text-accent'
              }`}
              onClick={() => setIsGroup(false)}
            >
              <FiMessageCircle className="inline mr-2" />
              Direct Chat
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                isGroup 
                  ? 'bg-accent text-primary shadow-md' 
                  : 'text-on-surface hover:text-accent'
              }`}
              onClick={() => setIsGroup(true)}
            >
              <FiHash className="inline mr-2" />
              Group Chat
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search Section */}
          <div className="space-y-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface/50" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 bg-primary/20 border border-accent/20 rounded-xl text-on-surface placeholder-on-surface/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                aria-label="Search users"
              />
            </div>
            <button 
              className="w-full bg-accent text-primary py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105" 
              onClick={handleSearch} 
              disabled={loading || !search.trim()}
            >
              {loading ? <Spinner label="Searching..." /> : 'Search Users'}
            </button>
          </div>

          {/* Group Settings */}
          {isGroup && (
            <div className="space-y-4 p-4 bg-primary/10 rounded-xl border border-accent/20">
              <h3 className="font-semibold text-on-surface flex items-center gap-2">
                <FiUsers />
                Group Settings
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Group Name *</label>
                <input
                  type="text"
                  placeholder="Enter group name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-4 py-3 bg-primary/20 border border-accent/20 rounded-xl text-on-surface placeholder-on-surface/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Group Image URL (optional)</label>
                <div className="relative">
                  <FiImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface/50" />
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={groupImage}
                    onChange={(e) => setGroupImage(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-primary/20 border border-accent/20 rounded-xl text-on-surface placeholder-on-surface/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2">Expires in (hours, optional)</label>
                <div className="relative">
                  <FiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface/50" />
                  <input
                    type="number"
                    placeholder="24"
                    value={expiresIn}
                    onChange={(e) => setExpiresIn(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-primary/20 border border-accent/20 rounded-xl text-on-surface placeholder-on-surface/50 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && <ErrorBanner message={error} />}

          {/* Search Results */}
          {results.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-on-surface">Search Results</h3>
              <div className="max-h-48 overflow-y-auto space-y-2">
                {results.map((u) => (
                  <div
                    key={u.uid}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                      selected.some((s) => s.uid === u.uid)
                        ? 'bg-accent text-primary shadow-md'
                        : 'bg-primary/20 hover:bg-accent/10 hover:text-accent text-on-surface'
                    }`}
                    onClick={() => handleSelect(u)}
                  >
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <FiUser className="text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{u.displayName}</div>
                      <div className="text-sm opacity-70">{u.email}</div>
                    </div>
                    {selected.some((s) => s.uid === u.uid) && (
                      <FiCheck className="text-accent" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Users */}
          {selected.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-on-surface">
                Selected Users ({selected.length})
                {isGroup && selected.length < 2 && (
                  <span className="text-error text-sm ml-2">* Minimum 2 members required</span>
                )}
              </h3>
              <div className="flex flex-wrap gap-2">
                {selected.map((u) => (
                  <div
                    key={u.uid}
                    className="flex items-center gap-2 bg-accent text-primary px-3 py-2 rounded-full"
                  >
                    <span className="text-sm font-medium">{u.displayName}</span>
                    <button
                      onClick={() => handleSelect(u)}
                      className="hover:bg-accent/20 rounded-full p-1"
                    >
                      <FiX className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Button */}
          {selected.length > 0 && (
            <button
              className="w-full bg-accent text-primary py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
              onClick={handleCreate}
              disabled={loading || (isGroup && (!groupName.trim() || selected.length < 2))}
            >
              {loading ? (
                <Spinner label="Creating..." />
              ) : (
                <>
                  <FiPlus />
                  Create {isGroup ? 'Group' : 'Chat'}
                </>
              )}
            </button>
          )}

          {/* Empty State */}
          {results.length === 0 && !loading && search && !error && (
            <EmptyState 
              message="No users found" 
              icon={<FiSearch className="text-4xl text-accent" />} 
            />
          )}
        </div>
      </div>
    </div>
  );
} 