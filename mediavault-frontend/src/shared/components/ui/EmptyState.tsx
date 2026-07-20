import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export function EmptyState({ icon: Icon, title, description, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center text-center"
      style={{
        padding: 'var(--space-16) var(--space-4)',
        gap: 'var(--space-4)',
        maxWidth: '400px',
        margin: '0 auto',
      }}
    >
      <Icon size={32} style={{ color: 'var(--color-neutral-400)' }} />
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text)',
          margin: 0,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-base)',
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}
      >
        {description}
      </p>
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="rounded-md"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-text-on-accent)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            padding: 'var(--space-2) var(--space-4)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
