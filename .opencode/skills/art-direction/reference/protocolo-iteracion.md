# Protocolo de iteración — re-scoring, TECHO y formatos de reporte

Reglas del loop de calidad desde el lado del `art_director`. El loop lo controla `orchestrator` (paso 3e de su flujo); aquí está lo que cada reporte debe contener y cómo mantener el scoring consistente entre iteraciones.

## Secuencia fija de evaluación (anti-inconsistencia)

Siempre el mismo procedimiento, en el mismo orden — la consistencia del scoring depende de no variar el instrumento:

1. Captura con el MISMO viewport del config (`viewports`, default `1280x800`): `node .opencode/scripts/screenshot.mjs <ruta-html> .opencode/artifacts/art-direction/shots/iter-<n>.png`. Nunca comparar capturas de viewports distintos.
2. Si `n > 1`: **auditoría de directivas previas ANTES de puntuar** (ver abajo).
3. Puntuar los grupos SIEMPRE en orden G1→G6, categoría por categoría, con evidencia por score.
4. Aplicar techos de `intelligence/anti-patrones.md` y la regla del suelo de la rúbrica.
5. Veredicto y (si ITERAR) directivas.

## Auditoría de directivas previas (n > 1)

Releer `iteracion-<n-1>.md` y clasificar CADA directiva emitida:

| Estado | Significa |
|---|---|
| `resuelta` | El cambio pedido está y funciona |
| `parcial` | Se intentó pero no alcanza el nivel pedido |
| `ignorada` | No hay rastro del cambio (¿se tradujo mal el prompt? — anotarlo: es señal para `refinement.md`) |
| `regresión` | El cambio se hizo pero rompió otra cosa (citar qué) |

Esta tabla abre el reporte de la iteración. Una directiva `ignorada` dos veces seguidas se marca para revisión de la traducción a prompt, no se repite verbatim por tercera vez.

## Regla de estabilidad de scores (±3)

Entre iteraciones, una categoría NO afectada por las directivas ni por regresiones no puede moverse más de ±3 puntos sin evidencia de cambio citada. Si al re-puntuar te da un delta mayor en una categoría intacta, es deriva del evaluador, no del diseño: mantén el score anterior y anótalo. Las categorías afectadas por directivas se re-puntúan libremente (con evidencia, como siempre).

## Detección de TECHO

Veredicto `TECHO` (el loop no va a alcanzar el umbral por esta vía — escalar al usuario) cuando se cumple cualquiera:

- **Dos iteraciones consecutivas sin mejora material**: delta global < +2 en ambas, con directivas correctamente aplicadas (no cuenta si fueron `ignoradas` — eso es un problema de traducción, no de techo).
- **La mejora necesaria es estructural**: las debilidades dominantes requieren cambios que `edit_screens` no puede hacer sin destruir la pantalla (cambiar el esqueleto, rehacer la jerarquía completa) — regenerar desde cero con un prompt nuevo es decisión del usuario, no del loop.
- **El déficit está en decisiones aprobadas**: las categorías bajas se deben a tokens de la estrategia (`color_strategist`) o a la estructura de la Fase 3 que el usuario ya aprobó — el loop no tiene autoridad sobre eso (análogo Franja 3).

El reporte TECHO incluye: qué se intentó (resumen de score-history), por qué no alcanza, y las 2-3 opciones concretas para el usuario (aceptar con el score actual / regenerar con prompt nuevo / revisar la decisión aprobada X / bajar el umbral).

## Formato de `art-direction/iteracion-<n>.md`

```markdown
# Art Direction — Iteración <n> — <slug-pantalla-firma>
Fecha: <YYYY-MM-DD> · Viewport: <WxH> · Umbral: <umbral> · Iteración <n>/<maxIteraciones>
Captura: shots/iter-<n>.png · HTML: <ruta>

## Veredicto: APROBADA | ITERAR | TECHO
<una frase con el global vs umbral>

## Auditoría de directivas previas   <!-- solo si n>1 -->
| # | Directiva (resumen) | Estado | Evidencia |

## Scores
| Grupo | Categoría | Score | Evidencia |
<24 filas; evidencia = elemento/zona/valor concreto, obligatoria>

| Grupo | Score |
<6 filas + fila **Global (ponderado)** — anotar si se aplicó la regla del suelo o un techo de anti-patrón>

## Fortalezas
<máx 3, reales>

## Debilidades
<cada una: qué, dónde (evidencia), qué categoría descuenta, severidad>

## Mejoras concretas (priorizadas)
| Prioridad | Mejora | Categorías que sube | Impacto esperado (puntos) |

## Directivas   <!-- solo si veredicto = ITERAR -->
<numeradas D<n>.1, D<n>.2...; cada una autosuficiente y accionable: qué cambiar, dónde exactamente,
 hacia qué resultado — redactadas para que refinement.md las traduzca a edit_screens SIN releer
 este reporte. Ordenadas por impacto. Máx 6 por iteración: más diluye la señal del prompt.>

## Escalado al usuario   <!-- solo si algo toca decisiones aprobadas -->
<sugerencias sin autoridad de directiva>
```

## Formato de `art-direction/score-history.md`

Una tabla acumulada, una fila por iteración — es lo que `orchestrator` le muestra al usuario en el gate y lo que la consolidación usa para medir deltas:

```markdown
# Score history — <slug-pantalla-firma>
Umbral: <umbral> · Máx iteraciones: <maxIteraciones>

| Iter | G1 | G2 | G3 | G4 | G5 | G6 | Global | Veredicto | Directivas emitidas |
|---|---|---|---|---|---|---|---|---|---|
```

Actualizarla en CADA iteración, en el mismo paso que el reporte — nunca dejar que diverjan.
