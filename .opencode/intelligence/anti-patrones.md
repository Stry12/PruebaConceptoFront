# Anti-patrones

Decisiones de diseño que fallan repetidamente. `art_director` los lee ANTES de puntuar (calibración: si el mockup exhibe uno de estos, la categoría afectada no puede superar su techo indicado). `brand_strategist`, `color_strategist` y `ui_designer` los leen en retrieval para no reintroducirlos.

> Reset 2026-07-19: la base de conocimiento se vació a petición del usuario (experimento frontend-directo, partida desde cero). Se conservan solo los 3 anti-patrones ESTRUCTURALES — forman parte del diseño del sistema (auditorías y skills que los detectan) y no contienen identidad de ningún proyecto. Los anti-patrones derivados de corridas (AP-4+) fueron eliminados y se re-consolidarán desde los runs nuevos.

Formato de entrada (append-only):

```markdown
## AP-<n>: <título corto>
- **Qué es:** <descripción del patrón fallido>
- **Por qué falla:** <consecuencia observada>
- **Cómo detectarlo:** <señal concreta en un mockup/prompt>
- **Techo de score:** <categoría de la rúbrica afectada y máximo que puede recibir mientras el anti-patrón esté presente>
- **Evidencia:** <dónde se observó>
```

---

## AP-1: Esqueleto default de "admin SaaS" (sidebar + fila de stat-cards + grid/tabla)
- **Qué es:** el generador (Stitch o un implementador sin spec) aplica la misma estructura a cualquier dominio si no se impone una estructura firma derivada de arquetipos.
- **Por qué falla:** todos los productos terminan idénticos aunque tengan identidades visuales distintas; las stat-cards suelen ser relleno sin lugar en la jerarquía de información.
- **Cómo detectarlo:** `frontend_audit check:"skeleton"` lo detecta mecánicamente; visualmente: fila de ≥3 tarjetas de métrica arriba de un listado en una pantalla cuyo rol no es `analítica`/`registros`.
- **Techo de score:** Originalidad ≤ 55; Jerarquía visual ≤ 70 si las stat-cards no están en la jerarquía de `ux-flow.md`.
- **Evidencia:** documentado como riesgo estructural central en `ui_designer` Fase 3 y `stitch-prompt-crafter/reference/archetypes.md`; motivó la auditoría `skeleton` (commit `ed0ed65`).

## AP-2: Fondo crema/beige genérico como atajo de "calidez"
- **Qué es:** los generadores (y los prompts/specs vagos) tienden a resolver "cálido/acogedor" con un fondo cream uniforme sin sistema de superficies.
- **Por qué falla:** aplana la jerarquía de superficies (cards ≈ fondo), degrada el contraste de texto secundario y hace que proyectos distintos se vean iguales.
- **Cómo detectarlo:** fondo global saturación baja + tono amarillo/naranja, sin escala de superficies diferenciada en `theme.css`; pares de contraste al límite en `design_check contrast`.
- **Techo de score:** Aplicación del color ≤ 65; Premium ≤ 60 si además las sombras son el único separador de superficie.
- **Evidencia:** anti-default documentado en `stitch-prompt-crafter/reference/vocabulary.md` (sección anti-default).

## AP-3: Léxico AI-default en prompts/specs ("moderno", "limpio", "cool", "azul")
- **Qué es:** adjetivos vagos que el generador o el implementador resuelven con su prior genérico.
- **Por qué falla:** produce el mismo resultado plano independientemente de la intención; es la causa raíz del "AI slop" que `stitch-prompt-crafter/reference/vocabulary.md` y las reglas duras de `screen-spec-composer` existen para evitar.
- **Cómo detectarlo:** el checklist de 18 puntos de `stitch-prompt-crafter` (modo stitch) o el checklist de `screen-spec-composer` (modo frontend-directo) lo marcan; en iteraciones del loop: una directiva traducida sin valores medibles o sin tokens de `theme.css`.
- **Techo de score:** no aplica a la pantalla (es un anti-patrón de redacción) — pero una iteración cuyo prompt/enmienda lo contenga se considera mal ejecutada y no cuenta como "mejora intentada" al evaluar TECHO.
- **Evidencia:** metodología completa en `stitch-prompt-crafter` (commit `059adcd`).
