# Dominio — MediaVault (Biblioteca Multimedia Personal)

## Entidades

### User
| Atributo | Tipo | Notas |
|---|---|---|
| id | string (uuid) | PK |
| name | string | Nombre visible |
| email | string | Único por usuario |
| passwordHash | string | Nunca en claro |
| role | enum: `user`, `admin` | `admin` puede cargar contenido masivo |
| createdAt | Date | Registro |

### MediaItem (entidad central)
| Atributo | Tipo | Notas |
|---|---|---|
| id | string (uuid) | PK |
| userId | string | FK → User. Propietario del registro |
| title | string | Obligatorio |
| coverImage | string (URL) | Portada. Nullable (sin imagen) |
| description | string | Resumen o sinopsis. Nullable |
| creator | string | Autor / director / creador |
| type | enum: `book`, `series`, `film`, `documentary`, `manga`, `comic`, `magazine`, `audiobook`, `podcast`, `course`, `other` | Tipo de contenido |
| genre | string | Género temático (ej. "Ciencia ficción", "Programación") |
| categoryId | string | FK → Category. Nullable (sin categoría) |
| status | enum: `pending`, `consuming`, `completed`, `abandoned`, `favorite` | Estado de consumo |
| addedAt | Date | Cuándo se agregó |
| consumedAt | Date \| null | Cuándo se terminó de consumir |
| personalRating | number (1-5) \| null | Calificación propia |
| notes | string | Comentarios / notas personales. Nullable |
| platform | string | Sitio u origen (ej. "Amazon Kindle", "Netflix", "YouTube") |
| sourceUrl | string (URL) | Enlace de descarga / compra / visualización. Nullable |
| isFavorite | boolean | Default false. Acceso rápido a favoritos |

### Category
| Atributo | Tipo | Notas |
|---|---|---|
| id | string (uuid) | PK |
| userId | string | FK → User. Categorías por usuario |
| name | string | Nombre de la categoría |

### Tag
| Atributo | Tipo | Notas |
|---|---|---|
| id | string (uuid) | PK |
| userId | string | FK → User. Etiquetas por usuario |
| name | string | Nombre de la etiqueta |

### MediaItemTag (relación N:N)
| Atributo | Tipo | Notas |
|---|---|---|
| mediaItemId | string | FK → MediaItem |
| tagId | string | FK → Tag |

### Collection
| Atributo | Tipo | Notas |
|---|---|---|
| id | string (uuid) | PK |
| userId | string | FK → User |
| name | string | Nombre de la colección |
| description | string | Descripción. Nullable |
| createdAt | Date | Creación |

### CollectionItem (relación N:N)
| Atributo | Tipo | Notas |
|---|---|---|
| collectionId | string | FK → Collection |
| mediaItemId | string | FK → MediaItem |

### List (lista personalizada)
| Atributo | Tipo | Notas |
|---|---|---|
| id | string (uuid) | PK |
| userId | string | FK → User |
| name | string | Nombre de la lista |
| description | string | Nullable |
| createdAt | Date | Creación |

### ListItem (relación N:N con orden)
| Atributo | Tipo | Notas |
|---|---|---|
| listId | string | FK → List |
| mediaItemId | string | FK → MediaItem |
| position | number | Orden dentro de la lista |

### BulkImport (carga masiva, rol admin)
| Atributo | Tipo | Notas |
|---|---|---|
| id | string (uuid) | PK |
| userId | string | FK → User (debe ser admin) |
| filename | string | Nombre del archivo subido |
| status | enum: `pending`, `processing`, `completed`, `failed` | Estado de la importación |
| totalItems | number | Total de registros en el archivo |
| importedItems | number | Registros exitosos |
| failedItems | number | Registros con error |
| createdAt | Date | Cuándo se inició |

## Relaciones clave

- **User 1:N MediaItem** — cada contenido pertenece a un usuario.
- **MediaItem N:1 Category** — un contenido puede tener una categoría (opcional).
- **MediaItem N:N Tag** — un contenido puede tener múltiples etiquetas y viceversa.
- **MediaItem N:N Collection** — un contenido puede estar en múltiples colecciones.
- **MediaItem N:N List** — un contenido puede estar en múltiples listas, con posición ordenada.
- **User 1:N BulkImport** — solo usuarios admin pueden crear importaciones masivas.

## Reglas de negocio

1. **Un usuario solo ve su propia biblioteca** — no hay contenido compartido entre usuarios (versión actual).
2. **El status `favorite` es acumulativo** — un item puede ser `completed` Y `isFavorite = true` simultáneamente.
3. **La búsqueda** debe cubrir: título, creador, género, categoría, etiquetas, plataforma, tipo y estado.
4. **BulkImport** requiere rol `admin`. El archivo debe ser validado antes de insertar — evitar duplicados por título + userId.
5. **Las categorías, etiquetas, colecciones y listas son privadas** por usuario.
6. **coverImage** es opcional — la UI debe manejar el caso sin portada gracefully.
7. **sourceUrl** es opcional — algunos contenidos pueden no tener enlace externo.
