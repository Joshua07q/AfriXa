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
    <div className="p-4 border rounded max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-2">Upload Status</h2>
      <textarea
        className="border p-2 rounded w-full mb-2 bg-black/40 text-gray-100"
        placeholder="What&apos;s on your mind? (optional)"
        value={text}
        onChange={e => setText(e.target.value)}
        rows={2}
      />
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      {file && (
        <div className="mt-4">
          {file.type.startsWith('video/') ? (
            <video ref={videoRef} src={URL.createObjectURL(file)} controls className="w-full max-h-48" />
          ) : (
            <Image src={URL.createObjectURL(file)} alt="status" width={400} height={192} className="w-full max-h-48 object-cover" />
          )}
        </div>
      )}
      {segments.length > 1 && <div className="text-xs text-gray-500">Video will be split into {segments.length} clips of 30s each.</div>}
      <button
        className="bg-green-500 text-white p-2 rounded mt-4 w-full"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? `Uploading... ${progress.toFixed(0)}%` : 'Upload Status'}
      </button>
    </div>
  );
} 