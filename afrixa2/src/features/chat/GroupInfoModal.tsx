"use client";
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateGroupInfoThunk, removeGroupMemberThunk, leaveGroupThunk } from './chatSlice';
import Avatar from '../../components/Avatar';
import { User } from '../../types';
import styles from './GroupInfoModal.module.css';

export default function GroupInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { currentChat } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [groupName, setGroupName] = useState(currentChat?.groupName || '');
  const [groupImage, setGroupImage] = useState(currentChat?.groupImage || '');

  if (!open || !currentChat?.isGroup) return null;

  const handleUpdate = () => {
    if (currentChat?.id) {
      dispatch(updateGroupInfoThunk({ chatId: currentChat.id, groupName, groupImage }));
    }
  };

  const handleRemove = (uid: string) => {
    if (currentChat?.id) {
      dispatch(removeGroupMemberThunk({ chatId: currentChat.id, uid }));
    }
  };

  const handleLeave = () => {
    if (currentChat?.id && user?.uid) {
      dispatch(leaveGroupThunk({ chatId: currentChat.id, uid: user.uid }));
      onClose();
    }
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <h2 className="text-xl font-bold mb-4">Group Info</h2>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          value={groupImage}
          onChange={(e) => setGroupImage(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button className="bg-blue-500 text-white p-2 rounded w-full mb-4" onClick={handleUpdate}>
          Update Group
        </button>
        <div className="mb-4">
          <div className="font-semibold mb-2">Members</div>
          <ul>
            {currentChat.membersData?.map((m: User) => (
              <li key={m.uid} className="flex items-center gap-2 mb-1">
                <Avatar src={m.photoURL} name={m.displayName} size={32} />
                <span>{m.displayName}</span>
                {user && m.uid !== user.uid && (
                  <button className="ml-2 text-red-500" onClick={() => handleRemove(m.uid)}>
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <button className="bg-red-500 text-white p-2 rounded w-full" onClick={handleLeave}>
          Leave Group
        </button>
        <button className="bg-gray-300 p-2 rounded w-full mt-2" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
} 