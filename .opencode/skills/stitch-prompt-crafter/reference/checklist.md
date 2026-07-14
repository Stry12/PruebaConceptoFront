# Checklist de verificación de borradores (Etapa B — autoritativo)

Estos 18 puntos se repasan TODOS contra `design/prompts/<slug>.md` antes de gastar una generación real. Si algo falla, se corrige el archivo primero. El resultado se marca en la sección `## Checklist` del propio borrador — es la evidencia de que la Etapa B ocurrió.

## Pipeline (1-10)

1. [ ] ¿Tiene persona senior al inicio?
2. [ ] ¿Están las 4 capas (contexto / estructura / estética / especificación técnica), y la Capa 5 si es nodo derivado?
3. [ ] ¿Los valores de color/tipografía/espaciado/radios/sombras son copiados literalmente de `theme.css` (no aproximados ni de memoria)?
4. [ ] ¿Incluye las prohibiciones explícitas de la Fase 2?
5. [ ] ¿El contenido y la jerarquía coinciden con lo definido para esa pantalla en la Fase 3 (`ux-flow.md`)?
6. [ ] ¿Los casos de borde que le correspondan (vacío/error/carga) están declarados como nodos propios del árbol (no embutidos en este prompt)?
7. [ ] ¿El prompt final mide ≤4500 caracteres? Si necesita más, ¿está planificada la partición Anchor → Inject → Tune-up → Fix (`generate_screen_from_text` + `edit_screens` sucesivos, 1-2 cambios por llamada)?
8. [ ] ¿`modelId` correcto (`GEMINI_3_FLASH` salvo autorización explícita para `GEMINI_3_1_PRO`) y `designSystem` del proyecto incluido en la llamada planificada?
9. [ ] Si hay navegación global (sidebar/tabs/menú), ¿los ítems coinciden EXACTAMENTE con la navegación aprobada en `ux-flow.md`, enumerados y cerrados con "nada más"? Stitch agrega relleno SaaS genérico ("Schedule", "Messages", "Settings") si no lo acotas — quítalo del borrador ahora, no lo dejes para que `frontend_engineer` adivine después.
10. [ ] ¿El `tipo_nodo` del ScreenBrief está bien clasificado según el árbol de `ux-flow.md`, y si es derivado (`[overlay]`/`[pantalla]`), las capas 1-4 son copia literal del prompt padre y el prompt final describe la pantalla base completa además del estado nuevo?

## Calidad de diseño (11-18)

11. [ ] ¿Los tres dials (densidad/audacia/movimiento) están declarados en el ScreenBrief, son coherentes con `design-tokens.md`/`discovery.md`, y son LOS MISMOS que el resto del lote (o el cambio está justificado por escrito)? ¿La audacia cae dentro del rango del registro de la pantalla (`producto` 1-3 / `marketing` 3-5), y si hay dirección creativa elegida en Fase 2, la Capa 3 la respeta?
12. [ ] ¿Cero adjetivos vagos sin cualificar ("moderno", "limpio", "profesional", "minimalista", "bonito", "cool")? Ver sustituciones en `vocabulary.md`.
13. [ ] ¿Cada componente interactivo visible tiene descrito su estado en reposo Y al menos un estado alternativo insinuable estáticamente (hover/selected/disabled/error), según `states.md`?
14. [ ] ¿El primer viewport está especificado: qué se ve sin hacer scroll y qué elemento domina?
15. [ ] Si la pantalla es móvil o responsive: ¿breakpoint de referencia y comportamiento del patrón de navegación declarados?
16. [ ] ¿Ningún par texto/fondo del prompt contradice el resultado de `design_check contrast` de la Fase 2?
17. [ ] ¿Sin léxico AI-default: fondo cream/sand/beige "por calidez", cards anidadas, sombras duras, iconos sólidos no pedidos, texto gris claro "por elegancia"? Ver la sección anti-default de `vocabulary.md`.
18. [ ] ¿La Capa 2 respeta la estructura firma aprobada en `ux-flow.md` (objeto central, referentes del dominio, decisión de layout memorable), y CADA bloque de contenido del prompt (stat-cards, paneles de actividad, widgets) se traza a la jerarquía de Fase 3? Un bloque que no está en `ux-flow.md` es relleno de Stitch: se elimina del borrador, igual que la navegación fantasma (punto 9). Si la pantalla usa el esqueleto `sidebar + stat-cards + grid/tabla`, la justificación desde el objeto central debe existir por escrito en `ux-flow.md`.
