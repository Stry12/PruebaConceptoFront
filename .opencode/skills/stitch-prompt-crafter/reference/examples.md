# Ejemplos few-shot: de requerimiento breve a prompt de Stitch

Dos transformaciones completas: un nodo raíz y un nodo derivado `[overlay]`. Los valores hex provienen de un `theme.css` de ejemplo — en un proyecto real se copian del `theme.css` aprobado, nunca de aquí.

---

## Ejemplo 1 — Nodo raíz

**Requerimiento de entrada** (lo que llega del inventario de Fase 3):
> "Pantalla de listado de prescripciones para los farmacéuticos del hospital."

**ScreenBrief resuelto**: `tipo_nodo: raiz` · dials `{ densidad: 4, audacia: 2, movimiento: 1 }` (herramienta clínica de escritorio, turnos largos, escaneo rápido) · léxico: clínico-preciso · casos de borde pendientes: vacío, error, carga (3 nodos propios).

**Prompt final (~2.300 caracteres — deja margen para 2 `edit_screens` de refinamiento):**

> Actúa como Lead Product Designer de un sistema clínico hospitalario de referencia (nivel Epic/Linear en craft). Diseña la pantalla **"Listado de prescripciones"** de una app web de farmacia hospitalaria.
>
> **Contexto**: la usan farmacéuticos clínicos en turnos largos, en monitores de escritorio 1440px, con luz de oficina; priorizan velocidad de escaneo y cero ambigüedad sobre estética decorativa. Densidad de información alta, expresión de marca contenida.
>
> **Estructura**: sidebar fija de 240px a la izquierda con navegación exacta: "Prescripciones" (activa), "Pacientes", "Inventario", "Reportes" — nada más, sin ítems adicionales. Área principal: encabezado con título H1 "Prescripciones", buscador por paciente/medicamento y botón primario "Nueva prescripción" alineado a la derecha; debajo, fila de filtros como chips seleccionables ("Pendientes", "Validadas", "Dispensadas", "Rechazadas"); debajo, tabla densa de ancho completo que domina el primer viewport, columnas: Paciente, Medicamento, Dosis, Vía, Prescriptor, Estado (badge), Hora. Filas de 44px, cebra sutil.
>
> **Estética**: lenguaje clínico-preciso, superficie blanca neutra con acentos funcionales; nada de estilo dashboard SaaS genérico ni Material por defecto. Los estados clínicos usan color semántico, no decorativo. Un solo elemento con color pleno por vista: el botón primario.
>
> **Especificación técnica**: fondo `#F8FAFC`; superficie de tabla `#FFFFFF`; texto principal `#0F172A`; texto secundario `#475569`; primario `#0E7490` (botón "Nueva prescripción", chip activo, fila seleccionada al 8% de opacidad); estados: éxito `#15803D`, advertencia `#B45309`, error `#B91C1C` — usados SOLO en los badges de Estado, como fondo al 12% con texto del color pleno. Tipografía "Inter": H1 24px/600, encabezados de tabla 12px/600 uppercase tracking 0.05em, celdas 14px/400, line-height 1.5. Radios 6px en badges y chips, 8px en el contenedor de tabla. Sombra única del contenedor: 0 1px 2px rgba(0,0,0,0.05). Iconos de trazo fino 1.5px, nunca rellenos. Muestra UNA fila en estado hover (fondo `#F1F5F9`) y el ítem de navegación activo con indicador lateral de 3px. Chip "Pendientes" seleccionado: fondo primario, texto blanco. **Prohibido**: gradientes, cards anidadas, sombras duras, iconografía sólida, ítems de navegación no listados.

**Qué lo hace bueno**: persona con referente de craft · navegación enumerada y cerrada · densidad materializada (44px, cebra) · color semántico acotado ("SOLO en los badges") · estados insinuados (hover, chip activo, nav activa) · prohibiciones al cierre · tamaño con margen.

---

## Ejemplo 2 — Nodo derivado `[overlay]`

**Requerimiento**: el botón "Nueva prescripción" del listado abre un modal de alta.

**ScreenBrief resuelto**: `tipo_nodo: overlay` · `prompt_padre: .opencode/artifacts/design/prompts/listado-prescripciones.md` · mismos dials y léxico que el padre (obligatorio).

**Mecánica**: las capas 1-4 se COPIAN literalmente del prompt padre (todo el bloque de Contexto/Estructura/Estética/Especificación del Ejemplo 1 va tal cual en el prompt final, describiendo la pantalla base de fondo). Solo se AÑADE la Capa 5:

> **Estado a mostrar**: sobre la pantalla anterior (visible de fondo, atenuada con overlay `rgba(15,23,42,0.4)`), un modal centrado de 560px, radio 8px, sombra 0 8px 24px rgba(0,0,0,0.12). Título H2 "Nueva prescripción", botón de cierre (icono X de trazo fino) arriba a la derecha. Formulario en una columna: campo de búsqueda de paciente con autocompletado (muestra el dropdown abierto con 3 resultados, el segundo en hover con fondo `#F1F5F9`), select de medicamento, campos Dosis y Frecuencia en fila 50/50, select de Vía, textarea "Indicaciones" de 3 líneas. El campo "Dosis" se muestra en estado de error: borde `#B91C1C` y mensaje de 12px debajo "Indica la dosis en mg". Pie del modal: botón secundario "Cancelar" (ghost, texto `#475569`) y primario "Guardar prescripción" deshabilitado (opacidad 40%, sin sombra) porque el formulario está incompleto.

**Qué lo hace bueno**: la pantalla base completa viaja en el prompt (Stitch no "recuerda" la pantalla padre) · el modal documenta 3 estados en una sola generación (dropdown en hover, input en error, botón disabled) · geometría del overlay exacta · se genera con `generate_screen_from_text` como llamada independiente, NUNCA con `edit_screens` sobre el padre (lo mutaría destruyendo la versión sin modal).
