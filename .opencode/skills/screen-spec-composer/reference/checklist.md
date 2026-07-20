# Checklist de ScreenSpec (antes de declararla `vigente`)

Se verifica ítem por ítem y se marca en la sección `## Checklist` de la propia spec. Una spec con ítems sin marcar no se entrega.

## Completitud
1. [ ] Las 20 secciones de `plantilla.md` están presentes; las no aplicables dicen "No aplica — motivo".
2. [ ] Frontmatter completo: slug, ruta, tipo, tipo_nodo, version, iteracion, estado, viewports, fuentes.
3. [ ] Todas las fuentes del ScreenBrief existen en disco y se citaron (no se escribió de memoria).
4. [ ] Si existe patrón aplicable en `.opencode/intelligence/patterns/`, sus reglas obligatorias están incorporadas como `[MUST]`.

## Precisión
5. [ ] Cero valores crudos de diseño: todo color/espaciado/radio/borde/sombra/tipografía es `var(--...)` de `theme.css`.
6. [ ] Cero léxico vago: sin "moderno/premium/limpio/intuitivo/elegante/mejorar espaciado" ni equivalentes — todo traducido a instrucción medible.
7. [ ] Todo requisito lleva etiqueta `[MUST]`/`[SHOULD]`/`[MAY]`; la acción principal es exactamente una y es `[MUST]`.
8. [ ] El layout tiene medidas (px/tokens/conteos), no descripciones ("grid de 4 columnas, gap var(--space-4), tarjetas de ratio 2/3") — para ambos viewports.

## Estados e interacción
9. [ ] Cada componente interactivo especifica hover, focus-visible, active y disabled (o "No aplica" explícito).
10. [ ] La pantalla especifica vacío, carga y error con contenido exacto.
11. [ ] Sección 14: cada acción secundaria declara su independencia de la principal (qué NO dispara).
12. [ ] Sección 12: orden de tab numerado y semántica Enter/Space por elemento con roles nativos.
13. [ ] Sección 13: nombres accesibles exactos (con plantilla para contenido dinámico) y aria-* requeridos.

## Verificabilidad
14. [ ] Cada criterio de aceptación (sección 18) es comprobable por test Playwright, auditoría o observación binaria en captura — nada de "se ve bien".
15. [ ] Los criterios cubren: acción principal, independencia de secundarias, teclado, focus visible y los estados de pantalla.
16. [ ] Sección 19 enumera al menos los defaults genéricos vetados por `design-tokens.md`/`brand-brief.md` aplicables a esta pantalla.
17. [ ] Accesibilidad `[MUST]`: contraste (design_check), targets ≥44px móvil, un solo H1, focus visible, prefers-reduced-motion.
18. [ ] Fixtures realistas definidos (dominio real, cantidades concretas) — prohibido lorem ipsum y "Item N". En dominios con imagen, los fixtures incluyen imágenes reales (portadas/covers): un placeholder gris invalida la evaluación visual (craft.md §3).

## Craft (reference/craft.md — todos obligatorios)
19. [ ] Todo componente repetido tiene anatomía de slots (media/body/footer), title con line-clamp + altura reservada, footer siempre presente, alturas iguales por fila.
20. [ ] Contención declarada: nada sobresale del borde de su card salvo excepciones explícitas con offset; controles repetidos con el mismo offset en todas las instancias.
21. [ ] Ritmo 8pt vía `var(--space-*)`; mínimos de respiración entre hermanos declarados (≥ space-3/space-4 según craft.md §2).
22. [ ] Proporción de color 60/30/10 alcanzable con lo especificado: portadores de color del dominio presentes; estados semánticos con color, no solo gris.
23. [ ] Los criterios de aceptación de craft (contención, consistencia ±2px, alturas por fila, ritmo, color) están en la sección 18.
