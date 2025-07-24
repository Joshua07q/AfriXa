import React from 'react';

export default function ErrorBanner({ message, onClose }: { message: string; onClose?: () => void }) {
  return (
    <div
      className="bg-red-100 text-red-700 p-2 rounded mb-2 flex items-center justify-between"
      role="alert"
      aria-live="assertive"
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-red-700 hover:text-red-900 font-bold focus:outline focus:ring"
          aria-label="Close error message"
        >
          ×
        </button>
      )}
    </div>
  );
} 