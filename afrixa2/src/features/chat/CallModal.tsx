"use client";
import React, { useEffect, useRef, useState } from 'react';
import { createCall, answerCall, onCallUpdate, User } from '../../firebase/firestoreHelpers';

interface CallModalProps {
  open: boolean;
  type: 'video' | 'audio';
  status: 'ringing' | 'in-progress' | 'ended';
  onAccept: () => void;
  onDecline: () => void;
  onEnd: () => void;
  remoteUser: User;
  localUser: User;
  isCaller: boolean;
  callId?: string | null;
}

export default function CallModal({ open, type, status, onAccept, onDecline, onEnd, remoteUser, localUser, isCaller, callId: propCallId }: CallModalProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [callId, setCallId] = useState<string | null>(propCallId ?? null);
  const [callStatus, setCallStatus] = useState<'ringing' | 'in-progress' | 'ended'>(status);

  useEffect(() => {
    if (!open) return;
    let pc: RTCPeerConnection;
    let localStream: MediaStream;
    let unsub: (() => void) | undefined;
    const setupCall = async () => {
      pc = new RTCPeerConnection();
      localStream = await navigator.mediaDevices.getUserMedia({
        video: type === 'video',
        audio: true,
      });
      if (localVideoRef.current && type === 'video') {
        (localVideoRef.current as HTMLVideoElement).srcObject = localStream;
      }
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));
      pc.ontrack = (event) => {
        if (remoteVideoRef.current && type === 'video') {
          (remoteVideoRef.current as HTMLVideoElement).srcObject = event.streams[0];
        }
      };
      pc.onicecandidate = async (event) => {
        if (event.candidate && callId) {
          // Add ICE candidate to Firestore (not implemented in helpers yet)
        }
      };
      if (status === 'ringing' && isCaller) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        const id = await createCall(localUser.uid, remoteUser.uid, offer);
        setCallId(id);
        unsub = onCallUpdate(id, (call: Record<string, unknown> | null) => {
          if (call && call.answer && typeof call.answer === 'object' && 'type' in call.answer) {
            const answer = call.answer as RTCSessionDescriptionInit;
            pc.setRemoteDescription(new RTCSessionDescription(answer));
            setCallStatus('in-progress');
          }
          if (call && call.status === 'ended') {
            setCallStatus('ended');
            pc.close();
          }
        });
      } else if (status === 'ringing' && !isCaller && propCallId) {
        unsub = onCallUpdate(propCallId, (call: Record<string, unknown> | null) => {
          if (call && call.offer && typeof call.offer === 'object' && 'type' in call.offer) {
            const offer = call.offer as RTCSessionDescriptionInit;
            pc.setRemoteDescription(new RTCSessionDescription(offer))
              .then(async () => {
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                await answerCall(propCallId, answer);
                setCallStatus('in-progress');
              })
              .catch(() => {});
          }
          if (call && call.status === 'ended') {
            setCallStatus('ended');
            pc.close();
          }
        });
      }
    };
    setupCall();
    return () => {
      if (unsub) unsub();
      if (pc) pc.close();
      if (localStream) localStream.getTracks().forEach((t) => t.stop());
    };
  }, [open, type, status, localUser, remoteUser, isCaller, propCallId, callId]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">{type === 'video' ? 'Video Call' : 'Voice Call'}</h2>
        <div className="mb-4">
          <span className="font-semibold">{remoteUser?.displayName}</span>
        </div>
        {type === 'video' && (
          <div className="flex gap-2 mb-4">
            <video autoPlay playsInline muted ref={localVideoRef} className="w-32 h-32 bg-black rounded" />
            <video autoPlay playsInline ref={remoteVideoRef} className="w-32 h-32 bg-black rounded" />
          </div>
        )}
        {callStatus === 'ringing' && isCaller && (
          <div className="text-green-500">Calling...</div>
        )}
        {callStatus === 'ringing' && !isCaller && (
          <div className="flex gap-2">
            <button className="bg-green-500 text-white p-2 rounded" onClick={onAccept}>Accept</button>
            <button className="bg-red-500 text-white p-2 rounded" onClick={onDecline}>Decline</button>
          </div>
        )}
        {callStatus === 'in-progress' && (
          <button className="bg-red-500 text-white p-2 rounded" onClick={onEnd}>End Call</button>
        )}
        {callStatus === 'ended' && <div className="text-gray-500">Call ended</div>}
      </div>
    </div>
  );
} 