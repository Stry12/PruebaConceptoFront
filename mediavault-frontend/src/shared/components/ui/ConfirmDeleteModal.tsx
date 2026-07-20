import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName }: ConfirmDeleteModalProps) {
  return (
    <Modal title="¿Eliminar este ítem?" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center text-center" style={{ gap: 'var(--space-4)' }}>
        <AlertTriangle size={24} style={{ color: 'var(--color-warning)' }} />

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-secondary)',
            margin: 0,
          }}
        >
          Esta acción no se puede deshacer. El ítem se eliminará permanentemente de tu biblioteca.
        </p>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text)',
            margin: 0,
          }}
        >
          {itemName}
        </p>

        <div className="flex justify-center" style={{ gap: 'var(--space-3)', paddingTop: 'var(--space-2)' }}>
          <button
            onClick={onClose}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text)',
              backgroundColor: 'var(--color-surface-raised)',
              border: 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-on-accent)',
              backgroundColor: 'var(--color-danger)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
            }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
}
