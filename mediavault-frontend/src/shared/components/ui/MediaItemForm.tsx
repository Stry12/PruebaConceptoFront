import { useState } from 'react';
import type { MediaItem, MediaItemType, ConsumptionStatus } from '../../../core/types';
import { MEDIA_TYPE_LABELS, STATUS_LABELS } from '../../../core/types';

interface MediaItemFormProps {
  initialValues?: Partial<MediaItem>;
  onSubmit: (values: Omit<MediaItem, 'id' | 'userId' | 'addedAt'>) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function MediaItemForm({ initialValues, onSubmit, onCancel, isEditing = false }: MediaItemFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [coverImage, setCoverImage] = useState(initialValues?.coverImage ?? '');
  const [type, setType] = useState<MediaItemType>(initialValues?.type ?? 'book');
  const [creator, setCreator] = useState(initialValues?.creator ?? '');
  const [genre, setGenre] = useState(initialValues?.genre ?? '');
  const [platform, setPlatform] = useState(initialValues?.platform ?? '');
  const [sourceUrl, setSourceUrl] = useState(initialValues?.sourceUrl ?? '');
  const [status, setStatus] = useState<ConsumptionStatus>(initialValues?.status ?? 'pending');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [titleError, setTitleError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError('El título es obligatorio');
      return;
    }
    setTitleError('');
    onSubmit({
      title: title.trim(),
      coverImage: coverImage || null,
      type,
      creator,
      genre,
      categoryId: initialValues?.categoryId ?? null,
      description: initialValues?.description ?? null,
      status,
      consumedAt: initialValues?.consumedAt ?? null,
      personalRating: initialValues?.personalRating ?? null,
      notes: notes || null,
      platform,
      sourceUrl: sourceUrl || null,
      isFavorite: initialValues?.isFavorite ?? false,
    });
  };

  const inputStyle = {
    width: '100%',
    padding: 'var(--space-2) var(--space-3)',
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-base)',
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-surface)',
    border: 'var(--border-width) solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-weight-medium)' as const,
    color: 'var(--color-text-secondary)',
    display: 'block',
    marginBottom: 'var(--space-1)',
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: 'var(--space-4)' }}>
      {/* Title (required) */}
      <div>
        <label htmlFor="item-title" style={labelStyle}>Título *</label>
        <input
          id="item-title"
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
          style={{
            ...inputStyle,
            borderColor: titleError ? 'var(--color-danger)' : 'var(--color-border)',
          }}
          autoFocus
          required
        />
        {titleError && (
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)', fontWeight: 'var(--font-weight-medium)' }}>
            {titleError}
          </span>
        )}
      </div>

      {/* Cover Image URL */}
      <div>
        <label htmlFor="item-cover" style={labelStyle}>URL de portada</label>
        <input
          id="item-cover"
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://..."
          style={inputStyle}
        />
        {coverImage && (
          <div style={{ marginTop: 'var(--space-2)', aspectRatio: '3/4', maxWidth: '120px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Type */}
      <div>
        <label htmlFor="item-type" style={labelStyle}>Tipo</label>
        <select
          id="item-type"
          value={type}
          onChange={(e) => setType(e.target.value as MediaItemType)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {(Object.keys(MEDIA_TYPE_LABELS) as MediaItemType[]).map((t) => (
            <option key={t} value={t}>{MEDIA_TYPE_LABELS[t]}</option>
          ))}
        </select>
      </div>

      {/* Creator */}
      <div>
        <label htmlFor="item-creator" style={labelStyle}>Creador</label>
        <input
          id="item-creator"
          type="text"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Genre */}
      <div>
        <label htmlFor="item-genre" style={labelStyle}>Género</label>
        <input
          id="item-genre"
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Platform */}
      <div>
        <label htmlFor="item-platform" style={labelStyle}>Plataforma</label>
        <input
          id="item-platform"
          type="text"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* Source URL */}
      <div>
        <label htmlFor="item-source" style={labelStyle}>URL de fuente</label>
        <input
          id="item-source"
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://..."
          style={inputStyle}
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="item-status" style={labelStyle}>Estado</label>
        <select
          id="item-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ConsumptionStatus)}
          style={{ ...inputStyle, cursor: 'pointer' }}
        >
          {(Object.keys(STATUS_LABELS) as ConsumptionStatus[]).filter(s => s !== 'favorite').map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="item-notes" style={labelStyle}>Notas</label>
        <textarea
          id="item-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' as const }}
        />
      </div>

      {/* Actions */}
      <div
        className="flex justify-end"
        style={{
          gap: 'var(--space-3)',
          paddingTop: 'var(--space-4)',
          borderTop: 'var(--border-width) solid var(--color-border)',
          marginTop: 'var(--space-4)',
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: 'var(--space-3) var(--space-6)',
            fontFamily: 'var(--font-body)',
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
          type="submit"
          style={{
            padding: 'var(--space-3) var(--space-6)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-on-accent)',
            backgroundColor: 'var(--color-accent)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
