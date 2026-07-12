import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/shared/utils';

const roleLabels: Record<string, string> = {
  Admin: 'Administrador',
  Doctor: 'Doctor',
  Receptionist: 'Recepcionista',
};

export function Header() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = getInitials(user.name, user.surname);

  return (
    <header className="h-16 fixed top-0 right-0 left-[240px] bg-white border-b border-neutral-200 z-40 flex items-center justify-between px-8">
      <div></div>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-neutral-900 leading-none">
            {user.role === 'Doctor' ? `Dr. ` : user.role === 'Admin' && user.name.endsWith('a') ? `Dra. ` : ''}{user.name} {user.surname}
          </p>
          <p className="text-[11px] text-neutral-500 mt-1">
            {user.specialty || roleLabels[user.role]}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xs">
          {initials}
        </div>
      </div>
    </header>
  );
}
