import { useState } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import type { List } from '../../../core/types';

interface ListPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: List[];
  selectedIds: string[];
  onToggle: (listId: string) => void;
  onCreateNew: (name: string) => void;
  itemTitle: string;
}

export function ListPickerModal({
  isOpen,
  onClose,
  lists,
  selectedIds,
  onToggle,
  onCreateNew,
  itemTitle,
}: ListPickerModalProps) {
  const [newName, setNewName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = lists.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (newName.trim()) {
      onCreateNew(newName.trim());
      setNewName('');
      setShowCreate(false);
    }
  };

  return (
    <Modal title="Agregar a lista" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
        {/* Search */}
        <input
          type="search"
          placeholder="Buscar listas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: 'var(--space-2) var(--space-3)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            color: 'var(--color-text)',
            backgroundColor: 'var(--color-surface)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            outline: 'none',
          }}
          aria-label="Buscar listas"
        />

        {/* List items */}
        <div className="flex flex-col" style={{ gap: 'var(--space-1)' }}>
          {filtered.map((list) => {
            const isSelected = selectedIds.includes(list.id);
            return (
              <button
                key={list.id}
                onClick={() => onToggle(list.id)}
                className="flex items-center w-full text-left rounded-md"
                style={{
                  padding: 'var(--space-3)',
                  backgroundColor: isSelected ? 'var(--color-accent-bg)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  gap: 'var(--space-3)',
                }}
              >
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text)',
                    }}
                  >
                    {list.name}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {list.description || 'Sin descripción'}
                  </div>
                </div>
                {isSelected && (
                  <Check size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Create new */}
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="text-left rounded-md"
            style={{
              padding: 'var(--space-3)',
              color: 'var(--color-accent)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              backgroundColor: 'transparent',
              border: 'var(--border-width) dashed var(--color-border)',
              cursor: 'pointer',
            }}
          >
            + Crear nueva lista
          </button>
        ) : (
          <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre de la lista"
              autoFocus
              style={{
                flex: 1,
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-surface)',
                border: 'var(--border-width) solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
              }}
            />
            <button
              onClick={handleCreate}
              disabled={!newName.trim()}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-on-accent)',
                backgroundColor: 'var(--color-accent)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: newName.trim() ? 'pointer' : 'not-allowed',
                opacity: newName.trim() ? 1 : 0.5,
              }}
            >
              Crear
            </button>
          </div>
        )}

        {/* Close button */}
        <div className="flex justify-end" style={{ paddingTop: 'var(--space-2)' }}>
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
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
