import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  icon?: string;
  children?: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-primary hover:bg-primary-hover text-white shadow-subtle',
  secondary: 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50',
  danger: 'bg-error hover:bg-red-700 text-white',
  ghost: 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100',
};

export function Button({ variant = 'primary', size = 'md', icon, children, className = '', ...props }: ButtonProps) {
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  return (
    <button
      className={`inline-flex items-center gap-2 font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses} ${className}`}
      {...props}
    >
      {icon && <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>}
      {children}
    </button>
  );
}
