# Fase 3 — Estructura y UX

## Estructura firma (derivada de arquetipos)

### Objeto central

El **MediaItem** — específicamente su **portada/título**. Es lo que el usuario mira, busca, filtra y manipula el 80% del tiempo. La interfaz debe poner el contenido al frente, no la navegación.

### Clasificación por arquetipo

| Pantalla | Arquetipo | Esqueleto heredado |
|---|---|---|
| Library (Home) | **Biblioteca de contenido / medios** (#3) | Grid de portadas grandes, browsing visual, scroll horizontal por colección/status. Navegación mínima (topbar + bottom tabs). |
| Search & Browse | **Biblioteca de contenido / medios** (#3) | Grid de portadas con panel de filtros. Filtros combinables en topbar o slide-in. |
| Media Detail | **Biblioteca de contenido / medios** (#3) | Ficha de contenido con portada dominante + metadatos. |
| Add/Edit Media | **Formularios / trámite** (#9) | Slide-over panel de una columna, campos agrupados, progreso visual. |
| Collections List | **Biblioteca de contenido / medios** (#3) | Grid de colecciones como "estanterías". |
| Collections Detail | **Biblioteca de contenido / medios** (#3) | Scroll horizontal de portadas dentro de la colección. |
| Playlists | **Biblioteca de contenido / medios** (#3) | Lista ordenada de items con portadas. |
| Bulk Upload | **Formularios / trámite** (#9) | Wizard de pasos: subir → previsualizar → confirmar. |
| Admin Content Mgmt | **Registros / CRUD** (#1) | Tabla densa de items con acciones inline. Solo visible en rol admin. |

### Referentes del dominio

- **Letterboxd**: browsing visual de películas con portadas protagonistas, filtros elegantes.
- **Plex**: biblioteca personal con estanterías horizontales por categoría.
- **Spotify**: navegación por colecciones/playlists con scroll horizontal.
- **Notion**: formularios limpios y slide-overs para creación/edición.

### Decisión de layout memorable

> **"La portada manda: browsing por estanterías horizontales de portadas grandes, con filtros flotantes que no compiten con el contenido. La navegación se reduce a bottom tabs (mobile) o topbar horizontal (desktop) — nunca sidebar. Las acciones de creación/edición se abren como slide-over panels que no dejan la pantalla actual."**

**Prohibiciones de estructura**:
- ❌ Sidebar de navegación fija
- ❌ Stat-cards como bloque principal de CUALQUIER pantalla
- ❌ Tabla como vista principal de la biblioteca (solo para admin CRUD)
- ❌ Grid uniforme de cards pequeñas — las portadas deben ser grandes y protagonistas
- ❌ Navegación por árboles de menú anidados

---

## User flow principal (Usuario regular)

### Flujo 1: Explorar mi biblioteca
```
1. Abre la app → ve Library (home)
2. Ve secciones horizontales: "En progreso", "Pendientes", "Favoritos", "Colecciones"
3. Hace scroll horizontal en cada sección
4. Toca una portada → Media Detail
5. Ve portada grande + metadatos + opciones (editar, marcar estado, añadir a colección)
```

### Flujo 2: Buscar y filtrar
```
1. Toca el ícono de búsqueda en la barra superior
2. Escribe texto → resultados aparecen en tiempo real
3. Toca filtros → panel deslizante con: tipo, creador, género, categoría, estado, plataforma
4. Apila filtros combinados → grid se actualiza
5. Toca un resultado → Media Detail
```

### Flujo 3: Agregar contenido nuevo
```
1. Toca "+" en la barra superior
2. Se abre slide-over "Agregar contenido"
3. Completa campos obligatorios (título, tipo, creador)
4. Opcionalmente: portada, descripción, género, estado, plataforma, enlace
5. Guarda → item aparece en la sección correspondiente
```

### Flujo 4: Organizar contenido
```
1. Navega a Collections (bottom tab)
2. Ve grid de colecciones existentes
3. Toca "+" → crea nueva colección (nombre, descripción)
4. Desde Media Detail → "Añadir a colección" → selecciona colección(es)
5. Toca una colección → ve items agrupados
```

### Flujo 5: Seguimiento de estado
```
1. En Library (home), ve secciones filtradas por estado
2. "En progreso" → items que está consumiendo
3. "Pendientes" → items por consumir
4. "Favoritos" → items marcados como favoritos
5. Cambia estado desde Media Detail → actualización inmediata
```

---

## User flow del administrador

### Flujo 6: Gestión de contenido (CRUD)
```
1. Activa modo admin (switch en Profile)
2. En Library, aparece ícono de administración
3. Accede a Admin Content → tabla densa de todos los items
4. Puede: editar inline, eliminar, buscar, filtrar
5. Click en fila → Media Detail (con opciones admin)
```

### Flujo 7: Carga masiva
```
1. En modo admin, toca "Carga masiva" en Admin Content
2. Sube archivo (CSV/Excel)
3. Se abre wizard: Previsualización → Revisión → Confirmación
4. Previsualización: tabla con datos detectados, resaltado de duplicados
5. Revisión: puede editar/eliminar items individuales antes de confirmar
6. Confirmación: incorpora items nuevos, reporta duplicados omitidos
```

---

## Inventario de pantallas

### Pantallas principales

| # | Slug | Nombre | Propósito | Contenido principal | Entidades | Arquetipo |
|---|---|---|---|---|---|---|
| 1 | `library-home` | Library (Inicio) | Punto de entrada; browsing visual de la biblioteca personal | Secciones horizontales de portadas por estado (en progreso, pendientes, completados, favoritos) + secciones de colecciones. Header con búsqueda y botón "+". | MediaItem, Collection, Playlist | Biblioteca (#3) |
| 2 | `search-browse` | Buscar y Explorar | Encontrar contenido con búsqueda rápida + filtros combinables | Barra de búsqueda prominente + filtros (tipo, creador, género, categoría, estado, plataforma) + grid de resultados con portadas. | MediaItem | Biblioteca (#3) |
| 3 | `media-detail` | Detalle del contenido | Ver toda la información de un item y realizar acciones sobre él | Portada grande + título + creador + tipo + estado + calificación + notas + plataforma origen + enlace + colecciones/listas asociadas. Botones: editar, cambiar estado, favorito, añadir a colección, eliminar. | MediaItem, Category, Tag, Collection, Playlist | Biblioteca (#3) |
| 4 | `collections-list` | Mis Colecciones | Ver y gestionar todas las colecciones | Grid de colecciones (cards con nombre + descripción + count de items + portadas preview). Botón "+". | Collection, MediaItem | Biblioteca (#3) |
| 5 | `collections-detail` | Detalle de Colección | Ver items dentro de una colección específica | Nombre + descripción de colección + grid/portadas de items agrupados. Opciones: renombrar, eliminar colección, reordenar items. | Collection, MediaItem | Biblioteca (#3) |
| 6 | `playlists-list` | Mis Listas | Ver y gestionar todas las listas personalizadas | Lista de listas (cards con nombre + count de items). Botón "+". Similar a colecciones pero enfocado en orden secuencial. | Playlist, MediaItem | Biblioteca (#3) |
| 7 | `profile-settings` | Mi Perfil y Configuración | Configuración general y cambio de rol | Información del usuario, switch de rol (user/admin), configuración de preferencias. | User | Formularios (#9) |

### Pantallas admin

| # | Slug | Nombre | Propósito | Contenido principal | Entidades | Arquetipo |
|---|---|---|---|---|---|---|
| 8 | `admin-content` | Gestión de Contenido (Admin) | CRUD completo sobre items como administrador | Tabla densa de items con columnas: título, tipo, creador, estado, fecha agregado. Acciones inline: editar, eliminar. Búsqueda y filtros rápidos. Botón "Carga masiva". | MediaItem | Registros (#1) |
| 9 | `bulk-upload` | Carga Masiva | Subir archivo con múltiples items y revisar antes de incorporar | Wizard de 3 pasos: (1) Subir archivo, (2) Previsualizar datos en tabla con highlighting de duplicados, (3) Confirmar y reportar resultados. | MediaItem | Formularios (#9) |

### Overlays (estados derivados de pantallas raíz)

| # | Slug | Nodo padre | Disparador | Contenido | Tipo |
|---|---|---|---|---|---|
| 10 | `add-edit-media` | `library-home` / `media-detail` | Botón "+" o "Editar" | Slide-over panel con formulario de campos del MediaItem. Campos obligatorios: título, tipo, creador. Opcionales: portada, descripción, género, categoría, estado, calificación, notas, plataforma, enlace. | `[overlay]` |
| 11 | `delete-confirmation` | `media-detail` / `admin-content` | Botón "Eliminar" | Modal de confirmación: "¿Eliminar [título]?" con botones Cancelar/Eliminar. | `[overlay]` |
| 12 | `add-to-collection` | `media-detail` | Botón "Añadir a colección" | Modal/drawer con lista de colecciones existentes + opción crear nueva. Checkboxes para selección múltiple. | `[overlay]` |

---

## Árbol de estados por pantalla

### `library-home` (pantalla raíz)
```
<library-home>
├─ Estado base: secciones horizontales con portadas
├─ [caso-borde] vacío: "Tu biblioteca está vacía. ¡Agrega tu primer contenido!" + botón CTA
├─ [caso-borde] carga: skeleton placeholders de portadas
└─ [caso-borde] error: "No se pudo cargar tu biblioteca" + retry
```

### `search-browse` (pantalla raíz)
```
<search-browse>
├─ Estado base: barra de búsqueda + filtros + grid de resultados
├─ [caso-borde] sin resultados: "No encontramos nada con esos filtros"
├─ [caso-borde] carga: skeleton grid
└─ [caso-borde] error: mensaje de error + retry
```

### `media-detail` (pantalla raíz)
```
<media-detail>
├─ Estado base: portada + metadatos completos
├─ [overlay] add-edit-media — disparador: botón "Editar"
├─ [overlay] delete-confirmation — disparador: botón "Eliminar"
├─ [overlay] add-to-collection — disparador: botón "Añadir a colección"
├─ [caso-borde] no encontrado: "Este contenido no existe" + volver
└─ [caso-borde] carga: skeleton de ficha
```

### `collections-list` (pantalla raíz)
```
<collections-list>
├─ Estado base: grid de colecciones
├─ [overlay] crear colección — disparador: botón "+"
├─ [caso-borde] vacío: "Aún no tienes colecciones. ¡Crea una!"
├─ [caso-borde] carga: skeleton grid
└─ [caso-borde] error: mensaje + retry
```

### `collections-detail` (pantalla raíz)
```
<collections-detail>
├─ Estado base: portadas de items en la colección
├─ [overlay] editar colección — disparador: ícono editar
├─ [caso-borde] colección vacía: "Esta colección está vacía"
├─ [caso-borde] carga: skeleton
└─ [caso-borde] no encontrada: "Colección no encontrada"
```

### `playlists-list` (pantalla raíz)
```
<playlists-list>
├─ Estado base: lista de listas con count de items
├─ [overlay] crear lista — disparador: botón "+"
├─ [caso-borde] vacío: "Crea tu primera lista personalizada"
├─ [caso-borde] carga: skeleton
└─ [caso-borde] error: mensaje + retry
```

### `admin-content` (pantalla raíz — solo admin)
```
<admin-content>
├─ Estado base: tabla densa de items con acciones
├─ [overlay] delete-confirmation — disparador: botón eliminar en fila
├─ [pantalla] bulk-upload — disparador: botón "Carga masiva"
├─ [caso-borde] vacío: "No hay contenido registrado"
├─ [caso-borde] carga: skeleton tabla
└─ [caso-borde] error: mensaje + retry
```

### `bulk-upload` (pantalla raíz — solo admin)
```
<bulk-upload>
├─ Estado base: wizard de 3 pasos (subir → previsualizar → confirmar)
├─ [caso-borde] archivo inválido: "El archivo no tiene el formato correcto"
├─ [caso-borde] duplicados detectados: highlights en tabla + conteo
├─ [caso-borde] carga: processing spinner
└─ [caso-borde] éxito: "Se incorporaron X items. Y duplicados omitidos."
```

### `profile-settings` (pantalla raíz)
```
<profile-settings>
├─ Estado base: info usuario + switch rol + preferencias
├─ [caso-borde] carga: skeleton
└─ [caso-borde] error: mensaje
```

---

## Jerarquía de navegación

### Mobile (bottom tabs)
```
┌─────────────────────────────────┐
│          Header (logo + search) │
├─────────────────────────────────┤
│                                 │
│         Contenido actual        │
│       (Library / Search /       │
│        Collections / Profile)   │
│                                 │
├─────────────────────────────────┤
│  📚 Library │ 🔍 Buscar │ 📁 Colecciones │ 👤 Perfil │
└─────────────────────────────────┘
```

### Desktop (topbar horizontal)
```
┌─────────────────────────────────────────────────────────┐
│ Logo │ Library │ Buscar │ Colecciones │ Listas │ Perfil  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                    Contenido                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Transiciones entre pantallas
- **Library → Media Detail**: push (navegación estándar)
- **Media Detail → Add/Edit**: slide-over panel (no navega, se superpone)
- **Library → Search**: transición de contenido (misma estructura, cambia el panel principal)
- **Cualquier pantalla → Collections Detail**: push
- **Admin Content → Bulk Upload**: push (navegación estándar)
- **Cualquier pantalla → Profile**: push

---

**¿Confirmas este inventario de pantallas y estructura de navegación? ¿Alguna pantalla que agregar, eliminar o modificar antes de pasar a Fase 4 (generación en Stitch)?**
