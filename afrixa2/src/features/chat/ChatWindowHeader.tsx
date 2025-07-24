"use client";
import { useAppSelector } from '../../store/hooks';
import GroupInfoModal from './GroupInfoModal';
import { useState } from 'react';
import CallModal from './CallModal';
import ChatSettingsModal from './ChatSettingsModal';
import Avatar from '../../components/Avatar';
import type { User as ChatUser } from '../../firebase/firestoreHelpers';
import { Chat } from '../../types';
import { FiPhone, FiVideo, FiSettings, FiInfo } from 'react-icons/fi';

// Extend Chat type to include membersData and disappearingDuration
interface ChatWithMembersData extends Chat {
  membersData?: ChatUser[];
}

export default function ChatWindowHeader() {
  const { currentChat } = useAppSelector((state) => state.chat) as { currentChat: ChatWithMembersData | null };
  const { user } = useAppSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callType, setCallType] = useState<'voice' | 'video'>('voice');
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  if (!currentChat) return null;

  const isGroup = currentChat.isGroup;
  const avatarSrc = isGroup
    ? currentChat.groupImage
    : currentChat.membersData?.find((m: ChatUser) => m.uid !== user?.uid)?.photoURL;
  const avatarName = isGroup
    ? currentChat.groupName
    : currentChat.membersData?.filter((m: ChatUser) => m.uid !== user?.uid).map((m: ChatUser) => m.displayName).join(', ');
  const members = isGroup
    ? currentChat.membersData?.map((m: ChatUser) => m.displayName).join(', ')
    : null;

  // Only render CallModal if user and required fields are present
  const canCall = user && user.displayName && user.photoURL && user.email;
  const safeUser = canCall ? {
    uid: user.uid,
    displayName: user.displayName as string,
    photoURL: user.photoURL as string,
    email: user.email as string,
  } : null;

  function renderCallModal(): React.ReactNode {
    if (!currentChat) return null;
    if (canCall && !isGroup && currentChat.membersData?.find((m: ChatUser) => m.uid !== user?.uid)) {
      return (
        <CallModal
          open={callModalOpen}
          type={callType === 'voice' ? 'audio' : 'video'}
          status={'ringing'}
          onAccept={() => { return; }}
          onDecline={() => setCallModalOpen(false)}
          onEnd={() => setCallModalOpen(false)}
          remoteUser={currentChat.membersData.find((m: ChatUser) => m.uid !== user?.uid)!}
          localUser={safeUser!}
          isCaller={true}
        />
      );
    } else if (canCall && isGroup && currentChat.membersData) {
      return (
        <CallModal
          open={callModalOpen}
          type={callType === 'voice' ? 'audio' : 'video'}
          status={'ringing'}
          onAccept={() => { return; }}
          onDecline={() => setCallModalOpen(false)}
          onEnd={() => setCallModalOpen(false)}
          remoteUser={currentChat.membersData[0]}
          localUser={safeUser!}
          isCaller={true}
        />
      );
    }
    return null;
  }

  return (
    <header className="p-4 bg-surface border-b border-gray-700 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar src={avatarSrc} name={avatarName} size={40} />
        <div>
          <div className="font-bold text-on-surface">{avatarName}</div>
          {isGroup && <div className="text-xs text-gray-400">{members}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!isGroup && (
          <>
            <button className="p-2 rounded-full bg-erin hover:bg-green-700 text-on-secondary" onClick={() => { setCallType('voice'); setCallModalOpen(true); }}>
              <FiPhone />
            </button>
            <button className="p-2 rounded-full bg-erin hover:bg-green-700 text-on-secondary" onClick={() => { setCallType('video'); setCallModalOpen(true); }}>
              <FiVideo />
            </button>
          </>
        )}
        <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-on-surface" onClick={() => setSettingsModalOpen(true)}>
          <FiSettings />
        </button>
        {isGroup && (
          <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-on-surface" onClick={() => setModalOpen(true)}>
            <FiInfo />
          </button>
        )}
      </div>
      <ChatSettingsModal open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
      {currentChat.disappearingDuration && currentChat.disappearingDuration > 0 && (
        <span className="text-xs text-red-500">Disappearing: {currentChat.disappearingDuration / 1000 / 60} min</span>
      )}
      <GroupInfoModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {renderCallModal()}
    </header>
  );
} 