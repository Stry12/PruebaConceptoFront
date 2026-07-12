import React from 'react';
import { getInitials, getAvatarColor } from '@/shared/utils';

interface AvatarProps {
  name: string;
  surname: string;
  id: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-9 h-9 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-xl',
};

export function Avatar({ name, surname, id, size = 'md' }: AvatarProps) {
  const color = getAvatarColor(id);
  return (
    <div className={`${sizeClasses[size]} rounded-full ${color.bg} flex items-center justify-center font-semibold ${color.text}`}>
      {getInitials(name, surname)}
    </div>
  );
}
