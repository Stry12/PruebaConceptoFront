---
name: orchestration-flow
description: Use when the user gives a high-level functional description (client/analyst style — "quiero un sistema de...", business needs, a domain model) and expects a working frontend to come out the other end, or when resuming work on a project that already has files under .opencode/artifacts/. Explains the eight-agent pipeline (brand/color strategy, UX + Stitch, the art_director quality loop, implementation and verification), the artifact map, and where pipeline status is tracked (.opencode/artifacts/TODO.md). Use ONLY for this project's design/build pipeline — not for unrelated coding tasks.
---

# Flujo de orquestación: descripción funcional → frontend

> **MODO frontend-directo**: si `.opencode/design-quality.config.json` tiene `modoGeneracion: "frontend-directo"` (experimento — ver `.opencode/docs/experimento-frontend-directo.md`), Stitch está deshabilitado y el diagrama de abajo cambia en E4 y el loop: `ui_designer` produce **ScreenSpecs** (skill `screen-spec-composer` → `design/specs/`), `frontend_engineer` implementa la pantalla firma ANTES del loop, y el loop puntúa **capturas de la app renderizada** (ITERAR = enmienda de spec + cambio de código, nunca `edit_screens`). El detalle vive en el bloque `## Modo frontend-directo` de `orchestrator.md`.

Este proyecto usa ocho agentes de OpenCode que se coordinan para llevar una descripción funcional de alto nivel hasta un frontend funcionando con datos dummy:

```
orchestrator
  → brand_strategist   (E1: descubrimiento + brand brief)
  → color_strategist   (E2: sistema de color + tokens + theme.css)
  → ui_designer        (E3: UX + pantalla firma · E4a: Stitch, solo pantalla firma)
  → LOOP de calidad:   art_director (scoring) ⇄ ui_designer (refinamiento edit_screens)
       hasta score ≥ umbral | maxIteraciones | TECHO → gate del usuario
  → ui_designer        (E4b: extracción del sistema · E4c: resto de pantallas)
  → art_director       (consolidación en .opencode/intelligence/)
  → frontend_engineer  (convierte HTML descargado en código)
  → qa_verifier ∥ design_reviewer   (verificación mecánica ∥ review de craft; ninguno corrige código)
```

## Quién hace qué

- **`orchestrator`** (`.opencode/agents/orchestrator.md`, mode `primary`): punto de entrada. Recibe la descripción funcional, extrae o respeta el dominio dado (nunca lo rediseña), resuelve ambigüedades menores por su cuenta, delega vía Task tool — con permisos restringidos a los siete subagentes — y **dirige el loop de calidad** (paso 3e de su flujo, según `.opencode/design-quality.config.json`). No diseña, no critica, no programa.
- **`brand_strategist`** (`.opencode/agents/brand_strategist.md`, mode `all`): descubrimiento (B1 → `design/discovery.md`) y estrategia de marca en intención — personalidad, dirección emocional, nivel premium, referentes, keywords, direcciones creativas (B2 → `design/brand-brief.md`). Prohibido escribir valores literales de diseño. Aprobación humana por entregable.
- **`color_strategist`** (`.opencode/agents/color_strategist.md`, mode `all`): traduce el brief a valores — sistema de color semántico completo (claro+oscuro), tokens y `theme.css` — con `design_check` (theme-lint + contrast WCAG) pasado antes del gate humano. También reconcilia los deltas post-loop que reporte la extracción E4b.
- **`ui_designer`** (`.opencode/agents/ui_designer.md`, mode `all`): la UX (Fase 3: estructura firma por arquetipos, inventario, árbol de estados, selección de pantalla firma) y la ejecución en Stitch (E4a pantalla firma → protocolo de iteración del loop → E4b extracción del sistema → E4c resto de pantallas heredando). Es el único agente con acceso a las herramientas del MCP `stitch`, y descarga el código de cada pantalla aprobada a disco. Los artefactos de estrategia (discovery, brand-brief, color-system, tokens, theme.css) son contrato cerrado para él.
- **`art_director`** (`.opencode/agents/art_director.md`, mode `all`): crítico adversarial del mockup de Stitch **PRE-implementación**. Puntúa la pantalla firma con la rúbrica de 24 categorías (skill `art-direction`), emite veredicto APROBADA/ITERAR/TECHO contra el umbral del config, y sus directivas alimentan el refinamiento. También consolida lo aprendido en `.opencode/intelligence/` al cierre del loop. No edita diseño ni código; no confundir con `design_reviewer` (POST-implementación, app viva).
- **`frontend_engineer`** (`.opencode/agents/frontend_engineer.md`, mode `all`): convierte el HTML descargado en componentes reales, arquitecturados (separación UI/dominio/backend), con librería de componentes, theming, y datos dummy funcionales. No tiene acceso a las herramientas de Stitch.
- **`qa_verifier`** (`.opencode/agents/qa_verifier.md`, mode `all`): verificador independiente. Ejecuta las auditorías mecánicas (tool `frontend_audit` / `node .opencode/scripts/audit/run-all.mjs`), muestrea fidelidad de extracción y verifica funcionalidad en runtime; reporta en `qa/verification-report.md` y marca "verificada" en `TODO.md`. **No corrige código.** Ver la skill `verification-tools`.
- **`design_reviewer`** (`.opencode/agents/design_reviewer.md`, mode `all`): consultor senior de diseño sobre la **app viva** (motion vía skill `motion-craft`, estados interactivos, foco, responsive). Reporta en `design-review/design-review.md` con hallazgos en 3 franjas de autoridad. **No edita código ni artefactos de diseño.** Usa `art-direction/score-history.md` como contexto para no re-litigar lo ya aprobado con score.

Cualquiera de ellos puede invocarse directo (`mode: all`/`primary`) si no hace falta el pipeline completo. Excepción de seguridad: si a `ui_designer` le faltan los contratos de estrategia, no los improvisa — reporta que deben producirse por sus dueños.

## Mapa de artefactos (`.opencode/artifacts/` + `.opencode/intelligence/`)

Lo compartido vive en la raíz de `artifacts/`; el resto tiene dueño único — por carpeta, o **por archivo dentro de `design/`**. Esto aplica hacia adelante, en proyectos nuevos — no reorganices retroactivamente.

| Ruta | Lo escribe | Contenido |
|---|---|---|
| `domain.md` (raíz, compartido) | `orchestrator` | Entidades/atributos/tipos/relaciones — fuente de verdad para todos |
| `TODO.md` (raíz, compartido) | `orchestrator` (todos actualizan) | Estado del pipeline — ver abajo |
| `design/discovery.md` | `brand_strategist` (B1) | Propósito, público objetivo, plataforma, restricciones |
| `design/brand-brief.md` | `brand_strategist` (B2) | Personalidad, dirección emocional, nivel premium, referentes, keywords, dirección creativa elegida |
| `design/color-system.md` | `color_strategist` | Sistema de color semántico narrado (claro+oscuro) con decisiones WCAG documentadas |
| `design/design-tokens.md` | `color_strategist` | Tokens narrados/justificados (colores, tipografía, espaciado, prohibiciones) |
| `design/theme.css` | `color_strategist` | Los mismos tokens en formato literal (`:root` + `[data-theme="dark"]`) — fuente exacta para prompts y `frontend_engineer` |
| `design/ux-flow.md` | `ui_designer` (Fase 3) | Estructura firma, user flow, inventario, jerarquías, árbol de estados, pantalla firma |
| `design/prompts/<slug>.md` | `ui_designer` (Fase 4) | Borrador verificado del prompt por pantalla (+ `## Iteraciones` en la firma) |
| `design/screens.md` | `ui_designer` (Fase 4) | Registro por pantalla: IDs de Stitch, modelo, ruta descargada, estado |
| `design/DESIGN.md` | `ui_designer` (E4a/E4b) | Design system para Stitch, derivado de los tokens y actualizado tras la extracción |
| `design/screens/<slug>.html` (+`.png`) | `ui_designer` (Fase 4) | Código real descargado — única fuente que `frontend_engineer` puede usar |
| `design/system-extraction.md` | `ui_designer` (E4b) | Extracción del sistema desde la pantalla firma aprobada, con deltas vs. theme.css |
| `design/screens/<slug>.extraction.md` | `frontend_engineer` | Extracción verificable del `.html` — obligatoria ANTES de componer esa pantalla |
| `art-direction/iteracion-<n>.md` | `art_director` | Scoring de 24 categorías con evidencia, veredicto y directivas — carpeta exclusiva |
| `art-direction/score-history.md` (+`shots/`) | `art_director` | Evolución iteración×score del loop, con capturas |
| `frontend/component-plan.md` | `frontend_engineer` | Inventario de patrones visuales repetidos entre pantallas |
| `frontend/frontend-architecture.md` | `frontend_engineer` | Stack, mapeo de carpetas, registro de componentes, estado por pantalla |
| `ENGANCHE_BACKEND.md` (raíz del proyecto) | `frontend_engineer` | Qué falta para conectar el backend real |
| `qa/verification-report.md` | `qa_verifier` | Veredicto de verificación con acciones requeridas — carpeta exclusiva |
| `design-review/design-review.md` (+`shots/`) | `design_reviewer` | Review de craft y fidelidad en 3 franjas — carpeta exclusiva |
| `.opencode/intelligence/**` | `art_director` (consolidación) | **Persistente entre proyectos — NUNCA se borra.** Registros, patterns, heurísticas, anti-patrones (skill `design-intelligence`) |

## Dónde está el estado del pipeline

`.opencode/artifacts/TODO.md` es la fuente única de verdad de en qué punto quedó todo — incluida la iteración y el último score del loop de calidad. Antes de continuar cualquier trabajo en este proyecto, léelo primero. Todos los agentes lo actualizan a medida que avanzan.

## Configuración del loop de calidad

`.opencode/design-quality.config.json`: `umbral` (default 90), `maxIteraciones` (default 3), `modelId`, `pantallaFirma`/`reglaSeleccionFirma`, `viewports`, `dryRun`. Solo la pantalla firma pasa por el loop; el resto hereda el sistema extraído.

## Guardrails importantes

- El dominio (`domain.md`) es dado — ningún agente lo rediseña una vez aprobado.
- `orchestrator` nunca escribe contenido de diseño (briefs, paletas, user flows, prompts, críticas con score) ni código.
- **El umbral del `art_director` habilita el gate del usuario, no lo sustituye** — la pantalla firma la aprueba el usuario; y agotado `maxIteraciones` (o con veredicto TECHO), la decisión siempre vuelve al usuario, nunca se continúa en silencio.
- `frontend_engineer` nunca inventa el markup de una pantalla cuyo `.html` no esté descargado, ni cambia el diseño visual aprobado al reorganizar en componentes.
- La propiedad de artefactos es estricta (tabla de arriba): cada agente escribe SOLO lo suyo; los deltas de `theme.css` post-loop pasan por `color_strategist`, nunca los aplica `ui_designer`.
- `.opencode/intelligence/` sobrevive entre proyectos — no se borra al reiniciar un proyecto, y solo escribe ahí `art_director`.
- Los datos dummy deben ser funcionales (login, mutaciones de estado), no solo de lectura estática.
