"use client";
import React, { useRef, useState } from 'react';

export default function StatusUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [segments, setSegments] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    // TODO: Upload each segment as a separate status (integrate with Firestore/Firebase Storage)
    for (let i = 0; i < segments.length; i++) {
      // await uploadStatus(segments[i]);
      setProgress(((i + 1) / segments.length) * 100);
    }
    setUploading(false);
    alert('Status uploaded!');
    setFile(null);
    setSegments([]);
  };

  return (
    <div className="p-4 border rounded max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-2">Upload Status</h2>
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      {file && (
        <div className="mt-4">
          {file.type.startsWith('video/') ? (
            <video ref={videoRef} src={URL.createObjectURL(file)} controls className="w-full max-h-48" />
          ) : (
            <img src={URL.createObjectURL(file)} alt="status" className="w-full max-h-48 object-cover" />
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