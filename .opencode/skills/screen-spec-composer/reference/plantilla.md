# Plantilla de ScreenSpec (`design/specs/<slug>.md`)

Las 20 secciones son obligatorias. Si una no aplica a la pantalla, se escribe "No aplica — <motivo>", nunca se omite. Cada requisito lleva su etiqueta `[MUST]`/`[SHOULD]`/`[MAY]`.

```markdown
---
slug: <slug>
titulo: <nombre de la pantalla>
ruta: </ruta/en/la/app>
tipo: producto | marketing        # de ux-flow.md — misma semántica que en el modo stitch
tipo_nodo: raiz | overlay | pantalla
version: 1                        # se incrementa con cada enmienda del loop
iteracion: 0                      # iteración del loop de calidad en la que se está usando
estado: borrador | vigente | enmendada
viewports: ["1280x800", "390x844"]  # de design-quality.config.json
fuentes:
  theme_css: .opencode/artifacts/design/theme.css
  ux_flow: .opencode/artifacts/design/ux-flow.md
  tokens: .opencode/artifacts/design/design-tokens.md
  discovery: .opencode/artifacts/design/discovery.md
  brand_brief: .opencode/artifacts/design/brand-brief.md
  patron: <ruta en .opencode/intelligence/patterns/ o null>
---

# ScreenSpec: <titulo>

## 1. Propósito
<Qué resuelve esta pantalla dentro del producto, en 2-4 frases. Sin adjetivos de estilo.>

## 2. Objetivo del usuario
<El objetivo primario del usuario al llegar aquí, y desde dónde llega (nodo padre en ux-flow.md).>

## 3. Acciones
- Acción principal [MUST]: <una sola; qué dispara y a dónde lleva>
- Acciones secundarias: <lista, cada una etiquetada; qué disparan; independencia respecto de la principal>

## 4. Jerarquía de información
<Orden de lectura numerado. Qué domina el primer viewport. Qué es contenido primario / secundario / metadato.
 Cada texto de la pantalla con su NIVEL asignado (primary/secondary/muted — craft.md §6);
 pares label/valor con el énfasis en el valor.>

## 5. Layout y grid
<Topología con medidas: sidebar fija de Npx, grid de N columnas con gap var(--space-X), anchos máximos,
 alturas de fila. Desktop (1280x800) y móvil (390x844) por separado.>

## 6. Responsive
<Breakpoints y reflow: qué colapsa, qué se oculta, qué cambia de orientación, en qué medida.>

## 7. Inventario de componentes
| Componente | Nuevo/Reutilizado | Ubicación esperada | Props/estado clave |
|---|---|---|---|
<Reutilizado = ya existe en shared/components del proyecto; se referencia, no se duplica.
 Para TODO componente repetido en grid/lista: incluir su ANATOMÍA DE SLOTS (reference/craft.md §1) —
 zonas con nombre (media/body/footer), alturas gobernadas por slot (line-clamp + min-height),
 posición exacta de cada control repetido respecto de su slot, y contención declarada
 (qué puede sobresalir del borde; por defecto, nada).>

## 8. Tokens (solo variables de theme.css)
<Mapa componente→token para color, espaciado, radius, borde y elevación/sombra.
 PROHIBIDO escribir valores crudos: siempre var(--...).>

## 9. Tipografía
<Familia/escala por rol (display, headline, body, label) referenciando las variables/clases del tema.
 Un solo H1 [MUST].>

## 10. Iconos e imágenes
<Set de iconos y estilo de trazo; ratio y object-fit de imágenes; alt: cuándo texto y cuándo alt="" [MUST].>

## 11. Estados
<Por componente interactivo Y por pantalla: vacío, carga, error, hover, focus-visible, active, disabled.
 "No aplica" se escribe explícitamente. Los estados de pantalla (vacío/carga/error) describen contenido exacto.>

## 12. Teclado
<Orden de tabulación numerado. Qué hace Enter y qué hace Space en cada interactivo
 (semántica nativa: Enter en enlaces; Enter+Space en botones). Atajos si los hay.>

## 13. Lector de pantalla
<Roles y landmarks; nombres accesibles exactos (plantillas con contenido dinámico, ej.
 "Marcar como favorito: {titulo}"); aria-* requeridos (aria-pressed, aria-current, aria-live si aplica).>

## 14. Interacciones
<Tabla disparador → resultado, incluyendo prevención de conflictos (ej. acción secundaria NO dispara la principal).>

## 15. Movimiento
<Momentos de motion (hover, entrada, transición de ruta) con duración/easing por referencia a la skill
 motion-craft. Identificar el MOMENTO PICO del flujo (craft.md §8) y especificar su feedback — el motion
 se concentra ahí, no en decorar. Respetar prefers-reduced-motion [MUST].>

## 16. Accesibilidad
<Contraste conforme a design_check [MUST]; targets ≥44px en móvil [MUST]; focus visible [MUST];
 cualquier requisito adicional de la pantalla.>

## 17. Datos, fixtures y microcopy
<Contenido realista requerido (nada de "Lorem ipsum" ni "Item 1..N"): cuántos registros, qué campos,
 ejemplos concretos del dominio — con IMÁGENES reales si el dominio las tiene (craft.md §3).
 Microcopy REAL de la pantalla: labels de acciones (verbo concreto), copy del empty state (guía + CTA),
 mensajes de error — el copy es contrato, no se improvisa en código (craft.md §8).
 Los fixtures viven en el código del proyecto, no en la spec.>

## 18. Criterios de aceptación
<Checklist verificable — cada ítem mapeable a un test Playwright, una auditoría o una observación
 binaria en captura. Esta sección ES la base de la suite de tests de la pantalla.>
- [ ] ...

## 19. Interpretaciones prohibidas
<Qué NO hacer: defaults genéricos a evitar, patrones vetados por design-tokens.md/brand-brief.md,
 libertades que el implementador NO tiene.>

## 20. Contexto de revisión
- Iteración actual: <n>
- Hallazgos abiertos: <lista o "ninguno">
- Captura previa: <ruta o "n/a (iteración 0)">

## Checklist
<los ítems de reference/checklist.md, marcados — evidencia de la verificación previa a declarar la spec vigente>

## Enmiendas
<solo si la spec pasó por el loop: una entrada por enmienda con directiva origen, cambio de spec,
 petición de cambio emitida a frontend_engineer y versión resultante — formato en reference/refinamiento.md>
```
