# Índice del Design Intelligence Layer

Base de conocimiento persistente de diseño. **Sobrevive entre proyectos** — a diferencia de `.opencode/artifacts/`, que se sobrescribe en cada corrida del pipeline, esta carpeta NUNCA se borra ni se reorganiza al iniciar un proyecto nuevo.

Protocolo completo (quién lee, quién escribe, cuándo): skill `design-intelligence` (`.opencode/skills/design-intelligence/SKILL.md`). Único escritor: `art_director` (consolidación al cierre de cada loop de calidad).

> **Reset 2026-07-19 (excepción única al "nunca se borra", ejecutada a petición explícita del usuario):** la base se vació para el experimento `frontend-directo` — el conocimiento del run Stitch de mediaVault (registro de proyecto con paleta/tipografía literales, 4 patterns, 4 anti-patrones derivados y 3 heurísticas candidatas) estaba dirigiendo los runs "desde cero" a reproducir la misma identidad visual. Se conservan solo los 3 anti-patrones estructurales (AP-1..3), que son calibración genérica del sistema. El modelo de interacción obligatorio de las tarjetas de biblioteca sobrevive en `screen-spec-composer/reference/ejemplo-biblioteca.md` (sección 14).

## Proyectos registrados

_(ninguno — base reseteada; el próximo registro lo escribe `art_director` al cierre del primer loop nuevo)_

## Patterns disponibles

_(ninguno)_

## Anti-patrones registrados

| # | Anti-patrón | Techo de score | Proyecto de origen |
|---|---|---|---|
| AP-1 | Esqueleto admin SaaS | Originalidad ≤ 55, Jerarquía ≤ 70 | (estructural) |
| AP-2 | Fondo crema genérico | Color ≤ 65, Premium ≤ 60 | (estructural) |
| AP-3 | Léxico AI-default en prompts/specs | (anti-patrón de redacción) | (estructural) |

## Heurísticas promovidas

_Ninguna aún — se requieren ≥2 ocurrencias en proyectos distintos. Ver [heuristics.md](heuristics.md)._

## Conocimiento transversal

- [Heurísticas](heuristics.md) — lecciones promovidas (vistas ≥2 veces). Vacía tras el reset.
- [Anti-patrones](anti-patrones.md) — decisiones de diseño que fallan repetidamente; el `art_director` los usa como calibración (techos de score). 3 estructurales.
