# Extracción — Biblioteca (`/`)

**Fuente:** `.opencode/artifacts/design/specs/biblioteca.md` (ScreenSpec vigente, 881 líneas)
**Fecha:** 2026-07-19

---

## Layout de la pantalla

### Header (§4)
- **Título**: `Biblioteca`, `font-display`, `text-3xl`, `font-weight-bold`
- **Buscador**: solo visible en desktop (`md:flex`), `max-w-[400px]`, `flex-1`, con ícono `Search` (20px), fondo `var(--color-surface)`, borde `var(--color-border)`, radio `var(--radius-md)`
- **Botón +**: `background: var(--color-accent)`, `color: var(--color-text-on-accent)`, `min-height: 40px`, `min-width: var(--space-10)`, `border-radius: var(--radius-md)`

### Barra de filtros (§5)
- Chips de filtro tipo + chips de filtro estado en fila horizontal
- Separador vertical `1px var(--color-border)` entre ambos grupos (solo desktop)
- En mobile: scroll horizontal (`overflow-x: auto`, `scroll-snap-type: x proximity`)
- Link "Limpiar filtros": `color: var(--color-accent)`, solo visible cuando hay filtros activos

### Grid de cards (§7)
- **Responsive**: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` (Tailwind)
- **Gap**: `gap-3` mobile, `sm:gap-4` tablet/desktop
- **Container**: `max-width: var(--grid-max-width)`, `padding: 0 var(--space-6)`
- **role="list"** en el grid, **role="listitem"** en cada wrapper de card

### Card (§8)
- **Aspect ratio de portada**: `aspect-[3/4]` (relación 3:4)
- **Título**: `text-sm` (NO `text-lg` ni `text-xl` — spec §19.5)
- **Favorito**: `aria-pressed`, mínimo `44×44px` hit area
- **Menú contextual (…)**: mínimo `44×44px` hit area
- **Enlace extendido**: overlay con `::after` pseudo-element, cubre toda la card
- **z-index**: `cover-overlay: 50`, `favorite-button: 30`, `context-menu: 40`

### SlideOver (§13)
- **Panel derecho**: `width: 400px`, `transition: transform 200ms ease-in-out`
- **Mobile (<640px)**: full-screen (`max-width: 100%`, `border-radius: 0`)
- **Backdrop**: `rgba(0,0,0,0.3)`, `transition: opacity 200ms ease-in-out`
- **Focus trap**: Tab cycling, Escape key, body scroll lock
- **Restore focus**: al cerrar, devuelve foco al elemento que lo abrió

### Modal (§14)
- **Max-width**: `min(544px, calc(100vw - 32px))` responsive
- **Backdrop**: `rgba(0,0,0,0.5)`
- **Focus trap**: Tab cycling, Escape key, body scroll lock

---

## Tokens utilizados

| Token | Valor aproximado | Uso |
|---|---|---|
| `--color-bg` | `#faf9f7` | Fondo de página |
| `--color-surface` | `#ffffff` | Fondo de cards, inputs, paneles |
| `--color-text` | `#1a1714` | Texto principal |
| `--color-text-secondary` | `#6b6560` | Texto secundario |
| `--color-text-tertiary` | `#9e9891` | Placeholder, iconos |
| `--color-text-on-surface` | `#1a1714` | Texto sobre superficies claras |
| `--color-text-on-accent` | `#ffffff` | Texto sobre color de acento |
| `--color-border` | `#e5e2de` | Bordes generales |
| `--color-accent` | `#2563eb` | Botones primarios, links, acentos |
| `--color-accent-hover` | `#1d4ed8` | Hover de botones primarios |
| `--color-accent-pressed` | `#1e40af` | Pressed de botones primarios |
| `--color-danger` | `#dc2626` | Eliminar, estados de error |
| `--color-danger-hover` | `#b91c1c` | Hover de botones de peligro |
| `--color-surface-overlay` | `rgba(0,0,0,0.3)` | Backdrop de SlideOver |
| `--color-surface-modal-overlay` | `rgba(0,0,0,0.5)` | Backdrop de Modal |
| `--font-display` | `Libre Baskerville, serif` | Títulos de página |
| `--font-body` | `Inter, sans-serif` | Texto de cuerpo, UI |
| `--text-sm` | `0.875rem` | Títulos de card |
| `--text-base` | `1rem` | Texto de cuerpo |
| `--text-3xl` | `1.875rem` | Título de página |
| `--radius-md` | `0.5rem` | Bordes de cards, botones, inputs |
| `--space-2` a `--space-12` | 8px–48px | Sistema de espaciado |
| `--grid-max-width` | `72rem` | Max-width del container |

---

## Componentes identificados

| Componente | Ubicación | Reutilización |
|---|---|---|
| **MediaCard** | `shared/components/ui/MediaCard.tsx` | Reutilizable para cualquier grid de MediaItem |
| **FilterChips** | `shared/components/ui/FilterChips.tsx` | Reutilizable para cualquier filtro de tipo/status |
| **MediaTypeBadge** | `shared/components/ui/MediaTypeBadge.tsx` | Reutilizable en cards, listas, tablas |
| **StatusBadge** | `shared/components/ui/StatusBadge.tsx` | Reutilizable en cards, listas, tablas |
| **RatingStars** | `shared/components/ui/RatingStars.tsx` | Reutilizable en cards, detalle, forms |
| **EmptyState** | `shared/components/ui/EmptyState.tsx` | Reutilizable para vacío, error, sin resultados |
| **SkeletonCard** | `shared/components/ui/SkeletonCard.tsx` | Reutilizable para estados de carga |
| **ContextMenu** | `shared/components/ui/ContextMenu.tsx` | Reutilizable para acciones de ítem |
| **SlideOver** | `shared/components/ui/SlideOver.tsx` | Reutilizable para formularios laterales |
| **Modal** | `shared/components/ui/Modal.tsx` | Reutilizable para confirmaciones, pickers |
| **MediaItemForm** | `shared/components/ui/MediaItemForm.tsx` | Reutilizable para crear/editar MediaItem |
| **Toast** | `shared/components/ui/Toast.tsx` | Reutilizable para notificaciones globales |
| **CollectionPickerModal** | `shared/components/ui/CollectionPickerModal.tsx` | Reutilizable para picker de colecciones |
| **ListPickerModal** | `shared/components/ui/ListPickerModal.tsx` | Reutilizable para picker de listas |
| **ConfirmDeleteModal** | `shared/components/ui/ConfirmDeleteModal.tsx` | Reutilizable para confirmaciones de borrado |

---

## Datos dummy

- **12 MediaItems** con portadas reales (Open Library, TMDB URLs)
- 3 estados variados: `completed` (5), `consuming` (3), `pending` (4)
- Ratings: 3, 4, 5, null (variedad intencional)
- 1 ítem sin portada (Watchmen) para verificar placeholder
- 3 Collections de ejemplo
- 2 Lists de ejemplo

---

## Sub-pantallas implementadas

| ID | Nombre | Tipo | Componente/Trigger |
|---|---|---|---|
| 1.1 | Nuevo Ítem | SlideOver | Botón `+` en header → `MediaItemForm` |
| 1.2 | Editar Ítem | SlideOver | Context menu → `MediaItemForm` con `isEditing` |
| 1.3 | Agregar a Colección | Modal | Context menu → `CollectionPickerModal` |
| 1.4 | Agregar a Lista | Modal | Context menu → `ListPickerModal` |
| 1.5 | Eliminar Ítem | Modal | Context menu → `ConfirmDeleteModal` |

---

## Acciones cableadas al servicio

| Acción | Trigger | Método del servicio | Efecto observable |
|---|---|---|---|
| Toggle favorito | Corazón en card | `toggleFavorite(id)` | Cambia `isFavorite`, actualiza UI + toast |
| Cambiar estado | Context menu → status | `changeStatus(id, status)` | Actualiza badge, toast |
| Eliminar | Context menu → eliminar | `delete(id)` | Elimina card del grid, toast |
| Crear ítem | SlideOver form → guardar | `create(values)` | Añade card al inicio del grid |
| Editar ítem | SlideOver form → guardar | `update(id, values)` | Actualiza card en el grid |
| Buscar | Input de búsqueda | — (filtro local) | Filtra cards en tiempo real con debounce |
| Filtrar tipo | Chips de tipo | — (filtro local) | Filtra cards por tipo |
| Filtrar estado | Chips de estado | — (filtro local) | Filtra cards por estado |

---

## Estado de implementación

**Estado**: Implementada, cableado verificado en runtime
**Playwright**: Suite de tests con cobertura de filtros, búsqueda, favoritos, teclado, responsive, accesibilidad, contención de cards
