import React from 'react';

export default function Spinner({ label = 'Loading...', size = 24 }: { label?: string; size?: number }) {
  return (
    <div className="flex flex-col items-center justify-center" role="status" aria-live="polite">
      <span
        className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"
        style={{ width: size, height: size, borderTopColor: '#3b82f6' }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
} 