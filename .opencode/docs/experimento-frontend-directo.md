# Experimento: modo `frontend-directo` (Stitch deshabilitado)

**Fecha:** 2026-07-19
**Estado:** PREPARADO — pendiente de ejecución del pipeline en OpenCode
**Reversible:** sí (ver [Procedimiento de rollback](#procedimiento-de-rollback))

## Objetivo y alcance

Probar si la organización de diseño actual (brand_strategist → color_strategist → ui_designer → art_director / design_reviewer) puede producir **especificaciones de implementación frontend** lo bastante precisas como para que `frontend_engineer` construya la interfaz directamente, sin Stitch. En este modo:

- Stitch MCP queda deshabilitado (`opencode.json → mcp.stitch.enabled: false`), sin borrar su configuración ni credenciales.
- `ui_designer` compone **ScreenSpecs** (`.opencode/artifacts/design/specs/<slug>.md`) en vez de prompts de Stitch, usando la skill `screen-spec-composer`.
- La fuente de verdad de revisión es la **app renderizada** (capturas con `screenshot.mjs`), no el mock de Stitch.
- El loop de calidad conserva rúbrica, `umbral`, `maxIteraciones` y veredictos (APROBADA/ITERAR/TECHO); ITERAR produce enmiendas de spec + cambios de código, nunca `edit_screens`.
- El caso de validación inicial es la tarjeta de la Biblioteca (MediaVault): portada y título abren el detalle, favorito independiente, sin interactivos anidados, accesible por teclado, con tests Playwright.

El run actual de MediaVault (estancado en TECHO, score 84 < 90) se archiva; el pipeline se ejecutará **desde cero** por decisión del usuario.

## Flag de control

`.opencode/design-quality.config.json → "modoGeneracion"`:

- `"stitch"` — comportamiento original (los bloques de modo en agentes quedan inertes).
- `"frontend-directo"` — este experimento.

## Inventario de cambios

| Archivo | Tipo | Cambio | Reversión |
|---|---|---|---|
| `opencode.json` | modificado | `mcp.stitch.enabled: true → false` (único cambio; bloque y credencial intactos) | restaurar desde `opencode.json.bk` |
| `opencode.json.bk` | creado | backup íntegro pre-cambio (SHA256 verificado) | conservar hasta rollback confirmado; luego borrable |
| `.opencode/design-quality.config.json` | modificado | `+modoGeneracion`, `+_modoGeneracionValores`, `+guardarArtefactosIteracion`, viewports `+390x844`, `_lectores` ampliado (6 agentes) | `modoGeneracion: "stitch"` o quitar claves añadidas |
| `.gitignore` | modificado | allowlist `mediavault-frontend/` + re-ignores (node_modules, dist, test-results, playwright-report) | quitar las 6 líneas añadidas |
| `.opencode/artifacts/design/` → `_archive/stitch-run-2026-07-19/design/` | movido | run mediaVault completo archivado (30 archivos) | mover de vuelta |
| `.opencode/artifacts/art-direction/` → `_archive/stitch-run-2026-07-19/art-direction/` | movido | loop TECHO 84 archivado (7 archivos) | mover de vuelta |
| `.opencode/artifacts/TODO.md` | modificado | reseteado para run desde cero en modo frontend-directo | versión anterior descrita en `_archive/` (score-history) y en git |
| `.opencode/agents/orchestrator.md` | modificado | nota de modo + guardrail ampliado + bloque `## Modo frontend-directo` (variantes 3d/3d-bis/3e/3f/3h) | quitar nota y bloque (inertes con flag en "stitch") |
| `.opencode/agents/ui_designer.md` | modificado | nota de modo + anotaciones "(solo modoGeneracion: stitch)" + bloque de modo (Compositor de Especificaciones) | ídem |
| `.opencode/agents/art_director.md` | modificado | nota de modo + bloque de modo (puntúa capturas de la app; directivas de 7 campos) | ídem |
| `.opencode/agents/frontend_engineer.md` | modificado | nota de modo + anotación en reglas duras + bloque de modo (spec autoritativa, MUST/SHOULD/MAY, Playwright) | ídem |
| `.opencode/agents/qa_verifier.md` | modificado | permisos `+npx playwright test*`/`+npm test*` + bloque de modo (suite Playwright, diff contra spec) | ídem |
| `.opencode/agents/design_reviewer.md` | modificado | bloque de modo (fidelidad contra spec; franjas re-mapeadas) | ídem |
| `.opencode/skills/screen-spec-composer/` | creado | skill nueva: SKILL.md + reference/{plantilla,refinamiento,checklist,ejemplo-biblioteca}.md | borrar carpeta |
| `.opencode/skills/ui-design-flow/SKILL.md` | modificado | nota de modo al inicio | quitar nota |
| `.opencode/skills/orchestration-flow/SKILL.md` | modificado | nota de modo al inicio | quitar nota |
| `.opencode/skills/verification-tools/SKILL.md` | modificado | nota de modo al inicio | quitar nota |
| `.opencode/intelligence/patterns/grid-portadas--biblioteca.md` | modificado | +sección "Modelo de interacción de la tarjeta (OBLIGATORIO)" — lección consolidada, persiste entre runs | conocimiento consolidado: NO se revierte con el experimento |
| `.opencode/docs/experimento-frontend-directo.md` | creado | este documento | borrable tras rollback completo |

No tocados: credencial de Stitch, `.opencode/tools/stitch_design.ts`, skill `stitch-prompt-crafter`, skill `motion-craft`, borrados pendientes de `hospital-frontend/` en git, scripts de auditoría, `domain.md`.

## Backup

- Original: `opencode.json` (raíz del repo; ignorado por git — el backup existe SOLO en disco).
- Backup: `opencode.json.bk`
- Verificación: comparación SHA256 (hashes registrados abajo; nunca se imprime el contenido del archivo porque contiene una API key real).
- Hash pre-cambio (original == backup, verificado 2026-07-19): `83CD162B6E492EBC6934D935CFFBFA5E37DFC513C387A8E3582F1D1DD169CD25`
- Hash post-cambio (solo `enabled: false`): `BD99C1CDACDC700E661A0F89704F7445FF7B1407CD0FF9871EDEABA5012FB65F`
- **No borrar el backup** hasta confirmar que Stitch vuelve a funcionar tras un eventual rollback.

## Procedimiento de rollback

No ejecutar salvo fallo del experimento o petición explícita.

1. Detener cualquier flujo experimental en curso (dev server, loop de revisión).
2. Verificar integridad del backup: `(Get-FileHash opencode.json.bk).Hash` == hash pre-cambio registrado arriba.
3. Restaurar: `Copy-Item opencode.json.bk opencode.json -Force`.
4. Validar: `Get-Content opencode.json -Raw | ConvertFrom-Json` parsea y `mcp.stitch.enabled` es `true` (comprobación de propiedad, sin imprimir el archivo).
5. En `.opencode/design-quality.config.json`: poner `"modoGeneracion": "stitch"` (opción A — los bloques de modo quedan inertes; recomendada) o eliminar las claves añadidas y las entradas de `_lectores` según el inventario (opción B — revert completo).
6. Opcional (limpieza profunda): borrar `.opencode/skills/screen-spec-composer/`, `.opencode/artifacts/design/specs/` y las adiciones a `.gitignore`; restaurar los artefactos archivados desde `.opencode/artifacts/_archive/stitch-run-2026-07-19/` a sus rutas originales.
7. Verificar que ningún ajuste experimental sigue activo: `grep -r "frontend-directo" .opencode/*.json` debe devolver solo `"modoGeneracion": "stitch"`-compatible (o nada tras revert completo).
8. Arrancar OpenCode y confirmar que las tools de Stitch vuelven a registrarse (p. ej. `list_screens` disponible para `ui_designer`).
9. Conservar `opencode.json.bk` hasta confirmar Stitch operativo; después puede borrarse.

## Checklist de validación (nivel configuración)

- [x] `opencode.json.bk` existe y su SHA256 coincide con el hash pre-cambio. (2026-07-19)
- [x] `opencode.json` parsea; único cambio semántico: `mcp.stitch.enabled: false`; bloque y credenciales intactos (verificado por propiedades, sin imprimir el archivo).
- [x] `design-quality.config.json` parsea; `modoGeneracion` presente; `_lectores` actualizado (6 agentes).
- [x] Los 6 agentes tienen bloque `## Modo frontend-directo`; las referencias a Stitch quedan anotadas o cubiertas por la nota global "MODO ACTIVO", no borradas. `brand_strategist`/`color_strategist` solo mencionan Stitch en prohibiciones de propiedad (benigno, sin cambios).
- [x] Skill `screen-spec-composer` completa (SKILL.md + plantilla + refinamiento + checklist + ejemplo).
- [x] Run anterior archivado en `_archive/stitch-run-2026-07-19/` (39 archivos movidos); `TODO.md` reseteado.
- [x] `.gitignore` verificado con `git check-ignore`: `mediavault-frontend/src/*` trackeable, `node_modules` ignorado, `opencode.json.bk` ignorado.
- [x] Inventario de cambios == delta real de `git status`; borrados de `hospital-frontend` y modificaciones pre-existentes (`domain.md`, `audit.config.json`, `stitch-prompt-crafter/*`) intactos.
- [x] Rollback documentado (sección arriba).

La validación de ejecución (render, capturas, revisión, tests Playwright, tarjeta corregida) queda **pendiente del run del pipeline en OpenCode** — este experimento no se reporta como exitoso hasta entonces.

## Instrucciones de ejecución del experimento

1. Arrancar OpenCode en la raíz del repo (Stitch ya no se registra; el resto del sistema arranca normal).
2. Dar al `orchestrator` la especificación funcional de MediaVault (run desde cero).
3. El pipeline sigue su flujo E1→E2→E3 normal; en Fase 4, `ui_designer` compone la ScreenSpec de la pantalla firma con `screen-spec-composer`.
4. Loop de calidad: `frontend_engineer` implementa desde la spec → app corriendo → captura (`node .opencode/scripts/screenshot.mjs http://localhost:5173/<ruta> <out>.png <viewport>`, viewports del config) → `art_director` puntúa → ITERAR = enmienda de spec + cambio de código → re-captura. Salida por APROBADA (≥ umbral), o TECHO/maxIteraciones con decisión del usuario.
5. `qa_verifier` ejecuta `frontend_audit all` + suite Playwright; `design_reviewer` revisa la app viva contra la spec.
6. Registrar el resultado en la sección "Informe final" de este documento.

## Adenda 2026-07-19 — Primer intento y reset total del entorno

**Incidente:** el primer run del experimento completó E1→E4a + implementación (specs, `mediavault-frontend/`, dev server), pero reprodujo la identidad visual EXACTA del run de Stitch (paleta `#3B4856`/`#9A7520`, Plus Jakarta Sans + Inter). **Causa raíz:** la capa `.opencode/intelligence/` conservaba el registro `projects/mediaVault.md` (snapshot literal del sistema aprobado) y 4 patterns con hex del run anterior; el retrieval de los agentes de estrategia reprodujo esa identidad. Nota: durante ese run también desapareció el archivo `artifacts/_archive/stitch-run-2026-07-19/` original (no lo borró este experimento).

**Acción (a petición explícita del usuario — "borra todo lo antiguo, como si partiera de 0 en conocimiento y proyectos"):** borrado definitivo, no archivado:
- Eliminados: `artifacts/_archive/` completo (incluido el run-1 archivado y el intento run-2), `artifacts/domain.md`, `artifacts/design|frontend|qa|design-review|art-direction` del intento, `ENGANCHE_BACKEND.md`, `mediavault-frontend/` (dev servers detenidos primero — PIDs de vite/esbuild anclados a la carpeta).
- Intelligence reseteada: eliminados el registro de proyecto, los 4 patterns y las heurísticas candidatas; `anti-patrones.md` conserva SOLO los 3 estructurales (AP-1..3, sin identidad de proyecto); `index.md` refleja el reset y la excepción a la regla "nunca se borra" (autorizada por el usuario).
- `TODO.md` reseteado a "sin proyecto activo".
- El modelo obligatorio de interacción de tarjetas sobrevive en `screen-spec-composer/reference/ejemplo-biblioteca.md` (contrato de interacción, sin valores visuales).

**Implicación para el rollback:** los pasos de restauración de artefactos archivados ya no aplican (no existe archivo del run Stitch). El rollback de configuración (opencode.json.bk + `modoGeneracion: "stitch"`) sigue íntegro y verificado.

## Adenda 2026-07-19 (2) — Craft de contención y prioridad visual

**Defectos observados en el run activo (iteraciones 1-2):** botón `…` derramado fuera de su card y en posiciones distintas entre cards (altura de card gobernada por el contenido), espaciados aplastados en la barra de acciones, y pantalla casi monocroma (fixtures con placeholders grises en vez de portadas — en una biblioteca las portadas SON el color).

**Cambios:**
- Nueva referencia `screen-spec-composer/reference/craft.md` — destilado de sistemas de referencia (Apple HIG / skills apple-design): anatomía de slots para componentes repetidos, contención estricta, ritmo 8pt, proporción de color 60/30/10, máx. 4 tamaños/2 pesos, radios jerárquicos, sombras en capas, feedback universal. Consumo obligatorio del compositor; `plantilla.md` §7 y `checklist.md` (ítems 19-23) actualizados.
- `frontend_engineer.md` (bloque de modo): estrategias anti-derrame (slots con flex/h-full/mt-auto, line-clamp + min-height, absolute anclado + overflow) y 3 tests Playwright nuevos obligatorios: contención por bounding box, consistencia de offset del control repetido (±2px), alturas iguales por fila.
- `art_director.md` (bloque de modo): **la visión manda** — el verde de Playwright es piso funcional, no evidencia visual; nuevo barrido visual de contención/consistencia/ritmo/color ANTES de puntuar; fixtures sin imágenes reales ⇒ evaluación visual inválida (bloqueo, no score); prohibido citar tests como fortaleza.
- Segunda abstracción de las skills Apple (`craft.md` §6-8 + plantilla §4/15/17 + checklist): jerarquía de texto por niveles medibles (primary/secondary/muted, valor > etiqueta, números tabulares, texto ≤600px), regla del multiplicador ×2 en espaciado, sombra tintada, microcopy como contrato (empty states con guía+CTA reales), momento pico del flujo (Peak-End). Mecánica de flujo: `ui_designer` E4a ahora abre con **exploración divergente** (2-3 direcciones visuales nombradas con ≥3 diferencias medibles, gate rápido de usuario) antes de redactar la spec — anti-genérico estructural.

## Adenda 2026-07-19 (5) — Capturas de estados de componentes + 4 viewports

**Necesidad:** las capturas base no muestran qué pasa al abrir el menú `…`, pulsar `+` (modal), hover o foco — y ahí viven los defectos de overlays. Además se amplió la evaluación a 4 dimensiones de pantalla.
**Cambios:** (1) `viewports` del config ampliado a `["1920x1080","1280x800","768x1024","390x844"]`; (2) nuevo `.opencode/scripts/capture-states.mjs` — dirigido por un plan JSON por pantalla (`design/specs/<slug>.capturas.json`, entregable de `frontend_engineer` derivado de las secciones 11/14 de la spec), usa el Playwright del proyecto, ejecuta acciones (click/hover/press/fill/esperar) y captura estado × viewport; fallos por-estado no detienen el resto y son hallazgo. (3) Cableado: entregable + verificación del plan en `frontend_engineer`; paso 1b del barrido del `art_director` (overlays: menú fuera de viewport, modal sin scrim, derrames — plan faltante = hallazgo); uso en `design_reviewer`; permisos en los 4 agentes; documentado en `verification-tools`.
**Probado en real:** plan de biblioteca con 5 estados (base, menú `…` abierto, modal `+`, hover de card, primer foco) × 4 viewports = 20/20 capturas OK. La captura del estado de menú reveló de inmediato dos hallazgos reales: H1 "Biblioteca" recortado bajo la barra de búsqueda (contención del header) y el popover del menú no visible en viewport tras el click (candidato a overlay fuera de pantalla) — pendientes para la próxima iteración del loop.

## Adenda 2026-07-19 (4) — Dev server sin bloqueo

**Problema:** los agentes ejecutaban `npm run dev` en primer plano y quedaban pegados (el comando nunca retorna); además dejaban servers zombis entre runs (se encontraron y mataron 2 procesos Vite huérfanos de corridas anteriores).
**Solución:** `.opencode/scripts/dev-server.mjs` (sin dependencias, como screenshot.mjs) — `start` lanza el binario de Vite DIRECTO con node (sin cmd/npm: los .cmd batch se cuelgan en "¿Terminar trabajo por lotes?" ante un CTRL+C heredado), desacoplado (`detached` + log a archivo), espera a que el server publique su URL en el log Y responda HTTP, imprime `READY <url> pid=<n>` y retorna; detecta el puerto real (Vite auto-incrementa si 5173 está ocupado); idempotente; fail-fast si el proceso muere al arrancar. `status` / `stop` (taskkill /T del árbol). Estado/log en `.opencode/.dev-server/` (git-ignorado).
**Probado en real:** ciclo start → status RUNNING → captura screenshot.mjs OK (725 KB) → stop limpio → status NOT_STARTED.
**Endurecimiento posterior (a petición del usuario):** (1) **puerto fijo** — Vite se lanza con `--port 5173 --strictPort`, jamás auto-incrementa a puertos nuevos; (2) **`start` = reinicio limpio** — mata el server rastreado anterior Y cualquier proceso zombi escuchando en el puerto (netstat/lsof + taskkill /T) antes de levantar; para conservar un server vivo se usa `status`, no `start`. Re-probado: start con zombi en :5173 (lo mató y arrancó en :5173) → start con server vivo (lo reemplazó en el MISMO puerto, pid nuevo) → stop deja el puerto libre.
**Cableado:** regla "nunca npm run dev en primer plano" + uso del lanzador en `frontend_engineer` (además ganó allowlist bash para dev-server/screenshot), `qa_verifier` (paso 3), `design_reviewer` (paso 1), permisos en `art_director`; ciclo de vida del server en el loop del `orchestrator` (start al entrar, vivo entre iteraciones, stop al salir); documentado en `verification-tools/SKILL.md`.

## Adenda 2026-07-19 (3) — Lente de filosofía experta

Nueva referencia `art-direction/reference/filosofia.md` (consumida por `art_director` como lente previa a la rúbrica, y por `ui_designer` vía `screen-spec-composer` al componer/explorar): Rams (6 preguntas de honestidad, "menos pero mejor"), Vignelli (semántica/sintáctica/pragmática + apropiado/atemporal), Tufte (test de eliminación, tinta/información), Refactoring UI (jerarquía por des-énfasis, exceso de blanco inicial, sistemas de tonos, labels como último recurso, luz coherente), craft Rauno/Vercel-Kowalski (robustez, detalles invisibles, <200ms, UI optimista), y §6 "cómo se forma el criterio": calibrar contra el mejor referente del vertical (no contra la iteración previa), nombrar con precisión, estudiar el delta, robar decisiones nunca identidad, juzgar en el peor caso. Cableada en `art-direction/SKILL.md` (paso 2 de carga + mapa) y `screen-spec-composer/SKILL.md` (tabla de referencias).

## Informe final

_Pendiente de ejecución (el intento del 2026-07-19 se descartó por contaminación de retrieval — ver adenda)._
