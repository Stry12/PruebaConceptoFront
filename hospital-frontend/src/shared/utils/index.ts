const avatarColors = [
  { bg: 'bg-primary-light', text: 'text-primary' },
  { bg: 'bg-secondary-light', text: 'text-secondary' },
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-red-100', text: 'text-red-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700' },
];

export function getAvatarColor(id: number) {
  return avatarColors[id % avatarColors.length];
}

export function getInitials(name: string, surname: string) {
  return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase();
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function getAge(dateOfBirth: string): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export const roleLabels: Record<string, string> = {
  Admin: 'Administrador',
  Doctor: 'Doctor',
  Receptionist: 'Recepcionista',
};
