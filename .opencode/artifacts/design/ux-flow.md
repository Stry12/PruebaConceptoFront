# UX Flow — MediaVault (Biblioteca Multimedia Personal)

> **Fase 3** · ui_designer · 2026-07-19
> Contratos de entrada: `domain.md`, `design/discovery.md`, `design/brand-brief.md`, `design/color-system.md`, `design/design-tokens.md`, `design/theme.css`
> Configuración: `.opencode/design-quality.config.json` (modoGeneracion: `frontend-directo`, pantallaFirma: `auto`)

---

## 1. Clasificación y estructura firma

### Objeto central

El **MediaItem** — específicamente, su portada visual y metadatos ricos. El usuario mira su colección de contenido (portadas de libros, carteles de películas, thumbnails de series) el 80% del tiempo. La entidad MediaItem es el nodo de toda la experiencia.

### Arquetipo primario: **Biblioteca de contenido / medios** (Arquetipo 3)

> "Objeto central: la portada/artwork. Esqueleto: estanterías de scroll horizontal por colección, grid de portadas grandes, browsing visual; la navegación puede ser mínima (tabs/topbar)."
> — `archetypes.md`

**Justificación:** MediaVault es literalmente un catálogo personal de contenido multimedia. El usuario navega por portadas, filtra por tipo/estado/género, y abre fichas de detalle. La experiencia visual es idéntica a Letterboxd, Apple Books o Plex: el contenido es la interfaz.

**Excepción:** Las pantallas de configuración (gestión de categorías/etiquetas) e importación masiva se clasifican como **Arquetipo 1 (Registros/CRUD)** por su rol funcional, pero mantienen la estética del arquetipo 3 (sin stat-cards, sin dashboard feel).

### Referentes del dominio

| Referente | Qué se toma | Qué se rechaza |
|---|---|---|
| **Letterboxd** | El tracker como identidad personal. Catálogo visual con metadatos ricos. El "rating" como expresión de gusto. | El componente social (feeds, seguidores). MediaVault es privado. |
| **Apple Books (biblioteca)** | La reverencia por las portadas como protagonista. La sensación de "mi colección". | El vendor lock-in. MediaVault organiza, no vende. |
| **Plex** | Browsing visual multi-tipo en una sola interfaz. Carátolas como unidad visual. | La complejidad de media server. MediaVault es catálogo, no reproductor. |
| **Spotify (biblioteca)** | Organización por listas y colecciones. La sensación de "mi música". | El algoritmo y la descubrimiento social. MediaVault es estático/intencional. |

### Decisión de layout memorable

> **Portadas a sangre con browsing por estanterías temáticas; navegación mínima tipo tabs sin sidebar de admin, sin stat-cards, sin tablas como vista principal. Las portadas son la materia visual — la interfaz es la estantería que las exhibe.**

Esto **prohíbe explícitamente:**
- Sidebar de administración con menú extenso (navegación = topbar + tabs bottom en móvil)
- Fila de stat-cards en la pantalla principal
- Tabla densa como vista de la biblioteca (la tabla es herramienta auxiliar, solo en config/admin)
- Fondo crema/beige (AP-2 resuelto por color_strategist)
- Ilustraciones decorativas en empty states (P-9)

---

## 2. Estructura de navegación

```
App Shell
├─ Top Bar
│   ├─ [izquierda] Logo / nombre "MediaVault"
│   ├─ [centro] Barra de búsqueda (expandible)
│   ├─ [derecha] Toggle modo oscuro · Avatar/menú de usuario
│
├─ Navegación principal
│   ├─ Desktop: barra de tabs horizontal bajo el top bar (o integrada)
│   │   ├─ Biblioteca (tab activa por defecto)
│   │   ├─ Colecciones
│   │   └─ Listas
│   │
│   └─ Móvil: bottom tab bar (3 tabs: Biblioteca, Colecciones, Listas)
│
├─ Rutas
│   ├─ /                  → Biblioteca (grid principal)
│   ├─ /item/:id          → Detalle de ítem
│   ├─ /colecciones       → Colecciones (overview)
│   ├─ /colecciones/:id   → Detalle de colección
│   ├─ /listas            → Listas (overview)
│   ├─ /listas/:id        → Detalle de lista
│   ├─ /configuracion     → Configuración (categorías, etiquetas, cuenta)
│   └─ /importacion       → Importación masiva (solo admin)
│
└─ Menú de usuario (dropdown desde avatar)
    ├─ Configuración → /configuracion
    ├─ Importación (solo si role=admin) → /importacion
    └─ Cerrar sesión
```

**Nota sobre navegación:** Se usa tab bar horizontal (desktop) y bottom tabs (móvil) en lugar de sidebar, siguiendo el arquetipo 3 ("la navegación puede ser mínima (tabs/topbar)"). Las pantallas de configuración e importación se acceden desde el menú de usuario, no como tabs principales — son secundarias y no deben competir con el browsing visual.

---

## 3. Inventario de pantallas y sub-pantallas

### 3A. Pantallas principales (rutas)

| # | Slug | Nombre | Ruta | Arquetipo | Registro | Propósito | Componentes clave | Entidad dominio |
|---|------|--------|------|-----------|----------|-----------|-------------------|-----------------|
| 1 | `biblioteca` | Biblioteca | `/` | Biblioteca de contenido | producto | Grid visual de todos los ítems. La pantalla donde el usuario pasa el 80% de su tiempo. Búsqueda, filtros, browsing por portadas. | MediaCard, FilterChips, SearchBar, StatusBadge, MediaTypeBadge, RatingStars, EmptyState, SkeletonLoader | MediaItem |
| 2 | `item-detalle` | Detalle de Ítem | `/item/:id` | Biblioteca de contenido (ficha) | producto | Vista completa de un ítem: portada grande, todos los metadatos, calificación, notas, acciones (editar, favorito, cambiar estado, agregar a colección/lista). | MediaDetailHeader, MetadataList, RatingStars, NotesEditor, ActionMenu | MediaItem |
| 3 | `colecciones` | Colecciones | `/colecciones` | Biblioteca de contenido | producto | Overview visual de todas las colecciones del usuario. Cada colección se muestra como card con mosaico de portadas, nombre y conteo. | CollectionCard (cover mosaic), EmptyState | Collection |
| 4 | `coleccion-detalle` | Detalle de Colección | `/colecciones/:id` | Biblioteca de contenido | producto | Todos los ítems de una colección en grid visual, con nombre/descripción de la colección como header. | MediaCard, CollectionHeader, EmptyState | Collection + MediaItem |
| 5 | `listas` | Listas | `/listas` | Biblioteca de contenido | producto | Overview de todas las listas ordenadas del usuario. Cards con nombre, descripción, itemCount y preview de portadas. | ListCard, EmptyState | List |
| 6 | `lista-detalle` | Detalle de Lista | `/listas/:id` | Biblioteca de contenido (lista ordenada) | producto | Ítems de una lista en posición explícita (numerada/ordenada), con posibilidad de reordenar. | MediaCard (ordered), ListHeader, DragHandle, EmptyState | List + ListItem + MediaItem |
| 7 | `configuracion` | Configuración | `/configuracion` | Registros/CRUD | producto | Gestión de categorías, etiquetas y configuración de cuenta. Sección por sección. | TagInput, CategoryList, AccountForm | Category, Tag, User |
| 8 | `importacion` | Importación Masiva | `/importacion` | Registros/CRUD | producto | Upload de archivo CSV/Excel, preview de datos, detección de duplicados, confirmación y progreso de importación. Solo visible para admins. | FileUpload, PreviewTable, DuplicateWarning, ProgressBar, ImportSummary | BulkImport |

### 3B. Sub-pantallas derivadas

Cada sub-pantalla es un componente con diseño propio. Las que aparecen en múltiples pantallas padre se marcan con "reutiliza" — comparten el mismo componente visual pero se inventarian una vez como diseño único.

#### Derivadas de Biblioteca (`/`)

| Sub-# | Slug | Tipo | Nombre | Pantalla padre | Propósito | Componentes clave | Entidad dominio |
|--------|------|------|--------|----------------|-----------|-------------------|-----------------|
| 1.1 | `slide-nuevo-item` | slide-over | Nuevo ítem | Biblioteca | Formulario completo de creación de MediaItem. Se abre desde el botón "+" en el header o FAB. | MediaItemForm (campos: title, type, creator, genre, category, tags, platform, sourceUrl, status, notes, coverImage), ValidationInline, CoverUpload | MediaItem |
| 1.2 | `slide-editar-item` | slide-over | Editar ítem | Biblioteca, Detalle de Ítem | Formulario pre-rellenado con los datos del ítem existente. Mismo componente que 1.1 en modo edición. **Reutilizado desde Detalle de Ítem.** | MediaItemForm (pre-rellenado), ValidationInline, CoverUpload | MediaItem |
| 1.3 | `modal-agregar-item-a-coleccion` | modal | Agregar a colección | Biblioteca, Detalle de Ítem | Picker de colecciones existentes para agregar ESTE ítem. Incluye opción "Crear nueva colección" inline. **Reutilizado desde Detalle de Ítem.** | CollectionPickerList, CollectionQuickCreate, CheckmarkExistente, SearchFilter | Collection + MediaItem |
| 1.4 | `modal-agregar-item-a-lista` | modal | Agregar a lista | Biblioteca, Detalle de Ítem | Picker de listas existentes para agregar ESTE ítem. Incluye selector de posición opcional. **Reutilizado desde Detalle de Ítem.** | ListPickerList, PositionSelector (opcional), SearchFilter | List + ListItem + MediaItem |
| 1.5 | `modal-confirmar-eliminar-item` | modal | Confirmar eliminar ítem | Biblioteca, Detalle de Ítem | Diálogo de confirmación con advertencia de pérdida permanente. **Reutilizado desde Detalle de Ítem.** | ConfirmationMessage, WarningText, DangerButton, CancelButton | MediaItem |

#### Derivadas de Detalle de Ítem (`/item/:id`)

No genera sub-pantallas nuevas — las 4 interacciones (editar, agregar a colección, agregar a lista, eliminar) reutilizan los componentes 1.2, 1.3, 1.4 y 1.5 inventariados arriba.

#### Derivadas de Colecciones (`/colecciones`)

| Sub-# | Slug | Tipo | Nombre | Pantalla padre | Propósito | Componentes clave | Entidad dominio |
|--------|------|------|--------|----------------|-----------|-------------------|-----------------|
| 3.1 | `modal-crear-coleccion` | modal | Crear colección | Colecciones | Formulario con nombre (requerido) + descripción (opcional). | TextInput (nombre, requerido), TextArea (descripción), CreateButton, ValidationInline | Collection |
| 3.2 | `modal-confirmar-eliminar-coleccion` | modal | Confirmar eliminar colección | Colecciones, Detalle de Colección | Diálogo de confirmación. Avisa que los ítems NO se eliminan, solo se desvinculan de la colección. **Reutilizado desde Detalle de Colección.** | ConfirmationMessage, InfoText ("Los ítems no se eliminarán"), DangerButton, CancelButton | Collection |

#### Derivadas de Detalle de Colección (`/colecciones/:id`)

| Sub-# | Slug | Tipo | Nombre | Pantalla padre | Propósito | Componentes clave | Entidad dominio |
|--------|------|------|--------|----------------|-----------|-------------------|-----------------|
| 4.1 | `modal-editar-coleccion` | modal | Editar colección | Detalle de Colección | Formulario pre-rellenado con nombre + descripción de la colección. | TextInput (nombre, requerido), TextArea (descripción), SaveButton, ValidationInline | Collection |
| 4.2 | `modal-agregar-item-al-coleccion` | modal | Agregar ítem a colección | Detalle de Colección | Picker de items de la biblioteca para agregar a ESTA colección. Búsqueda + grid de portadas con checkbox. **Diferente de 1.3** — aquí se elige el ítem fuente, no la colección destino. | ItemPickerGrid, SearchFilter, MediaCard (mini, selectable), SelectedCount, AddButton | MediaItem + Collection |
| 4.3 | `modal-quitar-item-de-coleccion` | modal | Quitar ítem de colección | Detalle de Colección | Confirmación inline al quitar un ítem de la colección (desde ícono "X" en la card). | ConfirmationMessage, DangerButton, CancelButton | CollectionItem |

#### Derivadas de Listas (`/listas`)

| Sub-# | Slug | Tipo | Nombre | Pantalla padre | Propósito | Componentes clave | Entidad dominio |
|--------|------|------|--------|----------------|-----------|-------------------|-----------------|
| 5.1 | `modal-crear-lista` | modal | Crear lista | Listas | Formulario con nombre (requerido) + descripción (opcional). | TextInput (nombre, requerido), TextArea (descripción), CreateButton, ValidationInline | List |
| 5.2 | `modal-confirmar-eliminar-lista` | modal | Confirmar eliminar lista | Listas, Detalle de Lista | Diálogo de confirmación. Avisa que los ítems NO se eliminan, solo se desvinculan de la lista. **Reutilizado desde Detalle de Lista.** | ConfirmationMessage, InfoText ("Los ítems no se eliminarán"), DangerButton, CancelButton | List |

#### Derivadas de Detalle de Lista (`/listas/:id`)

| Sub-# | Slug | Tipo | Nombre | Pantalla padre | Propósito | Componentes clave | Entidad dominio |
|--------|------|------|--------|----------------|-----------|-------------------|-----------------|
| 6.1 | `modal-editar-lista` | modal | Editar lista | Detalle de Lista | Formulario pre-rellenado con nombre + descripción de la lista. | TextInput (nombre, requerido), TextArea (descripción), SaveButton, ValidationInline | List |
| 6.2 | `modal-agregar-item-a-lista` | modal | Agregar ítem a lista | Detalle de Lista | Picker de items de la biblioteca para agregar a ESTA lista. Incluye selector de posición. **Diferente de 1.4** — aquí se elige el ítem fuente, no la lista destino. | ItemPickerGrid, SearchFilter, MediaCard (mini, selectable), PositionSelector, AddButton | ListItem + MediaItem |
| 6.3 | `modal-quitar-item-de-lista` | modal | Quitar ítem de lista | Detalle de Lista | Confirmación inline al quitar un ítem de la lista (desde ícono "X"). | ConfirmationMessage, DangerButton, CancelButton | ListItem |
| 6.4 | `feedback-drag-reorder` | feedback | Reordenar ítems | Detalle de Lista | Indicador visual de drag & drop: handle arrastrable, línea de inserción, preview fantasma del ítembeing movido. Feedback de posición actual. | DragHandle, DropIndicator (línea), DragGhost (preview semitransparente), PositionBadge | ListItem |

#### Derivadas de Configuración (`/configuracion`)

| Sub-# | Slug | Tipo | Nombre | Pantalla padre | Propósito | Componentes clave | Entidad dominio |
|--------|------|------|--------|----------------|-----------|-------------------|-----------------|
| 7.1 | `inline-crear-categoria` | inline | Crear categoría | Configuración | Input inline con botón de confirmar. Aparece al final de la lista de categorías. | TextInput (nombre), ConfirmButton, CancelButton | Category |
| 7.2 | `inline-crear-etiqueta` | inline | Crear etiqueta | Configuración | Input inline con botón de confirmar. Aparece al final de la lista de etiquetas. | TextInput (nombre), ConfirmButton, CancelButton | Tag |
| 7.3 | `modal-confirmar-eliminar-categoria-etiqueta` | modal | Confirmar eliminar categoría/etiqueta | Configuración | Diálogo de confirmación. Si la categoría/etiqueta tiene items asociados, muestra aviso y opciones (mover a otra categoría / eliminar etiqueta de items). | ConfirmationMessage, AssociatedItemsWarning, ActionOptions (mover/eliminar), DangerButton, CancelButton | Category, Tag |
| 7.4 | `modal-cambiar-contraseña` | modal | Cambiar contraseña | Configuración | Formulario con contraseña actual + nueva contraseña + confirmación. | PasswordInput (actual), PasswordInput (nueva), PasswordInput (confirmar), ValidationInline, SaveButton | User |

#### Derivadas de Importación (`/importacion`)

| Sub-# | Slug | Tipo | Nombre | Pantalla padre | Propósito | Componentes clave | Entidad dominio |
|--------|------|------|--------|----------------|-----------|-------------------|-----------------|
| 8.1 | `importacion-preview` | vista | Preview de importación | Importación | Tabla con los datos parseados del archivo. Columnas mapeadas, duplicados resaltados, errores de formato marcados. Checkbox por fila para deselectar. | PreviewTable (columnas dinámicas), DuplicateHighlight, FormatErrorMarker, RowCheckbox, SelectAllToggle, ImportButton | BulkImport + MediaItem |
| 8.2 | `modal-confirmar-importacion` | modal | Confirmar importación | Importación | Resumen antes de ejecutar: N items nuevos, M duplicados a omitir, K con errores. Confirmación final. | SummaryStats (nuevos/duplicados/errores), DuplicateList, ConfirmButton, CancelButton | BulkImport |
| 8.3 | `importacion-progreso` | vista | Procesando importación | Importación | Barra de progreso animada + texto "Importando... X de N". Se muestra durante el procesamiento. | ProgressBar (animada), ProgressText ("X de N"), StatusIcon (spinner) | BulkImport |
| 8.4 | `importacion-resultado` | vista | Resultado de importación | Importación | Tres estados: **exitoso** ("Se importaron X items"), **parcial** ("X importados, Y fallidos" + detalle), **fallido** ("La importación falló" + detalle + reintentar). Comparten layout base con contenido dinámico. | ResultHeader (icono + título), StatsRow (importados/fallidos/duplicados), ErrorDetailList (expandible), ActionLink ("Ver en Biblioteca"), RetryButton | BulkImport |

#### Transversales (aparecen en múltiples pantallas)

| Sub-# | Slug | Tipo | Nombre | Pantallas padre | Propósito | Componentes clave | Entidad dominio |
|--------|------|------|--------|-----------------|-----------|-------------------|-----------------|
| T.1 | `toast-exito` | toast | Toast de éxito | Todas (post-acción) | Confirmación efímera de acción exitosa. Se auto-cierra en ~3s. Posición: top-right (desktop) / top-center (móvil). | ToastContainer, SuccessIcon, MessageText, DismissButton | — |
| T.2 | `toast-error` | toast | Toast de error | Todas (post-error) | Notificación de error. Se auto-cierra en ~5s (más lento que éxito para dar tiempo a leer). Posición: top-right / top-center. | ToastContainer, ErrorIcon, MessageText, DismissButton, RetryAction (opcional) | — |
| T.3 | `toggle-modo-oscuro` | toggle | Modo oscuro | Top Bar (todas las pantallas) | Toggle en el top bar para alternar entre tema claro y oscuro. | ThemeToggle (icono sol/luna), TransitionCSS | — |

### Resumen de conteo

| Categoría | Cantidad |
|-----------|----------|
| Pantallas principales (rutas) | 8 |
| Sub-pantallas de Biblioteca | 5 |
| Sub-pantallas de Colecciones | 2 |
| Sub-pantallas de Detalle de Colección | 3 |
| Sub-pantallas de Listas | 2 |
| Sub-pantallas de Detalle de Lista | 4 |
| Sub-pantallas de Configuración | 4 |
| Sub-pantallas de Importación | 4 |
| Sub-pantallas transversales | 3 |
| **Total sub-pantallas** | **27** |
| **Total pantallas + sub-pantallas** | **35** |

**Nota:** Detalle de Ítem no genera sub-pantallas propias — sus 4 interacciones reutilizan los componentes 1.2–1.5 de Biblioteca.

---

## 4. Jerarquía de información por pantalla

### 4.1 Biblioteca (`/`)

1. **Primario (primer viewport):** Grid de portadas — las tarjetas visuales de cada MediaItem dominan la pantalla. La portada es lo primero que se ve.
2. **Secundario (encima del grid, siempre visible):** Chips de filtro (tipo de contenido, estado de consumo) + barra de búsqueda. Permiten reducir el conjunto sin perder la vista del grid.
3. **Terciario (por tarjeta):** Título del ítem (truncado) → autor/creador → pills de tipo y estado → rating estrellas. Todo debajo de la portada.
4. **Accesoria (periférica):** Navegación por tabs (Biblioteca | Colecciones | Listas). Toggle de modo oscuro. Menú de usuario.

#### 1.1 — Slide-over "Nuevo ítem"

1. **Primario:** Título del formulario ("Nuevo ítem") + botón cerrar (X).
2. **Secundario:** Campo título (requerido, autofocus) + portada (upload con preview).
3. **Terciario:** Campos de metadatos — tipo (select), creador, género, categoría (select), etiquetas (multi-select/creación inline), plataforma, fuente URL.
4. **Accesoria:** Campo estado (select) + notas (textarea) + botón "Guardar" fijo al fondo.

#### 1.2 — Slide-over "Editar ítem"

> Misma jerarquía que 1.1. Todos los campos pre-rellenados con los valores actuales del ítem.

#### 1.3 — Modal "Agregar a colección"

1. **Primario:** Título ("Agregar a colección") + campo de búsqueda de colecciones.
2. **Secundario:** Lista de colecciones existentes — cada una muestra mosaico mini + nombre + conteo + checkmark si el ítem ya pertenece.
3. **Terciario:** Opción "Crear nueva colección" (expandible inline).
4. **Accesoria:** Botón cerrar.

#### 1.4 — Modal "Agregar a lista"

1. **Primario:** Título ("Agregar a lista") + campo de búsqueda de listas.
2. **Secundario:** Lista de listas existentes — nombre + itemCount + checkmark si ya contiene el ítem.
3. **Terciario:** Selector de posición (opcional, solo si la lista es ordenada).
4. **Accesoria:** Botón cerrar.

#### 1.5 — Modal "Confirmar eliminar ítem"

1. **Primario:** Icono de advertencia + título ("¿Eliminar este ítem?").
2. **Secundario:** Mensaje: "Esta acción no se puede deshacer. El ítem se eliminará permanentemente de tu biblioteca."
3. **Terciario:** Nombre del ítem a eliminar (contexto).
4. **Accesoria:** Botón "Cancelar" + botón "Eliminar" (peligro).

### 4.2 Detalle de Ítem (`/item/:id`)

1. **Primario:** Portada grande del ítem + título (serif, display) + autor/creador.
2. **Secundario:** Todos los metadatos organizados: tipo, género, categoría, etiquetas, plataforma, fuente, fechas (agregado, consumido), estado de consumo.
3. **Terciario:** Calificación estrellas editable + notas personales (expandible).
4. **Accesoria:** Acciones — editar, marcar favorito, cambiar estado, agregar a colección, agregar a lista, eliminar.

### 4.3 Colecciones (`/colecciones`)

1. **Primario:** Grid de cards de colección — cada card muestra un mosaico de portadas (2-4 portadas representativas), nombre de la colección y conteo de ítems.
2. **Secundario:** Botón "Crear colección" (acción principal de la página).
3. **Terciario:** Descripción de la colección (truncada en la card, completa en detalle).

#### 3.1 — Modal "Crear colección"

1. **Primario:** Título ("Crear colección") + campo nombre (requerido, autofocus).
2. **Secundario:** Campo descripción (textarea, opcional).
3. **Accesoria:** Botón "Crear" + botón cancelar.

#### 3.2 — Modal "Confirmar eliminar colección"

1. **Primario:** Icono de advertencia + título ("¿Eliminar esta colección?").
2. **Secundario:** Mensaje: "Los ítems de esta colección no se eliminarán. Solo se quitarán de la colección."
3. **Terciario:** Nombre de la colección (contexto).
4. **Accesoria:** Botón "Cancelar" + botón "Eliminar colección" (peligro).

### 4.4 Detalle de Colección (`/colecciones/:id`)

1. **Primario:** Header con nombre de colección (serif, display), descripción y itemCount. Debajo: grid de portadas de los ítems de la colección.
2. **Secundario:** Chips de filtro dentro de la colección (tipo, estado).
3. **Terciario:** Acciones — editar colección, eliminar colección.

#### 4.1 — Modal "Editar colección"

1. **Primario:** Título ("Editar colección") + campo nombre (requerido, pre-rellenado).
2. **Secundario:** Campo descripción (textarea, pre-rellenado).
3. **Accesoria:** Botón "Guardar" + botón cancelar.

#### 4.2 — Modal "Agregar ítem a colección"

1. **Primario:** Título ("Agregar ítem a {nombre_colección}") + campo de búsqueda de items.
2. **Secundario:** Grid de portadas de la biblioteca — cada ítem muestra portada + título + checkmark si ya pertenece a la colección. Selección múltiple.
3. **Terciario:** Contador de seleccionados + botón "Agregar N items".
4. **Accesoria:** Botón cerrar.

#### 4.3 — Confirmación "Quitar ítem de colección"

1. **Primario:** Mensaje inline: "¿Quitar {título} de esta colección?"
2. **Secundario:** Texto aclaratorio: "El ítem no se eliminará de tu biblioteca."
3. **Accesoria:** Botón "Quitar" (peligro) + botón "Cancelar".

### 4.5 Listas (`/listas`)

1. **Primario:** Grid de cards de lista — cada card muestra nombre, descripción corta, itemCount y un preview lineal de portadas (3-5 en fila).
2. **Secundario:** Botón "Crear lista".
3. **Terciario:** Fecha de creación.

#### 5.1 — Modal "Crear lista"

1. **Primario:** Título ("Crear lista") + campo nombre (requerido, autofocus).
2. **Secundario:** Campo descripción (textarea, opcional).
3. **Accesoria:** Botón "Crear" + botón cancelar.

#### 5.2 — Modal "Confirmar eliminar lista"

1. **Primario:** Icono de advertencia + título ("¿Eliminar esta lista?").
2. **Secundario:** Mensaje: "Los ítems de esta lista no se eliminarán. Solo se quitarán de la lista."
3. **Terciario:** Nombre de la lista (contexto).
4. **Accesoria:** Botón "Cancelar" + botón "Eliminar lista" (peligro).

### 4.6 Detalle de Lista (`/listas/:id`)

1. **Primario:** Header con nombre de lista y descripción. Lista ordenada de ítems con número de posición, portada, título, autor.
2. **Secundario:** Acciones de reordenar (drag handle), editar, eliminar ítem de la lista.
3. **Terciario:** Botón "Agregar ítem" a la lista.

#### 6.1 — Modal "Editar lista"

1. **Primario:** Título ("Editar lista") + campo nombre (requerido, pre-rellenado).
2. **Secundario:** Campo descripción (textarea, pre-rellenado).
3. **Accesoria:** Botón "Guardar" + botón cancelar.

#### 6.2 — Modal "Agregar ítem a lista"

1. **Primario:** Título ("Agregar ítem a {nombre_lista}") + campo de búsqueda de items.
2. **Secundario:** Grid de portadas de la biblioteca — cada ítem muestra portada + título + checkmark si ya está en la lista. Selección múltiple.
3. **Terciario:** Selector de posición (por defecto: al final). Contador de seleccionados.
4. **Accesoria:** Botón "Agregar N items" + botón cerrar.

#### 6.3 — Confirmación "Quitar ítem de lista"

1. **Primario:** Mensaje inline: "¿Quitar {título} de esta lista?"
2. **Secundario:** Texto aclaratorio: "El ítem no se eliminará de tu biblioteca."
3. **Accesoria:** Botón "Quitar" (peligro) + botón "Cancelar".

#### 6.4 — Indicador de drag & drop (reordenamiento)

1. **Primario:** Handle de arrastre (⠿ o ⋮⋮) visible en cada fila.
2. **Secundario:** Durante el arrastre: línea indicadora de posición de inserción + ghost/preview semitransparente del ítembeing movido.
3. **Terciario:** Badge de posición actual (número) que se actualiza en tiempo real.
4. **Accesoria:** Feedback de drop exitoso (animación sutil de asentamiento).

### 4.7 Configuración (`/configuracion`)

1. **Primario:** Secciones en acordeón o tabs: Categorías, Etiquetas, Cuenta.
2. **Secundario:** Lista de categorías/etiquetas existentes con acciones de editar/eliminar inline.
3. **Terciario:** Formulario de cuenta (nombre, email, contraseña). Toggle de tema.

#### 7.1 — Input inline "Crear categoría"

1. **Primario:** Campo de texto (autofocus) + botón confirmar (checkmark).
2. **Secundario:** Botón cancelar (X).
3. **Terciario:** Feedback de validación inline (nombre duplicado, vacío).

#### 7.2 — Input inline "Crear etiqueta"

1. **Primario:** Campo de texto (autofocus) + botón confirmar (checkmark).
2. **Secundario:** Botón cancelar (X).
3. **Terciario:** Feedback de validación inline.

#### 7.3 — Modal "Confirmar eliminar categoría/etiqueta"

1. **Primario:** Icono de advertencia + título ("¿Eliminar esta {categoría/etiqueta}?").
2. **Secundario:** Si tiene items asociados: "Hay N items con esta {categoría/etiqueta}. Se les quitará al eliminar." + opciones: "Mover a otra categoría" (si aplica) / "Solo quitar la {etiqueta}".
3. **Accesoria:** Botón "Cancelar" + botón "Eliminar" (peligro).

#### 7.4 — Modal "Cambiar contraseña"

1. **Primario:** Título ("Cambiar contraseña") + campo contraseña actual (requerido).
2. **Secundario:** Campo nueva contraseña (requerido) + campo confirmar nueva contraseña (requerido).
3. **Terciario:** Indicadores de fortaleza de contraseña + validación de coincidencia.
4. **Accesoria:** Botón "Actualizar contraseña" + botón cancelar.

### 4.8 Importación Masiva (`/importacion`)

1. **Primario:** Zona de upload de archivo (drag & drop o selector).
2. **Secundario:** Preview de los datos parseados (tabla con columnas del CSV) + indicadores de duplicados detectados.
3. **Terciario:** Botón "Confirmar importación" + barra de progreso + resumen de resultados (importados, fallidos, duplicados omitidos).

#### 8.1 — Preview de importación (vista)

1. **Primario:** Tabla con datos parseados — columnas dinámicas según el mapeo del CSV. Cada fila = un MediaItem candidato.
2. **Secundario:** Fila resaltada si es duplicado (mismo título + userId). Marca de error si el formato no es válido. Checkbox de selección por fila.
3. **Terciario:** Estadísticas resumen: "N nuevos, M duplicados, K con errores". Toggle "Seleccionar todos".
4. **Accesoria:** Botón "Importar seleccionados".

#### 8.2 — Modal "Confirmar importación"

1. **Primario:** Título ("¿Importar estos items?") + resumen numérico.
2. **Secundario:** Desglose: "{N} items nuevos se agregarán a tu biblioteca. {M} duplicados serán omitidos. {K} items con errores serán ignorados."
3. **Terciario:** Lista expandible de duplicados (títulos duplicados).
4. **Accesoria:** Botón "Importar" + botón "Cancelar".

#### 8.3 — Barra de progreso de importación (vista)

1. **Primario:** Barra de progreso animada (porcentaje visual).
2. **Secundario:** Texto "Importando... {X} de {N}".
3. **Terciario:** Icono de spinner/activity.

#### 8.4 — Resultado de importación (vista, 3 estados)

1. **Primario (exitoso):** Icono de check + "Se importaron {N} items exitosamente."
2. **Primario (parcial):** Icono de advertencia + "{N} importados, {M} fallidos." + detalle expandible de errores.
3. **Primario (fallido):** Icono de error + "La importación falló." + detalle del error.
4. **Secundario (todos):** Estadísticas finales: importados, fallidos, duplicados omitidos.
5. **Accesoria:** Enlace "Ver en Biblioteca" (exitoso/parcial) / Botón "Reintentar" (fallido).

### 4.9 Transversales

#### T.1 — Toast de éxito

1. **Primario:** Icono de check (verde/success) + mensaje (ej. "Ítem agregado", "Colección creada", "Estado actualizado").
2. **Accesoria:** Botón dismiss (X) + auto-dismiss ~3s.

#### T.2 — Toast de error

1. **Primario:** Icono de error (rojo/danger) + mensaje descriptivo.
2. **Secundario:** Acción de retry (opcional, contextual).
3. **Accesoria:** Botón dismiss (X) + auto-dismiss ~5s.

#### T.3 — Toggle de modo oscuro

1. **Primario:** Icono (sol ☀ / luna 🌙) que refleja el estado actual.
2. **Accesoria:** Transición CSS suave al cambiar. Persiste en localStorage.

---

## 5. Árbol de estados por pantalla

### 5.1 Biblioteca (`/`)

```
<Biblioteca>
├─ Estado base: grid de portadas con datos, filtros activos visibles
├─ [caso-borde] Vacío: icono de librería + "Tu biblioteca está vacía" + CTA "Añadir tu primer ítem"
├─ [caso-borde] Carga: 8 skeleton cards con las mismas dimensiones que las reales
├─ [caso-borde] Error: mensaje de error + botón "Reintentar"
├─ [caso-borde] Búsqueda sin resultados: "No se encontraron resultados para '{query}'" + limpiar filtros
├─ [overlay] Agregar ítem: slide-over derecho con formulario completo de MediaItem → 1.1
├─ [overlay] Confirmar eliminar ítem: diálogo de confirmación inline → 1.5
└─ [overlay] Agregar a colección: picker modal con lista de colecciones + "Crear nueva" → 1.3
```

### 5.2 Detalle de Ítem (`/item/:id`)

```
<Detalle de Ítem>
├─ Estado base: ficha completa con portada, metadatos y acciones
├─ [caso-borde] Ítem no encontrado: "Este ítem no existe" + enlace volver a Biblioteca
├─ [caso-borde] Carga: skeleton de la ficha (portada placeholder + líneas de texto)
├─ [caso-borde] Error de carga: mensaje + reintentar
├─ [overlay] Editar ítem: slide-over con formulario (pre-rellenado) → 1.2
├─ [overlay] Agregar a colección: picker modal → 1.3
├─ [overlay] Agregar a lista: picker modal con opción de posición → 1.4
└─ [overlay] Confirmar eliminar: diálogo con advertencia → 1.5
```

### 5.3 Colecciones (`/colecciones`)

```
<Colecciones>
├─ Estado base: grid de cards de colección
├─ [caso-borde] Vacío: "Crea tu primera colección" + CTA
├─ [caso-borde] Carga: skeleton cards
├─ [overlay] Crear colección: modal con nombre (requerido) + descripción (opcional) → 3.1
└─ [overlay] Confirmar eliminar colección: diálogo → 3.2
```

### 5.4 Detalle de Colección (`/colecciones/:id`)

```
<Detalle de Colección>
├─ Estado base: header + grid de items de la colección
├─ [caso-borde] Colección vacía: "Esta colección está vacía" + CTA "Explorar biblioteca"
├─ [caso-borde] Carga: skeleton
├─ [caso-borde] Colección no encontrada: 404
├─ [overlay] Editar colección: modal con nombre + descripción → 4.1
├─ [overlay] Quitar ítem de colección: confirmación inline → 4.3
└─ [overlay] Agregar ítem: picker modal de items de la biblioteca → 4.2
```

### 5.5 Listas (`/listas`)

```
<Listas>
├─ Estado base: grid de cards de lista
├─ [caso-borde] Vacío: "Crea tu primera lista" + CTA
├─ [caso-borde] Carga: skeleton cards
├─ [overlay] Crear lista: modal con nombre (requerido) + descripción (opcional) → 5.1
└─ [overlay] Confirmar eliminar lista: diálogo → 5.2
```

### 5.6 Detalle de Lista (`/listas/:id`)

```
<Detalle de Lista>
├─ Estado base: header + lista ordenada de ítems con posición
├─ [caso-borde] Lista vacía: "Esta lista está vacía" + CTA "Agregar ítem"
├─ [caso-borde] Carga: skeleton
├─ [caso-borde] Lista no encontrada: 404
├─ [overlay] Editar lista: modal con nombre + descripción → 6.1
├─ [overlay] Agregar ítem: picker modal de la biblioteca → 6.2
├─ [overlay] Quitar ítem de lista: confirmación inline → 6.3
└─ [interacción] Reordenar: drag & drop con feedback visual de posición → 6.4
```

### 5.7 Configuración (`/configuracion`)

```
<Configuración>
├─ Estado base: secciones de categorías, etiquetas y cuenta
├─ [caso-borde] Error de guardado: toast de error + valores preservados
├─ [inline] Agregar categoría: input inline + botón confirmar → 7.1
├─ [inline] Agregar etiqueta: input inline + botón confirmar → 7.2
├─ [overlay] Confirmar eliminar categoría/etiqueta: diálogo (solo si tiene items asociados) → 7.3
└─ [overlay] Cambiar contraseña: modal con contraseña actual + nueva contraseña → 7.4
```

### 5.8 Importación Masiva (`/importacion`)

```
<Importación>
├─ Estado base: zona de upload
├─ [caso-borde] Archivo inválido: "El archivo no tiene el formato correcto" + formato esperado
├─ [caso-borde] Error de parsing: "No se pudo leer el archivo" + reintentar
├─ [vista] Preview: tabla con datos parseados + indicadores de duplicados → 8.1
├─ [overlay] Confirmar importación: resumen (N items, M duplicados, K potencialmente nuevos) → 8.2
├─ [vista] Procesando: barra de progreso + "Importando... X de N" → 8.3
├─ [vista] Resultado exitoso: "Se importaron X items" + enlace a biblioteca → 8.4
├─ [vista] Resultado parcial: "X importados, Y fallidos" + detalle de errores → 8.4
└─ [vista] Resultado fallido: "La importación falló" + detalle + reintentar → 8.4
```

---

## 6. User flows

### Flow 1: Agregar contenido individual

```
1. Usuario está en Biblioteca (/)
2. Clic en botón "+" (fab o header) →
3. Slide-over "Nuevo ítem" se abre con formulario (1.1)
4. Completa campos: título (requerido), tipo, creador, género, categoría, etiquetas,
   plataforma, enlace fuente, estado, notas, portada (upload o URL)
5. Clic "Guardar" →
6. Slide-over se cierra →
7. Nuevo ítem aparece en el grid de Biblioteca (posición: más reciente primero)
8. Toast de confirmación (T.1): "Ítem agregado"
```

**Casos de borde:**
- Título vacío: validación inline, campo resaltado con `--color-danger`
- Portada no subida: el ítem se guarda sin portada (placeholder con icono de tipo)
- Detección de duplicados (título + userId): aviso antes de guardar, opción de cancelar

### Flow 2: Buscar y filtrar

```
1. Usuario escribe en la barra de búsqueda →
2. Grid se actualiza en tiempo real (debounced) mostrando solo coincidencias
3. Usuario clic en chip de filtro (ej. "Películas") →
4. Búsqueda + filtro se combinan (AND) → grid se refina
5. Usuario clic en "Limpiar filtros" →
6. Grid vuelve a mostrar todos los ítems
```

**Campos de búsqueda (domain.md regla 3):** título, creador, género, categoría, etiquetas, plataforma, tipo, estado.

### Flow 3: Organizar en colección

```
1. Usuario desde Detalle de Ítem o grid clic en "Agregar a colección" →
2. Picker modal (1.3): lista de colecciones existentes + opción "Crear nueva colección"
3a. Si selecciona colección existente → ítem agregado → toast (T.1) "Añadido a {colección}"
3b. Si elige "Crear nueva" → mini-formulario (nombre) → crea colección → ítem agregado
4. Si el ítem ya pertenece a la colección: opción "Quitar de esta colección"
```

### Flow 4: Cambiar estado de consumo

```
1. Usuario en Detalle de Ítem o en tarjeta clic en badge de estado →
2. Dropdown con opciones: Pendiente, Consumiendo, Completado, Abandonado
3. Selecciona nuevo estado →
4. Badge se actualiza visualmente (color + texto) →
5. Si cambia a "Completado": campo consumedAt se llena con fecha actual
6. Toast (T.1): "Estado actualizado a {nuevo_estado}"
```

### Flow 5: Importación masiva (admin)

```
1. Admin desde menú de usuario → Importación → /importacion
2. Zona de upload: drag & drop o selector de archivo (CSV/Excel)
3. Archivo subido → backend parsea →
4. Preview (8.1): tabla con los registros detectados
   - Columnas mapeadas: título, tipo, creador, género, plataforma, etc.
   - Duplicados resaltados (mismo título + userId)
   - Errores de formato marcados
5. Admin revisa y deselecta ítems que no desea importar
6. Clic "Importar {N} ítems" →
7. Modal confirmar importación (8.2): resumen de lo que se va a importar
8. Barra de progreso (8.3) con conteo "Importando... 45 de 120"
9. Resultado (8.4): "Se importaron 115 items. 3 duplicados omitidos. 2 con errores."
10. Enlace "Ver en Biblioteca"
```

---

## 7. Selección de pantalla firma

### Propuesta: **Biblioteca** (`biblioteca`, `/`)

**Según la regla del config:** "Nodo raíz del objeto central del producto (el que el usuario mira el 80% del tiempo), registro 'producto', con la mayor densidad de componentes reutilizables."

| Criterio | Cumplimiento |
|---|---|
| Nodo raíz del objeto central | ✅ Es la vista principal de la colección de MediaItems — el objeto central del producto. |
| Registro 'producto' | ✅ El diseño sirve a la tarea de browsing; retención por usabilidad. |
| Mayor densidad de componentes reutilizables | ✅ Concentra: MediaCard, FilterChips, SearchBar, StatusBadge, MediaTypeBadge, RatingStars, EmptyState, SkeletonLoader — 8+ componentes reutilizables en una sola pantalla. |
| El que el usuario mira el 80% del tiempo | ✅ Es la pantalla de inicio y la más visitada. |

**Justificación:** La Biblioteca es el nodo raíz del objeto central (colección visual de contenido), tiene registro `producto` y concentra la mayor densidad de componentes reutilizables del producto. El sistema de diseño extraído de esta pantalla (MediaCard con portada + metadatos + acciones, FilterChips, estados de vacío/carga/error) gobierna el resto de pantallas que reutilizan esos mismos patrones.

---

## 8. Matriz de herencia de componentes

Para que la Fase 4 (E4c) pueda copiar las capas del prompt firma con precisión, esta tabla documenta qué componentes de la pantalla firma se reutilizan en cada pantalla/sub-pantalla restante.

### 8A. Componentes de pantallas principales

| Componente | Biblioteca (firma) | Detalle Ítem | Colecciones | Det. Colección | Listas | Det. Lista | Config | Importación |
|---|---|---|---|---|---|---|---|---|
| MediaCard | ✅ raíz | — | — | ✅ hereda | — | ✅ hereda | — | — |
| FilterChips | ✅ raíz | — | — | ✅ hereda | — | — | — | — |
| SearchBar | ✅ raíz | — | — | — | — | — | — | — |
| StatusBadge | ✅ raíz | ✅ hereda | — | ✅ hereda | — | ✅ hereda | — | — |
| MediaTypeBadge | ✅ raíz | ✅ hereda | — | ✅ hereda | — | ✅ hereda | — | — |
| RatingStars | ✅ raíz | ✅ hereda | — | — | — | — | — | — |
| EmptyState | ✅ raíz | — | ✅ hereda | ✅ hereda | ✅ hereda | ✅ hereda | — | — |
| SkeletonLoader | ✅ raíz | ✅ hereda | ✅ hereda | ✅ hereda | ✅ hereda | ✅ hereda | — | ✅ hereda |
| CollectionCard | — | — | ✅ raíz | — | — | — | — | — |
| ListCard | — | — | — | — | ✅ raíz | — | — | — |
| DragHandle | — | — | — | — | — | ✅ raíz | — | — |
| FileUpload | — | — | — | — | — | — | — | ✅ raíz |
| PreviewTable | — | — | — | — | — | — | — | ✅ raíz |

### 8B. Componentes de sub-pantallas (reutilización transversal)

| Componente | Definido en | Reutilizado en | Notas |
|---|---|---|---|
| **MediaItemForm** | 1.1 slide-nuevo-item | 1.2 slide-editar-item | Mismo formulario, modo creación vs edición (pre-rellenado). Campos: title, type, creator, genre, categoryId, tags, platform, sourceUrl, status, notes, coverImage. |
| **CoverUpload** | 1.1 slide-nuevo-item | 1.2 slide-editar-item | Upload de portada con preview. Drag & drop o click para seleccionar. |
| **ValidationInline** | 1.1 slide-nuevo-item | 1.2, 3.1, 4.1, 5.1, 6.1, 7.4 | Mensajes de error inline por campo (requerido, duplicado, formato). Patrón reutilizado en todos los formularios. |
| **CollectionPickerList** | 1.3 modal-agregar-item-a-coleccion | — | Lista de colecciones con mosaico mini + nombre + conteo + checkmark. |
| **CollectionQuickCreate** | 1.3 modal-agregar-item-a-coleccion | — | Mini-formulario inline para crear colección dentro del picker. |
| **ListPickerList** | 1.4 modal-agregar-item-a-lista | — | Lista de listas con nombre + itemCount + checkmark. |
| **PositionSelector** | 1.4 modal-agregar-item-a-lista | 6.2 modal-agregar-item-a-lista | Selector de posición para listas ordenadas. Opcional. |
| **ConfirmationMessage** | 1.5 modal-confirmar-eliminar-item | 3.2, 4.3, 5.2, 6.3, 7.3 | Patrón de confirmación: icono + título + mensaje + botones peligro/cancelar. Reutilizado en todas las eliminaciones. |
| **DangerButton** | 1.5 modal-confirmar-eliminar-item | 3.2, 4.3, 5.2, 6.3, 7.3 | Botón de acción destructiva (rojo). |
| **CancelButton** | 1.5 modal-confirmar-eliminar-item | Todos los modales | Botón de cancelar/cerrar. |
| **ItemPickerGrid** | 4.2 modal-agregar-item-al-coleccion | 6.2 modal-agregar-item-a-lista | Grid de portadas de la biblioteca con selección múltiple (checkbox). Diferente de los pickers de colección/lista. |
| **SearchFilter** | 1.3, 4.2, 6.2 | — | Campo de búsqueda dentro de pickers (filtrar colecciones, listas o items). Patrón reutilizado. |
| **TextInput (requerido)** | 3.1 modal-crear-coleccion | 4.1, 5.1, 6.1, 7.1, 7.2 | Campo de texto con indicador de requerido + autofocus. |
| **TextArea** | 3.1 modal-crear-coleccion | 4.1, 5.1, 6.1 | Campo de descripción (textarea multilínea). |
| **InfoText** | 3.2 modal-confirmar-eliminar-coleccion | 5.2 modal-confirmar-eliminar-lista | Texto aclaratorio "Los ítems no se eliminarán". |
| **PasswordInput** | 7.4 modal-cambiar-contraseña | — | Campo de contraseña con toggle visibilidad. |
| **ToastContainer** | T.1 toast-exito | T.2 toast-error | Contenedor de toasts (posición fija top-right/center). |
| **ProgressBar (animada)** | 8.3 importacion-progreso | — | Barra de progreso con animación y porcentaje. |
| **ResultHeader** | 8.4 importacion-resultado | — | Icono + título dinámico según estado (éxito/parcial/fallido). |
| **StatsRow** | 8.4 importacion-resultado | 8.1 importacion-preview | Fila de estadísticas numéricas (importados/fallidos/duplicados). |
| **DragGhost** | 6.4 feedback-drag-reorder | — | Preview semitransparente del ítembeing arrastrado. |
| **DropIndicator** | 6.4 feedback-drag-reorder | — | Línea visual de posición de inserción durante drag. |

---

*Documento actualizado en Fase 3 del pipeline de diseño — expansión de inventario de sub-pantallas. Pendiente de aprobación del usuario antes de avanzar a Fase 4 (composición de ScreenSpecs en modo frontend-directo).*
