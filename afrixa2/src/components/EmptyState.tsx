import React from 'react';

export default function EmptyState({ message, icon }: { message: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-gray-400 text-center mt-8" role="status" aria-live="polite">
      {icon && <div className="mb-2 text-4xl">{icon}</div>}
      <span>{message}</span>
    </div>
  );
} 