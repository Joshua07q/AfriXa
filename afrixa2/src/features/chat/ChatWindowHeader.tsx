"use client";
import { useAppSelector } from '../../store/hooks';
import GroupInfoModal from './GroupInfoModal';
import { useState } from 'react';
import CallModal from './CallModal';
import ChatSettingsModal from './ChatSettingsModal';
import Avatar from '../../components/Avatar';
import type { User as ChatUser } from '../../firebase/firestoreHelpers';
import { Chat } from '../../types';

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
    <header className="p-4 border-b font-bold bg-white flex items-center gap-3">
      <Avatar src={avatarSrc} name={avatarName} size={40} />
      <div>
        <div>{avatarName}</div>
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
      {currentChat.disappearingDuration && currentChat.disappearingDuration > 0 && (
        <span className="ml-2 text-xs text-red-500">Disappearing: {currentChat.disappearingDuration / 1000 / 60} min</span>
      )}
      <GroupInfoModal open={modalOpen} onClose={() => setModalOpen(false)} />
      {renderCallModal()}
    </header>
  );
} 