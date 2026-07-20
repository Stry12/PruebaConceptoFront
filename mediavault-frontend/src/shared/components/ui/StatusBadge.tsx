import type { ConsumptionStatus } from '../../../core/types';
import { STATUS_LABELS } from '../../../core/types';

interface StatusBadgeProps {
  status: ConsumptionStatus;
}

const statusColors: Record<ConsumptionStatus, { bg: string; text: string }> = {
  pending: { bg: 'var(--color-info-bg)', text: 'var(--color-info-text)' },
  consuming: { bg: 'var(--color-warning-bg)', text: 'var(--color-warning-text)' },
  completed: { bg: 'var(--color-success-bg)', text: 'var(--color-success-text)' },
  abandoned: { bg: 'var(--color-danger-bg)', text: 'var(--color-danger-text)' },
  favorite: { bg: 'var(--color-accent-bg)', text: 'var(--color-accent)' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = statusColors[status];

  return (
    <span
      className="inline-flex items-center rounded-full"
      style={{
        padding: '2px var(--space-2)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-weight-medium)',
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
