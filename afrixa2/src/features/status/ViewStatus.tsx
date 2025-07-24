import React, { useEffect, useState } from 'react';
import Avatar from '../../components/Avatar';
import { fetchStatuses } from '../../firebase/firestoreHelpers';

export default function ViewStatus() {
  const [statuses, setStatuses] = useState<any[]>([]);
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
            <div key={status.id} className="bg-black/60 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6 mb-4 flex items-center gap-4">
              <Avatar name={status.displayName} src={status.photoURL} size={48} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-accent">{status.displayName}</span>
                  <span className="text-xs text-gray-400">{status.createdAt?.toDate ? status.createdAt.toDate().toLocaleString() : ''}</span>
                </div>
                {status.mediaUrl && status.type?.startsWith('image') && (
                  <img src={status.mediaUrl} alt="status" className="w-full max-h-48 object-cover rounded my-2" />
                )}
                {status.mediaUrl && status.type?.startsWith('video') && (
                  <video src={status.mediaUrl} controls className="w-full max-h-48 rounded my-2" />
                )}
                {status.text && <div className="text-lg text-gray-100 mt-1">{status.text}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 