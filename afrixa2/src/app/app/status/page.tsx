"use client";
import StatusUpload from '../../../features/status/StatusUpload';
import ViewStatus from '../../../features/status/ViewStatus';

export default function StatusPage() {
  return (
    <div className="max-w-4xl mx-auto mt-8 flex flex-col md:flex-row gap-8">
      <div className="flex-1 bg-black/60 backdrop-blur-lg rounded-xl shadow-lg border border-white/10 p-6 mb-4">
        <StatusUpload />
      </div>
      <div className="flex-1">
        <ViewStatus />
      </div>
    </div>
  );
} 