# Refinement — de directivas del `art_director` a prompts de `edit_screens`

Protocolo del "Prompt Optimizer" del loop de calidad. Entrada: la sección `## Directivas` de `.opencode/artifacts/art-direction/iteracion-<n>.md`. Salida: llamadas `edit_screens` precisas + registro en el borrador. Lo ejecuta `ui_designer` (único agente con Stitch); las directivas NO se resumen ni se parafrasean a ojo — se TRADUCEN a instrucciones de diseño exactas.

## Procedimiento

1. **Leer solo `## Directivas`** del reporte de la iteración (están redactadas para ser autosuficientes — si una no se entiende sin el resto del reporte, repórtalo como defecto de la directiva, no lo adivines). Consultar también, en retrieval de `design-intelligence`, si hay formulaciones que ya produjeron delta en proyectos similares.
2. **Clasificar cada directiva**: ¿es un cambio que `edit_screens` puede hacer sin destruir la pantalla?
   - **Sí** (color/valor incorrecto, spacing, jerarquía de un bloque, contenido de muestra, un componente concreto): entra al lote de edición.
   - **No** (cambia el esqueleto, rehace la jerarquía completa, altera la estructura firma o tokens aprobados): NO se envía — se reporta al orquestador como "requiere regeneración o decisión de usuario". Forzarla por `edit_screens` degrada la pantalla y quema iteraciones.
3. **Agrupar por zona/componente** (header, sidebar, card de ítem, tabla...) y ordenar los grupos por impacto esperado (la columna del reporte). Regla existente de Fase 4: **1-2 cambios por llamada** `edit_screens` — Stitch "olvida" el diseño si le pides cinco cambios de golpe. Preferir pocas llamadas bien cargadas: idealmente UNA por iteración si las directivas caben en 1-2 cambios coherentes; nunca más de 3 llamadas por iteración (cuota).
4. **Redactar cada instrucción como especificación, no como crítica.** La directiva dice qué está mal; el prompt dice exactamente qué debe haber:
   - Valores LITERALES de `theme.css` (hex, px, familia, sombra) — nunca "más contraste" sino "el texto secundario de las cards pasa de #8A8580 a #5C5651 (—color-text-secondary)".
   - Ubicación inequívoca del elemento ("en la tarjeta de ítem de la estantería horizontal, el título...").
   - **Refuerzo de contexto en CADA llamada**: una frase de anclaje del diseño vigente + las prohibiciones de Fase 2 relevantes a la zona tocada. `edit_screens` pierde fidelidad al diseño previo en cada edición si no se le re-ancla.
   - Cero léxico AI-default (ver `vocabulary.md` — igual que en generación).
5. **Enviar** con el `modelId` del config, respetando el protocolo de resiliencia MCP de Fase 4 (timeout ≠ fallo; `get_screen` cada ~30 s antes de reintentar).
6. **Re-descargar SIEMPRE** el HTML a `design/screens/<slug>.html` tras cada lote de ediciones (regla existente de Fase 4, punto 5) — el `art_director` puntúa el archivo en disco; si no se re-descarga, puntúa la versión vieja.
7. **Registrar** (ver abajo) y devolver el control al orquestador — `ui_designer` NUNCA se auto-puntúa ni declara la pantalla aprobada.

## Registro obligatorio: sección `## Iteraciones` del borrador

Cada iteración se anexa al final de `design/prompts/<slug-firma>.md`:

```markdown
## Iteraciones
### Iteración <n> — <fecha>
- Directivas atendidas: D<n>.1, D<n>.3 (D<n>.2 escalada: estructural)
- Llamadas edit_screens: <cuántas>
- Prompt(s) exacto(s) enviado(s):
  > <texto literal de cada llamada>
- Resultado: <re-descargado a design/screens/<slug>.html — hash/fecha; incidentes MCP si hubo>
```

Este registro es la materia prima de la consolidación en `intelligence/` (los prompts que produjeron delta se guardan verbatim) — sin él, el aprendizaje entre proyectos se pierde.

## `correcciones_vigentes` y el loop

Si una iteración introduce una desviación deliberada respecto de un artefacto (ej. el `art_director` señaló un problema real cuyo arreglo matiza un token en ESTA pantalla), se anota en `correcciones_vigentes` del ScreenBrief hasta que el artefacto fuente se actualice. Tras la aprobación de la pantalla firma, la extracción (E4b) y la reconciliación de `theme.css` (vía `color_strategist`) deben dejar ese campo vacío otra vez — `correcciones_vigentes` con contenido persistente es deuda de sincronía, no un estado normal.

## Qué NO hacer

- No convertir una directiva en varios cambios "ya que estamos" — el loop mide causa-efecto por directiva; los extras contaminan la medición y gastan cuota.
- No re-generar la pantalla con `generate_screen_from_text` por decisión propia — eso es siempre escalado (TECHO o decisión de usuario).
- No editar el `.html` local a mano ni con comandos de `impeccable` — Stitch es la única fuente de verdad visual (regla existente de Fase 4).
