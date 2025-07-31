"use client";
import EmptyState from '../components/EmptyState';
import { FiAlertTriangle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <EmptyState
        message="Page not found"
        icon={<FiAlertTriangle className="text-4xl text-error" />}
      />
    </div>
  );
}
