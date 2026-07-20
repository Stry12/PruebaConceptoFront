---
name: verification-tools
description: Use when verifying frontend quality or design decisions in this project — running audits (CSS duplication, orphan routes, unwired handlers, implied/undesigned screens, hardcoded tokens, phantom registry entries), checking WCAG contrast or theme completeness, or deciding whether a screen can be marked as done. Covers the frontend_audit and design_check custom tools, their npm script equivalents, the complementary impeccable design-quality skill, and how each agent should use them.
---

# Toolbox de verificación mecánica

> **Dev server sin bloqueo** (`node .opencode/scripts/dev-server.mjs start|status|stop`): NUNCA ejecutes `npm run dev`/`vite` en primer plano — no retorna y el agente queda pegado. El lanzador arranca Vite desacoplado en el **puerto FIJO 5173 (`--strictPort` — jamás se crean servers en puertos nuevos)**, espera a que responda, imprime `READY http://localhost:5173/ pid=<n>` y devuelve el control. **`start` siempre reinicia limpio**: mata el server anterior rastreado Y cualquier proceso zombi escuchando en el puerto antes de levantar (para conservar un server vivo, comprueba con `status`, no con `start`). `stop` mata el árbol de procesos y libera el puerto. Estado y log en `.opencode/.dev-server/`. Quien abre el server para una verificación puntual lo cierra al terminar; en el loop de calidad el ciclo de vida lo gobierna `orchestrator` (start tras cada re-implementación = build fresco garantizado).

> **Capturas de estados** (`node .opencode/scripts/capture-states.mjs design/specs/<slug>.capturas.json [dirProyecto]`): fotografía con Playwright los ESTADOS interactivos que `screenshot.mjs` no puede ver — menú contextual abierto, modal/slide-over abierto, hover, foco de teclado — en todos los viewports del config (4 dimensiones). El plan `.capturas.json` lo escribe `frontend_engineer` por pantalla (formato documentado en el propio script; ejemplo: `design/specs/biblioteca.capturas.json`); lo consumen `art_director` (barrido de overlays en el loop) y `design_reviewer`. Requiere el dev server arriba; un estado ERROR no detiene el resto y es hallazgo.

> **MODO frontend-directo**: si `.opencode/design-quality.config.json` tiene `modoGeneracion: "frontend-directo"`, no existen mockups de Stitch — las corridas de `frontend_audit` con `path:"design/screens"` no aplican, y a la caja se suma la **suite Playwright** del proyecto (`npx playwright test`, la escribe `frontend_engineer`, la ejecuta `qa_verifier`) que cubre los criterios de aceptación de cada ScreenSpec (`design/specs/`). `screenshot.mjs` sigue siendo la herramienta de captura del loop, sobre la app corriendo, en los viewports del config.

Este proyecto convierte las auditorías "en prosa" de los agentes en herramientas ejecutables. La regla general: **todo chequeo que pueda ser un script no se hace de memoria ni con grep manual** — se ejecuta la herramienta y se interpreta su salida.

## Herramientas disponibles (custom tools de OpenCode)

| Tool | Check | Qué detecta | Cuándo ejecutarla |
|---|---|---|---|
| `frontend_audit` | `css` | Clases duplicadas entre páginas; patrones (tabla, modal, botón, avatar…) redefinidos por página cuando ya existe el componente en `components/ui/`, o repetidos sin componente | `frontend_engineer`: antes de dar una pantalla por terminada. `qa_verifier`: siempre |
| `frontend_audit` | `routes` | Rutas declaradas sin entrada de navegación (pantallas huérfanas) y navegación hacia rutas inexistentes | Al cerrar el enrutamiento (paso 8.1) |
| `frontend_audit` | `handlers` | 4 clases de UI sin cablear: éxito falso (toast de éxito sin servicio), handlers decorativos, botones sin onClick, confirmaciones que solo cierran el modal — ver la skill `unwired-ui` para el triage y la remediación | Tras cablear cada pantalla (paso 7) |
| `frontend_audit` | `tokens` | Hex hardcodeados en CSS que ya tienen token en `global.css`; literales sin token (INFO, pueden ser valores de Stitch preservados) | Tras traducir estilos de cada pantalla |
| `frontend_audit` | `registry` | Componentes registrados en `frontend-architecture.md` que no existen en el código, y viceversa | Tras actualizar el registro |
| `frontend_audit` | `layers` | CSS sin `@layer` que anula las utilidades de Tailwind v4 (ej. reset global `* {margin:0;padding:0}` — rompe todos los espaciados de la app sin que el build lo detecte) | `frontend_engineer`: tras tocar CSS global. Solo aplica si el proyecto usa Tailwind |
| `frontend_audit` | `implied` | Links/botones con texto que implica una pantalla propia ("¿Olvidaste tu contraseña?", "Notificaciones", "Configuración", "Ver todo"). Con `path:"design/screens"` audita mockups de Stitch (candidatas a revisar contra `ux-flow.md`); sin `path` audita el código y además marca los cascarones sin destino real | `ui_designer`: al cerrar el lote de Fase 4 (contra mockups). `frontend_engineer`: red de seguridad al cerrar (paso 8.3, contra código) |
| `frontend_audit` | `skeleton` | Firma del esqueleto default "admin SaaS" (sidebar + fila de ≥3 stat-cards) y stat-cards de relleno que Stitch cuela sin que el prompt las pida. Cada hallazgo es candidata: se cruza contra la estructura firma (arquetipo) y la jerarquía de `ux-flow.md` — solo `analítica`/`registros` lo justifican. Con `path:"design/screens"` audita mockups; sin `path`, design/screens + pagesDir | `ui_designer`: al cerrar el lote de Fase 4 (contra mockups). `qa_verifier`/`design_reviewer`: contra el código construido |
| `frontend_audit` | `all` | Las anteriores (css, routes, handlers, implied, skeleton, tokens, registry, layers) + resumen PASS/FAIL | `qa_verifier` como primer paso; `orchestrator` para conocer el estado real |
| `design_check` | `contrast` | Ratios WCAG 2.1 de cada token de color contra cada fondo del theme (AA: 4.5:1 texto, 3:1 grande/UI) | `color_strategist`: antes de pedir aprobación de su fase, tras cada corrección de paleta, y al reconciliar deltas post-loop |
| `design_check` | `theme-lint` | Grupos de tokens faltantes en `theme.css` (estados, tipografía, espaciado, radios, sombras, paleta rotativa) | `color_strategist`: antes de cerrar su fase |

**Calidad de diseño (aparte de estas herramientas mecánicas):** `frontend_audit`/`design_check` son deterministas (pasa/falla objetivo). La calidad *subjetiva* de diseño tiene dos instrumentos complementarios: la skill `impeccable` con `audit`/`critique` (solo lectura — la usa `ui_designer` sobre el `.html` descargado y `frontend_engineer` sobre el código construido, además de `polish`, que sí edita, solo en `frontend_engineer`), y la **rúbrica numérica de la skill `art-direction`** (24 categorías 0-100 con anclas y evidencia obligatoria — la usa exclusivamente `art_director` sobre la pantalla firma dentro del loop de calidad, con veredicto contra el umbral de `design-quality.config.json`). Tres patas: las mecánicas garantizan que *funciona y es fiel*; `impeccable` evalúa que *está bien diseñado*; la rúbrica decide si *alcanza el nivel exigido para ser la base visual del producto*.

**Screenshots para verificación visual** (`qa_verifier`, `design_reviewer` y `art_director`; sin dependencias — usa Edge/Chrome instalado): `node .opencode/scripts/screenshot.mjs <url|archivo.html> <salida.png> [1280x800]`. Sirve tanto para la app corriendo (`http://localhost:5173/login`) como para mockups en disco (`design/screens/<slug>.html`) — `art_director` captura cada iteración de la pantalla firma a `art-direction/shots/iter-<n>.png` con el viewport fijo del config (la consistencia del scoring depende de no variar el viewport), y `qa_verifier` compara app vs. diseño aprobado.

Equivalentes por terminal: `node .opencode/scripts/audit/run-all.mjs` (todas), o el script individual (`css-duplication.mjs`, `route-reachability.mjs`, `handler-wiring.mjs`, `implied-screens.mjs`, `token-fidelity.mjs`, `registry-sync.mjs`, `unlayered-css.mjs`, `contrast.mjs`, `theme-lint.mjs`). **Todos aceptan `--root <ruta>`** para auditar cualquier directorio (la app en un subdirectorio, otro proyecto, un fixture): `node .opencode/scripts/audit/run-all.mjs --root hospital-frontend`. Sin `--root` auditan el directorio actual. El `.opencode/audit.config.json` se busca en la raíz indicada y hacia arriba (hasta 4 niveles), y sus rutas se resuelven contra el directorio que contiene ese `.opencode` — así el resultado es el mismo desde cualquier cwd. La tool `frontend_audit` expone lo mismo vía el parámetro opcional `root`. Si el proyecto generado tiene `package.json`, `frontend_engineer` puede añadir alias npm (`"audit": "node .opencode/scripts/audit/run-all.mjs"`) por comodidad, pero los scripts no dependen de ello.

## Cómo interpretar la salida

- **WARN** = hallazgo que se corrige o se justifica por escrito (en `frontend-architecture.md` o en el reporte de QA). Nunca se ignora en silencio.
- **INFO** = contexto para decidir, no exige acción (ej. un hex literal de Stitch preservado a propósito).
- **Exit code 1 / FAIL** = la pantalla o fase no puede marcarse como terminada en `TODO.md` hasta resolver o justificar los WARN.
- Las herramientas son heurísticas: un WARN de `handlers` sobre un botón de "ver detalle" puede ser falso positivo — se verifica y se descarta con una frase, no se elimina el chequeo.

## Reparto por agente

- **`color_strategist`** (bash denegado): usa `design_check` (`contrast`/`theme-lint`) antes de pedir aprobación de su fase y al reconciliar deltas post-loop. El contraste es insumo de decisión de paleta, no un bloqueo automático — un par que falla solo importa si ese par se usa como texto/fondo real.
- **`ui_designer`** (bash denegado): usa `frontend_audit check:"implied"/"skeleton"` con `path:"design/screens"` al cerrar el lote de E4c para detectar pantallas implícitas y esqueleto default. Para calidad de diseño usa además la skill `impeccable` (`critique`/`audit`, solo lectura).
- **`art_director`**: captura con `screenshot.mjs` y puntúa con la rúbrica de la skill `art-direction` (viewport fijo, evidencia por score). No ejecuta las auditorías de código — su objeto es el mockup.
- **`frontend_engineer`**: ejecuta el check correspondiente al terminar cada paso (css+tokens tras estilos, handlers tras cablear, routes+registry+implied al cerrar). Los pasos 7/8.1/8.3 de su prompt se cumplen ejecutando estas herramientas, no releyendo el código a mano; el pulido de diseño (paso 8.2) usa la skill `impeccable`.
- **`qa_verifier`**: ejecuta `frontend_audit all` siempre, más verificación de extracción y runtime. Es quien emite el veredicto final — `frontend_engineer` no se auto-aprueba.
- **`orchestrator`**: puede pedir `frontend_audit all` para conocer el estado real antes de reportar al usuario, pero no corrige nada él mismo.

## Mantenimiento

Los scripts viven en `.opencode/scripts/audit/` (Node puro, sin dependencias; si la app aún no existe, reportan "nada que auditar" en vez de fallar).

**Multi-stack.** Las auditorías soportan React/Next (`.tsx`/`.jsx`), Angular (`.ts` + templates `.html` + `.scss`), Vue y Svelte (SFC con `<style>` embebido) y TS/JS plano. Las rutas se autodetectan (candidatos comunes: `src/pages`, `src/app/pages`, `src/views`…), pero el proyecto debe fijarlas explícitamente en `.opencode/audit.config.json` (lo escribe `frontend_engineer` en su Paso 0):
```json
{ "srcDir": "src", "pagesDir": "src/pages", "componentsDir": "src/components", "tokensFile": "src/styles/global.css", "publicRoutes": ["/login"] }
```
Los tokens se leen tanto de custom properties CSS (`--color-x`) como de variables SCSS (`$color-x`). El enrutamiento por archivos (Next App Router/SvelteKit puro) no se detecta automáticamente — declarar rutas en la config o verificar a mano. Si un agente detecta un falso positivo recurrente o un patrón nuevo que auditar, lo reporta al usuario para ajustar el script — no "compensa" el defecto del script con prosa en su prompt.
