# Design Quality Pipeline — Arquitectura

Documento de arquitectura de la integración del pipeline de calidad de diseño sobre el sistema multi-agente existente. Vive en `.opencode/docs/` (no en `artifacts/`, que se sobrescribe por proyecto). Fecha: 2026-07-18.

---

## 1. Auditoría de la arquitectura previa

**Lo que existía** (5 agentes en `.opencode/agents/`, orquestación por Task tool con allowlist, artefactos por dueño en `.opencode/artifacts/`):

- `orchestrator` (primary): dominio + TODO.md + delegación. `ui_designer`: 4 fases (discovery → estrategia visual → UX → Stitch, todas las pantallas), único consumidor del MCP `stitch`. `frontend_engineer`: HTML descargado → app React con datos dummy. `qa_verifier` ∥ `design_reviewer`: verificación mecánica ∥ review de craft sobre la app viva (3 franjas de autoridad, sin scoring numérico).
- 8 skills: `orchestration-flow`, `ui-design-flow`, `stitch-prompt-crafter` (metodología anti-slop de prompts), `motion-craft`, `impeccable` (corpus de ~31 referencias de craft visual + scripts), `unwired-ui`, `frontend-state-sync`, `verification-tools`.
- Custom tools: `stitch_design.ts` (bypass HTTP del bug `$defs`/`$ref` del cliente MCP para design systems), `frontend_audit.ts`, `design_check.ts`; scripts de auditoría dependency-free + `screenshot.mjs`.
- MCP: `stitch` (Google, remoto) en `opencode.json`.

**Diagnóstico:** el sistema ya tenía prevención de calidad *a priori* (arquetipos, checklist de 18 puntos, prohibiciones, design system de Stitch) y verificación *a posteriori* (QA + design review sobre la app implementada), pero **nadie evaluaba el output de Stitch antes de que se volviera la base visual del producto**, no había scoring numérico contra umbral, y **nada persistía entre proyectos** (`artifacts/` se sobrescribe — verificado en la transición hospital → mediavault).

**Qué se conservó sin cambios:** `qa_verifier`, `frontend_engineer`, las tools y scripts, el MCP, la metodología de arquetipos/prompts, los gates de aprobación humana, la propiedad estricta de artefactos. **Qué se extendió:** `ui_designer` (re-alcance), `orchestrator` (loop), `stitch-prompt-crafter` (+refinement), `verification-tools`, `design_reviewer` (insumos). **Qué se reemplazó:** las Fases 1-2 de `ui_designer` migraron a dos agentes nuevos. **Nada se duplicó:** el corpus de conocimiento visual sigue siendo `impeccable`; la skill `art-direction` solo añade lo que faltaba (rúbrica numérica, Gestalt, leyes UX, digest de sistemas de plataforma).

## 2. Cambios de arquitectura

| Rol pedido | Materialización | Racional |
|---|---|---|
| Brand Strategist | **Agente nuevo** `brand_strategist` (absorbe Fase 1 + exploración creativa) | Rol y temperatura distintos (0.7); separa intención de valores |
| Color Strategist | **Agente nuevo** `color_strategist` (absorbe Fase 2 completa) | `theme-lint` exige el sistema de tokens entero, no solo color; dueño único de `theme.css` |
| Stitch Generator | `ui_designer` **re-alcanzado** (Fase 3 + Fase 4 en sub-etapas E4a/loop/E4b/E4c) | Ya era el único con Stitch; ahora consume la estrategia como contrato cerrado |
| Art Director | **Agente nuevo** `art_director` (adversarial, temp 0.2, rúbrica 24×0-100) | Quien genera no se auto-puntúa; distinto de `design_reviewer` (pre vs. post implementación) |
| Prompt Optimizer | **Skill** `stitch-prompt-crafter/reference/refinement.md` (ejecuta `ui_designer`) | Su output es un prompt de `edit_screens` y solo `ui_designer` habla con Stitch — un agente intermedio añadiría un salto con pérdida |
| Loop Controller | **Protocolo del `orchestrator`** (paso 3e) + `design-quality.config.json` | Consistente con el modelo de coordinación existente; los subagentes tienen `task: deny` |
| Design System Extractor | **Protocolo E4b de `ui_designer`** + reconciliación vía `color_strategist` | Necesita Stitch (`upload_design_md`); los deltas de `theme.css` los aplica su dueño |
| Design Intelligence Layer | **Directorio persistente** `.opencode/intelligence/` + **skill** `design-intelligence`; escribe solo `art_director` | Fuera de `artifacts/` para sobrevivir; un solo escritor preserva la disciplina de propiedad |

## 3. Diagrama de agentes actualizado

```
                                   orchestrator (primary)
                                   task allowlist: los 7 de abajo
        ┌──────────┬──────────────┬───────┴────────┬────────────────┬──────────────┐
        ▼          ▼              ▼                ▼                ▼              ▼
 brand_strategist  color_strategist  ui_designer   art_director   frontend_   qa_verifier ∥
  E1: discovery     E2: color-system  E3: UX+firma   loop: scoring   engineer    design_reviewer
  + brand-brief     + tokens+theme    E4a/E4b/E4c    24 cat. 0-100   HTML→app    mecánica ∥ craft
  (intención)       (valores+WCAG)    [único Stitch] + consolidación
        │               │                 ▲   │           │
        │               │    directivas   │   │ iteracion-<n>.md
        │               │  (via orchestr.)└───┘
        └───────────────┴───── retrieval ──────┴──── .opencode/intelligence/ (persistente)
```

## 4. Workflow

```
Especificación de producto (descripción funcional)
  → orchestrator: domain.md + TODO.md
  → E1 brand_strategist: discovery.md + brand-brief.md          [gate usuario ×2]
  → E2 color_strategist: color-system.md + design-tokens.md
       + theme.css (claro+oscuro) + design_check                 [gate usuario]
  → E3 ui_designer: ux-flow.md + pantalla firma propuesta        [gate usuario]
  → E4a ui_designer: design system Stitch + SOLO pantalla firma (generada y descargada)
  → LOOP (orchestrator; umbral=90, maxIteraciones=3 por config):
       art_director puntúa → APROBADA | ITERAR | TECHO
       ITERAR → ui_designer: refinement.md → edit_screens → re-descarga → re-puntuar
       APROBADA → [gate usuario: aprueba la pantalla firma]
       TECHO / max iteraciones → decisión del usuario (nunca continúa en silencio)
  → E4b ui_designer: system-extraction.md + DESIGN.md → Stitch
       deltas theme.css → color_strategist reconcilia + design_check
  → art_director: consolidación → .opencode/intelligence/
  → E4c ui_designer: resto de pantallas heredando (designSystem + capas del prompt firma; sin loop)
  → frontend_engineer → qa_verifier ∥ design_reviewer → reporte final
```

Solo la PRIMERA pantalla (firma) entra al loop; aprobada, es la base visual de todas las demás.

## 5. Responsabilidades por agente

Detalle autoritativo en cada `.opencode/agents/*.md`; resumen:

- **orchestrator** — dominio, estado, delegación, dirección del loop (lee veredictos, no los re-litiga), gates de usuario, enrutado de hallazgos. Nunca produce contenido de especialista.
- **brand_strategist** — descubrimiento e identidad en intención (personalidad, dirección emocional, premium 1-5, referentes con renuncias, keywords, direcciones creativas). Prohibido: valores literales.
- **color_strategist** — sistema semántico de color (claro+oscuro), tokens completos, `theme.css`, validación WCAG (`design_check`), reconciliación de deltas post-loop. Prohibido: re-decidir la marca.
- **ui_designer** — UX por arquetipos + selección de pantalla firma; generación en Stitch (E4a firma → iteración → E4b extracción → E4c resto); descarga obligatoria. Prohibido: escribir/corregir contratos de estrategia, auto-puntuarse.
- **art_director** — scoring adversarial de la firma (rúbrica 24 categorías, evidencia obligatoria, techos de anti-patrones), veredictos, directivas priorizadas, escalado de lo aprobado, consolidación de intelligence. Prohibido: editar diseño/código, redactar prompts.
- **frontend_engineer / qa_verifier / design_reviewer** — sin cambios de fondo (implementación / verificación mecánica / craft en app viva); `design_reviewer` ahora recibe score-history como contexto anti-re-litigio.

## 6. Interacción entre agentes

Toda coordinación pasa por `orchestrator` (los demás declaran `task: deny`) y **el estado vive en archivos, no en mensajes**: `TODO.md` (progreso), `art-direction/iteracion-<n>.md` + `score-history.md` (loop), `design/prompts/<slug>.md` `## Iteraciones` (prompts enviados), `system-extraction.md` (deltas). Cada delegación instruye "lee X directamente" en lugar de copiar contenido — los agentes releen los artefactos por su cuenta. En el loop, la interfaz entre `art_director` y `ui_designer` es exclusivamente la sección `## Directivas` (autosuficientes por diseño): ninguno de los dos se habla directo.

## 7. Skills requeridas

| Skill | Estado | Rol en el pipeline |
|---|---|---|
| `art-direction` | **nueva** | Rúbrica 24×0-100 con anclas, gestalt, leyes-ux, sistemas-plataforma, protocolo de iteración |
| `design-intelligence` | **nueva** | Retrieval pre-fase + consolidación post-loop sobre `.opencode/intelligence/` |
| `stitch-prompt-crafter` | extendida | + `reference/refinement.md` (Prompt Optimizer) + `## Iteraciones` en la plantilla |
| `impeccable` | reutilizada | Corpus de conocimiento visual del `art_director` (vía mapa anti-duplicación) y auditoría solo-lectura de mockups |
| `motion-craft` | reutilizada | Criterios de motion insinuado (art_director) y real (design_reviewer) |
| `orchestration-flow`, `ui-design-flow`, `verification-tools` | actualizadas | Documentación del pipeline de 8 agentes |
| `unwired-ui`, `frontend-state-sync` | sin cambios | Etapa de implementación |

## 8. Integraciones MCP

Sin cambios: un solo servidor MCP (`stitch`, remoto, en `opencode.json`), consumido exclusivamente por `ui_designer`. El loop usa las mismas herramientas existentes (`generate_screen_from_text`, `edit_screens`, `get_screen`) y las custom tools `stitch_design_*` para design systems (bypass del bug de validación `$defs`/`$ref` del cliente). `art_director` NO necesita MCP: opera sobre el `.html` descargado + `screenshot.mjs`. No se añadió ningún servidor nuevo — la capa de intelligence es archivos locales por diseño (cero dependencias, versionable en git).

## 9. Flujo de contexto

1. **Descendente (contratos):** `domain.md` → todos; `discovery.md`+`brand-brief.md` → color_strategist/ui_designer/art_director; `color-system.md`+`design-tokens.md`+`theme.css` → ui_designer (Capa 4 de prompts)/art_director (vara)/frontend_engineer (theming); `ux-flow.md` → prompts/art_director/frontend_engineer.
2. **Del loop:** `screens/<firma>.html` (re-descargado por iteración) → art_director; `iteracion-<n>.md` → ui_designer (solo `## Directivas`) y usuario (gate); `score-history.md` → usuario/consolidación/design_reviewer.
3. **De herencia:** `system-extraction.md` → color_strategist (deltas) y DESIGN.md→Stitch (E4c); prompt firma → capas de los prompts restantes.
4. **Transversal persistente:** `.opencode/intelligence/` → retrieval de los 4 agentes de diseño al inicio de cada fase; consolidación al cierre de cada loop. Informa, no gobierna.

## 10. Flujo de aprobación

Gates humanos (inamovibles): B1 discovery → B2 brand-brief → E2 tokens → E3 UX+pantalla firma → **pantalla firma post-loop** → pantallas E4c (por pantalla o por lote) → veredictos finales QA/design-review. El loop corre **autónomo entre gates**: el umbral del `art_director` decide cuándo la pantalla está lista para presentarse, nunca la aprueba — "APROBADA (art_director) ≠ aprobada (usuario)". Agotamiento (`maxIteraciones`) y `TECHO` son siempre decisión del usuario con el score-history a la vista. Franja 3 del design_reviewer y directivas estructurales del loop siguen la misma regla: al usuario, nunca forzadas.

## 11. Opciones de configuración (`.opencode/design-quality.config.json`)

| Clave | Default | Efecto |
|---|---|---|
| `umbral` | `90` | Score global mínimo para veredicto APROBADA |
| `maxIteraciones` | `3` | Tope duro del loop; al llegar, decisión de usuario |
| `modelId` | `GEMINI_3_FLASH` | Modelo de Stitch (PRO solo con autorización explícita) |
| `pantallaFirma` | `"auto"` | Slug explícito o selección por regla |
| `reglaSeleccionFirma` | (texto) | Criterio de selección cuando es `auto` |
| `viewports` | `["1280x800"]` | Viewport fijo de capturas del art_director |
| `dryRun` | `false` | `true` = pipeline hasta borradores verificados, sin invocar Stitch (0 cuota) |

## 12. Riesgos y mitigaciones

- **Cuota Stitch multiplicada por el loop** (~350 gen/mes): `maxIteraciones: 3`, 1 `edit_screens` batcheado por iteración (máx 3), `dryRun` para pruebas, protocolo de recuperación ante timeouts (nunca reintentar a ciegas).
- **Inconsistencia de scoring entre sesiones**: temperatura 0.2, anclas 50/75/90/98, evidencia obligatoria por score, viewport fijo, secuencia G1→G6 fija, regla ±3 en categorías intactas, techos de anti-patrones, calibración contra scores típicos de intelligence. Verificación: sonda de doble pasada (aceptación: delta global ≤ ±3).
- **Umbral inalcanzable por techo de calidad de Stitch**: veredicto `TECHO` con opciones concretas al usuario en vez de quemar iteraciones.
- **Erosión de la propiedad de artefactos**: mapa file-level en `orchestration-flow` como fuente única; deltas de `theme.css` solo vía `color_strategist`; intelligence con escritor único.
- **Crecimiento de contexto del orquestador en el loop**: estado en archivos, delegaciones que devuelven resúmenes de una línea, lectura de "solo el veredicto".
- **Divergencia HTML local ↔ Stitch**: re-descarga obligatoria tras cada edición (el art_director puntúa disco); prohibidos los comandos de edición de impeccable sobre el archivo local.
- **`contrast.mjs` podría no parsear el bloque dark**: fallback documentado (contraste dark manual en `color-system.md`) + extensión del script como mejora anotada.
- **Loop degradando el diseño** (ediciones que "olvidan"): re-anclaje obligatorio del diseño + prohibiciones en cada `edit_screens`; directivas estructurales nunca se fuerzan por edición.

## 13. Estrategia de migración

Compatibilidad hacia atrás por diseño — sin big bang:

1. Los nombres de archivo consumidos aguas abajo NO cambiaron (`discovery.md`, `design-tokens.md`, `theme.css`, `ux-flow.md`, `screens/*.html`): `frontend_engineer`, `qa_verifier`, `design_check.ts` y los prompts siguen funcionando sin tocar sus rutas. Solo cambió el *dueño* de algunos.
2. Proyectos en curso (ej. mediavault, ya en QA): terminan con el flujo viejo — la convención "no reorganizar artefactos retroactivamente" ya existía y aplica. El pipeline nuevo rige para el próximo proyecto.
3. `.opencode/intelligence/` arranca vacío (con anti-patrones sembrados de la experiencia previa documentada); se puebla en la primera consolidación. Su ausencia de contenido no bloquea nada (retrieval "sin conocimiento aplicable").
4. Invocación directa de agentes sigue funcionando; el único cambio de comportamiento es que `ui_designer` sin contratos de estrategia reporta en vez de improvisarlos — que es exactamente el bug que se quería cerrar.
5. Rollback: revertir los archivos de agentes/skills; los artefactos y la intelligence no necesitan migración inversa.

## 14. Roadmap de implementación

**Hecho en esta integración:**
1. Config + scaffold de intelligence + skill `design-intelligence`.
2. Skill `art-direction` (rúbrica + 4 referencias de conocimiento + protocolo).
3. `refinement.md` + extensión de `stitch-prompt-crafter`.
4. Agentes `art_director`, `brand_strategist`, `color_strategist`.
5. Re-alcance de `ui_designer`; loop en `orchestrator`; skills de documentación actualizadas.

**Siguiente (validación, sin quemar cuota):**
6. Prueba standalone del `art_director` sobre un `.html` ya descargado de mediavault (valida screenshot, rúbrica, formato de reporte). Sonda de consistencia: dos pasadas, delta ≤ ±3 — si falla, endurecer anclas.
7. Dry-run del loop completo (`dryRun: true`, `maxIteraciones: 1`, `umbral: 99` para forzar la ruta de agotamiento y el gate de decisión).
8. Check de `contrast.mjs` con bloque `[data-theme="dark"]`.

**Después (primer proyecto real):**
9. Smoke con cuota mínima (brief trivial, 1 generate + 1 edit + re-score) — valida el round-trip `edit_screens` bajo el loop.
10. Primer proyecto completo → primera consolidación real de intelligence.

**Futuro (cuando haya datos):**
11. Extender `contrast.mjs` a dark mode si el check 8 lo pide; capturas de patterns en la biblioteca; ponderaciones de rúbrica por vertical si la evidencia acumulada lo justifica; métrica de éxito del sistema: iteraciones-hasta-umbral decreciendo proyecto a proyecto.
