# Discovery — MediaVault

> **Fase B1** · Brand Strategist · 2026-07-19

## Qué se construye

**MediaVault** es una aplicación web para gestionar bibliotecas multimedia personales. Centraliza en un solo lugar todo el contenido que el usuario ha consumido, está consumiendo o desea consumir — sin importar el tipo (libros, películas, series, documentales, manga, cómics, revistas, audiolibros, podcasts, cursos, etc.) ni la plataforma de origen.

### Problema central

Las personas acumulan contenido desde múltiples fuentes (tiendas online, plataformas de streaming, descargas, recomendaciones de amigos). Con el tiempo pierden trazabilidad: olvidan dónde obtuvieron cada contenido, qué ya consumieron, qué está pendiente, y dónde volver a encontrarlo. No existe una capa de organización personal que trascienda las plataformas individuales.

### Qué resuelve

Un registro unificado con metadatos ricos (título, creador, tipo, género, plataforma, enlace fuente, estado de consumo, calificación personal, notas) más un sistema de organización flexible (categorías, etiquetas, colecciones, listas ordenadas, favoritos) que permite al usuario encontrar, filtrar y recuperar cualquier contenido de su biblioteca.

## Para quién

### Público objetivo

Cualquier persona que consume contenido digital de forma habitual. **No es una app de nicho** — el contenido es genérico y abarca todos los tipos.

**Segmentos de uso esperados:**

- **Lectores voraces** — libros, audiolibros, revistas, manga, cómics. Necesitan saber qué leyeron, qué está pendiente, calificar, recomendarse a sí mismos.
- **Cinéfilos y series addicts** — películas, series, documentales. Necesitan跟踪 dónde están (Netflix, HBO, descarga local), qué terminaron, qué abandonaron.
- **Estudiantes y autodidactas** — cursos, podcasts, artículos, documentales. Necesitan organizar por tema/proyecto, marcar pendientes de revisión.
- **Fans de nicho** — manga, cómics, podcasts de investigación. Necesitan metadatos ricos y organización por colecciones temáticas.

### Nivel técnico esperado

No especializado. La app debe ser usable sin conocimiento técnico previo. Sin embargo, el panel de administración (carga masiva) asume un usuario cómodo con archivos CSV/Excel.

### Contexto de uso

Web — escritorio y responsive (tableta/móvil en navegador). Es una herramienta personal de gestión, no una plataforma social. No hay contenido compartido entre usuarios en esta versión.

## Plataforma

- **Web** (responsive). No es app móvil nativa.
- Debe funcionar bien en pantallas de escritorio (donde el usuario probablemente dedica tiempo a organizar) y en móvil/tablet (para consultas rápidas y registro sobre la marcha).

## Entidades clave (dominio)

| Entidad | Rol en la experiencia |
|---|---|
| **MediaItem** | Entidad central. El contenido registrado — con todos sus metadatos, estado y calificación. |
| **User** | Cada usuario tiene su biblioteca privada. Roles: user (regular) y admin (carga masiva). |
| **Category** | Clasificación por tipo de contenido. Privada por usuario. |
| **Tag** | Etiquetas flexibles (N:N). Permiten agrupación transversal. Privadas por usuario. |
| **Collection** | Agrupación temática con descripción. Puede contener cualquier item. |
| **List** | Lista ordenada (posición explícita). Para "top 10", "próximos a ver", etc. |
| **BulkImport** | Solo admin. Carga masiva desde archivo con validación previa y detección de duplicados. |

### Reglas de negocio relevantes para diseño

1. Un usuario solo ve su propia biblioteca — no hay feed social, no hay descubrimiento comunitario.
2. El status `favorite` es acumulativo: un item puede ser `completed` Y `favorito` a la vez.
3. La búsqueda debe cubrir todos los campos: título, creador, género, categoría, etiquetas, plataforma, tipo, estado.
4. `coverImage` es opcional — la UI debe manejar items sin portada gracefully.
5. `sourceUrl` es opcional — algunos contenidos no tienen enlace externo.

## Restricciones conocidas

- **App web** — no móvil nativo. Responsive es obligatorio.
- **Contenido multi-tipo** — la interfaz debe manejar 11 tipos de contenido (del enum `type`) sin que el usuario sienta que la app es solo para uno de ellos.
- **Sin componente social** — cada biblioteca es privada. No hay compartir, no hay feeds, no hay perfiles públicos.
- **Carga masiva** — solo para admins. Requiere upload de archivo, validación, preview de duplicados antes de insertar.
- **Sin marca existente** — MediaVault es nombre tentativo. No hay identidad visual previa que preservar.

## Oportunidades de diseño

- **Enciclopedia personal**: la sensación de tener "tu propia Wikipedia de contenido consumido". La app puede aspirar a ser un objeto de orgullo — no solo una herramienta utilitaria.
- **Riqueza visual por los tipos de contenido**: portadas de libros, carteles de películas, thumbnails de series. El contenido mismo es altamente visual — la UI puede aprovecharlo.
- **Organización como placer**: para el público objetivo, organizar y catalogar no es una tarea molesta sino parte del disfrute (el "satisfying" de tener todo en orden). La experiencia de organizaci\u00f3n puede ser un diferenciador.
- **Multi-tipo como fortaleza**: lejos de ser un problema, cubrir 11 tipos de contenido permite al usuario tener UNA sola referencia. La interfaz debe celebrar esa diversidad, no ocultarla.

## Conocimiento de referencia

- **Anti-patrones estructurales** (AP-1 a AP-3): vigentes. Evitar esqueleto "admin SaaS" (AP-1), fondo crema genérico (AP-2), y léxico AI-default (AP-3).
- **Patterns del vertical**: ninguno acumulado (base post-reset). No hay diseño previo aprobado que sirva como referencia en la capa de inteligencia.
- **Modelo de interacción de tarjetas de biblioteca**: existe como referencia en `screen-spec-composer/reference/ejemplo-biblioteca.md` (sección 14) — el tipo de interacción fue aprobado en un run anterior.

---

**¿Confirmas que el descubrimiento es correcto y completo, o quieres agregar/modificar algo antes de que avance a la estrategia de marca (B2)?**
