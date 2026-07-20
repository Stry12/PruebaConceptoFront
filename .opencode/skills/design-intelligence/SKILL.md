---
name: design-intelligence
description: Use before starting any design phase (retrieval of accumulated design knowledge for the project's vertical/archetype) and after the design quality loop closes (consolidation of iterations, scores and approved patterns). Manages the persistent knowledge base at .opencode/intelligence/ that survives per-project artifact overwrites. Consumers - brand_strategist, color_strategist, ui_designer, art_director. Writer - art_director only.
---

# Design Intelligence Layer

Capa de conocimiento de diseño persistente entre proyectos. Existe porque `.opencode/artifacts/` se sobrescribe en cada corrida del pipeline (verificado: la corrida hospital fue reemplazada por mediavault) — todo lo aprendido en un proyecto se perdía. Esta capa acumula inteligencia de diseño estructurada, no logs de conversación.

**Objetivo medible:** que cada proyecto nuevo necesite MENOS iteraciones del loop de calidad que el anterior, porque los agentes arrancan con lo ya aprendido.

## Estructura (`.opencode/intelligence/` — persistente, NUNCA se borra entre proyectos)

| Archivo | Contenido | Formato |
|---|---|---|
| `index.md` | Índice: proyectos registrados, patterns disponibles | Tablas — se actualiza en cada consolidación |
| `projects/<slug>.md` | Registro por proyecto: evolución de scores, directivas con mayor delta, prompts exitosos verbatim, soluciones rechazadas, snapshot del sistema aprobado, lecciones candidatas | Plantilla en `projects/README.md` |
| `patterns/<pattern>--<vertical>.md` | Biblioteca de patterns aprobados: layout, tokens, jerarquía de componentes, racional UX, a11y, scores típicos, casos de uso | Plantilla en `patterns/README.md` |
| `heuristics.md` | Lecciones promovidas (vistas ≥2 veces) | Entradas `H-<n>` append-only |
| `anti-patrones.md` | Decisiones que fallan repetidamente, con techo de score por categoría | Entradas `AP-<n>` append-only |

## Protocolo de retrieval (lectura — ANTES de empezar cada fase)

Cada agente lee lo suyo al arrancar; si `index.md` está vacío o no hay nada del vertical/arquetipo, se dice explícitamente ("sin conocimiento previo aplicable") y se continúa — el retrieval nunca bloquea.

| Agente | Qué lee | Para qué |
|---|---|---|
| `brand_strategist` | `index.md` → `patterns/` del vertical + `heuristics.md` + secciones "Sistema aprobado" de `projects/` similares | Referentes y direcciones que ya funcionaron en productos/industrias similares; no partir de cero |
| `color_strategist` | Snapshots de sistemas aprobados en `projects/` del vertical + `heuristics.md` (color/contraste) | Paletas y decisiones de contraste ya validadas para ese público |
| `ui_designer` | `patterns/` del arquetipo de cada pantalla + "Prompts de edición exitosos" y "Directivas con mayor delta" de `projects/` | Estructuras firma y prompts que ya puntuaron alto; al iterar, reutilizar formulaciones que produjeron delta |
| `art_director` | `anti-patrones.md` (techos de score) + "Score típico" de `patterns/` comparables + `heuristics.md` | Calibración: puntuar consistente con la historia, aplicar techos, priorizar los tipos de crítica que históricamente producen mayor mejora |

Regla de citado: cuando un agente use conocimiento de esta capa en un entregable, lo referencia ("según `patterns/dashboard--fintech.md`...") — así el usuario sabe qué es aprendizaje acumulado y qué es decisión nueva.

## Protocolo de consolidación (escritura — SOLO `art_director`, al cierre del loop)

`orchestrator` la delega como paso explícito del pipeline cuando la pantalla firma queda aprobada por el usuario (no antes: un loop abortado o un TECHO también se consolida, pero marcado como tal — las soluciones rechazadas valen tanto como las exitosas). Pasos:

1. **Registro del proyecto** → `projects/<slug>.md` (plantilla de `projects/README.md`): evolución iteración×score desde `art-direction/score-history.md`, las directivas con mayor delta (verbatim, con delta observado), los prompts de `edit_screens` que funcionaron (desde `## Iteraciones` de `design/prompts/<slug-firma>.md`), soluciones rechazadas y por qué, snapshot del sistema aprobado (desde `design/system-extraction.md` si existe, o `theme.css`).
2. **Patterns** → crear/actualizar `patterns/<pattern>--<vertical>.md` con el diseño aprobado. Solo diseños aprobados alimentan patterns.
3. **Promoción** → recorrer "Lecciones candidatas" de TODOS los `projects/*.md`: una lección vista en ≥2 proyectos/iteraciones se promueve a `heuristics.md` (`H-<n>`) o `anti-patrones.md` (`AP-<n>`, con techo de score). Una sola ocurrencia NUNCA se promueve.
4. **Feedback loop del propio art_director**: comparar críticas emitidas vs. delta que produjeron (score-history). Anotar en el registro del proyecto qué TIPOS de crítica (composición, color, marca, UX...) produjeron mayor mejora — en proyectos futuros, la sección de retrieval del art_director prioriza esos tipos al ordenar directivas.
5. **Índice** → actualizar `index.md` en el mismo paso (fila del proyecto + patterns nuevos). Una consolidación que no actualiza el índice está incompleta.

## Reglas

- **Append-only para la historia**: registros y entradas promovidas no se reescriben; se marcan `superada por:` si algo las reemplaza.
- **Estructurado, no logs**: nada de volcados de conversación ni reportes completos copiados — solo los campos de las plantillas, con datos trazables (deltas, slugs, fechas).
- **Sin datos sensibles**: nunca copiar credenciales, datos personales de briefs de cliente, ni contenido que el usuario haya marcado confidencial. En duda, resumir sin el dato.
- **Todo en español**, consistente con el resto del sistema.
- **La capa informa, no gobierna**: un pattern acumulado es un punto de partida con evidencia, no una obligación — las fases de aprobación humana y la clasificación por arquetipos siguen mandando. Si el conocimiento acumulado contradice el brief actual, gana el brief.
