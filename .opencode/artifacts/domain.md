# Dominio — Mi Biblioteca Multimedia

## Entidades

### MediaItem (elemento de biblioteca)
| Atributo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| title | string | Obligatorio |
| description | string? | Sin límite de largo |
| coverImage | string (URL) | Portada; nullable |
| type | enum | `book`, `series`, `film`, `documentary`, `manga`, `comic`, `magazine`, `audiobook`, `podcast`, `course`, `other` |
| creator | string | Autor, director o creador |
| genre | string? | Género literario/audiovisual |
| status | enum | `pending`, `in_progress`, `completed`, `abandoned`, `favorite` |
| addedAt | ISO-8601 datetime | Timestamp de alta |
| consumedAt | ISO-8601 date? | Fecha de consumo (puede ser null si está pendiente) |
| rating | int (1-5)? | Calificación personal |
| notes | string? | Comentarios/libretas |
| sourcePlatform | string? | Plataforma de origen |
| sourceUrl | string (URL)? | Enlace de descarga/compra/visualización |
| createdAt | ISO-8601 datetime | Audit |
| updatedAt | ISO-8601 datetime | Audit |

### Category (categoría)
| Atributo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| name | string | Único |
| description | string? | |

### Tag (etiqueta)
| Atributo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| name | string | Único |

### Collection (colección)
| Atributo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| name | string | Único |
| description | string? | |

### Playlist (lista personalizada)
| Atributo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| name | string | Único |
| description | string? | |

### User (usuario)
| Atributo | Tipo | Notas |
|---|---|---|
| id | UUID | PK |
| email | string | Único |
| name | string | |
| role | enum | `user`, `admin` |
| createdAt | ISO-8601 datetime | |

## Relaciones

- **MediaItem** ↔ **Category**: N:1 (cada item pertenece a una categoría)
- **MediaItem** ↔ **Tag**: N:N (cada item puede tener muchas etiquetas)
- **MediaItem** ↔ **Collection**: N:N (cada item puede pertenecer a muchas colecciones)
- **MediaItem** ↔ **Playlist**: N:N (cada item puede estar en muchas listas personalizadas)
- **User** ↔ **MediaItem**: 1:N (un usuario crea muchos items)
- **User** → **MediaItem** (favorites): N:N (subconjunto marcado como favorito — derivado del status, no relación separada)

## Reglas de negocio extraídas

1. **Favoritos** se modela via `status = favorite`, no como relación aparte.
2. **Duplicados**: un MediaItem se identifica por título + tipo + creador. El admin debe poder evitar registros duplicados al cargar.
3. **Carga masiva**: el admin puede subir un archivo (planilla) con múltiples items; el sistema debe previsualizar y permitir revisión antes de confirmar la incorporación.
4. **Rol admin**: puede crear, editar, eliminar items; carga masiva. El usuario normal solo consulta y gestiona su propia biblioteca (en MVP, un solo usuario sin auth multi-tenant).
5. **Búsqueda**: soporte por título, tipo, creador, género, categoría, estado, etiquetas, plataforma.
6. **Filtros combinables**: el usuario puede apilar múltiples filtros simultáneamente.

## Ambigüedades resueltas por el orquestador

- **Favoritos como status vs. relación aparte**: se modela como valor del enum `status` para simplificar; si en el futuro se requiere "marcar como favorito sin cambiar el estado de consumo", se puede agregar un booleano `isFavorite` independiente.
- **Multi-usuario vs. single-user**: la descripción no menciona autenticación multi-tenant; por ahora se modela un único usuario por defecto. Si se necesita auth, se agregará en la fase de enganche con backend.
- **Categorías predefinidas vs. libres**: se asume que las categorías las crea el usuario (o el admin); no hay un set fijo predeterminado.
