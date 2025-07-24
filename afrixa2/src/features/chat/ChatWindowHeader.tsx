"use client";
import { useAppSelector } from '../../store/hooks';
import GroupInfoModal from './GroupInfoModal';
import { useState } from 'react';
import CallModal from './CallModal';
import ChatSettingsModal from './ChatSettingsModal';
import Avatar from '../../components/Avatar';

export default function ChatWindowHeader() {
  const { currentChat } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  if (!currentChat) return null;

  const isGroup = currentChat.isGroup;
  const avatarSrc = isGroup
    ? currentChat.groupImage
    : currentChat.membersData?.find((m: any) => m.uid !== user?.uid)?.photoURL;
  const avatarName = isGroup
    ? currentChat.groupName
    : currentChat.membersData?.filter((m: any) => m.uid !== user?.uid).map((m: any) => m.displayName).join(', ');
  const members = isGroup
    ? currentChat.membersData?.map((m: any) => m.displayName).join(', ')
    : null;

  return (
    <header className="p-4 border-b font-bold bg-white flex items-center gap-3">
      <Avatar src={avatarSrc} name={avatarName} size={40} />
      <div>
        <div>{name}</div>
        {isGroup && <div className="text-xs text-gray-500">{members}</div>}
      </div>
      {isGroup && (
        <button className="ml-auto bg-blue-500 text-white p-2 rounded" onClick={() => setModalOpen(true)}>
          Group Info
        </button>
      )}
      {!isGroup && (
        <>
          <button className="ml-2 bg-green-500 text-white p-2 rounded" onClick={() => { setCallType('voice'); setCallModalOpen(true); }}>
            Voice Call
          </button>
          <button className="ml-2 bg-blue-500 text-white p-2 rounded" onClick={() => { setCallType('video'); setCallModalOpen(true); }}>
            Video Call
          </button>
        </>
      )}
      <button className="ml-2 bg-gray-500 text-white p-2 rounded" onClick={() => setSettingsModalOpen(true)}>
        Settings
      </button>
      <ChatSettingsModal open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
      {currentChat.disappearingDuration > 0 && (
        <span className="ml-2 text-xs text-red-500">Disappearing: {currentChat.disappearingDuration / 1000 / 60} min</span>
      )}
      <GroupInfoModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <CallModal open={callModalOpen} type={callType} status={'ringing'} onAccept={() => {}} onDecline={() => setCallModalOpen(false)} onEnd={() => setCallModalOpen(false)} remoteUser={isGroup ? null : currentChat.membersData?.find((m: any) => m.uid !== user?.uid)} />
    </header>
  );
} 