# Estados y microinteracciones en prompts de Stitch

Principio rector: **Stitch genera HTML/CSS estático.** Una microinteracción no se "pide" como animación — se insinúa mostrando el ESTADO visible que la evidencia. La animación real la implementa `frontend_engineer` después; tu trabajo es dejar evidencia visual de cada estado para que no tenga que inventarlo.

## Estados de componente (van en la Capa 4 del prompt)

Para cada componente interactivo visible, describe el estado en reposo Y al menos un estado alternativo, con valores literales de `theme.css`:

| Componente | Estados a especificar | Cómo pedirlo (ejemplo de frase) |
|---|---|---|
| Fila de tabla / ítem de lista | reposo, hover, seleccionado | "muestra UNA fila en estado hover: fondo `#F1F5F9`" |
| Botón primario | reposo, disabled | "el botón 'Guardar' aparece deshabilitado (opacidad 40%, sin sombra) porque el formulario está incompleto" |
| Input / campo de formulario | reposo, focus, error de validación | "el campo 'Dosis' se muestra en error: borde `#B91C1C`, mensaje de ayuda de 12px debajo en el mismo color" |
| Chip / filtro | reposo, seleccionado | "el chip 'Pendientes' está seleccionado: fondo primario, texto blanco; el resto en reposo" |
| Ítem de navegación | activo, inactivo | "'Prescripciones' es el ítem activo: indicador lateral de 3px en primario, texto a peso 600" |
| Toggle / checkbox | on y off visibles | "muestra dos filas: una con el toggle activado y otra desactivada" |

Truco clave: pide que la pantalla muestre la MEZCLA natural de estados (una fila en hover, un chip activo, un botón disabled) en vez de una pantalla "toda en reposo" — una sola generación documenta varios estados sin gastar nodos extra.

## Estados de pantalla (nodos propios del árbol — NUNCA dentro del mismo prompt)

Cada uno es un nodo `[overlay]` o `[pantalla]` del árbol de estados de `ux-flow.md`, con su propio borrador que copia las capas 1-4 del padre:

- **Vacío**: qué ícono/ilustración (coherente con la iconografía declarada), título, subtítulo de una línea y CTA aparecen cuando no hay datos. El empty state es una oportunidad de diseño, no un "no hay resultados" suelto.
- **Error**: mensaje humano (qué pasó + qué hacer), acción de reintento, sin culpar al usuario.
- **Carga**: describe los skeletons con geometría concreta: "skeleton de 8 filas; cada fila, barras redondeadas (radio 4px) de 14px de alto al 60%/40%/80% del ancho de su columna". Nunca "un spinner" a secas para vistas con estructura conocida.

## Dial de movimiento (1-3) — qué insinuar según el nivel

- **1 — Funcional**: solo estados hover/focus/selected estáticos. Apropiado para herramientas densas y back-office.
- **2 — Expresivo moderado**: además, elevación visible en hover de cards (sombra un paso más profunda), chips con transición de fondo insinuada, badges con dot de estado.
- **3 — Rico**: estados intermedios visibles en el mockup — barra de progreso a mitad, toast de confirmación presente, stepper en paso 2 de 4, contador animable con valor "en curso".

En cualquier nivel: la transición real (curva, duración, stagger) NO va en el prompt de Stitch — no puede representarla. Si el diseño la necesita, anótala en el borrador como nota para `frontend_engineer` (la skill `impeccable`, `reference/interaction-design.md`, cubre motion real en código).

## Accesibilidad (va en el prompt, no se parchea después)

- **Contraste**: no escribas ningún par texto/fondo que contradiga el resultado de `design_check contrast` de la Fase 2.
- **Táctil**: targets ≥44px en móvil (filas, botones, iconos de acción).
- **Focus visible**: anillo de 2px en el color primario sobre los interactivos — pide que un elemento del mockup lo muestre.
- **Jerarquía de headings**: un solo H1 por pantalla, niveles sin saltos.
