# Refinamiento en el loop de calidad (modo frontend-directo)

Análogo de `stitch-prompt-crafter/reference/refinement.md`, pero sin Stitch: en este modo una directiva de `art_director` NUNCA se convierte en una llamada `edit_screens`. Se convierte en dos artefactos acoplados:

1. **Enmienda de la ScreenSpec** — la spec es el contrato; si la directiva cambia el diseño, la spec cambia PRIMERO.
2. **Petición de cambio para `frontend_engineer`** — la traducción implementable de esa enmienda.

## Entrada

`art-direction/iteracion-<n>.md` → sección `## Directivas`. Cada directiva válida ya llega con el formato exigido a `art_director` en este modo:

- componente exacto afectado
- problema observado (en la captura, no en el gusto)
- impacto en el usuario
- principio violado (rúbrica/spec/patrón)
- severidad (crítica | alta | media | baja)
- cambio recomendado
- criterio de aceptación

Si una directiva llega sin alguno de estos campos, se devuelve a `art_director` — no se interpreta.

## Procedimiento (por iteración)

1. Lee TODAS las directivas de la iteración antes de tocar nada; agrupa las que afectan a la misma sección de la spec.
2. Para cada directiva o grupo:
   - **Si contradice un `[MUST]` vigente de la spec** → conflicto: no se aplica en silencio; se reporta al orquestador (decisión de usuario o de `art_director`).
   - **Si refina algo que la spec dejaba `[SHOULD]`/`[MAY]` o infra-especificado** → enmienda la sección correspondiente con valor medible (token de `theme.css`, medida, conteo). La vaguedad no se propaga: "más aire" se convierte en "gap del grid pasa de `var(--space-4)` a `var(--space-6)`".
3. Incrementa `version` en el frontmatter; `estado: enmendada`; registra en `## Enmiendas`:

```markdown
### v<version> — iteración <n> (<fecha>)
- Directiva: <resumen + severidad> (origen: art-direction/iteracion-<n>.md)
- Cambio de spec: sección <N> — <antes → después>
- Petición a frontend_engineer: <cambio concreto de código esperado, componente exacto>
- Criterio de aceptación añadido/modificado: <ítem de la sección 18>
```

4. Emite la petición de cambio a `frontend_engineer` (vía orquestador) citando: spec `v<version>`, secciones enmendadas y criterios de aceptación nuevos. Máximo 3 frentes de cambio por iteración — un diff enorme impide atribuir mejoras/regresiones entre capturas.
5. `frontend_engineer` implementa, re-ejecuta la suite Playwright (los criterios nuevos deben tener test si son testables) y se re-captura con `screenshot.mjs` en los viewports del config. La captura nueva + spec `v<version>` son la entrada de la siguiente puntuación.

## Reglas

- La spec NUNCA queda por detrás del código: si el código cambió, es porque una versión de la spec lo pidió.
- Las directivas estructurales (cambian jerarquía/layout aprobados en Fase 3) no se enmiendan aquí: van al usuario como decisión, igual que en el modo stitch.
- Registra también las directivas RECHAZADAS y por qué (conflicto con MUST, fuera de alcance, decisión de usuario pendiente) — el historial de enmiendas es la trazabilidad del loop.
