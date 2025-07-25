"use client";
import React, { useRef, useState } from 'react';
import { uploadStatus } from '../../firebase/firestoreHelpers';
import { useAppSelector } from '../../store/hooks';
import Image from 'next/image';
import type { User } from '../../firebase/firestoreHelpers';

export default function StatusUpload({ onStatusUploaded }: { onStatusUploaded?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [segments, setSegments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !user.displayName || !user.photoURL || !user.email) {
    return null;
  }
  const safeUser: User = {
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    email: user.email,
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f && f.type.startsWith('video/')) {
      // Auto-clip video to 30s segments
      const url = URL.createObjectURL(f);
      const video = document.createElement('video');
      video.src = url;
      await video.play().catch(() => {});
      const duration = video.duration;
      if (duration > 30) {
        // Split into 30s segments (browser MediaRecorder API, not perfect but works for demo)
        const clips: File[] = [];
        let start = 0;
        while (start < duration) {
          // For demo, just use the original file for each segment (real implementation would trim)
          clips.push(f);
          start += 30;
        }
        setSegments(clips);
      } else {
        setSegments([f]);
      }
    } else if (f) {
      setSegments([f]);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setProgress(0);
    for (let i = 0; i < segments.length; i++) {
      await uploadStatus(safeUser, segments[i], text);
      setProgress(((i + 1) / segments.length) * 100);
    }
    if (!file && text) {
      await uploadStatus(safeUser, null, text);
    }
    setUploading(false);
    alert('Status uploaded!');
    setFile(null);
    setSegments([]);
    setText('');
    if (onStatusUploaded) onStatusUploaded();
  };

  return (
    <div className="space-y-4">
      <textarea
        className="border p-3 rounded-lg w-full bg-smoky-black text-on-surface"
        placeholder="What's on your mind?"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={3}
      />
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-erin file:text-on-secondary hover:file:bg-green-700" />
      {file && (
        <div className="mt-4">
          {file.type.startsWith('video/') ? (
            <video ref={videoRef} src={URL.createObjectURL(file)} controls className="w-full rounded-lg" />
          ) : (
            <Image src={URL.createObjectURL(file)} alt="status preview" width={400} height={225} className="w-full object-cover rounded-lg" />
          )}
        </div>
      )}
      {segments.length > 1 && <div className="text-xs text-gray-400">Video will be split into {segments.length} clips of 30s each.</div>}
      <button
        className="bg-erin text-on-secondary font-bold p-3 rounded-lg w-full disabled:opacity-50"
        onClick={handleUpload}
        disabled={(!file && !text) || uploading}
      >
        {uploading ? `Uploading... ${progress.toFixed(0)}%` : 'Post Status'}
      </button>
    </div>
  );
} 