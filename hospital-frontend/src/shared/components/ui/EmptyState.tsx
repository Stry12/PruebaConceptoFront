import React from 'react';

interface EmptyStateProps {
  icon: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-neutral-400" style={{ fontSize: '32px' }}>{icon}</span>
      </div>
      <p className="text-neutral-500 text-sm mb-4">{message}</p>
      {action}
    </div>
  );
}
