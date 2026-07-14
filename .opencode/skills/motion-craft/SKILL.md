---
name: motion-craft
description: Load when reviewing implemented animation/motion/microinteraction code (transitions, easing, durations, hover/press feedback, reduced-motion) or when writing motion recommendations inside a design review. Primary consumer is the design_reviewer agent; frontend_engineer may receive its rules as concrete proposals. Scoped to motion ONLY — for general UI craft (color, typography, layout, a11y) use the impeccable skill instead. Do not auto-load for generic frontend tasks.
---

# Motion Craft — criterio y revisión de animación

Destilado de las skills MIT de Emil Kowalski ([github.com/emilkowalski/skill](https://github.com/emilkowalski/skill): `emil-design-eng` + `review-animations`), adaptado a este pipeline: Stitch entrega mockups estáticos, así que TODO el motion real se decide e implementa en la etapa de código — y por eso se revisa aquí, no contra los mockups.

Filosofía: el buen motion casi nunca se nota conscientemente; se acumula en una interfaz que "se siente bien". Cada animación debe poder justificar su existencia — el default es NO animar.

## Marco de decisión (para redactar propuestas)

**1. ¿Debe animarse siquiera?** Por frecuencia de uso:

| Frecuencia | Decisión |
|---|---|
| 100+ veces/día (atajos de teclado, command palette) | Sin animación. Nunca. |
| Decenas de veces/día (hover, navegación de listas) | Eliminar o reducir drásticamente |
| Ocasional (modales, drawers, toasts) | Animación estándar |
| Rara / primera vez (onboarding, celebraciones) | Puede añadir delight |

Nunca se anima una acción iniciada por teclado.

**2. ¿Con qué propósito?** Solo valen: consistencia espacial (el toast entra y sale por el mismo lado), indicación de estado, feedback (botón que confirma la pulsación), explicación, o evitar un cambio brusco. "Se ve bonito" no es propósito.

**3. ¿Qué easing?**

| Situación | Easing |
|---|---|
| Elemento entrando o saliendo | `ease-out` (o curva custom) |
| Movimiento/morphing en pantalla | `ease-in-out` |
| Hover / cambio de color | `ease` |
| Movimiento constante (marquee, progreso) | `linear` |

Curvas custom recomendadas: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` · `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` · `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`. Nunca `ease-in` en UI.

**4. ¿Qué duración?** Feedback de botón 100-160ms · tooltips/popovers pequeños 125-200ms · dropdowns 150-250ms · modales/drawers 200-500ms. Regla: UI <300ms salvo justificación. Enter/exit asimétricos: lo que el usuario decide puede ser lento, lo que el sistema responde debe ser rápido.

## Reglas de implementación (las que van en las propuestas al ingeniero)

- Solo animar `transform` y `opacity` (GPU); nunca layout (`height`, `padding`, `margin`, `width`).
- Entradas desde `scale(0.95-0.97)` + `opacity: 0`, nunca desde `scale(0)` ni fade-only.
- Popovers/dropdowns con `transform-origin` en el trigger (los modales sí quedan centrados).
- Transiciones CSS sobre keyframes para UI dinámica: son interrumpibles y re-apuntan a mitad de camino; los keyframes reinician de cero.
- `@starting-style` para estados de entrada declarativos; springs (`bounce` bajo) para gestos/drag.
- Botones: `transform: scale(0.97)` en `:active` con `transition: transform 160ms ease-out`.
- Stagger de 30-80ms entre ítems de una lista que entra junta.
- `prefers-reduced-motion`: menos y más suave, no cero — conservar opacidad/color, quitar desplazamiento.
- Hover solo bajo `@media (hover: hover) and (pointer: fine)`.

## Estándares de revisión (bloqueos duros — cada uno es hallazgo automático)

1. `transition: all` → especificar propiedades exactas.
2. Entrada con `scale(0)` o solo-fade.
3. `ease-in` (o easing débil por defecto) en UI.
4. Animación en acciones de teclado o de altísima frecuencia.
5. UI >300ms sin justificación escrita.
6. `transform-origin: center` en popover anclado a trigger.
7. Keyframes en elementos que se disparan rápido y repetido.
8. Animación de propiedades de layout.
9. Falta `prefers-reduced-motion` o el gating de hover táctil.
10. Timing simétrico donde debería ser asimétrico (enter deliberado vs exit del sistema).

También es hallazgo el extremo opuesto: una app entera SIN ningún feedback de interacción (botones sin estado de pulsación, modales que aparecen de golpe) — el objetivo es motion justificado, no motion cero.

## Formato de salida al revisar

Tabla de hallazgos (Dónde | Antes | Propuesta | Por qué, citando la regla) + veredicto agrupado por impacto. La cohesión manda: el motion debe encajar con la personalidad del producto definida en `design/discovery.md` (un dashboard clínico es seco y rápido; un consumer puede rebotar).
