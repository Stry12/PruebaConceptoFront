import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { ConsumptionStatus } from '../../../core/types';
import { STATUS_LABELS } from '../../../core/types';

export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

interface ContextMenuProps {
  items: DropdownMenuItem[];
  statusOptions?: ConsumptionStatus[];
  onStatusChange?: (status: ConsumptionStatus) => void;
  ariaLabel: string;
}

export function ContextMenu({ items, statusOptions, onStatusChange, ariaLabel }: ContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      <button
        ref={triggerRef}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center justify-center"
        style={{
          minWidth: '44px',
          minHeight: '44px',
          color: 'var(--color-text-tertiary)',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 2,
          transition: `color var(--duration-fast) var(--easing-default)`,
          padding: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = 'var(--color-text-secondary)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = 'var(--color-text-tertiary)';
        }}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-50 min-w-[200px]"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-2)',
            top: '100%',
            marginTop: 'var(--space-1)',
          }}
        >
          {statusOptions && onStatusChange && (
            <>
              <div
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-tertiary)',
                }}
              >
                Cambiar estado
              </div>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  role="menuitem"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStatusChange(status);
                    setIsOpen(false);
                  }}
                  className="w-full text-left rounded-md block"
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text)',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: 'var(--space-1) 0' }} />
            </>
          )}
          {items.map((item, i) => (
            <button
              key={i}
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                item.onClick();
                setIsOpen(false);
              }}
              className="w-full text-left flex items-center gap-2 rounded-md"
              style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                color: item.danger ? 'var(--color-danger)' : 'var(--color-text)',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
