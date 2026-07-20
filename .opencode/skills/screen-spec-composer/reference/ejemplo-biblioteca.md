# EJEMPLO trabajado — ScreenSpec de "Biblioteca" (MediaVault)

> **Esto es material de referencia de la skill, NO un artefacto del run.** La spec real de cada run se
> compone desde los artefactos vigentes de ese run (`theme.css`, `ux-flow.md`, …) y se guarda en
> `design/specs/biblioteca.md`. Los nombres de token citados aquí son ILUSTRATIVOS — cada run usa
> los que su `color_strategist` defina; ningún valor ni identidad visual se copia de este ejemplo.
> **El modelo de interacción de la tarjeta (secciones 3, 11-14, 18) SÍ es contrato obligatorio** en
> cualquier pantalla de grid de tarjetas con acción principal de navegación + acciones secundarias:
> enlace extendido en el título (`::after` cubre la tarjeta), acción secundaria como HERMANA elevada
> (`z-index`), cero interactivos anidados, teclado y lector de pantalla según esas secciones.

---
slug: biblioteca
titulo: Biblioteca
ruta: /biblioteca
tipo: producto
tipo_nodo: raiz
version: 1
iteracion: 0
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
Vista raíz del objeto central del producto: la colección personal de medios (libros, películas, series, manga, cómics, audiolibros, podcasts, cursos, revistas). Permite explorar, filtrar y abrir el detalle de cada ítem, y marcar favoritos sin salir de la vista.

## 2. Objetivo del usuario
Localizar un ítem de su colección (visual, por portada) y abrir su detalle. Llega desde la navegación lateral (nodo raíz según `ux-flow.md`).

## 3. Acciones
- Acción principal [MUST]: **abrir el detalle del ítem** (`/biblioteca/:id`). Se dispara al hacer click/tap en la portada, en el título o en la zona no interactiva de la tarjeta; y con Enter cuando el enlace del título tiene el foco.
- Marcar/desmarcar favorito [MUST]: botón estrella por tarjeta. Independiente: NUNCA navega al detalle.
- Filtrar por tipo de medio [SHOULD]: chips de filtro sobre el grid.
- Cambiar vista grid/lista [MAY].

## 4. Jerarquía de información
1. Grid de portadas (domina el primer viewport). 2. Por tarjeta: portada → título → autor/creador → pills de tipo y estado → rating. 3. Chips de filtro. 4. Navegación lateral (persistente, secundaria).

## 5. Layout y grid
- Desktop 1280x800: sidebar fija de 240px; contenido con grid de 4 columnas, gap `var(--space-4)`; tarjetas con portada ratio 2/3 (libro/manga/cómic) o 16/9 (vídeo/audio/curso/revista).
- Móvil 390x844: sin sidebar (navegación colapsada), grid de 2 columnas, gap `var(--space-3)`.

## 6. Responsive
Entre 1280 y 768px el grid baja a 3 columnas; <768px, 2 columnas y navegación colapsada. Los chips de filtro pasan a scroll horizontal con overflow visible del foco.

## 7. Inventario de componentes
| Componente | Nuevo/Reutilizado | Ubicación esperada | Props/estado clave |
|---|---|---|---|
| MediaCard | Nuevo (patrón obligatorio) | shared/components/ui | item, onToggleFavorito |
| MediaTypeBadge / StatusBadge | Nuevo | shared/components/ui | tipo / estado |
| FilterChips | Nuevo | shared/components/ui | opciones, selección |
| SidebarNav | Reutilizado del shell | shared/components/layout | ítem activo (`aria-current`) |

## 8. Tokens (solo variables de theme.css)
Tarjeta: fondo `var(--color-surface)`, borde `var(--color-border)`, radio `var(--radius-md)`, sombra reposo `var(--shadow-sm)` / hover `var(--shadow-md)`. Favorito activo: `var(--color-accent)`. Pills de estado: variables `--status-*`. Espaciado interno de tarjeta `var(--space-4)`.

## 9. Tipografía
Título de tarjeta: familia headline, peso semibold, truncado a 1 línea. Autor: familia body, tamaño label. Un solo H1 en la página ("Biblioteca") [MUST].

## 10. Iconos e imágenes
Iconos Material Symbols Outlined (estrella rellena = favorito activo). Portada: `object-fit: cover`, `alt=""` [MUST] — el nombre accesible lo aporta el enlace del título (evita doble lectura en lector de pantalla).

## 11. Estados
- Pantalla — vacío: ilustración + "Tu biblioteca está vacía" + CTA "Añadir tu primer ítem". Carga: 8 tarjetas skeleton con las mismas dimensiones que las reales. Error: mensaje + acción reintentar.
- MediaCard — hover: elevación `var(--shadow-md)` + scale 1.02 de la portada [SHOULD]. focus-visible: anillo visible de 2px `var(--color-accent)` alrededor de la tarjeta (foco en el enlace) [MUST]. active: scale 0.98 [MAY]. disabled: No aplica — las tarjetas nunca se deshabilitan.
- Botón favorito — hover: fondo `var(--color-surface)` opaco. focus-visible: anillo propio de 2px [MUST]. active/pressed: `aria-pressed` refleja el estado [MUST]. disabled: No aplica.

## 12. Teclado
Orden de tab: navegación lateral → chips de filtro → por tarjeta: (1) enlace del título, (2) botón favorito → siguiente tarjeta. Enter en el enlace navega al detalle (semántica nativa de `<a>`; Space en enlaces no navega — desviación documentada respecto del enunciado genérico "Enter/Space": se respeta la semántica nativa). Enter Y Space en el botón favorito alternan el estado [MUST].

## 13. Lector de pantalla
Grid como `<ul>`/`<li>` o landmark `main` con headings; tarjeta como `<article>`. Nombre del enlace = título del ítem. Botón favorito: `aria-pressed={estado}` y `aria-label` con plantilla "Marcar como favorito: {titulo}" / "Quitar de favoritos: {titulo}" [MUST]. Rating: contenedor `role="img"` + `aria-label="Valoración: N de 5"` [MUST]. Ítem activo del sidebar: `aria-current="page"`.

## 14. Interacciones
| Disparador | Resultado |
|---|---|
| Click/tap en portada, título o zona no interactiva de la tarjeta | Navega a `/biblioteca/:id` [MUST] |
| Click/tap/Enter/Space en estrella | Alterna favorito; NO navega [MUST] |
| Click en chip de filtro | Filtra el grid; no navega |

Modelo obligatorio (del patrón, para evitar interactivos anidados): **enlace extendido** — un único `<a>` real en el título cuyo pseudo-elemento `::after` con `inset: 0` cubre la tarjeta (portada y huecos clicables); el botón favorito es HERMANO del enlace con `z-index` superior al overlay, de modo que sus clicks nunca alcanzan el enlace (sin `stopPropagation`, sin `<button>` dentro de `<a>`) [MUST].

## 15. Movimiento
Hover de tarjeta: transición de sombra/scale 150-200ms ease-out (ver skill motion-craft). Entrada del grid: sin animación de stagger en la iteración 0 [MAY]. `prefers-reduced-motion`: desactivar scale/transiciones no esenciales [MUST].

## 16. Accesibilidad
Contraste conforme a `design_check` [MUST]. Target táctil del botón favorito ≥44x44px en móvil [MUST]. Focus visible en TODOS los interactivos [MUST]. Un solo H1 [MUST].

## 17. Datos y fixtures
12 ítems reales del dominio (mezcla de tipos: ≥4 libros, ≥2 películas, ≥1 serie, ≥1 manga…), con título, autor/creador, tipo, estado (pendiente/consumiendo/completado), favorito (≥3 activos) y rating variado. Prohibido lorem ipsum.

## 18. Criterios de aceptación
- [ ] Click en la portada navega a `/biblioteca/:id` (test Playwright).
- [ ] Click en el título navega a `/biblioteca/:id` (test Playwright).
- [ ] Enter con foco en el enlace del título navega (test Playwright).
- [ ] Click, Enter y Space en el botón favorito alternan `aria-pressed` y NO navegan (test Playwright).
- [ ] Ningún interactivo anidado: el botón favorito no tiene ancestro `<a>` (test Playwright: `button.closest('a') === null`).
- [ ] Anillo de foco visible al tabular al enlace y al botón (test Playwright + captura).
- [ ] Las N tarjetas renderizadas se comportan igual: N enlaces con nombre = título, N botones favorito (test Playwright).
- [ ] Botón favorito ≥44px en viewport 390x844 (test Playwright: bounding box).
- [ ] Estados vacío/carga/error renderizan el contenido especificado (test Playwright con fixtures forzados).
- [ ] Un solo H1; portadas con `alt=""` (auditoría/test).

## 19. Interpretaciones prohibidas
- No hacer la tarjeta entera un `<div onClick>` ni un `<a>` que envuelva al botón favorito (interactivos anidados).
- No usar `stopPropagation` como mecanismo de independencia del favorito — la independencia sale de la estructura (hermano + z-index).
- No añadir ítems de navegación, métricas ni CTAs que no estén en `ux-flow.md`.
- No introducir colores/sombras fuera de `theme.css`.
- No sustituir portadas reales por placeholders grises "de momento".

## 20. Contexto de revisión
- Iteración actual: 0 · Hallazgos abiertos: ninguno · Captura previa: n/a (iteración 0)

## Checklist
(en una spec real: los 18 ítems de `reference/checklist.md`, marcados)

## Enmiendas
(vacío en v1)
