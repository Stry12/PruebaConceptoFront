---
name: ui-design-flow
description: Use when designing UI screens with the Stitch MCP server, running the design pipeline stages (brand/color strategy contracts, ui_designer's UX phase, signature-screen generation, the art_director quality loop, system extraction and remaining screens), writing or reviewing prompts sent to generate_screen_from_text/edit_screens, or checking why a Stitch-generated screen came out generic/inconsistent. Covers the draft-verify-send pipeline, the mandatory download step, and the design/ artifact folder. Use ONLY for this project's design pipeline — not for general Stitch questions unrelated to this agent setup.
---

# Flujo de diseño (Stitch + loop de calidad)

> **MODO frontend-directo**: si `.opencode/design-quality.config.json` tiene `modoGeneracion: "frontend-directo"` (experimento — ver `.opencode/docs/experimento-frontend-directo.md`), Stitch está deshabilitado y TODO lo que esta skill dice sobre E4/Stitch (design system, generate_screen_from_text, edit_screens, descarga de .html) queda inerte. En su lugar: `ui_designer` compone ScreenSpecs con la skill `screen-spec-composer` (`design/specs/<slug>.md`), `frontend_engineer` implementa desde la spec, y el loop de calidad puntúa capturas de la app renderizada. E1-E3 no cambian. Los bloques `## Modo frontend-directo` de cada agente son la fuente autoritativa.

Referencia rápida del proceso de diseño del pipeline. El detalle completo y autoritativo vive en los agentes (`brand_strategist.md`, `color_strategist.md`, `ui_designer.md`, `art_director.md`) — esta skill es un resumen de guardrails para no perderlos de vista en medio de una sesión larga.

## Las etapas (aprobación humana obligatoria en cada gate)

1. **E1 — Descubrimiento y marca** (`brand_strategist`): B1 discovery (propósito, público, plataforma, restricciones → `design/discovery.md`) y B2 brand brief en intención — personalidad, dirección emocional, nivel premium 1-5, lenguaje de diseño, referentes con renuncias, keywords, y (solo proyectos persuasivos/comerciales o audacia ≥4) 2-3 **direcciones creativas** nombradas de las que el usuario elige una → `design/brand-brief.md`. Cero valores literales: los hex y las fuentes son de la etapa 2.
2. **E2 — Color y tokens** (`color_strategist`): sistema de color semántico completo — primario/secundario/acento con reglas de uso, escalas de neutros y superficies, texto/bordes/fondos, semánticos con fondos suaves, paleta rotativa si aplica, **modo claro y oscuro** → `design/color-system.md`; tabla completa de tokens (color+tipografía+espaciado+radios+sombras+prohibiciones) → `design/design-tokens.md`; y la versión literal → `design/theme.css` (`:root` + `[data-theme="dark"]`).
   - **Verificación mecánica antes de pedir aprobación (obligatoria, tool `design_check`, no requiere bash):** `check: "theme-lint"` confirma que `theme.css` no deje grupos incompletos; `check: "contrast"` calcula el contraste WCAG de cada par color/fondo. El contraste se interpreta como diseñador y la decisión se documenta. Los pares del modo oscuro se verifican también (manualmente si el script no parsea el bloque dark). Repetir tras cada corrección. Ver la skill `verification-tools`.
3. **E3 — UX** (`ui_designer`, Fase 3): **estructura firma primero**, DERIVADA clasificando el producto (y el rol de cada pantalla) contra la tabla de arquetipos de `stitch-prompt-crafter/reference/archetypes.md`. Es el antídoto contra el esqueleto default `sidebar + stat-cards + grid/tabla`. Luego user flow, inventario — cada pantalla con arquetipo y **registro** (`producto`: audacia 1-3, lente product.md · `marketing`: audacia 3-5, lente brand.md) — jerarquía de información, árbol de estados, y la **selección de la pantalla firma** (regla en `design-quality.config.json`; el usuario la confirma en el mismo gate) → `design/ux-flow.md`.
4. **E4 — Ejecución en Stitch** (`ui_designer`) — solo tras aprobar E1-E3. Sub-etapas:
   - **E4a**: design system en Stitch (DESIGN.md + custom tool) + generación y descarga de **SOLO la pantalla firma** por el pipeline borrador→verificación→envío→descarga. No se presenta al usuario: entra al loop.
   - **Loop de calidad** (dirigido por `orchestrator`, config `umbral`/`maxIteraciones`): `art_director` puntúa 24 categorías con la rúbrica de la skill `art-direction` (evidencia obligatoria por score) → veredicto APROBADA/ITERAR/TECHO → si ITERAR, `ui_designer` traduce las directivas con `stitch-prompt-crafter/reference/refinement.md` a `edit_screens` (valores literales, 1-2 cambios por llamada, re-anclaje del diseño), **re-descarga siempre** y registra en `## Iteraciones` del borrador → se repite. APROBADA habilita el **gate del usuario** (no lo sustituye); maxIteraciones/TECHO escalan la decisión al usuario, nunca se continúa en silencio.
   - **E4b**: extracción del sistema desde la pantalla aprobada → `design/system-extraction.md` + `DESIGN.md` actualizado + subida a Stitch (`stitch_design_upload_design_md`). Los deltas de `theme.css` los reconcilia `color_strategist` (dueño del archivo), nunca `ui_designer`.
   - **E4c**: resto de pantallas heredando el `designSystem` actualizado y las Capas 1/3/4 del prompt firma (copiadas, no reescritas de memoria). Sin loop — la calidad la garantiza la herencia. Auditorías de cierre de lote al final (ver abajo).

**Nunca se salta una etapa ni su aprobación humana.** Si el usuario pide generar ya, resumir lo que falta y ofrecer completarlo rápido — no generar directo. `dryRun: true` en el config ejecuta todo hasta los borradores verificados sin invocar Stitch (0 cuota).

## Ingeniería de prompts (skill `stitch-prompt-crafter`)

Stitch por defecto produce interfaces genéricas ("AI slop"). La metodología completa vive en la skill `stitch-prompt-crafter` (`.opencode/skills/stitch-prompt-crafter/`) y se carga OBLIGATORIAMENTE al entrar a la Fase 4, antes de redactar prompt alguno. En resumen: ScreenBrief armado desde los artefactos (nunca de memoria), persona de diseñador senior, capas 1-5, dials declarados (densidad 1-5, audacia 1-5, movimiento 1-3), vocabulario preciso (`reference/vocabulary.md`), estados de componentes (`reference/states.md`), prompts ≤4500 caracteres e iterativos, casos de borde como nodos propios, y el protocolo de refinamiento del loop (`reference/refinement.md`).

## Pipeline por pantalla: borrador → verificación → envío → descarga

Nunca se llama `generate_screen_from_text` en frío:
0. **Design system primero (una vez por proyecto)**: `create_project` → `DESIGN.md` derivado de los tokens de E2, guardado en `design/DESIGN.md` → custom tool `stitch_design_create_design_system` con `designMdFile` → registrar `projectId` y el id `assets/<id>` en `screens.md`. Ese id va como `designSystem` en TODAS las generaciones.
   ⚠️ Las tools MCP `create_design_system`/`upload_design_md` fallan a través del cliente de OpenCode ("invalid argument": su validador no resuelve `$defs`/`$ref`), y el base64 de `upload_design_md` jamás se escribe a mano — por eso existen las custom tools `stitch_design_*` (HTTP directo + encoding desde archivo).
1. **Borrador**: el prompt completo se escribe primero en `design/prompts/<slug>.md`, con la plantilla de la skill.
2. **Verificación**: los 18 puntos de `stitch-prompt-crafter/reference/checklist.md` contra el borrador — se corrige el archivo antes de gastar una generación real y el resultado queda marcado en `## Checklist`.
3. **Envío**: recién aquí se invoca la herramienta, con el `modelId` del config (`GEMINI_3_FLASH` default; `GEMINI_3_1_PRO` solo con autorización explícita del usuario).
4. **Descarga obligatoria**: en cuanto la pantalla queda aprobada (o tras cada iteración del loop), se recupera con `get_screen` y se guarda a `design/screens/<slug>.html` (+`.png` opcional). Una pantalla no está "terminada" hasta que ese archivo existe en disco — y el `art_director` puntúa el archivo en disco, no lo que quedó en Stitch.
5. **Auditoría de calidad (solo lectura, tras descargar)**: skill `impeccable` con `critique` y `audit`. **Nunca** sus comandos de edición sobre el archivo local (desincroniza el `.html` del proyecto real en Stitch); toda corrección va por `edit_screens` + re-descarga.

**Auditorías de cierre de lote (E4c, una sola vez sobre todos los `.html`):** `frontend_audit check:"skeleton"` (esqueleto default / stat-cards de relleno — cruzar contra la estructura firma; si es relleno, `edit_screens` + re-descarga) y `frontend_audit check:"implied"` (links que implican pantallas nunca inventariadas — si es gap real, vuelve a Fase 3: inventario + aprobación + generación; no se borra el link del HTML).

**Cortes de conexión durante la generación (comportamiento esperado, no bug):** `generate_screen_from_text`/`edit_screens` tardan minutos; si la llamada corta, la generación suele completarse igual en el servidor. **Nunca se reintenta directamente**: `get_screen`/`list_screens` cada ~30 s (hasta 10 veces), y solo se regenera si se confirma que no existe. Reintentar a ciegas duplica pantallas y quema cuota (~350 generaciones/mes en free tier).

## Artefactos (`.opencode/artifacts/design/`)

`design/` tiene propiedad **por archivo**: `discovery.md`+`brand-brief.md` (`brand_strategist`); `color-system.md`+`design-tokens.md`+`theme.css` (`color_strategist`); `ux-flow.md`, `prompts/*`, `screens.md`, `screens/*.html`, `DESIGN.md`, `system-extraction.md` (`ui_designer`). Solo `domain.md` y `TODO.md` viven en la raíz de `.opencode/artifacts/`. Si existe `TODO.md`, márcalo al completar cada fase/pantalla. Esta convención aplica hacia adelante — no reorganices artefactos ya creados en otra ubicación.

## Guardrails

- El diseño visual aprobado no se reinterpreta después — ni por `ui_designer` en refinamientos, ni por `frontend_engineer` al implementar.
- Los contratos de estrategia (E1/E2) no los escribe ni corrige `ui_designer` — si faltan, se reporta; si hay que corregirlos, lo hace su dueño.
- `ui_designer` nunca se auto-puntúa ni declara aprobada la pantalla firma — el scoring es de `art_director` y la aprobación del usuario.
- Si el usuario pide subir a `GEMINI_3_1_PRO`, se le explica la razón antes de activarlo — nunca por cuenta propia.
- Si quien invoca es `orchestrator`, los contratos ya deberían existir — verificarlos leyéndolos, e igual pasar por la aprobación humana de la Fase 3.
