import React, { useEffect, useState } from 'react';
import Avatar from '../../components/Avatar';
import { fetchStatuses } from '../../firebase/firestoreHelpers';
import Image from 'next/image';
import { Status } from '../../types';
import { Timestamp } from 'firebase/firestore';

export default function ViewStatus() {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStatuses = async () => {
    setLoading(true);
    const data = await fetchStatuses();
    setStatuses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStatuses();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-accent">Status Feed</h2>
      {loading ? (
        <div className="text-gray-400">Loading statuses...</div>
      ) : (
        <div className="space-y-6">
          {statuses.length === 0 && <div className="text-gray-400">No statuses yet.</div>}
          {statuses.map((status) => (
            <div key={status.id} className="bg-surface rounded-xl shadow-lg p-6 flex items-start gap-4">
              <Avatar name={status.displayName} src={status.photoURL} size={56} />
              <div className="flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="font-bold text-lg text-on-surface">{status.displayName}</span>
                  <span className="text-sm text-gray-400">
                    {status.createdAt instanceof Timestamp ? status.createdAt.toDate().toLocaleString() : ''}
                  </span>
                </div>
                {status.text && <p className="text-on-surface mt-2">{status.text}</p>}
                {status.mediaUrl && status.type?.startsWith('image') && (
                  <Image src={status.mediaUrl} alt="status" width={400} height={225} className="w-full object-cover rounded-lg my-3" />
                )}
                {status.mediaUrl && status.type?.startsWith('video') && (
                  <video src={status.mediaUrl} controls className="w-full rounded-lg my-3" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 