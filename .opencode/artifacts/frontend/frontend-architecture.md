# Frontend Architecture — MediaVault

## Stack

- **Framework:** React 18 + TypeScript (strict mode)
- **Build tool:** Vite 8
- **Styling:** Tailwind CSS v4 + CSS custom properties from `theme.css`
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Testing:** Playwright
- **Package manager:** npm

## Cómo arrancar

```bash
cd mediavault-frontend
npm install
npm run dev
```

La app se levanta en `http://localhost:5173`.

## Estructura de carpetas

```
mediavault-frontend/
├── src/
│   ├── main.tsx                          # Entry point
│   ├── App.tsx                           # Root component with router
│   ├── styles/
│   │   ├── global.css                    # Tailwind + base styles + theme import
│   │   └── theme.css                     # Copia de .opencode/artifacts/design/theme.css
│   ├── app/
│   │   ├── provider.tsx                  # Composition root (DI context)
│   │   └── shell.tsx                     # App Shell (top bar, tabs, bottom tabs)
│   ├── core/
│   │   ├── types/
│   │   │   └── index.ts                  # Domain types (MediaItem, Collection, List, etc.)
│   │   ├── interfaces/
│   │   │   └── media-item/
│   │   │       └── IMediaItemService.ts  # Service contract
│   │   ├── contracts/
│   │   │   └── backend/
│   │   │       └── media-item-dto.ts     # Backend DTO
│   │   ├── services/
│   │   │   └── media-item/
│   │   │       └── dummy-media-item-service.ts  # Dummy implementation
│   │   └── data/
│   │       └── dummy-media-items.ts      # Mock data (12 items + collections + lists)
│   ├── shared/
│   │   └── components/
│   │       └── ui/
│   │           ├── MediaCard.tsx          # Card con enlace extendido (::after)
│   │           ├── FilterChips.tsx        # Chips de filtro
│   │           ├── MediaTypeBadge.tsx     # Badge de tipo de contenido
│   │           ├── StatusBadge.tsx        # Badge de estado de consumo
│   │           ├── RatingStars.tsx        # Estrellas de valoración
│   │           ├── EmptyState.tsx         # Estado vacío / error / sin resultados
│   │           ├── SkeletonCard.tsx       # Skeleton de carga
│   │           ├── ContextMenu.tsx        # Menú contextual (…)
│   │           ├── SlideOver.tsx          # Panel lateral (nuevo/editar ítem)
│   │           ├── Modal.tsx              # Modal genérico
│   │           ├── MediaItemForm.tsx      # Formulario de MediaItem
│   │           ├── Toast.tsx              # Notificaciones toast
│   │           ├── CollectionPickerModal.tsx  # Picker de colecciones
│   │           ├── ListPickerModal.tsx    # Picker de listas
│   │           └── ConfirmDeleteModal.tsx # Modal de confirmación de eliminación
│   └── pages/
│       └── biblioteca/
│           └── BibliotecaPage.tsx         # Pantalla principal (grid + filtros + overlays)
├── tests/
│   └── biblioteca.spec.ts                # Suite Playwright
├── index.html
├── vite.config.ts
├── playwright.config.ts
└── package.json
```

## Registro de componentes

| Componente | Props clave | Variantes | Pantallas que lo usan |
|---|---|---|---|
| **MediaCard** | `item`, `onToggleFavorito`, `onDelete`, `onAddToCollection`, `onAddToList`, `onChangeStatus`, `onEdit` | — | Biblioteca |
| **FilterChips** | `options`, `activeIds`, `onToggle`, `ariaLabel` | — | Biblioteca |
| **MediaTypeBadge** | `type` | 11 tipos | MediaCard |
| **StatusBadge** | `status` | 5 estados | MediaCard |
| **RatingStars** | `rating`, `readonly` | 1-5 o null | MediaCard |
| **EmptyState** | `icon`, `title`, `description`, `ctaLabel`, `onCta` | — | Biblioteca (vacío, error, sin resultados) |
| **SkeletonCard** | — | — | Biblioteca (loading) |
| **ContextMenu** | `items`, `statusOptions`, `onStatusChange`, `ariaLabel` | — | MediaCard |
| **SlideOver** | `title`, `isOpen`, `onClose`, `children` | — | Biblioteca (nuevo, editar) |
| **Modal** | `title`, `isOpen`, `onClose`, `children`, `maxWidth` | — | Colección picker, lista picker, delete confirm |
| **MediaItemForm** | `initialValues?`, `onSubmit`, `onCancel`, `isEditing?` | Creación / Edición | Biblioteca |
| **Toast** | `toasts`, `onDismiss` | success / error | Biblioteca |
| **CollectionPickerModal** | `collections`, `selectedIds`, `onToggle`, `onCreateNew` | — | Biblioteca |
| **ListPickerModal** | `lists`, `selectedIds`, `onToggle`, `onCreateNew` | — | Biblioteca |
| **ConfirmDeleteModal** | `itemName`, `onConfirm` | — | Biblioteca |

## Arquitectura de 4 capas

| Capa | Carpeta | Qué vive aquí |
|---|---|---|
| **Interfaces/Contratos** | `core/interfaces/`, `core/contracts/` | Tipos de dominio + puertos de servicio + DTOs |
| **Servicios** | `core/services/` | Implementaciones (dummy por ahora) |
| **Datos** | `core/data/` | Mock data mutables |
| **UI** | `shared/components/`, `pages/` | Componentes de presentación + páginas |

**Regla de dependencia:** `pages/` y `shared/components/` solo importan de `core/types` e `core/interfaces`. El cableado (qué implementación se usa) ocurre en `app/provider.tsx`.

## Estado por pantalla

| Pantalla | Ruta | Estado |
|---|---|---|
| Biblioteca | `/` | Implementada, cableado verificado en runtime, suite Playwright |
| Detalle de Ítem | `/item/:id` | Pendiente |
| Colecciones | `/colecciones` | Pendiente |
| Listas | `/listas` | Pendiente |

## Datos dummy

- 12 MediaItems con portadas reales (Open Library, TMDB)
- 3 Collections de ejemplo
- 2 Lists de ejemplo
- Estados variados: completed, consuming, pending
- Ratings variados: 3, 4, 5, null
- 1 ítem sin portada (Watchmen) para verificar placeholder

## Pendiente para enganche backend

- Reemplazar `dummy-media-item-service.ts` por `media-item-service.ts` real (HTTP)
- Los contratos en `core/interfaces/` ya están definidos
- Los DTOs en `core/contracts/backend/` documentan la forma esperada del payload
