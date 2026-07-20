export function SkeletonCard() {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface-raised)',
        borderRadius: 'var(--radius-lg)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    >
      {/* Cover placeholder */}
      <div
        style={{
          aspectRatio: '3 / 4',
          backgroundColor: 'var(--color-neutral-200)',
        }}
      />
      {/* Text placeholders */}
      <div style={{ padding: 'var(--space-3)' }}>
        <div
          className="rounded"
          style={{
            height: '14px',
            width: '70%',
            backgroundColor: 'var(--color-neutral-200)',
            marginBottom: 'var(--space-2)',
          }}
        />
        <div
          className="rounded"
          style={{
            height: '12px',
            width: '40%',
            backgroundColor: 'var(--color-neutral-200)',
          }}
        />
      </div>
    </div>
  );
}
