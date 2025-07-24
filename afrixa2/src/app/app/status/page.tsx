"use client";
import StatusUpload from '../../../features/status/StatusUpload';
import ViewStatus from '../../../features/status/ViewStatus';

export default function StatusPage() {
  return (
    <div className="h-screen bg-background text-on-background p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Status Updates</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-surface rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Post a Status</h2>
          <StatusUpload />
        </div>
        <div className="md:col-span-2 bg-surface rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-accent mb-4">Recent Updates</h2>
          <ViewStatus />
        </div>
      </div>
    </div>
  );
}