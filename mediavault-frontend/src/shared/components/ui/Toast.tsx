import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="fixed z-[100] flex flex-col"
      style={{
        top: 'var(--space-4)',
        right: 'var(--space-4)',
        gap: 'var(--space-2)',
        maxWidth: '360px',
      }}
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const duration = toast.type === 'error' ? 5000 : 3000;
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div
      className="flex items-center gap-2 rounded-lg"
      style={{
        padding: 'var(--space-3) var(--space-4)',
        backgroundColor: toast.type === 'success' ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
        border: `var(--border-width) solid ${toast.type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'}`,
        boxShadow: 'var(--shadow-lg)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity var(--duration-normal) var(--easing-out), transform var(--duration-normal) var(--easing-out)',
      }}
      role="status"
      aria-live="polite"
    >
      {toast.type === 'success' ? (
        <CheckCircle size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
      ) : (
        <XCircle size={18} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
      )}
      <span
        style={{
          flex: 1,
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: toast.type === 'success' ? 'var(--color-success-text)' : 'var(--color-danger-text)',
        }}
      >
        {toast.message}
      </span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onDismiss(toast.id), 300);
        }}
        style={{
          color: toast.type === 'success' ? 'var(--color-success-text)' : 'var(--color-danger-text)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          flexShrink: 0,
        }}
        aria-label="Cerrar notificación"
      >
        <X size={14} />
      </button>
    </div>
  );
}
