---
name: screen-spec-composer
description: Load ALWAYS at Fase 4 of the ui_designer flow when design-quality.config.json has modoGeneracion "frontend-directo" (Stitch disabled — experiment, see .opencode/docs/experimento-frontend-directo.md). Turns a ScreenBrief (screen from the ux-flow.md inventory + literal tokens from theme.css) into a Frontend Implementation Specification (ScreenSpec) saved in design/specs/, precise enough for frontend_engineer to build the screen WITHOUT inventing the design. Also use when amending a spec after art_director directives in the quality loop. This skill only writes and validates specs — it never implements code and never calls Stitch tools.
---

# Screen Spec Composer

Redactas las **Especificaciones de Implementación Frontend** (ScreenSpec) del pipeline en modo `frontend-directo`. Tu único entregable es `.opencode/artifacts/design/specs/<slug>.md`. Nunca implementas código: especificar (esta skill) e implementar (`frontend_engineer`) son pasos separados.

**Por qué existe**: sin Stitch, `frontend_engineer` no recibe un `.html` de referencia. Si la spec es vaga, el ingeniero inventa el diseño — exactamente lo que este pipeline existe para impedir. Una ScreenSpec válida deja **cero decisiones visuales abiertas**: todo lo que no esté escrito con un valor medible o una referencia de token no existe.

## Archivos de referencia (bajo demanda)

| Archivo | Cuándo leerlo |
|---|---|
| `reference/plantilla.md` | SIEMPRE — es el esquema obligatorio de la spec. |
| `reference/craft.md` | SIEMPRE — contención/anatomía de slots, ritmo 8pt, proporción de color 60/30/10, tipografía/elevación. Sus reglas entran a la spec como `[MUST]` y sus criterios a la sección 18. |
| `../art-direction/reference/filosofia.md` | Al arrancar cada pantalla — la lente experta (Rams: quitar antes que añadir; Vignelli: semántica/sintáctica/pragmática; Tufte: test de eliminación; Refactoring UI: jerarquía por des-énfasis, exceso de blanco; craft de detalles invisibles). Aplica su §6.1 en la exploración divergente: pregunta qué haría el mejor referente del vertical, y roba la DECISIÓN, nunca la identidad. |
| `reference/checklist.md` | SIEMPRE, antes de declarar una spec lista. |
| `reference/refinamiento.md` | Al recibir directivas de `art_director` en el loop de calidad — cómo traducirlas a enmiendas de spec + peticiones de cambio para `frontend_engineer`. |
| `reference/ejemplo-biblioteca.md` | Solo en las primeras 1-2 specs de un proyecto nuevo — spec de ejemplo trabajada (marcada como ejemplo, no es un artefacto del run). |
| `../stitch-prompt-crafter/reference/archetypes.md` | Para clasificar estructura por arquetipo (se reutiliza; es agnóstica de Stitch). |
| `../stitch-prompt-crafter/reference/states.md` | Para enumerar estados de componentes interactivos (se reutiliza). |

## Entrada obligatoria: el ScreenBrief

Igual que en `stitch-prompt-crafter`: antes de escribir una línea, reúne de los artefactos (no de memoria) `theme.css`, `ux-flow.md`, `design-tokens.md`, `discovery.md`, `brand-brief.md`, y el patrón aplicable de `.opencode/intelligence/patterns/` si existe (p. ej. `grid-portadas--biblioteca.md` — sus reglas de interacción son OBLIGATORIAS en la spec). Si falta cualquier fuente, detente y repórtalo.

## Reglas duras

- **Tokens SOLO por referencia.** Colores, espaciados, radios, bordes, sombras y tipografías se citan como variables de `theme.css` (`var(--color-accent)`), nunca como valores crudos re-escritos. Si un valor no existe en `theme.css`, es señal de volver a `color_strategist`, no de inventarlo.
- **Todo requisito etiquetado**: `[MUST]` (obligatorio — su violación es hallazgo bloqueante), `[SHOULD]` (preferido — desviarse exige justificación escrita del ingeniero), `[MAY]` (opcional — jamás exigible en revisión). `frontend_engineer` no puede tratar un MAY como MUST ni viceversa.
- **Prohibido el léxico vago**: "moderno", "premium", "limpio", "intuitivo", "mejora el espaciado", "hazlo elegante". Cada intención se traduce a instrucción medible (ej. no "aireado" sino "padding vertical de sección `var(--space-8)`, máximo 3 tarjetas por fila en 1280px").
- **Criterios de aceptación verificables**: cada criterio debe poder comprobarse con un test Playwright, una aserción de auditoría (`frontend_audit`) o una observación binaria en captura. Son la base de la suite de tests.
- **Interpretaciones prohibidas explícitas**: la sección 19 enumera qué NO hacer (los defaults genéricos que un implementador tendería a añadir).
- **Estados completos**: vacío, carga, error, hover, focus-visible, active y disabled se especifican SIEMPRE para cada componente interactivo — "no aplica" debe escribirse, no omitirse.
- **Accesibilidad no negociable**: contraste conforme a `design_check`, targets táctiles ≥44px en móvil, un solo H1, focus visible, nombres accesibles. Siempre `[MUST]`.
- **Versionado**: el frontmatter lleva `version` e `iteracion`; toda enmienda del loop incrementa `version` y se registra en `## Enmiendas` (ver `reference/refinamiento.md`). La spec vigente es el contrato de revisión.

## Flujo

1. Reúne el ScreenBrief y regístralo en el frontmatter + sección de fuentes.
2. Redacta la spec sección por sección según `reference/plantilla.md` (20 secciones — ninguna se omite; si una no aplica, se declara "No aplica" con motivo).
3. Verifica contra `reference/checklist.md` ítem por ítem y marca la evidencia en la propia spec.
4. Declara la spec `estado: vigente` y repórtala al orquestador. `frontend_engineer` implementa desde ella; cualquier conflicto que él reporte vuelve aquí como enmienda, no se resuelve improvisando en código.
