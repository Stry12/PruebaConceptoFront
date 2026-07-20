export interface ChipOption {
  id: string;
  label: string;
}

interface FilterChipsProps {
  options: ChipOption[];
  activeIds: string[];
  onToggle: (id: string) => void;
  ariaLabel?: string;
  /** Additional CSS class for the container (e.g. responsive scroll behavior) */
  className?: string;
}

export function FilterChips({ options, activeIds, onToggle, ariaLabel, className }: FilterChipsProps) {
  return (
    <div
      className={`flex flex-wrap ${className ?? ''}`}
      style={{ gap: 'var(--space-2)' }}
      role="group"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = activeIds.includes(option.id);
        return (
          <button
            key={option.id}
            onClick={() => onToggle(option.id)}
            className="rounded-full whitespace-nowrap"
            style={{
              padding: 'var(--space-2) var(--space-3)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              backgroundColor: isActive ? 'var(--color-accent-bg)' : 'var(--color-surface)',
              border: `${isActive ? 'var(--border-width-strong)' : 'var(--border-width)'} solid ${isActive ? 'var(--color-accent)' : 'var(--color-border)'}`,
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: `background-color var(--duration-fast) var(--easing-default), border-color var(--duration-fast) var(--easing-default), color var(--duration-fast) var(--easing-default)`,
            }}
            aria-pressed={isActive}
            aria-label={isActive ? `Quitar filtro de tipo: ${option.label}` : `Filtrar por tipo: ${option.label}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
