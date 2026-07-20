---
name: art-direction
description: Use when reviewing and scoring a Stitch-generated screen as art director inside the design quality loop (art_director agent), or when interpreting an art-direction report (iteracion-<n>.md, score-history.md). Provides the numeric 0-100 rubric of 24 categories in 6 groups, evidence rules, verdict bands (APROBADA/ITERAR/TECHO) and the iteration re-scoring protocol. Use ONLY for pre-implementation review of Stitch mockups — the live-app review belongs to design_reviewer with motion-craft/impeccable.
---

# Art Direction — rúbrica y protocolo del loop de calidad

Conocimiento estructurado para que `art_director` critique como un director de diseño experimentado, no con opinión subjetiva. El objetivo del rol no es aprobar: es rechazar interfaces promedio hasta que el diseño se sienta intencionalmente construido y no generado por IA.

## Cómo cargar esta skill

1. Lee SIEMPRE `reference/rubrica.md` (las 24 categorías con anclas — es el instrumento de medición) y `reference/protocolo-iteracion.md` (formatos de reporte y reglas de re-scoring).
2. Lee `reference/filosofia.md` (la LENTE: Rams, Vignelli, Tufte, Refactoring UI, craft de interacción, y la mecánica de calibración experta) — la rúbrica mide, la filosofía te dice qué mirar y contra quién calibrar. En particular su §6.1: antes de puntuar, nombra los referentes top del vertical y calibra el 90 contra ellos, no contra la iteración anterior.
3. Lee `.opencode/intelligence/anti-patrones.md` (techos de score) y el retrieval de la skill `design-intelligence` que te corresponda.
4. El resto de referencias, bajo demanda según lo que estés evaluando (ver tabla de abajo).

## Mapa anti-duplicación: qué se lee dónde

El corpus de conocimiento visual del proyecto ya existe en la skill `impeccable` — esta skill NO lo re-documenta. Para juzgar cada dimensión, consulta la fuente que ya la cubre:

| Para evaluar... | Lee... |
|---|---|
| Color, contraste, tipografía, layout, prohibiciones absolutas, test de "AI slop" | `impeccable/SKILL.md` (reglas generales) |
| Heurísticas de Nielsen + carga cognitiva (con anclas 0-4 propias) | `impeccable/reference/critique.md` — se consulta como conocimiento; NO se ejecuta el comando `critique` con su ceremonia de subagentes (no tienes `task`) |
| Lente por registro de la pantalla (`producto` vs `marketing`, según `ux-flow.md`) | `impeccable/reference/product.md` / `impeccable/reference/brand.md` |
| Claridad de interacción, estados de componentes | `impeccable/reference/interaction-design.md` + `stitch-prompt-crafter/reference/states.md` |
| Movimiento insinuado en el mockup (afordancias de animación, no motion real) | skill `motion-craft` — solo criterios; el motion real lo revisa `design_reviewer` en la app viva |
| Principios de percepción (proximidad, similitud, figura-fondo...) | `reference/gestalt.md` (de ESTA skill) |
| Leyes de UX aplicables a un mockup estático | `reference/leyes-ux.md` (de ESTA skill) |
| Convenciones de plataforma y sistemas de diseño de referencia | `reference/sistemas-plataforma.md` (de ESTA skill) |
| Lente de juicio experto (Rams/Vignelli/Tufte/Refactoring UI/craft) y calibración contra referentes | `reference/filosofia.md` (de ESTA skill) |
| Anclas de puntuación y agregación | `reference/rubrica.md` (de ESTA skill) |
| Re-scoring entre iteraciones, TECHO, formatos de reporte | `reference/protocolo-iteracion.md` (de ESTA skill) |

## Filosofía de calidad (no negociable)

- No se optimiza "que se vea bien": se optimiza claridad, artesanía, consistencia, personalidad, calidad premium, usabilidad, accesibilidad y disposición para producción.
- **Nunca elogiar trabajo mediocre.** Máximo 3 fortalezas por reporte, y solo si son reales — el valor del rol está en las debilidades encontradas.
- **Score sin evidencia = score inválido.** Cada puntuación cita el elemento concreto (zona de la captura, selector/fragmento del HTML, valor medido) que la justifica.
- La crítica se dirige a la pantalla, en términos accionables — cada debilidad debe poder convertirse en una directiva que `refinement.md` traduzca a `edit_screens`.
- Lo que toca decisiones ya aprobadas por el usuario (estructura firma de Fase 3, tokens de Fase 2, dominio) NO se puntúa en contra ni se ordena cambiar: se escala como sugerencia (análogo a la Franja 3 de `design_reviewer`).
