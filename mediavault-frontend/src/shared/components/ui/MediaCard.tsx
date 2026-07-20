import { useState } from 'react';
import {
  Star,
  MoreHorizontal,
  Film,
  Tv,
  BookOpen,
  Headphones,
  Mic,
  GraduationCap,
  Newspaper,
  Clapperboard,
  Pencil,
  FolderPlus,
  ListPlus,
  Trash2,
} from 'lucide-react';
import type { MediaItem, ConsumptionStatus } from '../../../core/types';
import { MediaTypeBadge } from './MediaTypeBadge';
import { StatusBadge } from './StatusBadge';
import { RatingStars } from './RatingStars';
import { ContextMenu, type DropdownMenuItem } from './ContextMenu';

interface MediaCardProps {
  item: MediaItem;
  onToggleFavorito: (id: string) => void;
  onDelete: (item: MediaItem) => void;
  onAddToCollection: (item: MediaItem) => void;
  onAddToList: (item: MediaItem) => void;
  onChangeStatus: (id: string, status: ConsumptionStatus) => void;
  onEdit: (item: MediaItem) => void;
}

const typeIcons: Record<string, React.ReactNode> = {
  book: <BookOpen size={32} />,
  film: <Film size={32} />,
  series: <Tv size={32} />,
  documentary: <Clapperboard size={32} />,
  manga: <BookOpen size={32} />,
  comic: <BookOpen size={32} />,
  magazine: <Newspaper size={32} />,
  audiobook: <Headphones size={32} />,
  podcast: <Mic size={32} />,
  course: <GraduationCap size={32} />,
  other: <BookOpen size={32} />,
};

export function MediaCard({
  item,
  onToggleFavorito,
  onDelete,
  onAddToCollection,
  onAddToList,
  onChangeStatus,
  onEdit,
}: MediaCardProps) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !item.coverImage || imageError;

  const menuItems: DropdownMenuItem[] = [
    {
      label: 'Editar',
      icon: <Pencil size={16} style={{ color: 'var(--color-text-secondary)' }} />,
      onClick: () => onEdit(item),
    },
    {
      label: 'Agregar a colección',
      icon: <FolderPlus size={16} style={{ color: 'var(--color-text-secondary)' }} />,
      onClick: () => onAddToCollection(item),
    },
    {
      label: 'Agregar a lista',
      icon: <ListPlus size={16} style={{ color: 'var(--color-text-secondary)' }} />,
      onClick: () => onAddToList(item),
    },
    {
      label: 'Eliminar',
      icon: <Trash2 size={16} style={{ color: 'var(--color-danger)' }} />,
      onClick: () => onDelete(item),
      danger: true,
    },
  ];

  const allStatuses: ConsumptionStatus[] = ['pending', 'consuming', 'completed', 'abandoned'];

  return (
    <article
      className="media-card group relative flex flex-col h-full"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: 'var(--border-width) solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        transition: `box-shadow var(--duration-normal) var(--easing-out)`,
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      {/* Extended Link — covers the whole card via ::after */}
      <a
        href={`/item/${item.id}`}
        className="media-card__link block relative"
        style={{
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {/* Cover image */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '3 / 4',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          }}
        >
          {showFallback ? (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-neutral-200)',
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                color: 'var(--color-neutral-400)',
                aspectRatio: '3 / 4',
              }}
            >
              {typeIcons[item.type] || <BookOpen size={32} />}
            </div>
          ) : (
            <img
              src={item.coverImage!}
              alt=""
              className="w-full h-full object-cover"
              style={{
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                transition: `transform var(--duration-normal) var(--easing-out)`,
              }}
              onError={() => setImageError(true)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            />
          )}
        </div>

        {/* Body — title + meta (flex-grow pushes footer down) */}
        <div
          className="flex flex-col"
          style={{
            padding: 'var(--space-3)',
            paddingTop: 'var(--space-2)',
            gap: 'var(--space-1)',
            flex: '1 1 0',
          }}
        >
          <span
            className="block font-semibold"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text)',
              lineHeight: 'var(--leading-tight)',
              minHeight: '1.25em',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {item.title}
          </span>
          <span
            className="block"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {item.creator}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <MediaTypeBadge type={item.type} />
            <StatusBadge status={item.status} />
          </div>
          {item.personalRating != null && (
            <RatingStars rating={item.personalRating} />
          )}
        </div>

        {/* ::after overlay — covers entire card via pseudo-element */}
        <span
          className="absolute inset-0 z-[1]"
          style={{ pointerEvents: 'auto' }}
          aria-hidden="true"
        />
      </a>

      {/* Footer — always present, anchored to bottom via flex-grow in body */}
      <footer
        className="flex items-center justify-between"
        style={{
          padding: 'var(--space-2) var(--space-3)',
          borderTop: 'var(--border-width) solid var(--color-border)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Favorite button — ≥44×44px hit area */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorito(item.id);
          }}
          className="flex items-center justify-center"
          style={{
            minWidth: '44px',
            minHeight: '44px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: item.isFavorite ? 'var(--color-accent)' : 'var(--color-neutral-400)',
            position: 'relative',
            zIndex: 2,
            transition: `color var(--duration-fast) var(--easing-default)`,
            padding: 0,
          }}
          aria-pressed={item.isFavorite}
          aria-label={item.isFavorite ? `Quitar de favoritos: ${item.title}` : `Marcar como favorito: ${item.title}`}
        >
          <Star
            size={16}
            fill={item.isFavorite ? 'var(--color-accent)' : 'none'}
          />
        </button>

        {/* Context menu — ≥44×44px hit area */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <ContextMenu
            items={menuItems}
            statusOptions={allStatuses}
            onStatusChange={(status) => onChangeStatus(item.id, status)}
            ariaLabel={`Acciones de ${item.title}`}
          />
        </div>
      </footer>
    </article>
  );
}
