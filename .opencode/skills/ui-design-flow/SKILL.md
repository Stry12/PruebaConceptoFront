---
name: ui-design-flow
description: Use when designing UI screens with the Stitch MCP server, running the ui_designer agent's 4-phase flow (discovery, visual strategy, UX, Stitch execution), writing or reviewing prompts sent to generate_screen_from_text/edit_screens, or checking why a Stitch-generated screen came out generic/inconsistent. Covers the draft-verify-send pipeline, the mandatory download step, and the design/ artifact folder. Use ONLY for this project's design pipeline — not for general Stitch questions unrelated to this agent setup.
---

# Flujo de diseño de `ui_designer` (Stitch)

Referencia rápida del proceso que `ui_designer` (`.opencode/agents/ui_designer.md`) debe seguir. El detalle completo y autoritativo vive en ese archivo — esta skill es un resumen de guardrails para no perderlos de vista en medio de una sesión larga.

## Las 4 fases (aprobación humana obligatoria en cada una)

1. **Descubrimiento** — propósito, público objetivo, plataforma, restricciones → `design/discovery.md`.
2. **Estrategia de estilos** — paleta (con psicología del color), tipografía, espaciado, lenguaje visual, **prohibiciones explícitas**, y si el diseño usa variación de color por-ítem (avatares/tags), una **paleta rotativa explícita** (`--avatar-color-1..n`) — sin esto, la variación se pierde después. → `design/design-tokens.md` (narrado) + `design/theme.css` (literal, fuente exacta para `frontend_engineer`).
   - **Verificación mecánica antes de pedir aprobación (obligatoria, tool `design_check`, no requiere bash):** `check: "theme-lint"` confirma que `theme.css` no deje grupos de tokens incompletos (estados, tipografía, espaciado, radios, sombras, paleta rotativa); `check: "contrast"` calcula el contraste WCAG de cada par color/fondo. El contraste se interpreta como diseñador (un par que falla solo importa si se usa como texto/fondo real) y la decisión se documenta en `design-tokens.md`. Repetir ambas tras cada corrección de paleta. Ver la skill `verification-tools` para el detalle.
3. **UX** — **estructura firma primero**, DERIVADA clasificando el producto (y el rol de cada pantalla) contra la tabla de arquetipos de `stitch-prompt-crafter/reference/archetypes.md` (objeto central → arquetipo → esqueleto heredado + referentes + una decisión de layout memorable). Es el antídoto contra el esqueleto default `sidebar + stat-cards + grid/tabla` que Stitch aplica a cualquier dominio; al usuario solo se le pregunta ante ambigüedad real entre arquetipos. Luego user flow, inventario de pantallas, jerarquía de información → `design/ux-flow.md`.
4. **Ejecución en Stitch** — solo tras aprobar 1-3. Ver pipeline abajo.

**Nunca se salta una fase ni su aprobación humana.** Si el usuario pide generar ya, resumir lo que falta y ofrecer completarlo rápido — no generar directo.

## Ingeniería de prompts (skill `stitch-prompt-crafter`)

Stitch por defecto produce interfaces genéricas ("AI slop"). La metodología completa de redacción vive en la skill `stitch-prompt-crafter` (`.opencode/skills/stitch-prompt-crafter/`) y se carga OBLIGATORIAMENTE al entrar a la Fase 4, antes de redactar prompt alguno. En resumen: ScreenBrief armado desde los artefactos (nunca de memoria), persona de diseñador senior, capas 1-5 (contexto/estructura/estética/especificación técnica con valores literales de `theme.css`/estado), dials declarados (densidad 1-5, audacia 1-5, movimiento 1-3), vocabulario preciso (nunca "cool"/"moderno"/"azul" a secas — `reference/vocabulary.md`), estados de componentes descritos (`reference/states.md`), prompts ≤4500 caracteres e iterativos (un cambio a la vez), y casos de borde (vacío/error/carga) como nodos propios del árbol.

## Pipeline de Fase 4: borrador → verificación → envío → descarga

Nunca se llama `generate_screen_from_text` en frío:
0. **Design system primero (una vez por proyecto)**: `create_project` → `DESIGN.md` derivado de los tokens de Fase 2, guardado en `design/DESIGN.md` → custom tool `stitch_design_create_design_system` con `designMdFile` → registrar `projectId` y el id `assets/<id>` en `screens.md`. Ese id va como `designSystem` en TODAS las generaciones — la consistencia entre pantallas no se fía solo de la disciplina de prompt.
   ⚠️ Las tools MCP `create_design_system`/`upload_design_md` fallan a través del cliente de OpenCode ("invalid argument" con valores válidos: su validador no resuelve `$defs`/`$ref`), y el base64 de `upload_design_md` jamás se escribe a mano (un modelo lo corrompe siempre) — por eso existen las custom tools `stitch_design_*`, que llaman por HTTP directo y codifican desde archivo.
1. **Borrador**: el prompt completo se escribe primero en `design/prompts/<slug>.md`, con la plantilla de la skill `stitch-prompt-crafter` (ScreenBrief + persona + capas + prohibiciones + prompt final + checklist).
2. **Verificación**: los 18 puntos de `.opencode/skills/stitch-prompt-crafter/reference/checklist.md` contra el borrador (persona, capas, valores literales, prohibiciones, coincide con Fase 3, casos de borde como nodos propios, tamaño ≤4500, `modelId` y `designSystem` correctos, navegación sin ítems genéricos de Stitch, dials coherentes, estados de componentes, léxico anti-default, estructura firma respetada y cada bloque de contenido trazado a la jerarquía — sin stat-cards de relleno) — se corrige el archivo antes de gastar una generación real y el resultado queda marcado en la sección `## Checklist` del borrador.
3. **Envío**: recién aquí se invoca la herramienta, con `modelId: GEMINI_3_FLASH` salvo autorización explícita del usuario para `GEMINI_3_1_PRO`.
4. **Descarga obligatoria**: en cuanto el usuario aprueba una pantalla, se recupera con `get_screen` (no existe una tool separada de "export code") y se guarda a `design/screens/<slug>.html` (+`.png` opcional). Una pantalla no está "terminada" hasta que ese archivo existe en disco — `frontend_engineer` no tiene acceso a las herramientas de Stitch y solo puede trabajar con lo descargado.
5. **Auditoría de calidad (solo lectura, tras descargar)**: sobre el `.html` descargado, invocar la skill `impeccable` con `critique` y `audit` (evaluación UX/contraste/a11y). **Nunca** usar comandos de `impeccable` que editan código (`colorize`, `typeset`, `polish`, `bolder`, etc.) sobre el archivo local — desincroniza el `.html` del proyecto real en Stitch; si hay algo que corregir, se traduce a un prompt y se envía con `edit_screens`, y se vuelve a descargar. Es solo lectura, no un gate bloqueante.

**Auditorías de cierre de lote (una sola vez, sobre todos los `.html` descargados):** `frontend_audit check:"skeleton" path:"design/screens"` detecta la firma del esqueleto default (sidebar + fila de ≥3 stat-cards) y stat-cards de relleno — cada hallazgo se cruza contra la estructura firma y la jerarquía de `ux-flow.md`, y si es relleno se quita con `edit_screens` y se re-descarga. Además, `frontend_audit check:"implied" path:"design/screens"` (o `node .opencode/scripts/audit/implied-screens.mjs .opencode/artifacts/design/screens`) detecta links/botones con texto que implica una pantalla propia ("¿Olvidaste tu contraseña?", "Notificaciones", "Configuración", "Ver todo") que Stitch dibujó pero que nunca entró al inventario de Fase 3. Cada hallazgo es una candidata (cruzarla contra `ux-flow.md`; el mismo texto en varias pantallas suele ser UN gap compartido). Si es un gap real, **no se quita el link del HTML** (oculta el síntoma): se vuelve a Fase 3, se agrega la pantalla al inventario/árbol, se pide aprobación y se genera. Si se decide que no amerita pantalla, se anota como decisión explícita en `ux-flow.md`.

**Cortes de conexión durante la generación (comportamiento esperado, no bug):** `generate_screen_from_text`/`edit_screens` tardan minutos; si la llamada corta por timeout o error de conexión, la generación suele completarse igual en el servidor. **Nunca se reintenta la generación directamente**: se consulta `get_screen`/`list_screens` cada ~30 s (hasta 10 veces) para recuperar la pantalla, y solo se regenera si se confirma que no existe. Reintentar a ciegas duplica pantallas y quema cuota (~350 generaciones/mes en free tier).

## Artefactos (`.opencode/artifacts/design/`)

Todo lo que produce `ui_designer` vive bajo `design/` — es su carpeta exclusiva. Solo `domain.md` y `TODO.md` (si existen) viven en la raíz de `.opencode/artifacts/`, compartidos con `orchestrator`/`frontend_engineer`. Si existe `TODO.md`, márcalo al completar cada fase/pantalla. Esta convención aplica hacia adelante — no reorganices artefactos ya creados en otra ubicación.

## Guardrails

- El diseño visual aprobado no se reinterpreta después — ni por `ui_designer` en refinamientos, ni por `frontend_engineer` al implementar.
- Si el usuario pide subir a `GEMINI_3_1_PRO`, se le explica la razón antes de activarlo — nunca por cuenta propia.
- Si quien invoca es `orchestrator`, el brief que llega es insumo crudo para la Fase 1, no un discovery ya redactado — igual hay que pasar por la aprobación humana de cada fase.
