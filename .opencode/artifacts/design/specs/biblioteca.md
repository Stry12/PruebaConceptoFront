---
slug: biblioteca
titulo: Biblioteca
ruta: /
tipo: producto
tipo_nodo: raiz
version: 2
iteracion: 1
estado: vigente
viewports: ["1280x800", "390x844"]
fuentes:
  theme_css: .opencode/artifacts/design/theme.css
  ux_flow: .opencode/artifacts/design/ux-flow.md
  tokens: .opencode/artifacts/design/design-tokens.md
  discovery: .opencode/artifacts/design/discovery.md
  brand_brief: .opencode/artifacts/design/brand-brief.md
  patron: null
---

# ScreenSpec: Biblioteca

## 1. Propósito

Vista raíz del objeto central del producto: la colección personal de medios del usuario (libros, películas, series, manga, cómics, audiolibros, podcasts, cursos, revistas, documentales, otros). Permite explorar la colección visualmente por portadas, buscar y filtrar por múltiples criterios, y abrir el detalle de cada ítem. Es la pantalla donde el usuario pasa el 80% de su tiempo — el diseño existe para que el browsing de la colección se sienta como placer, no como gestión.

## 2. Objetivo del usuario

Localizar un ítem de su colección (visualmente, por portada) y abrir su detalle. Llega como ruta raíz (`/`) — es la primera pantalla que ve al abrir la app. También puede llegar desde cualquier otra pantalla vía los tabs de navegación (Biblioteca | Colecciones | Listas).

## 3. Acciones

- **Acción principal [MUST]: Abrir el detalle del ítem** (`/item/:id`). Se dispara al hacer click/tap en la portada, en el título o en cualquier zona no interactiva de la tarjeta; y con Enter cuando el enlace del título tiene el foco.
- **Marcar/desmarcar favorito [MUST]:** Botón de estrella por tarjeta. Independiente de la acción principal: NUNCA navega al detalle. Alterna `aria-pressed`.
- **Agregar nuevo ítem [MUST]:** Botón "+" en el header de la página. Abre slide-over derecho con formulario completo de MediaItem (sub-pantalla 1.1). Independiente del grid.
- **Buscar [SHOULD]:** Barra de búsqueda en el header. Filtra el grid en tiempo real (debounced ~300ms) por: título, creador, género, categoría, etiquetas, plataforma, tipo, estado (domain.md regla 3).
- **Filtrar por tipo de contenido [SHOULD]:** Chips de filtro sobre el grid. Se combinan con la búsqueda (AND).
- **Filtrar por estado de consumo [SHOULD]:** Chips de filtro (segunda fila o misma fila, diferenciados visualmente).
- **Limpiar filtros [SHOULD]:** Botón "Limpiar filtros" visible solo cuando hay filtros activos.
- **Eliminar ítem [SHOULD]:** Acción secundaria en el menú contextual de la tarjeta (ver sección 14). Abre modal de confirmación (sub-pantalla 1.5).
- **Agregar a colección [SHOULD]:** Acción secundaria en el menú contextual. Abre picker modal (sub-pantalla 1.3).
- **Agregar a lista [SHOULD]:** Acción secundaria en el menú contextual. Abre picker modal (sub-pantalla 1.4).
- **Cambiar estado de consumo [SHOULD]:** Acción secundaria en el menú contextual. Dropdown in-place con opciones: Pendiente, Consumiendo, Completado, Abandonado.

## 4. Jerarquía de información

### Pantalla principal

| Nivel | Elemento | Tokens de texto |
|---|---|---|
| 1 — Primario (domina el primer viewport) | **Grid de portadas** — las tarjetas visuales de cada MediaItem. La portada es lo primero que se ve. | — |
| 2 — Secundario (encima del grid, siempre visible) | **Chips de filtro** (tipo de contenido, estado de consumo) + **barra de búsqueda**. Permiten reducir el conjunto sin perder la vista del grid. | Chips: `--font-body`, `--text-sm`, `--font-weight-medium`. Búsqueda: `--font-body`, `--text-base` |
| 3 — Terciario (por tarjeta) | **Título** (truncado 1 línea) → **autor/creador** → **pills de tipo y estado** → **rating estrellas**. Todo debajo de la portada. | Título: `--font-body`, `--text-sm`, `--font-weight-semibold`, `--color-text`. Autor: `--font-body`, `--text-xs`, `--color-text-secondary`. Pills: `--font-body`, `--text-xs`, `--font-weight-medium` |
| 4 — Accesoria (periférica) | **Navegación por tabs** (Biblioteca \| Colecciones \| Listas). Toggle de modo oscuro. Menú de usuario. Botón "+". | Tabs: `--font-body`, `--text-sm`, `--font-weight-medium` |

### Sub-pantalla 1.1 — Slide-over "Nuevo ítem"

| Nivel | Elemento |
|---|---|
| Primario | Título del formulario ("Nuevo ítem") + botón cerrar (X) |
| Secundario | Campo título (requerido, autofocus) + portada (upload con preview) |
| Terciario | Campos de metadatos: tipo (select), creador, género, categoría (select), etiquetas (multi-select/creación inline), plataforma, fuente URL |
| Accesoria | Campo estado (select) + notas (textarea) + botón "Guardar" fijo al fondo |

### Sub-pantalla 1.2 — Slide-over "Editar ítem"

> Misma jerarquía que 1.1. Todos los campos pre-rellenados con los valores actuales del ítem.

### Sub-pantalla 1.3 — Modal "Agregar a colección"

| Nivel | Elemento |
|---|---|
| Primario | Título ("Agregar a colección") + campo de búsqueda de colecciones |
| Secundario | Lista de colecciones existentes — cada una muestra mosaico mini + nombre + conteo + checkmark si el ítem ya pertenece |
| Terciario | Opción "Crear nueva colección" (expandible inline) |
| Accesoria | Botón cerrar |

### Sub-pantalla 1.4 — Modal "Agregar a lista"

| Nivel | Elemento |
|---|---|
| Primario | Título ("Agregar a lista") + campo de búsqueda de listas |
| Secundario | Lista de listas existentes — nombre + itemCount + checkmark si ya contiene el ítem |
| Terciario | Selector de posición (opcional, solo si la lista es ordenada) |
| Accesoria | Botón cerrar |

### Sub-pantalla 1.5 — Modal "Confirmar eliminar ítem"

| Nivel | Elemento |
|---|---|
| Primario | Icono de advertencia + título ("¿Eliminar este ítem?") |
| Secundario | Mensaje: "Esta acción no se puede deshacer. El ítem se eliminará permanentemente de tu biblioteca." |
| Terciario | Nombre del ítem a eliminar (contexto) |
| Accesoria | Botón "Cancelar" + botón "Eliminar" (peligro) |

## 5. Layout y grid

### Estructura de zonas (ambos viewports)

```
┌─────────────────────────────────────────────┐
│  PAGE HEADER                                │
│  [título "Biblioteca"] · [buscador] · [+]   │
├─────────────────────────────────────────────┤
│  FILTER BAR                                 │
│  [chips tipo] [chips estado] [limpiar]       │
├─────────────────────────────────────────────┤
│                                             │
│  CARD GRID                                  │
│  (proporciona el scroll vertical)           │
│                                             │
└─────────────────────────────────────────────┘
```

### Desktop (1280×800)

- **Container principal:** max-width `var(--grid-max-width)` (1280px), centrado, padding horizontal `var(--grid-padding)` (24px).
- **Page header:** flex row, `justify-content: space-between`, `align-items: center`, gap `var(--space-4)` (16px) entre zonas.
  - Título: a la izquierda.
  - Buscador: flex-grow, max-width 400px.
  - Botón "+": a la derecha, mínimo `var(--space-10)` (40px) de ancho.
  - Altura mínima del header: `var(--space-12)` (48px).
  - Separación del header al filter bar: `var(--space-4)` (16px).
- **Buscador único [MUST]:** Cuando la ruta activa es `/` (Biblioteca), el buscador del App Shell se oculta (`display: none`). Solo está visible el buscador del page header de esta spec. Si el App Shell no tiene mecanismo de ocultación, se elimina el buscador de esta página y se usa exclusivamente el del App Shell — en cualquier caso, **exactamente un input de búsqueda visible** [MUST].
- **Filter bar:** flex row, wrap, gap `var(--space-2)` (8px) entre chips, `var(--space-4)` (16px) al grid debajo.
- **Card grid:** CSS Grid, `grid-template-columns: repeat(4, 1fr)`, gap `var(--space-4)` (16px).
  - Cada columna: ~298px (1280 - 48 padding - 48 gap) / 4.
- **Altura de las tarjetas:** las cards de una fila MIDEN LO MISMO — el grid estira con `align-items: stretch`, el body de cada card usa `flex-grow: 1` [MUST].

### Móvil (390×844)

- **Container:** padding horizontal `var(--space-4)` (16px).
- **Page header:** flex row, gap `var(--space-3)` (12px). Título + botón "+" a la derecha. El botón "+" es **siempre visible** [MUST]: tamaño táctil mínimo 44×44px (padding compensa si el icono es 20px), fondo `var(--color-accent)`, icono `Plus` de Lucide. El **buscador pasa a ser una barra independiente debajo del header** (flex row con icono de lupa + input), ancho completo.
- **Filter bar:** flex row, **`flex-wrap: nowrap`** [MUST], `overflow-x: auto`, `scroll-snap-type: x proximity`, gap `var(--space-2)` (8px). Los chips son scrollables horizontalmente en una sola fila por grupo. Separación al grid: `var(--space-4)` (16px).
- **Card grid:** CSS Grid, `grid-template-columns: repeat(2, 1fr)`, gap `var(--space-3)` (12px).
  - Cada columna: ~179px (390 - 32 padding - 12 gap) / 2.
- **Bottom tab bar [MUST]:** Barra fija al fondo del viewport con **3 tabs completos**: Biblioteca (`BookOpen`), Colecciones (`Folder`), Listas (`List`). Cada tab: icono 24px + label `--text-xs`, alto mínimo 48px, distribución equidistante (`flex: 1`). Tab activo: `var(--color-accent)` icono + label; inactivo: `var(--color-text-secondary)`. Separador superior de 1px `var(--color-border)`. La presencia de esta barra reduce el area util del viewport en 48px (el grid debe scrollear por encima de ella).

## 6. Responsive

| Breakpoint | Columnas grid | Header | Filter bar | Buscador |
|---|---|---|---|---|
| ≥1024px (desktop) | 4 | Row con título + buscador + botón | Wrap horizontal, chips no scroll | Integrado en header, max-width 400px |
| 640px–1023px (tablet) | 3 | Row con título + buscador + botón | Wrap horizontal | Integrado en header |
| <640px (móvil) | 2 | Row con título + **botón "+" visible (44×44px mínimo)** | Scroll horizontal, **nowrap** | Barra independiente debajo del header |

- **Buscador único en todos los breakpoints [MUST]:** Exactamente un input de búsqueda visible. En desktop/tablet, el buscador del App Shell se oculta cuando la ruta es `/` (Biblioteca). En móvil, solo existe el de la barra independiente bajo el header.
- Los tabs de navegación (Biblioteca | Colecciones | Listas) pasan a **bottom tab bar** en <640px [MUST] — esto es App Shell, pero esta spec requiere que los 3 tabs estén presentes (no 2). El tab bar es App Shell, pero la ausencia del tercero es un bug de esta pantalla.
- Los chips de filtro mantienen `flex-wrap: nowrap` + `overflow-x: auto` + `scroll-snap-type: x proximity` en móvil — una sola fila deslizable por grupo, sin apilamiento vertical [MUST]. El foco visible sobresale (no se recorta) [MUST].
- El slide-over (1.1, 1.2) pasa a vista de pantalla completa en <640px (sin panel lateral, con transición de entrada desde abajo) [MUST].
- Los modales (1.3, 1.4, 1.5) mantienen max-width `var(--grid-max-width)` y se ajustan a `calc(100vw - var(--space-8))` en móvil [MUST].

## 7. Inventario de componentes

### Componentes de la pantalla principal

| Componente | Nuevo/Reutilizado | Ubicación | Props/estado clave | Anatomía de slots |
|---|---|---|---|---|
| **MediaCard** | Nuevo (componente central del sistema) | `shared/components/ui` | `item: MediaItem`, `onToggleFavorito`, `onDelete`, `onAddToCollection`, `onAddToList`, `onChangeStatus` | **Slots fijos [MUST]:** `media` (portada, ratio 3:4, `object-fit: cover`) → `body` (título line-clamp-1 + metadatos) → `footer` (acciones: estrella favorita + menú `…`). Footer SIEMPRE existe aunque esté vacío — **renderizado condicional prohibido** [MUST]. Altura gobernada por slots: el body tiene `flex-grow: 1` y el footer se ancla abajo. La card se estira en la fila del grid (`h-full` en el item del grid). Contención estricta: nada sobresale del borde redondeado. **Fallback de portada [MUST]:** si `<img>` dispara `onError` o `src` es null/vacío, el slot `media` se reemplaza por un `div` con fondo `var(--color-neutral-200)`, `var(--radius-lg)`, y el icono del tipo de contenido (`Tv`, `BookOpen`, `Film`, etc.) centrado a 32px en `var(--color-neutral-400)`. Ninguna card muestra nunca el icono nativo de imagen rota del navegador. |
| **FilterChips** | Nuevo | `shared/components/ui` | `options: ChipOption[]`, `activeIds: string[]`, `onToggle(id)` | Flex row, gap `var(--space-2)`. Desktop: `flex-wrap: wrap`. **Móvil: `flex-wrap: nowrap`** [MUST] + `overflow-x: auto` + `scroll-snap-type: x proximity` — una sola fila deslizable por grupo. Cada chip: padding `var(--space-2)` vertical, `var(--space-3)` horizontal, `var(--radius-full)`, `--font-body`, `--text-sm`, `--font-weight-medium`. `scroll-padding-inline: var(--space-4)` en el contenedor. |
| **MediaTypeBadge** | Nuevo (reutilizado en Detalle de Ítem, Colecciones detalle) | `shared/components/ui` | `type: MediaItemType` | Pill inline: `var(--radius-full)`, `--text-xs`, `--font-weight-medium`, fondo `var(--color-accent-bg-subtle)`, texto `var(--color-accent)`. |
| **StatusBadge** | Nuevo (reutilizado en Detalle de Ítem, Colecciones detalle, Listas detalle) | `shared/components/ui` | `status: ConsumptionStatus` | Pill inline: `var(--radius-full)`, `--text-xs`, `--font-weight-medium`. Color de fondo/texto según estado (ver tabla de tokens en sección 8). |
| **RatingStars** | Nuevo (reutilizado en Detalle de Ítem) | `shared/components/ui` | `rating: 1-5 \| null`, `readonly?: boolean` | 5 estrellas inline, tamaño `var(--icon-size-xs)` (16px). Estrellas llenas: `var(--color-accent)`. Estrellas vacías: `var(--color-neutral-300)`. Contenedor `role="img"` + `aria-label`. |
| **EmptyState** | Nuevo (reutilizado en Colecciones, Listas, Detalle de Colección, Detalle de Lista, Configuración) | `shared/components/ui` | `icon`, `title`, `description`, `ctaLabel`, `onCta` | Centrado vertical y horizontal, max-width 400px. Icono `var(--icon-size-xl)` (32px) en `var(--color-neutral-400)`. Título: `--font-display`, `--text-xl`, `--color-text`. Descripción: `--font-body`, `--text-base`, `--color-text-secondary`. CTA: botón primario. |
| **SkeletonCard** | Nuevo (reutilizado en todas las pantallas con carga) | `shared/components/ui` | — | Mismas dimensiones que MediaCard. Background `var(--color-surface-raised)`, `var(--radius-lg)`, animación pulse con `opacity` de 0.4 a 0.7. |
| **Menú contextual (…)** | Nuevo | `shared/components/ui` | `items: MenuItem[]` | Dropdown con `var(--radius-xl)`, fondo `var(--color-surface)`, sombra `var(--shadow-lg)`. Items con `var(--space-3)` vertical, `var(--space-4)` horizontal. |

### Componentes de sub-pantallas

| Componente | Sub-pantalla | Props/estado clave |
|---|---|---|
| **SlideOver** | 1.1, 1.2 | `title`, `isOpen`, `onClose`, `children`. Panel derecho (480px desktop, full-screen móvil). Backdrop `rgba(0,0,0,0.4)`. Transición: translateX de 100% a 0, `var(--duration-slow)`, `var(--easing-out)`. |
| **MediaItemForm** | 1.1, 1.2 | `initialValues?`, `onSubmit`, `onCancel`. Campos: title (requerido), coverImage (upload), type (select), creator, genre, categoryId (select), tags (multi-select), platform, sourceUrl, status (select), notes (textarea). |
| **CoverUpload** | 1.1, 1.2 | `value?: string`, `onChange`, `onRemove`. Zona de drop con preview. Aspect ratio 3:4. Placeholder: `var(--color-neutral-200)` + icono de tipo. |
| **ValidationInline** | 1.1, 1.2, 1.3, 1.4 | `error?: string`. Texto `--text-xs`, `var(--color-danger)`, `--font-weight-medium`. |
| **CollectionPickerList** | 1.3 | `collections: Collection[]`, `selectedIds`, `onToggle`, `onCreateNew`. Cada fila: mosaico mini (grid 2×2 de mini-portadas, `var(--radius-sm)`) + nombre + conteo + checkmark. |
| **ListPickerList** | 1.4 | `lists: List[]`, `selectedIds`, `onToggle`. Cada fila: nombre + itemCount + checkmark. |
| **PositionSelector** | 1.4 | `position?: number`, `maxPosition`, `onChange`. Select o input numérico. Opcional. |
| **ConfirmationMessage** | 1.5 | `icon`, `title`, `message`, `itemName?`. Patrón reutilizado en todas las eliminaciones. |
| **DangerButton** | 1.5 | `label`, `onClick`, `disabled?`. Fondo `var(--color-danger)`, texto `var(--color-text-on-accent)`, `var(--radius-md)`. |
| **CancelButton** | 1.5, 1.3, 1.4 | `label`, `onClick`. Fondo `var(--color-surface-raised)`, borde `var(--color-border)`, `var(--radius-md)`. |

## 8. Tokens (solo variables de theme.css)

### MediaCard

| Zona | Propiedad | Token |
|---|---|---|
| Card — fondo | background | `var(--color-surface)` |
| Card — borde | border | `var(--border-width) solid var(--color-border)` |
| Card — radio | border-radius | `var(--radius-lg)` |
| Card — sombra reposo | box-shadow | `var(--shadow-sm)` |
| Card — sombra hover | box-shadow | `var(--shadow-md)` |
| Card — padding interno | padding | `var(--space-3)` (12px) |
| Media — radio | border-radius | `var(--radius-lg)` |
| Media — ratio | aspect-ratio | `3 / 4` |
| Media — object-fit | — | `cover` |
| Media — placeholder bg | background | `var(--color-neutral-200)` |
| Media — placeholder icono | color | `var(--color-neutral-400)` |
| Body — gap interno | gap | `var(--space-1)` (4px) entre título y metadatos |
| Título — color | color | `var(--color-text)` |
| Título — line-clamp | — | 1 (con `min-height` de 1 línea ≈ `var(--text-sm)` × line-height ≈ 20px) |
| Autor — color | color | `var(--color-text-secondary)` |
| Footer — padding-top | padding-top | `var(--space-2)` (8px) — separación del body |
| Footer — separador superior | border-top | `var(--border-width) solid var(--color-border)` |
| Footer — layout | — | flex row, `justify-content: space-between`, `align-items: center` |
| Favorito activo | color | `var(--color-accent)` |
| Favorito inactivo | color | `var(--color-neutral-400)` |
| Menú `…` | color | `var(--color-text-tertiary)` |
| Menú `…` hover | color | `var(--color-text-secondary)` |
| Hover — scale portada | transform | `scale(1.03)` [SHOULD] |

### Page header

| Elemento | Propiedad | Token |
|---|---|---|
| Título "Biblioteca" | font-family | `var(--font-display)` |
| Título | font-size | `var(--text-3xl)` (1.875rem) |
| Título | font-weight | `var(--font-weight-bold)` (700) |
| Título | color | `var(--color-text)` |
| Título | line-height | `var(--leading-tight)` (1.25rem) |
| Título | letter-spacing | `var(--tracking-tight)` (-0.02em) |
| Botón "+" | background | `var(--color-accent)` |
| Botón "+" | color | `var(--color-text-on-accent)` |
| Botón "+" | border-radius | `var(--radius-md)` |
| Botón "+" | padding | `var(--space-2)` vertical, `var(--space-4)` horizontal |
| Botón "+" | font-family | `var(--font-body)` |
| Botón "+" | font-size | `var(--text-sm)` |
| Botón "+" | font-weight | `var(--font-weight-semibold)` |
| Botón "+" hover | background | `var(--color-accent-hover)` |
| Botón "+" active | background | `var(--color-accent-pressed)` |

### Barra de búsqueda

| Elemento | Propiedad | Token |
|---|---|---|
| Contenedor | background | `var(--color-surface)` |
| Contenedor | border | `var(--border-width) solid var(--color-border)` |
| Contenedor | border-radius | `var(--radius-md)` |
| Contenedor — focus | border-color | `var(--color-border-focus)` |
| Input | font-family | `var(--font-body)` |
| Input | font-size | `var(--text-base)` |
| Input | color | `var(--color-text)` |
| Input placeholder | color | `var(--color-text-tertiary)` |
| Icono lupa | color | `var(--color-text-tertiary)` |
| Icono lupa tamaño | — | `var(--icon-size-base)` (20px) |
| Padding interno | padding | `var(--space-2)` vertical, `var(--space-3)` horizontal |
| Gap icono-input | gap | `var(--space-2)` (8px) |

### FilterChips

| Elemento | Propiedad | Token |
|---|---|---|
| Chip — fondo inactivo | background | `var(--color-surface)` |
| Chip — borde inactivo | border | `var(--border-width) solid var(--color-border)` |
| Chip — fondo activo | background | `var(--color-accent-bg)` |
| Chip — borde activo | border-color | `var(--color-accent)` |
| Chip — texto inactivo | color | `var(--color-text-secondary)` |
| Chip — texto activo | color | `var(--color-accent)` |
| Chip — radio | border-radius | `var(--radius-full)` |
| Chip — padding | padding | `var(--space-2)` (8px) vertical, `var(--space-3)` (12px) horizontal |
| Chip — font-family | — | `var(--font-body)` |
| Chip — font-size | — | `var(--text-sm)` |
| Chip — font-weight | — | `var(--font-weight-medium)` |
| Chip — hover | background | `var(--color-surface-interactive)` |

### Page header — botón "Limpiar filtros"

| Elemento | Propiedad | Token |
|---|---|---|
| Texto | color | `var(--color-accent)` |
| Texto | font-family | `var(--font-body)` |
| Texto | font-size | `var(--text-sm)` |
| Texto | font-weight | `var(--font-weight-medium)` |
| Hover | text-decoration | underline |

### Slide-over (1.1, 1.2)

| Elemento | Propiedad | Token |
|---|---|---|
| Panel — fondo | background | `var(--color-surface)` |
| Panel — ancho desktop | — | 480px |
| Panel — shadow | box-shadow | `var(--shadow-xl)` |
| Panel — padding | padding | `var(--space-6)` (24px) |
| Backdrop | background | `rgba(0, 0, 0, 0.4)` |
| Título | font-family | `var(--font-display)` |
| Título | font-size | `var(--text-2xl)` |
| Título | font-weight | `var(--font-weight-bold)` |
| Título | color | `var(--color-text)` |
| Botón cerrar (X) | color | `var(--color-text-secondary)` |
| Botón cerrar hover | color | `var(--color-text)` |
| Botón "Guardar" — fondo | background | `var(--color-accent)` |
| Botón "Guardar" — color | color | `var(--color-text-on-accent)` |
| Botón "Guardar" — radio | border-radius | `var(--radius-md)` |
| Botón "Guardar" — padding | padding | `var(--space-3)` vertical, `var(--space-6)` horizontal |
| Inputs — fondo | background | `var(--color-surface)` |
| Inputs — borde | border | `var(--border-width) solid var(--color-border)` |
| Inputs — radio | border-radius | `var(--radius-md)` |
| Inputs — focus | border-color | `var(--color-border-focus)` |
| Labels | color | `var(--color-text-secondary)` |
| Labels | font-size | `var(--text-sm)` |
| Labels | font-weight | `var(--font-weight-medium)` |
| Gap entre campos | gap | `var(--space-4)` (16px) |

### Modal (1.3, 1.4, 1.5)

| Elemento | Propiedad | Token |
|---|---|---|
| Contenedor — fondo | background | `var(--color-surface)` |
| Contenedor — radio | border-radius | `var(--radius-xl)` |
| Contenedor — shadow | box-shadow | `var(--shadow-xl)` |
| Contenedor — max-width | — | 480px |
| Contenedor — padding | padding | `var(--space-6)` (24px) |
| Backdrop | background | `rgba(0, 0, 0, 0.4)` |
| Título | font-family | `var(--font-display)` |
| Título | font-size | `var(--text-xl)` |
| Título | font-weight | `var(--font-weight-bold)` |
| Título | color | `var(--color-text)` |
| DangerButton — fondo | background | `var(--color-danger)` |
| DangerButton — color | color | `var(--color-text-on-accent)` |
| DangerButton — radio | border-radius | `var(--radius-md)` |
| DangerButton — padding | padding | `var(--space-3)` vertical, `var(--space-6)` horizontal |
| DangerButton — hover | background | `var(--color-danger)` con filter `brightness(0.9)` [SHOULD] |
| CancelButton — fondo | background | `var(--color-surface-raised)` |
| CancelButton — borde | border | `var(--border-width) solid var(--color-border)` |
| CancelButton — color | color | `var(--color-text)` |
| CancelButton — radio | border-radius | `var(--radius-md)` |
| CancelButton — padding | padding | `var(--space-3)` vertical, `var(--space-6)` horizontal |

### EmptyState

| Elemento | Propiedad | Token |
|---|---|---|
| Contenedor | — | flex column, `align-items: center`, gap `var(--space-4)`, padding `var(--space-16)` vertical |
| Icono | color | `var(--color-neutral-400)` |
| Icono | tamaño | `var(--icon-size-xl)` (32px) |
| Título | font-family | `var(--font-display)` |
| Título | font-size | `var(--text-xl)` |
| Título | font-weight | `var(--font-weight-bold)` |
| Título | color | `var(--color-text)` |
| Descripción | font-family | `var(--font-body)` |
| Descripción | font-size | `var(--text-base)` |
| Descripción | color | `var(--color-text-secondary)` |
| Descripción | text-align | center |
| Descripción | max-width | 400px |
| CTA | — | Botón primario (mismos tokens que botón "+") |

### SkeletonCard

| Elemento | Propiedad | Token |
|---|---|---|
| Fondo | background | `var(--color-surface-raised)` |
| Radio | border-radius | `var(--radius-lg)` |
| Animación | — | `@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.7} }`, `animation: pulse 1.5s ease-in-out infinite` |

## 9. Tipografía

| Rol | Familia | Tamaño | Peso | Uso | Token |
|---|---|---|---|---|---|
| Display (H1) | `var(--font-display)` | `var(--text-3xl)` | `var(--font-weight-bold)` | Título de página "Biblioteca" | Un solo H1 [MUST] |
| Título de card | `var(--font-body)` | `var(--text-sm)` | `var(--font-weight-semibold)` | Nombre del ítem en MediaCard | — |
| Cuerpo | `var(--font-body)` | `var(--text-base)` | `var(--font-weight-regular)` | Descripciones en modales, formularios | — |
| Metadata | `var(--font-body)` | `var(--text-xs)` | `var(--font-weight-regular)` | Autor/creador en card, timestamps | — |
| Label | `var(--font-body)` | `var(--text-sm)` | `var(--font-weight-medium)` | Labels de formulario, chips, tabs | — |
| Badge | `var(--font-body)` | `var(--text-xs)` | `var(--font-weight-medium)` | Pills de tipo y estado | — |
| Caption | `var(--font-body)` | `var(--text-xs)` | `var(--font-weight-regular)` | Hints, placeholders, "Limpiar filtros" | — |

**Restricción [MUST]:** Serif (`var(--font-display)`) solo para el H1 de la página y títulos de modales/slide-overs. Sans (`var(--font-body)`) para todo lo demás. No cruzar (P-12).

**Restricción [MUST]:** Máximo 4 tamaños tipográficos por vista: `--text-xs`, `--text-sm`, `--text-base`, `--text-3xl`. Si se necesita un quinto, la jerarquía está mal resuelta (craft.md §4).

## 10. Iconos e imágenes

### Iconografía

- **Set:** Lucide (outline, stroke 1.5px). Estilo consistente: trazo fino, sin relleno [MUST].
- **Tamaños:** `--icon-size-xs` (16px) inline en cards; `--icon-size-base` (20px) en controles; `--icon-size-lg` (24px) en navegación; `--icon-size-xl` (32px) en empty states.
- **Color:** `currentColor` heredado del texto circundante. Nunca color fijo excepto en estados semánticos (éxito=verde, error=rojo) [MUST].
- **Iconos específicos de esta pantalla:**
  - Lupa (buscador): `Search` de Lucide, 20px, `var(--color-text-tertiary)`
  - Plus (agregar): `Plus` de Lucide, 20px, `var(--color-text-on-accent)` sobre botón accent
  - Estrella (favorito): `Star` de Lucide, 16px, fill activo = `var(--color-accent)`, vacío = `var(--color-neutral-400)`
  - Menú contextual (…): `MoreHorizontal` de Lucide, 16px, `var(--color-text-tertiary)`
  - X (cerrar slide-over): `X` de Lucide, 20px, `var(--color-text-secondary)`
  - Icono empty state: `BookOpen` de Lucide, 32px, `var(--color-neutral-400)`
  - Check (checkmark en picker): `Check` de Lucide, 16px, `var(--color-accent)`
  - Alerta (modal eliminar): `AlertTriangle` de Lucide, 24px, `var(--color-warning)`
  - Trash (eliminar en menú): `Trash2` de Lucide, 16px, `var(--color-danger)`
  - Folder (agregar a colección): `FolderPlus` de Lucide, 16px, `var(--color-text-secondary)`
  - List (agregar a lista): `ListPlus` de Lucide, 16px, `var(--color-text-secondary)`
  - Edit (editar): `Pencil` de Lucide, 16px, `var(--color-text-secondary)`
  - Icono fallback por tipo: `BookOpen` (book/manga/comic/other), `Film` (film), `Tv` (series), `Headphones` (audiobook), `Mic` (podcast), `GraduationCap` (course), `Newspaper` (magazine), `Clapperboard` (documentary) — todos 32px, `var(--color-neutral-400)`, solo en slot de fallback de portada

### Imágenes

- **Portadas (MediaItem.coverImage):** `object-fit: cover`, `width: 100%`, `aspect-ratio: 3 / 4` [MUST]. Border-radius `var(--radius-lg)` consistente con la card.
- **Alt de portadas:** `alt=""` [MUST] — el nombre accesible lo aporta el enlace del título de la card (evita doble lectura en lector de pantalla).
- **Placeholder sin imagen:** Background `var(--color-neutral-200)` + icono del tipo de contenido (`BookOpen`, `Film`, `Tv`, etc.) centrado en `var(--color-neutral-400)`, tamaño `var(--icon-size-xl)` (32px) [MUST].
- **Fallback on error [MUST]:** El componente MediaCard debe manejar `onError` en el `<img>` de portada. Si la imagen falla al cargar (404, CORS, formato inválido, URL nula o vacía), se reemplaza el `<img>` por un `div` de fallback con: fondo `var(--color-neutral-200)`, `border-radius: var(--radius-lg)`, y un icono del tipo de contenido centrado (32px, `var(--color-neutral-400)`). El fallback se renderiza **en el mismo slot que la imagen** (misma posición, mismas dimensiones, `aspect-ratio: 3/4`). El icono se selecciona según `MediaItem.type`: `BookOpen` para book, `Film` para film, `Tv` para series, `BookOpen` para manga/comic, `Headphones` para audiobook, `Mic` para podcast, `GraduationCap` para course, `Newspaper` para magazine, `Clapperboard` para documentary, `BookOpen` para other.
- **Mosaico mini en CollectionPickerList:** Grid 2×2 de mini-portadas con `object-fit: cover`, radio `var(--radius-sm)`, tamaño fijo 48×48px. Si la colección tiene <4 ítems, los slots vacíos muestran `var(--color-neutral-200)`.

## 11. Estados

### Estados de pantalla

#### Vacío

- **Contenido exacto [MUST]:**
  - Icono: `BookOpen` de Lucide, 32px, `var(--color-neutral-400)`
  - Título: "Tu biblioteca está vacía" — `var(--font-display)`, `var(--text-xl)`, `var(--font-weight-bold)`, `var(--color-text)`
  - Descripción: "Añade tu primer libro, película, serie o cualquier contenido que consumas." — `var(--font-body)`, `var(--text-base)`, `var(--color-text-secondary)`
  - CTA: Botón "Añadir mi primer ítem" — botón primario (mismos tokens que "+")
- **Layout:** Centrado vertical y horizontal en el viewport del grid. Flex column, `align-items: center`, gap `var(--space-4)`.
- **Prohibido [MUST]:** Ilustraciones decorativas (P-9). Solo icono del sistema + texto + CTA.

#### Carga

- **Contenido exacto [MUST]:** 8 skeleton cards (4 columnas × 2 filas en desktop; 2 columnas × 4 filas en móvil) con las mismas dimensiones que las cards reales.
- **Cada skeleton:** Rectángulo `var(--color-surface-raised)` con radio `var(--radius-lg)`, animación pulse (opacity 0.4→0.7, 1.5s, ease-in-out infinite). Estructura interna: rectángulo de portada (ratio 3:4, fondo ligeramente más claro) + 2 líneas de texto (ancho 70% y 40%, fondo `var(--color-neutral-200)`).
- **Prohibido [MUST]:** Skeletons con dimensiones distintas a las cards reales — generan layout shift al cargar.

#### Error

- **Contenido exacto [MUST]:**
  - Icono: `AlertTriangle` de Lucide, 32px, `var(--color-warning)`
  - Título: "Algo salió mal" — `var(--font-display)`, `var(--text-xl)`, `var(--font-weight-bold)`, `var(--color-text)`
  - Descripción: "No pudimos cargar tu biblioteca. Intenta de nuevo." — `var(--font-body)`, `var(--text-base)`, `var(--color-text-secondary)`
  - CTA: Botón "Reintentar" — botón primario
- **Layout:** Centrado vertical y horizontal, mismo patrón que empty state.

#### Búsqueda sin resultados

- **Contenido exacto [MUST]:**
  - Icono: `SearchX` de Lucide (o `Search` con cross), 32px, `var(--color-neutral-400)`
  - Título: "No se encontraron resultados" — `var(--font-display)`, `var(--text-xl)`
  - Descripción: "No hay ítems que coincidan con \"{query}\". Prueba con otros términos o limpia los filtros." — `var(--font-body)`, `var(--text-base)`, `var(--color-text-secondary)`. El `{query}` se sustituye por el término de búsqueda real.
  - CTA: Enlace "Limpiar filtros" — `var(--color-accent)`, `var(--text-sm)`, `var(--font-weight-medium)`

### Estados de MediaCard

| Estado | Comportamiento |
|---|---|
| **Default** | Sombra `var(--shadow-sm)`, borde `var(--border-width) solid var(--color-border)`, fondo `var(--color-surface)` |
| **Hover** | Sombra `var(--shadow-md)` [MUST]. Scale de portada `scale(1.03)` [SHOULD] — transición `var(--duration-normal)`, `var(--easing-out)`. Borde permanece igual. |
| **Focus-visible** | Anillo de foco de 2px `var(--color-border-focus)` alrededor de la card completa, offset 2px [MUST]. El foco va en el enlace del título (el `<a>` que cubre la card). |
| **Active** | Scale `scale(0.98)` [MAY] — feedback táctil. Transición `var(--duration-fast)`. |
| **Disabled** | No aplica — las tarjetas nunca se deshabilitan. |

### Estados de botón "+"

| Estado | Comportamiento |
|---|---|
| **Default** | Fondo `var(--color-accent)`, texto `var(--color-text-on-accent)` |
| **Hover** | Fondo `var(--color-accent-hover)` |
| **Focus-visible** | Anillo 2px `var(--color-border-focus)`, offset 2px |
| **Active/Pressed** | Fondo `var(--color-accent-pressed)` |
| **Disabled** | No aplica — el botón siempre está habilitado. |

### Estados de FilterChips

| Estado | Comportamiento |
|---|---|
| **Default (inactivo)** | Fondo `var(--color-surface)`, borde `var(--color-border)`, texto `var(--color-text-secondary)` |
| **Hover (inactivo)** | Fondo `var(--color-surface-interactive)` |
| **Activo** | Fondo `var(--color-accent-bg)`, borde `var(--color-accent)`, texto `var(--color-accent)` |
| **Focus-visible** | Anillo 2px `var(--color-border-focus)`, offset 2px |
| **Disabled** | No aplica. |

### Estados de barra de búsqueda

| Estado | Comportamiento |
|---|---|
| **Default** | Borde `var(--color-border)`, fondo `var(--color-surface)` |
| **Focus** | Borde `var(--color-border-focus)`, ring sutil |
| **Con contenido** | Icono de lupa se reemplaza por icono X para limpiar [SHOULD] |
| **Disabled** | No aplica. |

### Estados de botón favorito (en MediaCard)

| Estado | Comportamiento |
|---|---|
| **Inactivo** | Icono estrella vacía, `var(--color-neutral-400)` |
| **Hover** | `var(--color-text-secondary)` |
| **Activo** | Icono estrella rellena, `var(--color-accent)` |
| **Focus-visible** | Anillo 2px `var(--color-border-focus)`, offset 2px [MUST] |
| **Disabled** | No aplica. |

### Estados de Slide-over (1.1, 1.2)

| Estado | Comportamiento |
|---|---|
| **Cerrado** | Panel translateX(100%) (off-screen derecho), backdrop opacity 0, pointer-events none |
| **Abierto** | Panel translateX(0), backdrop opacity 1, `var(--duration-slow)`, `var(--easing-out)` |
| **Guardando** | Botón "Guardar" muestra spinner, deshabilitado. Campos deshabilitados [SHOULD] |
| **Error de guardado** | Toast de error (T.2), campos permanecen editables |

### Estados de Modal (1.3, 1.4, 1.5)

| Estado | Comportamiento |
|---|---|
| **Cerrado** | display none |
| **Abierto** | Flex centrado, backdrop `rgba(0,0,0,0.4)`, `var(--duration-normal)`, `var(--easing-out)` |
| **Procesando** | Botón de acción muestra spinner, deshabilitado |

## 12. Teclado

### Orden de tabulación

1. Botón "+" (header) — ` tabIndex="0"` en el botón nativo
2. Input de búsqueda — ` tabIndex="0"` en el input
3. Chips de filtro (izq a der) — ` tabIndex="0"` en cada chip como `<button>`
4. **Por cada MediaCard (izq a der, arriba a abajo):**
   - (1) Enlace del título — ` tabIndex="0"` en el `<a>`
   - (2) Botón favorito — ` tabIndex="0"` en el `<button>`
   - (3) Botón menú `…` — ` tabIndex="0"` en el `<button>`
5. Enlace "Limpiar filtros" (si visible) — ` tabIndex="0"`

### Semántica por elemento

| Elemento | Rol nativo | Enter | Space |
|---|---|---|---|
| Enlace del título (card) | `<a href="/item/:id">` | Navega al detalle [MUST] | No hace nada (semántica nativa de `<a>`) |
| Botón "+" | `<button>` | Activa — abre slide-over [MUST] | Activa — abre slide-over [MUST] |
| Botón favorito | `<button>` | Alterna favorito, NO navega [MUST] | Alterna favorito, NO navega [MUST] |
| Botón menú `…` | `<button>` | Abre/cierra dropdown [MUST] | Abre/cierra dropdown [MUST] |
| Chip de filtro | `<button>` | Alterna filtro [MUST] | Alterna filtro [MUST] |
| Input de búsqueda | `<input type="search">` | No aplica (escritura) | No aplica (escritura) |
| Enlace "Limpiar filtros" | `<a>` o `<button>` | Activa limpieza [MUST] | Activa limpieza [MUST] |

### Atajos

- **Escape:** Cierra el slide-over abierto, cierra el dropdown de menú contextual, cierra el modal abierto [MUST]. Si no hay overlay abierto, Escape no hace nada.
- ** `/` (barra espaciadora cuando no hay input focused):** Focus al input de búsqueda [SHOULD].

## 13. Lector de pantalla

### Landmarks y roles

- La página principal usa `<main>` como landmark [MUST].
- El grid de cards se renderiza como `<ul role="list">` con cada card como `<li>` [MUST].
- El header de página es `<header>` con un único `<h1>` "Biblioteca" [MUST].
- La filter bar es una `<nav aria-label="Filtros de biblioteca">` [SHOULD].

### Nombres accesibles por componente

| Componente | Nombre accesible |
|---|---|
| Enlace del título (card) | `{título del ítem}` — el texto del `<a>` es el título [MUST] |
| Botón favorito (inactivo) | `"Marcar como favorito: {título}"` [MUST] |
| Botón favorito (activo) | `"Quitar de favoritos: {título}"` [MUST] |
| Botón menú `…` | `"Acciones de {título}"` [MUST] |
| Botón "+" | `"Agregar nuevo ítem"` [MUST] |
| Input de búsqueda | `aria-label="Buscar en tu biblioteca"` [MUST] |
| Chip de filtro (inactivo) | `"Filtrar por tipo: {tipo}"` (ej. "Filtrar por tipo: Película") [MUST] |
| Chip de filtro (activo) | `"Quitar filtro de tipo: {tipo}"` [MUST] |
| RatingStars | `role="img"` + `aria-label="Valoración: {N} de 5"` [MUST]. Si `rating` es null: `aria-label="Sin valoración"` |
| Badge de tipo | Texto del badge (ej. "Película") es contenido visible. No necesita aria adicional. |
| Badge de estado | Texto del badge (ej. "Completado") es contenido visible. No necesita aria adicional. |
| Slide-over | `role="dialog"` + `aria-modal="true"` + `aria-label="{título del formulario}"` [MUST]. Focus trap dentro del slide-over [MUST]. |
| Modal | `role="dialog"` + `aria-modal="true"` + `aria-label="{título del modal}"` [MUST]. Focus trap [MUST]. |
| Botón cerrar slide-over | `"Cerrar"` [MUST] |
| Empty state CTA | Texto del botón (ej. "Añadir mi primer ítem") [MUST] |

### Aria requeridos

- `aria-pressed` en botón favorito [MUST]
- `aria-current="page"` en el tab activo de navegación (App Shell) [MUST]
- `aria-live="polite"` en el contenedor del grid cuando cambia por filtros/búsqueda [SHOULD] — para anunciar "Mostrando N de M ítems"
- `aria-busy="true"` durante el estado de carga [MUST]
- Focus trap en slide-over y modales [MUST]

## 14. Interacciones

### Tabla de disparadores → resultados

| Disparador | Resultado | Independencia |
|---|---|---|
| Click/tap en portada, título o zona no interactiva de la card | Navega a `/item/:id` [MUST] | — (acción principal) |
| Enter con foco en el enlace del título | Navega a `/item/:id` [MUST] | Misma que click |
| Click/tap/Enter/Space en estrella favorito | Alterna favorito (`aria-pressed` cambia); NO navega [MUST] | Independiente — nunca dispara navegación [MUST] |
| Click en chip de filtro | Alterna ese filtro; el grid se actualiza; no navega [MUST] | Independiente — no afecta favoritos ni búsqueda |
| Click en "Limpiar filtros" | Desactiva todos los filtros y limpia la búsqueda; grid muestra todos los ítems | Independiente |
| Click en "+" | Abre slide-over "Nuevo ítem" (1.1) | Independiente — no afecta el grid hasta que se guarde |
| Click en `…` de una card | Abre dropdown de acciones (eliminar, agregar a colección, agregar a lista, cambiar estado) | Independiente — no navega ni alterna favorito |
| Click en "Eliminar" dentro del menú `…` | Abre modal de confirmación (1.5) | Independiente |
| Click en "Agregar a colección" dentro del menú `…` | Abre picker modal (1.3) | Independiente |
| Click en "Agregar a lista" dentro del menú `…` | Abre picker modal (1.4) | Independiente |
| Click en opción de estado dentro del menú `…` | Cambia el estado del ítem, actualiza el badge, cierra el dropdown | Independiente |
| Click fuera del dropdown `…` | Cierra el dropdown | Independiente |
| Escape con dropdown abierto | Cierra el dropdown | Independiente |
| Escape con slide-over abierto | Cierra el slide-over (confirma si hay cambios sin guardar) | Independiente |
| Escape con modal abierto | Cierra el modal | Independiente |
| Click en backdrop de slide-over | Cierra el slide-over (confirma si hay cambios sin guardar) | Independiente |
| Click en backdrop de modal | Cierra el modal | Independiente |

### Modelo de interacción de la card (obligatorio)

**Enlace extendido [MUST]:** Un único `<a>` real en el título cuyo pseudo-elemento `::after` con `inset: 0` cubre toda la tarjeta (portada, metadatos, huecos clicables). El botón favorito y el botón `…` son HERMANOS del enlace, posicionados con `position: relative` + `z-index` superior al overlay del `::after`. Esto garantiza que sus clicks nunca alcanzan el enlace, sin `stopPropagation`, sin `<button>` dentro de `<a>` [MUST].

Estructura HTML simplificada:
```html
<article class="media-card">
  <a href="/item/:id" class="media-card__link">
    <img class="media-card__cover" src="..." alt="" />
    <span class="media-card__title">{título}</span>
    <span class="media-card__meta">{autor} · {tipo}</span>
  </a>
  <footer class="media-card__footer">
    <button aria-pressed="..." aria-label="Marcar como favorito: {título}">
      <!-- icono estrella -->
    </button>
    <button aria-label="Acciones de {título}">
      <!-- icono MoreHorizontal -->
    </button>
  </footer>
</article>
```

El `::after` del `.media-card__link` tiene `position: absolute; inset: 0; z-index: 1`. El `.media-card__footer` tiene `position: relative; z-index: 2` para que sus botones estén por encima del overlay [MUST].

## 15. Movimiento

### Momentos de motion

| Momento | Transición | Duración | Easing |
|---|---|---|---|
| Hover de card — sombra | `box-shadow` de `var(--shadow-sm)` a `var(--shadow-md)` | `var(--duration-normal)` (200ms) | `var(--easing-out)` |
| Hover de card — scale portada | `transform: scale(1.03)` sobre la imagen | `var(--duration-normal)` (200ms) | `var(--easing-out)` [SHOULD] |
| Active de card | `transform: scale(0.98)` | `var(--duration-fast)` (100ms) | `var(--easing-default)` [MAY] |
| Apertura de slide-over | `transform: translateX(100%)` → `translateX(0)` + backdrop fade in | `var(--duration-slow)` (300ms) | `var(--easing-out)` |
| Cierre de slide-over | `transform: translateX(0)` → `translateX(100%)` + backdrop fade out | `var(--duration-slow)` (300ms) | `var(--easing-in)` |
| Apertura de modal | Scale de 0.95 → 1 + opacity de 0 → 1 + backdrop fade in | `var(--duration-normal)` (200ms) | `var(--easing-out)` |
| Cierre de modal | Scale de 1 → 0.95 + opacity de 1 → 0 + backdrop fade out | `var(--duration-normal)` (200ms) | `var(--easing-in)` |
| Toggle de chip filtro | `background-color` + `border-color` + `color` | `var(--duration-fast)` (100ms) | `var(--easing-default)` |
| Toggle de favorito | Color de estrella + escala sutil (1 → 1.2 → 1) | `var(--duration-fast)` (100ms) | `var(--easing-default)` [MAY] |

### Momento pico del flujo

El **momento pico** del flujo de esta pantalla es el **click en la portada de un ítem que el usuario estaba buscando** — es el momento de "lo encontré" que justifica toda la inversión en browsing visual. El feedback de este momento: transición de hover (scale + sombra) que confirma que la card es clickeable, seguido de la transición de ruta a la pantalla de detalle.

### prefers-reduced-motion [MUST]

Cuando `prefers-reduced-motion: reduce` está activo:
- Todas las transiciones de `transform` se desactivan (scale, translateX) [MUST]
- Las transiciones de `opacity` y `color` se mantienen pero con `duration: 0ms` o `var(--duration-fast)` [MUST]
- El animation pulse de los skeletons se detiene (sin animación) [MUST]
- El backdrop fade se reemplaza por un cambio instantáneo de opacity [MUST]

## 16. Accesibilidad

- **Contraste [MUST]:** Todos los pares texto/fondo verificados contra `design_check contrast`:
  - Texto primario (`var(--color-text)`) sobre `var(--color-surface)`: ≥7:1 (AAA)
  - Texto secundario (`var(--color-text-secondary)`) sobre `var(--color-surface)`: ≥4.5:1 (AA)
  - Texto on-accent (`var(--color-text-on-accent)`) sobre `var(--color-accent)`: ≥3:1 (AA large text — botones ≥14px bold) [MUST]
  - Chips activos (texto accent sobre accent-bg): verificar [MUST]
- **Targets táctiles [MUST]:** Todos los botones interactivos ≥44×44px en viewport móvil (390×844):
  - Botón favorito: tamaño mínimo de hit area 44×44px (el icono puede ser 16px pero el padding del botón compensa)
  - Botón `…`: mismo mínimo
  - Chips de filtro: alto mínimo 36px + padding = 44px total [MUST]
  - Botón "+": alto mínimo 40px + padding [MUST]
- **Un solo H1 [MUST]:** "Biblioteca" es el único `<h1>` de la página.
- **Focus visible [MUST]:** Anillo de 2px `var(--color-border-focus)` con offset 2px en todos los interactivos. El anillo no se recorta por `overflow: hidden` del contenedor.
- **Focus trap [MUST]:** Slide-over y modales atrapan el foco — Tab y Shift+Tab circulan dentro del overlay. Escape sale del overlay.
- **prefers-reduced-motion [MUST]:** Ver sección 15.
- **Skip link [SHOULD]:** "Saltar al contenido principal" que lleva foco al `<main>`.

## 17. Datos, fixtures y microcopy

### Fixtures para el grid principal

**12 ítems reales del dominio** (mezcla de tipos, estados y metadatos):

| # | título | type | creator | genre | status | isFavorite | personalRating | coverImage | platform | notas |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Cien años de soledad | book | Gabriel García Márquez | Realismo mágico | completed | true | 5 | `https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg` | Kindle | — |
| 2 | Blade Runner 2049 | film | Denis Villeneuve | Ciencia ficción | completed | true | 4 | `https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg` | Netflix | — |
| 3 | Breaking Bad | series | Vince Gilligan | Drama | consuming | true | 5 | `https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHWArZfCbn7EM.jpg` | HBO Max | Temporada 4 |
| 4 | Death Note, Vol. 1 | manga | Tsugumi Ohba / Takeshi Obata | Suspense | completed | false | 4 | `https://covers.openlibrary.org/b/isbn/9781421501680-L.jpg` | — | — |
| 5 | The Power of Habit | audiobook | Charles Duhigg | Productividad | consuming | false | null | `https://covers.openlibrary.org/b/isbn/9780812981605-L.jpg` | Audible | — |
| 6 | Cosmos | documentary | Carl Sagan | Ciencia | completed | true | 5 | `https://image.tmdb.org/t/p/w500/ivOLM47yJt90P19RH1hK8eSqkLi.jpg` | YouTube | — |
| 7 | Revista National Geographic — Enero 2024 | magazine | National Geographic Society | Naturaleza | pending | false | null | `https://covers.openlibrary.org/b/isbn/9780008557058-L.jpg` | Kiosco | — |
| 8 | Hardcore History | podcast | Dan Carlin | Historia | consuming | true | 5 | `https://artwork.transistor.fm/3f4e528e/dark/3000x3000.jpg` | Spotify | Episodios largos |
| 9 | The Witcher, Vol. 1: El último deseo | book | Andrzej Sapkowski | Fantasía | completed | false | 3 | `https://covers.openlibrary.org/b/isbn/9780756404741-L.jpg` | Físico | — |
| 10 | Curso de TypeScript Avanzado | course | Midudev | Programación | pending | false | null | `https://i.ytimg.com/vi/30ANN6y3RJo/maxresdefault.jpg` | YouTube | — |
| 11 | Spider-Man: Into the Spider-Verse | film | Bob Persichetti / Peter Ramsey | Animación | completed | false | 4 | `https://image.tmdb.org/t/p/w500/iiZZdoQvfYQd7g6B8BBM7lZHzL7.jpg` | Netflix | — |
| 12 | Watchmen | comic | Alan Moore / Dave Gibbons | Ciencia ficción | pending | false | null | — (sin portada) | Físico | Pendiente de leer |

**Requisitos de fixtures [MUST]:**
- ≥4 libros, ≥2 películas, ≥1 serie, ≥1 manga, ≥1 audiolibros, ≥1 podcast, ≥1 curso, ≥1 revista, ≥1 cómic
- Estados variados: ≥3 completed, ≥2 consuming, ≥2 pending, 0 abandoned (puede haber pero no obligatorio)
- ≥3 favoritos activos
- Rating variado: al menos 1 de cada valor (1-5) y ≥3 sin rating
- ≥1 ítem sin portada (ítem #12) para verificar el placeholder
- Imágenes reales: las URLs arriba son portadas reales de Open Library y TMDB. En producción, usar URLs fijas o fixtures embebidos.

### Microcopy

| Contexto | Texto |
|---|---|
| Título de página | "Biblioteca" |
| Botón agregar | "+" (solo icono, con aria-label "Agregar nuevo ítem") |
| Placeholder de búsqueda | "Buscar por título, autor, género..." |
| Chip "Todos" | "Todos" |
| Chips de tipo | Los 11 valores del enum `type` en inglés con capitalize: "Book", "Series", "Film", "Documentary", "Manga", "Comic", "Magazine", "Audiobook", "Podcast", "Course", "Other" |
| Chips de estado | "Pendiente", "Consumiendo", "Completado", "Abandonado" |
| Botón limpiar | "Limpiar filtros" |
| Empty state título | "Tu biblioteca está vacía" |
| Empty state descripción | "Añade tu primer libro, película, serie o cualquier contenido que consumas." |
| Empty state CTA | "Añadir mi primer ítem" |
| Error título | "Algo salió mal" |
| Error descripción | "No pudimos cargar tu biblioteca. Intenta de nuevo." |
| Error CTA | "Reintentar" |
| Sin resultados título | "No se encontraron resultados" |
| Sin resultados descripción | "No hay ítems que coincidan con \"{query}\". Prueba con otros términos o limpia los filtros." |
| Sin resultados CTA | "Limpiar filtros" |
| Slide-over título (nuevo) | "Nuevo ítem" |
| Slide-over título (editar) | "Editar ítem" |
| Botón guardar | "Guardar" |
| Modal agregar a colección título | "Agregar a colección" |
| Modal agregar a lista título | "Agregar a lista" |
| Modal eliminar título | "¿Eliminar este ítem?" |
| Modal eliminar mensaje | "Esta acción no se puede deshacer. El ítem se eliminará permanentemente de tu biblioteca." |
| Botón eliminar (danger) | "Eliminar" |
| Botón cancelar | "Cancelar" |
| Checkmark en picker | — (icono `Check` de Lucide, `var(--color-accent)`) |
| Toast éxito (post-guardar) | "Ítem agregado" / "Ítem actualizado" |
| Toast éxito (post-favorito) | "Añadido a favoritos" / "Quitado de favoritos" |
| Toast éxito (post-eliminar) | "Ítem eliminado" |
| Toast éxito (post-colección) | "Añadido a {nombre_colección}" |
| Toast éxito (post-lista) | "Añadido a {nombre_lista}" |
| Toast éxito (post-estado) | "Estado actualizado a {nuevo_estado}" |

## 18. Criterios de aceptación

### Acción principal y navegación

- [ ] Click en la portada de una card navega a `/item/:id` (test Playwright: `page.click('.media-card__link') → expect(page).toHaveURL(/\/item\//)`) [MUST]
- [ ] Click en el título de una card navega a `/item/:id` (test Playwright) [MUST]
- [ ] Enter con foco en el enlace del título navega a `/item/:id` (test Playwright: `page.focus('.media-card__link'); page.keyboard.press('Enter') → expect(page).toHaveURL(/\/item\//)`) [MUST]

### Independencia del favorito

- [ ] Click en el botón favorito alterna `aria-pressed` y NO navega (test Playwright: `aria-pressed` cambia + URL no cambia) [MUST]
- [ ] Enter en el botón favorito alterna `aria-pressed` y NO navega [MUST]
- [ ] Space en el botón favorito alterna `aria-pressed` y NO navega [MUST]
- [ ] El botón favorito no tiene ancestro `<a>` (test Playwright: `button.closest('a') === null`) [MUST]

### Contención y consistencia

- [ ] Ningún hijo visible de la card sobresale del bounding box de la card (test Playwright: bounding boxes con tolerancia ±2px) [MUST]
- [ ] El botón favorito tiene el mismo offset relativo a la card en todas las instancias, con títulos de 1 y de 2+ líneas (test Playwright: posicionamiento del botón) [MUST]
- [ ] El botón `…` tiene el mismo offset relativo en todas las instancias [MUST]
- [ ] Todas las cards de una misma fila del grid miden lo mismo (tolerancia ±1px) (test Playwright: `document.querySelectorAll('.media-card').forEach(card => expect(card.offsetHeight).toBe(rowHeight))`) [MUST]

### Alturas y slots

- [ ] El título de la card tiene line-clamp-1 y altura reservada de 1 línea (min-height aplicado) [MUST]
- [ ] El footer de la card siempre está presente (incluso con títulos largos) [MUST]
- [ ] El body de la card crece para empujar el footer al fondo (flex-grow: 1) [MUST]

### Ritmo y espaciado

- [ ] Ningún par de bloques hermanos en la página tiene separación < `var(--space-3)` (12px) [MUST]
- [ ] Gap inter-grupo ≥ 2× gap intra-grupo en las agrupaciones declaradas (header → filter bar → grid) [MUST]
- [ ] Separación header → filter bar ≥ `var(--space-4)` [MUST]
- [ ] Separación filter bar → grid ≥ `var(--space-4)` [MUST]

### Color y jerarquía

- [ ] Las portadas de los fixtures son imágenes reales (no placeholders grises) — al menos 11 de 12 ítems tienen portada [MUST]
- [ ] Los estados semánticos (badges de status) llevan color semántico del theme, no solo texto gris [MUST]
- [ ] Cada texto de la pantalla tiene nivel asignado (primary/secondary/muted) — verificable en inspección de estilos [MUST]
- [ ] En pares label/valor, el valor lleva el énfasis (font-weight mayor o color más saturado) [MUST]
- [ ] Contadores usan `font-variant-numeric: tabular-nums` [MUST]

### Interacción de card (modelo enlace extendido)

- [ ] Solo hay UN `<a>` por card (el del título) [MUST]
- [ ] El `::after` del enlace cubre toda la card con `position: absolute; inset: 0` [MUST]
- [ ] El botón favorito y `…` están por encima del overlay (z-index > z-index del ::after) [MUST]
- [ ] No hay `<button>` anidado dentro de `<a>` [MUST]

### Estados de pantalla

- [ ] Empty state renderiza: icono + "Tu biblioteca está vacía" + descripción + CTA (test Playwright con 0 ítems) [MUST]
- [ ] Loading state renderiza 8 skeleton cards con dimensiones iguales a las cards reales [MUST]
- [ ] Error state renderiza: icono + "Algo salió mal" + descripción + CTA "Reintentar" [MUST]
- [ ] Búsqueda sin resultados renderiza: "No se encontraron resultados" + query real + "Limpiar filtros" [MUST]

### Teclado

- [ ] Tab ordena: + → búsqueda → chips → cards (por card: título → favorito → `…`) → "Limpiar filtros" [MUST]
- [ ] Escape cierra slide-over, modal o dropdown abierto [MUST]
- [ ] Focus visible (anillo 2px `var(--color-border-focus)`) en todos los interactivos al tabular [MUST]

### Accesibilidad

- [ ] Un solo H1 en la página [MUST]
- [ ] Todas las portadas tienen `alt=""` [MUST]
- [ ] Botón favorito ≥44×44px de hit area en viewport 390×844 [MUST]
- [ ] Chips de filtro ≥36px alto total en viewport móvil [MUST]
- [ ] `aria-pressed` en botón favorito refleja el estado actual [MUST]
- [ ] Slide-over tiene `role="dialog"` + `aria-modal="true"` + focus trap [MUST]
- [ ] Modal tiene `role="dialog"` + `aria-modal="true"` + focus trap [MUST]
- [ ] `aria-live="polite"` en contenedor del grid announce cambio de resultados [SHOULD]
- [ ] `prefers-reduced-motion: reduce` desactiva transiciones de transform y animación de skeletons [MUST]

### Responsive

- [ ] Grid muestra 4 columnas en viewport 1280px [MUST]
- [ ] Grid muestra 3 columnas en viewport 768px [MUST]
- [ ] Grid muestra 2 columnas en viewport 390px [MUST]
- [ ] En móvil (<640px), el slide-over pasa a vista de pantalla completa [MUST]
- [ ] Chips de filtro son scrollables horizontalmente en viewport móvil [MUST]

### Footer de MediaCard (D1.1)

- [ ] Cada MediaCard renderiza un `<footer>` con borde superior `var(--border-width) solid var(--color-border)` [MUST]
- [ ] El footer contiene botón estrella (izquierda) con `aria-pressed` y botón `…` (derecha) con icono `MoreHorizontal` [MUST]
- [ ] El footer tiene `position: relative; z-index: 2` — superior al `::after` del enlace (`z-index: 1`) [MUST]
- [ ] Click en estrella favorito NO navega al detalle (test Playwright: URL no cambia) [MUST]
- [ ] Click en `…` NO navega al detalle [MUST]
- [ ] El footer es visible incluso cuando el título ocupa 2+ líneas (body flex-grow empuja footer abajo) [MUST]

### Fallback de portada rota (D1.2)

- [ ] El ítem con `coverImage: null` (fixture #12 Watchmen) muestra un `div` con fondo `var(--color-neutral-200)` y el icono del tipo centrado a 32px [MUST]
- [ ] Ninguna card muestra el icono nativo de imagen rota del navegador (test Playwright: no hay `<img>` con broken-image state visible) [MUST]
- [ ] El componente MediaCard ejecuta `onError` en el `<img>` y cambia al fallback sin flash visible [MUST]
- [ ] El fallback respeta `aspect-ratio: 3/4` y `border-radius: var(--radius-lg)` (mismas dimensiones que una portada real) [MUST]

### Filtros scroll horizontal en móvil (D1.3)

- [ ] En viewport 390×844, el contenedor de chips tiene `flex-wrap: nowrap` [MUST]
- [ ] Los chips se muestran en una sola fila deslizable horizontalmente, sin apilamiento vertical [MUST]
- [ ] `overflow-x: auto` + `scroll-snap-type: x proximity` aplicados al contenedor de chips [MUST]
- [ ] El scrollbar horizontal está oculto (`scrollbar-width: none` o equivalente) [SHOULD]

### Buscador único en desktop (D1.4)

- [ ] En viewport 1280×800, exactamente UN input de búsqueda visible (test Playwright: `input[type="search"]:visible` count === 1) [MUST]
- [ ] El buscador del App Shell tiene `display: none` cuando la ruta es `/` [MUST]

### Botón "+" y bottom tabs en móvil (D1.5)

- [ ] En viewport 390×844, el botón "+" es visible en el page header [MUST]
- [ ] El botón "+" tiene hit area mínima de 44×44px [MUST]
- [ ] La bottom tab bar muestra 3 tabs: Biblioteca, Colecciones, Listas [MUST]
- [ ] Cada tab tiene icono + label, alto mínimo 48px, distribución equidistante [MUST]

## 19. Interpretaciones prohibidas

Estos defaults genéricos están vetados para esta pantalla por las decisiones de `design-tokens.md`, `brand-brief.md` y `ux-flow.md`:

1. **No sidebar de administración [P-1, ux-flow.md]:** La navegación es por tabs (desktop) y bottom tabs (móvil). No hay sidebar extenso. El menú de usuario (configuración, importación) es dropdown, no sidebar.
2. **No stat-cards ni fila de métricas [AP-1, ux-flow.md]:** La pantalla principal no muestra contadores ("42 ítems", "12 completados") como bloque visual dominante. El grid de portadas ES el contenido.
3. **No tabla densa como vista principal [ux-flow.md]:** La tabla es herramienta auxiliar, solo en config/admin. La biblioteca se navega por grid visual de portadas.
4. **No fondo crema/beige/sand [AP-2, P-1]:** El fondo es `var(--color-bg)` (#FAF9F7), no crema. La calidez se carga en el acento copper y la tipografía serif, no en el fondo.
5. **No sombras con opacidad >10% (light) / >35% (dark) [P-2]:** Usar solo las sombras del theme (`var(--shadow-sm)`, `var(--shadow-md)`, `var(--shadow-xl)`).
6. **No `--color-accent` como fondo de secciones grandes [P-4]:** El acento ≤10% de superficie. Se usa en botones primarios, badges activos, links — nunca como fondo de zona.
7. **No `--color-text-tertiary` para información primaria [P-5]:** Solo para captions, hints, timestamps, placeholders.
8. **No ilustraciones decorativas en empty states [P-9]:** Solo icono del sistema + texto + CTA. Sin dibujos, sin arte.
9. **No `<div onClick>` ni `<a>` envolvente en la card [ejemplo-biblioteca.md]:** Solo enlace extendido con `::after` + hermanos con z-index.
10. **No `stopPropagation` como mecanismo de independencia [ejemplo-biblioteca.md]:** La independencia sale de la estructura HTML (hermano + z-index).
11. **No portadas placeholder grises "de momento" [craft.md §3]:** Los fixtures incluyen imágenes reales. Un placeholder gris invalida la evaluación visual.
12. **No léxico vago [AP-3]:** Prohibido "moderno", "limpio", "cool", "elegante", "mejorar espaciado". Toda instrucción es medible.
13. **No `--text-5xl` en esta pantalla [P-11]:** El H1 usa `--text-3xl`. El display máximo es solo para landing/dashboard principal.
14. **No font-family display para cuerpo [P-12]:** Serif solo en H1 y títulos de modales/slide-overs. Todo lo demás es sans.
15. **No border-radius >8px en componentes de alta densidad [P-6]:** Chips y pills usan `--radius-full` (que es legítimo para pills), pero cards usan `--radius-lg` (8px). No usar `--radius-xl` en cards del grid.
16. **No gradientes decorativos [P-8]:** Superficies planas con escala tonal. Sin gradientes en fondos, headers ni cards.
17. **No colores de la paleta rotativa para texto informativo [P-10]:** Los `--avatar-color-*` son decorativos. Nunca para texto de contenido.
18. **No más de 4 tamaños tipográficos por pantalla [craft.md §4]:** En esta pantalla: xs, sm, base, 3xl. Si se necesita un quinto, reorganizar la jerarquía.
19. **No dos buscadores visibles simultáneamente [D1.4, v2]:** Un solo input de búsqueda en la pantalla. En desktop, el del App Shell se oculta en `/`. El buscador duplicado es un error de implementación, no una decisión de diseño.

## 20. Contexto de revisión

- Iteración actual: 1
- Hallazgos abiertos: D1.1–D1.5 aplicadas como enmiendas v2
- Captura previa: shots/iter-1-1280x800.png, shots/iter-1-390x844.png
- Score previo: 60/100 (ITERAR)

## Checklist

### Completitud

1. [x] Las 20 secciones de `plantilla.md` están presentes — ninguna omitida.
2. [x] Frontmatter completo: slug, ruta, tipo, tipo_nodo, version, iteracion, estado, viewports, fuentes.
3. [x] Todas las fuentes del ScreenBrief existen en disco y se citaron: `theme.css`, `ux-flow.md`, `design-tokens.md`, `discovery.md`, `brand-brief.md`. `patron: null` (no hay patterns en intelligence).
4. [x] No hay patrón aplicable en `.opencode/intelligence/patterns/` (directorio vacío).

### Precisión

5. [x] Cero valores crudos de diseño: todo color/espaciado/radio/borde/sombra/tipografía es `var(--...)` de `theme.css`.
6. [x] Cero léxico vago: sin "moderno/premium/limpio/intuitivo/elegante/mejorar espaciado". Todo traducido a instrucción medible.
7. [x] Todo requisito lleva etiqueta `[MUST]`/`[SHOULD]`/`[MAY]`. La acción principal es exactamente una (abrir detalle) y es `[MUST]`.
8. [x] El layout tiene medidas: 4 columnas (desktop), 2 columnas (móvil), gaps en tokens, anchos en tokens o px. Para ambos viewports.

### Estados e interacción

9. [x] Cada componente interactivo especifica hover, focus-visible, active y disabled (o "No aplica"): MediaCard, botón "+", chips, búsqueda, favorito, slide-over, modal.
10. [x] La pantalla especifica vacío, carga, error y búsqueda sin resultados con contenido exacto.
11. [x] Sección 14: cada acción secundaria declara su independencia de la principal.
12. [x] Sección 12: orden de tab numerado y semántica Enter/Space por elemento con roles nativos.
13. [x] Sección 13: nombres accesibles exactos con plantilla para contenido dinámico y aria-* requeridos.

### Verificabilidad

14. [x] Cada criterio de aceptación (sección 18) es comprobable por test Playwright, auditoría o observación binaria en captura.
15. [x] Los cubren: acción principal, independencia de secundarias, teclado, focus visible y estados de pantalla.
16. [x] Sección 19 enumera 18 interpretaciones prohibidas, todas trazables a `design-tokens.md`/`brand-brief.md`/`ux-flow.md`.
17. [x] Accesibilidad `[MUST]`: contraste, targets ≥44px, un solo H1, focus visible, prefers-reduced-motion.
18. [x] Fixtures realistas: 12 ítems del dominio real, con imágenes reales (portadas de Open Library, TMDB, etc.), mezcla de tipos/estados/ratings.

### Craft (reference/craft.md)

19. [x] MediaCard tiene anatomía de slots (media/body/footer), título con line-clamp-1 + min-height, footer siempre presente, alturas iguales por fila (flex-grow en body + h-full en grid item).
20. [x] Contención declarada: `::after` del enlace se ancla con `inset: 0` dentro de la card (position relative en article). Nada sobresale. Botones favorito y `…` con z-index > 1 (misma posición en todas las instancias).
21. [x] Ritmo 8pt vía `var(--space-*)`: gap intra-card `var(--space-1)`, gap card-card `var(--space-4)`, gap sección-sección `var(--space-4)` o mayor. Mínimos de respiración declarados.
22. [x] Proporción de color 60/30/10 alcanzable: superficies neutras (~60%), superficies secundarias/bordes (~30%), acento copper + badges semánticos (~10%). Portadas como portadores de color del dominio.
23. [x] Los criterios de aceptación de craft (contención, consistencia ±2px, alturas por fila, ritmo, color) están en la sección 18.

## Enmiendas

### v2 — iteración 1 (2026-07-19)

**D1.1 — Footer en MediaCard (Crítica)**
- Directiva: Añadir footer con botón estrella (izq, `aria-pressed`) y botón `…` (der, `MoreHorizontal`), z-index superior al `::after`. Severidad: Crítica.
- Cambio de spec: Sección 7 (MediaCard) — se reforzó la descripción del footer con "renderizado condicional prohibido" [MUST] y se añadió el fallback de portada. Sección 14 — el HTML del footer ya existía, se mantuvo. Sección 8 — tokens de footer ya existían, se mantuvieron.
- Petición a frontend_engineer: Asegurar que el componente MediaCard renderiza `<footer class="media-card__footer">` con `position: relative; z-index: 2`, conteniendo botón estrella (`aria-pressed`) y botón `…` (`MoreHorizontal`). El `::after` del enlace debe tener `z-index: 1`.
- Criterios de aceptación añadidos: 6 ítems nuevos en sección 18 "Footer de MediaCard (D1.1)".

**D1.2 — Fallback de portada rota (Alta)**
- Directiva: Implementar fallback visual para portadas rotas/ausentes con `onError` en `<img>`. Severidad: Alta.
- Cambio de spec: Sección 7 (MediaCard slots) — añadido comportamiento de fallback: si `onError` o `src` null/vacío → div con fondo `var(--color-neutral-200)`, `var(--radius-lg)`, icono del tipo centrado 32px `var(--color-neutral-400)`. Sección 10 (Imágenes) — añadida subsección "Fallback on error [MUST]" con mapeo completo tipo→icono. Sección 10 (Iconografía) — añadidos iconos de fallback por tipo.
- Petición a frontend_engineer: Implementar `onError` handler en el `<img>` de MediaCard que cambie a un `div` placeholder con el icono del tipo de contenido. Aplicar a todos los tipos: `BookOpen` (book/manga/comic/other), `Film` (film), `Tv` (series), `Headphones` (audiobook), `Mic` (podcast), `GraduationCap` (course), `Newspaper` (magazine), `Clapperboard` (documentary).
- Criterios de aceptación añadidos: 4 ítems nuevos en sección 18 "Fallback de portada rota (D1.2)".

**D1.3 — Filtros scroll horizontal en móvil (Alta)**
- Directiva: Chips de filtro en `flex-wrap: nowrap` + `overflow-x: auto` + `scroll-snap-type: x proximity` en móvil. Severidad: Alta.
- Cambio de spec: Sección 5 (Layout móvil) — filter bar reescrita con `flex-wrap: nowrap` [MUST], `scroll-padding-inline`, scrollbar oculto. Sección 6 (Responsive) — reforzado: "flex-wrap: nowrap + overflow-x: auto + scroll-snap-type: x proximity en móvil, sin apilamiento vertical [MUST]". Sección 7 (FilterChips) — componente actualizado: desktop wrap, móvil nowrap [MUST].
- Petición a frontend_engineer: En el componente FilterChips, aplicar `flex-wrap: nowrap` + `overflow-x: auto` + `scroll-snap-type: x proximity` cuando el viewport es <640px. Añadir `scrollbar-width: none` y `::-webkit-scrollbar { display: none }`.
- Criterios de aceptación añadidos: 4 ítems nuevos en sección 18 "Filtros scroll horizontal en móvil (D1.3)".

**D1.4 — Eliminar buscador redundante en desktop (Media)**
- Directiva: Mantener UN solo buscador visible en desktop. Severidad: Media.
- Cambio de spec: Sección 5 (Layout desktop) — añadida subsección "Buscador único [MUST]" con regla: cuando la ruta es `/`, el buscador del App Shell se oculta (`display: none`). Sección 6 (Responsive) — añadida regla "Buscador único en todos los breakpoints [MUST]".
- Petición a frontend_engineer: En el componente de layout/routing, cuando la ruta activa sea `/` (Biblioteca), aplicar `display: none` al buscador del App Shell. Alternativamente, eliminar el buscador de la página Biblioteca y usar solo el del App Shell — en cualquier caso, exactamente 1 input visible.
- Criterios de aceptación añadidos: 2 ítems nuevos en sección 18 "Buscador único en desktop (D1.4)".

**D1.5 — Botón "+" y bottom tabs en móvil (Alta)**
- Directiva: Botón "+" visible en cabecera móvil (44×44px), bottom tab bar con 3 tabs completos. Severidad: Alta.
- Cambio de spec: Sección 5 (Layout móvil) — botón "+" reforzado como "siempre visible [MUST]" con tamaño táctil 44×44px. Añadida sección completa "Bottom tab bar [MUST]" con especificación de 3 tabs (Biblioteca, Colecciones, Listas), iconos, alto 48px, distribución equidistante, separador. Sección 6 (Responsive) — tab bar reforzada: "requiere que los 3 tabs estén presentes (no 2)".
- Petición a frontend_engineer: (1) Asegurar que el botón "+" es visible en el header móvil con hit area ≥44×44px. (2) En el App Shell para <640px, renderizar bottom tab bar con 3 tabs: Biblioteca (`BookOpen`), Colecciones (`Folder`), Listas (`List`). Cada tab con icono 24px + label `--text-xs`, alto 48px, `flex: 1`.
- Criterios de aceptación añadidos: 4 ítems nuevos en sección 18 "Botón '+' y bottom tabs en móvil (D1.5)".
