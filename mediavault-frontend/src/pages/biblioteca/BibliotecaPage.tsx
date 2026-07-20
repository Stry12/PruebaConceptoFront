import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, BookOpen, SearchX, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../../app/provider';
import type { MediaItem, ConsumptionStatus } from '../../core/types';
import { MEDIA_TYPE_LABELS, STATUS_LABELS } from '../../core/types';
import { MediaCard } from '../../shared/components/ui/MediaCard';
import { FilterChips, type ChipOption } from '../../shared/components/ui/FilterChips';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { SkeletonCard } from '../../shared/components/ui/SkeletonCard';
import { SlideOver } from '../../shared/components/ui/SlideOver';
import { MediaItemForm } from '../../shared/components/ui/MediaItemForm';
import { CollectionPickerModal } from '../../shared/components/ui/CollectionPickerModal';
import { ListPickerModal } from '../../shared/components/ui/ListPickerModal';
import { ConfirmDeleteModal } from '../../shared/components/ui/ConfirmDeleteModal';
import { ToastContainer, type Toast } from '../../shared/components/ui/Toast';
import { dummyCollections, dummyLists } from '../../core/data/dummy-media-items';

type ScreenState = 'loading' | 'loaded' | 'error' | 'empty' | 'no-results';

const typeChipOptions: ChipOption[] = [
  { id: 'all', label: 'Todos' },
  ...Object.entries(MEDIA_TYPE_LABELS).map(([id, label]) => ({ id, label })),
];

const statusChipOptions: ChipOption[] = [
  { id: 'all', label: 'Todos' },
  ...Object.entries(STATUS_LABELS)
    .filter(([id]) => id !== 'favorite')
    .map(([id, label]) => ({ id, label: label as string })),
];

export function BibliotecaPage() {
  const { mediaItemService } = useAppContext();

  // State
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTypeFilters, setActiveTypeFilters] = useState<string[]>([]);
  const [activeStatusFilters, setActiveStatusFilters] = useState<string[]>([]);

  // Overlays
  const [showNewItem, setShowNewItem] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MediaItem | null>(null);
  const [collectionPickerItem, setCollectionPickerItem] = useState<MediaItem | null>(null);
  const [listPickerItem, setListPickerItem] = useState<MediaItem | null>(null);

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Load items
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setScreenState('loading');
        const data = await mediaItemService.getAll();
        if (!cancelled) {
          setItems(data);
          setScreenState(data.length === 0 ? 'empty' : 'loaded');
        }
      } catch {
        if (!cancelled) setScreenState('error');
      }
    }
    load();
    return () => { cancelled = true; };
  }, [mediaItemService]);

  // Debounce search (~300ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter items (AND logic: type + status + search)
  const filteredItems = useMemo(() => {
    let result = items;

    // Type filter
    if (activeTypeFilters.length > 0 && !activeTypeFilters.includes('all')) {
      result = result.filter((item) => activeTypeFilters.includes(item.type));
    }

    // Status filter
    if (activeStatusFilters.length > 0 && !activeStatusFilters.includes('all')) {
      result = result.filter((item) => activeStatusFilters.includes(item.status));
    }

    // Search (domain.md regla 3: título, creador, género, categoría, etiquetas, plataforma, tipo, estado)
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.creator.toLowerCase().includes(q) ||
          item.genre.toLowerCase().includes(q) ||
          item.platform.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q))
      );
    }

    return result;
  }, [items, activeTypeFilters, activeStatusFilters, debouncedQuery]);

  // Determine if we need to show "no results"
  const hasActiveFilters =
    activeTypeFilters.length > 0 ||
    activeStatusFilters.length > 0 ||
    debouncedQuery.trim().length > 0;

  const showNoResults = screenState === 'loaded' && hasActiveFilters && filteredItems.length === 0;

  // Toggle filters
  const toggleTypeFilter = (id: string) => {
    if (id === 'all') {
      setActiveTypeFilters([]);
      return;
    }
    setActiveTypeFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const toggleStatusFilter = (id: string) => {
    if (id === 'all') {
      setActiveStatusFilters([]);
      return;
    }
    setActiveStatusFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const clearAllFilters = () => {
    setActiveTypeFilters([]);
    setActiveStatusFilters([]);
    setSearchQuery('');
    setDebouncedQuery('');
  };

  // Actions — all wired to the service
  const handleToggleFavorito = async (id: string) => {
    try {
      const isFav = await mediaItemService.toggleFavorite(id);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isFavorite: isFav } : item))
      );
      addToast('success', isFav ? 'Añadido a favoritos' : 'Quitado de favoritos');
    } catch {
      addToast('error', 'No se pudo cambiar el favorito');
    }
  };

  const handleChangeStatus = async (id: string, status: ConsumptionStatus) => {
    try {
      const updated = await mediaItemService.changeStatus(id, status);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      addToast('success', `Estado actualizado a ${STATUS_LABELS[status]}`);
    } catch {
      addToast('error', 'No se pudo cambiar el estado');
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    try {
      await mediaItemService.delete(deletingItem.id);
      setItems((prev) => prev.filter((item) => item.id !== deletingItem.id));
      setDeletingItem(null);
      addToast('success', 'Ítem eliminado');
    } catch {
      addToast('error', 'No se pudo eliminar el ítem');
    }
  };

  const handleCreateItem = async (values: Omit<MediaItem, 'id' | 'userId' | 'addedAt'>) => {
    try {
      const newItem = await mediaItemService.create(values);
      setItems((prev) => [newItem, ...prev]);
      setShowNewItem(false);
      setScreenState('loaded');
      addToast('success', 'Ítem agregado');
    } catch {
      addToast('error', 'No se pudo crear el ítem');
    }
  };

  const handleUpdateItem = async (values: Omit<MediaItem, 'id' | 'userId' | 'addedAt'>) => {
    if (!editingItem) return;
    try {
      const updated = await mediaItemService.update(editingItem.id, values);
      setItems((prev) => prev.map((item) => (item.id === editingItem.id ? updated : item)));
      setEditingItem(null);
      addToast('success', 'Ítem actualizado');
    } catch {
      addToast('error', 'No se pudo actualizar el ítem');
    }
  };

  // Count active filters for "Limpiar filtros" visibility
  const activeFilterCount =
    activeTypeFilters.filter((f) => f !== 'all').length +
    activeStatusFilters.filter((f) => f !== 'all').length +
    (debouncedQuery.trim() ? 1 : 0);

  return (
    <div className="mx-auto page-content-with-tabs" style={{ maxWidth: 'var(--grid-max-width)', padding: '0 var(--space-6)' }}>
      {/* Page Header — flex row nowrap: título + botón + (siempre juntos) */}
      <header
        className="flex items-center flex-nowrap"
        style={{
          gap: 'var(--space-3)',
          paddingTop: 'var(--space-4)',
          paddingBottom: 'var(--space-4)',
          minHeight: 'var(--space-12)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            margin: 0,
            whiteSpace: 'nowrap',
          }}
        >
          Biblioteca
        </h1>

        {/* Desktop search — flex-grow, max-width 400px */}
        <div className="hidden md:flex items-center flex-1 max-w-[400px]">
          <div
            className="flex items-center w-full"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: 'var(--border-width) solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-2) var(--space-3)',
              gap: 'var(--space-2)',
            }}
          >
            <Search size={20} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
            <input
              type="search"
              placeholder="Buscar por título, autor, género..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Buscar en tu biblioteca"
              className="w-full bg-transparent border-none outline-none"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                color: 'var(--color-text)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setDebouncedQuery(''); }}
                style={{
                  color: 'var(--color-text-tertiary)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  minWidth: '20px',
                  minHeight: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Add button — always visible, ≥44×44px hit area on mobile */}
        <button
          onClick={() => setShowNewItem(true)}
          className="flex items-center justify-center flex-shrink-0"
          style={{
            padding: 'var(--space-2) var(--space-4)',
            minHeight: '44px',
            minWidth: '44px',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-text-on-accent)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: `background-color var(--duration-fast) var(--easing-default)`,
          }}
          aria-label="Agregar nuevo ítem"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent-hover)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent)';
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent-pressed)';
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-accent-hover)';
          }}
        >
          <Plus size={20} />
        </button>
      </header>

      {/* Mobile search bar — independent bar below header */}
      <div className="md:hidden" style={{ paddingBottom: 'var(--space-4)' }}>
        <div
          className="flex items-center w-full"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-2) var(--space-3)',
            gap: 'var(--space-2)',
          }}
        >
          <Search size={20} style={{ color: 'var(--color-text-tertiary)', flexShrink: 0 }} />
          <input
            type="search"
            placeholder="Buscar por título, autor, género..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar en tu biblioteca"
            className="w-full bg-transparent border-none outline-none"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              color: 'var(--color-text)',
            }}
          />
        </div>
      </div>

      {/* Filter Bar — chips + limpiar filtros */}
      <nav
        aria-label="Filtros de biblioteca"
        className="flex flex-col md:flex-row md:flex-wrap md:items-center"
        style={{
          gap: 'var(--space-3)',
          paddingBottom: 'var(--space-4)',
        }}
      >
        <div
          className="flex filter-chips-scroll"
          style={{
            gap: 'var(--space-2)',
          }}
        >
          <FilterChips
            options={typeChipOptions}
            activeIds={activeTypeFilters.length === 0 ? ['all'] : activeTypeFilters}
            onToggle={toggleTypeFilter}
            ariaLabel="Filtrar por tipo de contenido"
          />
          <div className="hidden md:block" style={{ width: '1px', backgroundColor: 'var(--color-border)', alignSelf: 'stretch', flexShrink: 0 }} />
          <FilterChips
            options={statusChipOptions}
            activeIds={activeStatusFilters.length === 0 ? ['all'] : activeStatusFilters}
            onToggle={toggleStatusFilter}
            ariaLabel="Filtrar por estado de consumo"
          />
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="whitespace-nowrap"
            style={{
              color: 'var(--color-accent)',
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-medium)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.textDecoration = 'underline'; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.textDecoration = 'none'; }}
          >
            Limpiar filtros
          </button>
        )}
      </nav>

      {/* Content — aria-live announces filter changes */}
      <div aria-live="polite" aria-busy={screenState === 'loading'} style={{ paddingBottom: 'var(--space-8)' }}>
        {/* Loading state — 8 skeletons matching card dimensions */}
        {screenState === 'loading' && (
          <div
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {screenState === 'error' && (
          <EmptyState
            icon={AlertTriangle}
            title="Algo salió mal"
            description="No pudimos cargar tu biblioteca. Intenta de nuevo."
            ctaLabel="Reintentar"
            onCta={() => window.location.reload()}
          />
        )}

        {/* Empty state */}
        {screenState === 'empty' && (
          <EmptyState
            icon={BookOpen}
            title="Tu biblioteca está vacía"
            description="Añade tu primer libro, película, serie o cualquier contenido que consumas."
            ctaLabel="Añadir mi primer ítem"
            onCta={() => setShowNewItem(true)}
          />
        )}

        {/* No results */}
        {showNoResults && (
          <EmptyState
            icon={SearchX}
            title="No se encontraron resultados"
            description={`No hay ítems que coincidan con "${debouncedQuery}". Prueba con otros términos o limpia los filtros.`}
            ctaLabel="Limpiar filtros"
            onCta={clearAllFilters}
          />
        )}

        {/* Card grid — responsive: 2 cols mobile, 3 tablet, 4 desktop */}
        {screenState === 'loaded' && filteredItems.length > 0 && (
          <div
            className="media-grid grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-4"
            role="list"
            aria-label="Biblioteca de medios"
          >
            {filteredItems.map((item) => (
              <div key={item.id} role="listitem" className="h-full">
                <MediaCard
                  item={item}
                  onToggleFavorito={handleToggleFavorito}
                  onDelete={setDeletingItem}
                  onAddToCollection={setCollectionPickerItem}
                  onAddToList={setListPickerItem}
                  onChangeStatus={handleChangeStatus}
                  onEdit={setEditingItem}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Overlays ─── */}

      {/* New Item SlideOver (sub-pantalla 1.1) */}
      <SlideOver
        title="Nuevo ítem"
        isOpen={showNewItem}
        onClose={() => setShowNewItem(false)}
      >
        <MediaItemForm
          onSubmit={handleCreateItem}
          onCancel={() => setShowNewItem(false)}
        />
      </SlideOver>

      {/* Edit Item SlideOver (sub-pantalla 1.2) */}
      <SlideOver
        title="Editar ítem"
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
      >
        {editingItem && (
          <MediaItemForm
            initialValues={editingItem}
            onSubmit={handleUpdateItem}
            onCancel={() => setEditingItem(null)}
            isEditing
          />
        )}
      </SlideOver>

      {/* Delete Confirmation Modal (sub-pantalla 1.5) */}
      <ConfirmDeleteModal
        isOpen={!!deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDelete}
        itemName={deletingItem?.title ?? ''}
      />

      {/* Collection Picker Modal (sub-pantalla 1.3) */}
      <CollectionPickerModal
        isOpen={!!collectionPickerItem}
        onClose={() => setCollectionPickerItem(null)}
        collections={dummyCollections}
        selectedIds={[]}
        onToggle={(_id) => {
          addToast('success', `Añadido a colección`);
          setCollectionPickerItem(null);
        }}
        onCreateNew={(name) => {
          addToast('success', `Colección "${name}" creada`);
          setCollectionPickerItem(null);
        }}
        itemTitle={collectionPickerItem?.title ?? ''}
      />

      {/* List Picker Modal (sub-pantalla 1.4) */}
      <ListPickerModal
        isOpen={!!listPickerItem}
        onClose={() => setListPickerItem(null)}
        lists={dummyLists}
        selectedIds={[]}
        onToggle={(_id) => {
          addToast('success', `Añadido a lista`);
          setListPickerItem(null);
        }}
        onCreateNew={(name) => {
          addToast('success', `Lista "${name}" creada`);
          setListPickerItem(null);
        }}
        itemTitle={listPickerItem?.title ?? ''}
      />

      {/* Toasts (T.1 / T.2) */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
