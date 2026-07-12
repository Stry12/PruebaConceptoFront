---
name: orchestration-flow
description: Use when the user gives a high-level functional description (client/analyst style — "quiero un sistema de...", business needs, a domain model) and expects a working frontend to come out the other end, or when resuming work on a project that already has files under .opencode/artifacts/. Explains the orchestrator → ui_designer → frontend_engineer pipeline, the artifact map, and where pipeline status is tracked (.opencode/artifacts/TODO.md). Use ONLY for this project's design/build pipeline — not for unrelated coding tasks.
---

# Flujo de orquestación: descripción funcional → frontend

Este proyecto usa tres agentes de OpenCode que se coordinan para llevar una descripción funcional de alto nivel hasta un frontend funcionando con datos dummy:

```
orchestrator  →  ui_designer  →  frontend_engineer  →  qa_verifier
(coordina)       (Fases 1-4,      (convierte HTML        (verifica con
                  Stitch)          descargado en código)   auditorías; no corrige)
```

## Quién hace qué

- **`orchestrator`** (`.opencode/agents/orchestrator.md`, mode `primary`): punto de entrada. Recibe la descripción funcional, extrae o respeta el dominio dado (nunca lo rediseña), resuelve ambigüedades menores de tipos/atributos por su cuenta, y delega vía Task tool — con permisos restringidos exclusivamente a `ui_designer` y `frontend_engineer` — el resto del trabajo. No diseña ni programa nada él mismo.
- **`ui_designer`** (`.opencode/agents/ui_designer.md`, mode `all`): lleva 4 fases con aprobación humana obligatoria en cada una (Descubrimiento → Estrategia visual → UX → Ejecución en Stitch), y descarga el código de cada pantalla aprobada a disco. Es el único agente con acceso a las herramientas del MCP `stitch`.
- **`frontend_engineer`** (`.opencode/agents/frontend_engineer.md`, mode `all`): convierte el HTML descargado en componentes reales, arquitecturados (separación UI/dominio/backend), con librería de componentes, theming, y datos dummy funcionales (incluyendo mutaciones como login o mover ítems entre colas). No tiene acceso a las herramientas de Stitch.
- **`qa_verifier`** (`.opencode/agents/qa_verifier.md`, mode `all`): verificador independiente. Ejecuta las auditorías mecánicas (tool `frontend_audit` / `node .opencode/scripts/audit/run-all.mjs`), muestrea fidelidad de extracción y verifica funcionalidad en runtime; reporta en `qa/verification-report.md` y marca "verificada" en `TODO.md`. **No corrige código** — los hallazgos vuelven a `frontend_engineer`. Ver la skill `verification-tools` para el detalle del toolbox.

Cualquiera de los tres puede invocarse directo (`mode: all`/`primary`) si no hace falta el pipeline completo — por ejemplo, seguir iterando una pantalla puntual con `ui_designer`, o pedirle a `frontend_engineer` que implemente una pantalla cuyo `.html` ya está descargado.

## Mapa de artefactos (`.opencode/artifacts/`)

La carpeta se organiza por dueño: lo compartido vive en la raíz, lo que le pertenece a un solo agente vive en su propia subcarpeta. Esto aplica hacia adelante, en proyectos nuevos — no reorganices retroactivamente un proyecto que ya tenga artefactos en otra ubicación (ej. todo plano en la raíz).

| Ruta | Lo escribe | Contenido |
|---|---|---|
| `domain.md` (raíz, compartido) | `orchestrator` | Entidades/atributos/tipos/relaciones — dado o inferido, fuente de verdad para los otros dos agentes |
| `TODO.md` (raíz, compartido) | `orchestrator` (todos actualizan) | Estado del pipeline — ver abajo |
| `design/discovery.md` | `ui_designer` (Fase 1) | Propósito, público objetivo, plataforma, restricciones |
| `design/design-tokens.md` | `ui_designer` (Fase 2) | Tokens narrados/justificados (colores, tipografía, espaciado, prohibiciones) |
| `design/theme.css` | `ui_designer` (Fase 2) | Los mismos tokens en formato literal (custom properties CSS) — fuente exacta para `frontend_engineer` |
| `design/ux-flow.md` | `ui_designer` (Fase 3) | User flow, inventario de pantallas, jerarquía |
| `design/prompts/<slug>.md` | `ui_designer` (Fase 4) | Borrador verificado del prompt enviado a Stitch por pantalla |
| `design/screens.md` | `ui_designer` (Fase 4) | Registro por pantalla: IDs de Stitch, modelo usado, ruta descargada, estado |
| `design/screens/<slug>.html` (+`.png`) | `ui_designer` (Fase 4) | Código real descargado de cada pantalla aprobada — única fuente que `frontend_engineer` puede usar |
| `design/screens/<slug>.extraction.md` | `frontend_engineer` | Extracción verificable del `.html` (clases/valores citados textualmente) — obligatoria ANTES de escribir el componente de esa pantalla; si no existe o es genérica, es señal de que no se leyó el HTML real |
| `frontend/component-plan.md` | `frontend_engineer` (una vez, antes de la primera pantalla) | Inventario de patrones visuales repetidos entre pantallas — decide qué componentes compartidos construir antes de ensamblar páginas |
| `frontend/frontend-architecture.md` | `frontend_engineer` | Stack elegido, mapeo de carpetas, registro de componentes construidos (props/variantes/pantallas), qué pantallas/entidades ya están implementadas |
| `ENGANCHE_BACKEND.md` (en la raíz del proyecto, no en `.opencode/`) | `frontend_engineer` | Qué falta para conectar el backend real — no se implementa hasta que se pida aparte |
| `qa/verification-report.md` | `qa_verifier` | Veredicto de verificación (auditorías, fidelidad, runtime) con acciones requeridas — carpeta exclusiva de `qa_verifier` |

## Dónde está el estado del pipeline

`.opencode/artifacts/TODO.md` es la fuente única de verdad de en qué punto quedó todo. Antes de continuar cualquier trabajo en este proyecto (o de decidir qué agente invocar), léelo primero — evita repetir fases ya aprobadas o perder de vista qué pantallas faltan. Los tres agentes lo actualizan a medida que avanzan, no solo al final.

## Guardrails importantes

- El dominio (`domain.md`) es dado — ninguno de los tres agentes lo rediseña una vez aprobado.
- `orchestrator` nunca escribe contenido de diseño (paletas, user flows, prompts de Stitch) ni código — si lo hace, es un error, no una optimización.
- `frontend_engineer` nunca inventa el markup de una pantalla cuyo `.html` no esté descargado, ni cambia el diseño visual aprobado al reorganizar en componentes — solo puede reestructurar código, no reinterpretar el diseño.
- Los datos dummy deben ser funcionales (login, mutaciones de estado como mover entre colas), no solo de lectura estática.
