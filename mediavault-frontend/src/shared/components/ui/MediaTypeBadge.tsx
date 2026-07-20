import type { MediaItemType } from '../../../core/types';
import { MEDIA_TYPE_LABELS } from '../../../core/types';

interface MediaTypeBadgeProps {
  type: MediaItemType;
}

export function MediaTypeBadge({ type }: MediaTypeBadgeProps) {
  return (
    <span
      className="inline-flex items-center rounded-full"
      style={{
        padding: '2px var(--space-2)',
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-weight-medium)',
        backgroundColor: 'var(--color-accent-bg-subtle)',
        color: 'var(--color-accent)',
      }}
    >
      {MEDIA_TYPE_LABELS[type]}
    </span>
  );
}
