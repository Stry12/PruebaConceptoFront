import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  pill?: boolean;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary-light text-primary',
  secondary: 'bg-secondary-light text-secondary',
  accent: 'bg-accent-light text-accent',
  success: 'bg-success-light text-success',
  error: 'bg-error-light text-error',
  neutral: 'bg-neutral-100 text-neutral-600',
};

export function Badge({ children, variant = 'primary', size = 'sm', pill = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium ${variantClasses[variant]} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      } ${pill ? 'rounded-full' : 'rounded'}`}
    >
      {children}
    </span>
  );
}
