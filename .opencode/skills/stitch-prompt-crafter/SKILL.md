---
name: stitch-prompt-crafter
description: Load ALWAYS at Fase 4 of the ui_designer flow, BEFORE writing any prompt for Stitch's generate_screen_from_text or edit_screens. Turns a ScreenBrief (screen from the ux-flow.md inventory + literal tokens from theme.css) into a layered, checklist-verified prompt draft saved in design/prompts/. Also use when reviewing or debugging why a Stitch prompt produced a generic ("AI slop") or inconsistent screen. This skill only writes and validates prompt drafts — it never calls Stitch tools itself.
---

# Stitch Prompt Crafter

Redactas los prompts del pipeline de diseño. Tu único entregable es `.opencode/artifacts/design/prompts/<slug>.md`. Nunca invocas herramientas de Stitch: redactar (esta skill) y enviar (Etapa C de la Fase 4 en `ui_designer.md`) son pasos separados.

**Por qué existe**: Stitch por defecto produce interfaces conservadoras, planas y predecibles ("AI slop"). Un prompt vago produce un resultado genérico. Esta metodología es obligatoria para CUALQUIER prompt — no es opcional ni un "extra de calidad".

**Nota de terminología**: donde esta skill y sus referencias dicen "Fase 2" se refieren a la etapa de estrategia visual/tokens — hoy propiedad de `color_strategist` (E2), que produce `design-tokens.md` y `theme.css`. La dirección creativa y la identidad de marca las elige `brand_strategist` en `design/brand-brief.md` (E1). "Fase 3" sigue siendo la UX de `ui_designer`.

## Archivos de referencia (bajo demanda, no todos siempre)

| Archivo | Cuándo leerlo |
|---|---|
| `reference/archetypes.md` | En la Fase 3, para DERIVAR la estructura firma clasificando el producto (y el rol de cada pantalla) por arquetipo — y en Fase 4 si dudas de si el esqueleto de una pantalla es legítimo o es el prior de Stitch. |
| `reference/vocabulary.md` | Al redactar la Capa 3 (Estética) de la PRIMERA pantalla de un lote — el léxico elegido se reutiliza en el resto del lote. |
| `reference/states.md` | Si la pantalla tiene componentes interactivos o casos de borde (casi siempre). |
| `reference/checklist.md` | SIEMPRE, antes de declarar un borrador listo (Etapa B). |
| `reference/examples.md` | Solo en las primeras 1-2 pantallas de un proyecto nuevo; después ya tienes los patrones. |
| `reference/refinement.md` | Al recibir directivas de `art_director` en el loop de calidad de la pantalla firma — cómo traducirlas a llamadas `edit_screens` precisas y registrarlas. |

## Entrada obligatoria: el ScreenBrief

Antes de escribir una línea del prompt, reúne de los artefactos (no de memoria):

1. `theme.css` — valores literales (hex, fuentes, tamaños, radios, sombras). Si un valor no está ahí, NO existe: no lo inventes, es señal de volver a Fase 2.
2. `ux-flow.md` — la estructura firma del proyecto (objeto central, referentes del dominio, decisión de layout memorable), jerarquía de la pantalla, navegación aprobada ítem por ítem, y tipo de nodo en el árbol de estados (`raíz` / `[overlay]` / `[pantalla]`).
3. `design-tokens.md` — lenguaje visual, psicología de color y PROHIBICIONES de Fase 2.
4. `discovery.md` — público objetivo y contexto de uso (gobierna el tono y los dials).
5. `brand-brief.md` — personalidad, keywords visuales y la dirección creativa elegida (gobierna la Capa 3 y la audacia).
6. Si es nodo derivado: el archivo de prompt del padre COMPLETO — sus capas 1-4 se copian literalmente, nunca se parafrasean.

Si falta cualquiera de estas fuentes, detente y repórtalo — un prompt sin fuente es un prompt inventado.

Registra el ScreenBrief al inicio del borrador (ver plantilla):

```yaml
screen:
  slug: <slug>
  nombre: <nombre>
  tipo_nodo: raiz | overlay | pantalla
  registro: producto | marketing   # de ux-flow.md — fija el rango de audacia y la lente de auditoría
  arquetipo: <arquetipo asignado en ux-flow.md, ver reference/archetypes.md>
  prompt_padre: null | .opencode/artifacts/design/prompts/<slug-padre>.md
fuentes:
  theme_css: .opencode/artifacts/design/theme.css
  ux_flow: .opencode/artifacts/design/ux-flow.md
  tokens: .opencode/artifacts/design/design-tokens.md
  discovery: .opencode/artifacts/design/discovery.md
  brand_brief: .opencode/artifacts/design/brand-brief.md
dials: { densidad: 1-5, audacia: 1-5, movimiento: 1-3 }
casos_borde_pendientes: [vacio, error, carga]   # cada uno será nodo propio del árbol
correcciones_vigentes: []  # desviaciones aprobadas en conversación aún no volcadas a artefactos — debe tender a vacío; si hay algo aquí, actualiza el artefacto fuente cuanto antes. En el loop de calidad, las desviaciones que introduce una iteración se anotan aquí hasta que la extracción/reconciliación post-aprobación las vuelque (ver reference/refinement.md)
```

## Composición del prompt (en este orden)

0. **Persona senior.** Abre con un rol de diseño de alto nivel coherente con el dominio (ej. *"Actúa como Lead Product Designer de [referente de craft del sector]. Diseña..."*). Nunca pidas la pantalla "a secas": esto por sí solo cambia radicalmente la sofisticación del resultado.
1. **Capa 1 — Contexto**: para quién, en qué situación, en qué dispositivo/viewport. Un fintech y un juego infantil no comparten lenguaje visual.
2. **Capa 2 — Estructura**: topología del layout con nombres precisos (bento grid, sidebar fija de 240px, split-screen 60/40, stack vertical), orden de lectura, y qué elemento domina el primer viewport. Se redacta DESDE la estructura firma de `ux-flow.md` — el esqueleto default de Stitch (`sidebar + stat-cards + grid/tabla`) solo si esa sección lo justifica desde el objeto central, y cada bloque de contenido trazado a la jerarquía de Fase 3 (lo que no esté ahí es relleno).
3. **Capa 3 — Estética**: el "vibe" con vocabulario de `reference/vocabulary.md`. Prohibido: "moderno", "limpio", "bonito", "profesional", "minimalista" sin cualificar.
4. **Capa 4 — Especificación técnica**: hex, fuentes, tamaños, line-height, radios y sombras COPIADOS de `theme.css` (no aproximados ni de memoria). Iconografía explícita (estilo de trazo). Estados de componentes según `reference/states.md`. Cierra la capa repitiendo las prohibiciones de Fase 2.
5. **Capa 5 — Estado a mostrar** (solo nodos derivados): la pantalla base completa de fondo + el overlay/estado nuevo encima, con su contenido exacto.

## Dials (declara los tres en cada prompt, derivados de design-tokens.md y discovery.md)

- **Densidad 1-5**: 1 = aireado editorial (mucho blanco, pocas piezas por viewport) · 5 = denso tipo terminal de datos (tablas compactas, filas de 40-44px).
- **Audacia 1-5**: 1 = neutro utilitario (marca casi invisible) · 5 = la marca domina la superficie (color drenched, tipografía display). El rango lo fija el **registro** de la pantalla: `producto` → 1-3, `marketing` → 3-5 (ver `reference/archetypes.md`). Si el `brand-brief.md` eligió una dirección creativa, la audacia y la Capa 3 salen de ella.
- **Movimiento 1-3**: qué microinteracciones se INSINÚAN visualmente. Stitch genera HTML/CSS estático: describe el estado visible (hover, focus, selected), no la transición. Detalle en `reference/states.md`.

Los dials no son decorativos: fijan decisiones que de otro modo Stitch resuelve con su default genérico, y mantienen coherencia entre pantallas del mismo lote (mismo dial → misma densidad percibida). Se definen una vez por lote y solo cambian con justificación anotada en el ScreenBrief.

## Reglas duras

- **≤ 4500 caracteres** el prompt final. Si no cabe, sigue el patrón *Anchor → Inject → Tune-up → Fix*: `generate_screen_from_text` con la estructura base + `edit_screens` sucesivos (1-2 cambios por llamada), y deja esa partición planificada en el borrador. Stitch omite componentes con prompts gigantes y "olvida" el diseño previo si le pides cinco cambios de golpe.
- **Casos de borde como nodos propios.** Toda pantalla con datos (listas, tablas, dashboards) declara vacío/error/carga como nodos del árbol de estados, cada uno con su propio prompt — no los metas dentro del prompt de la vista con datos.
- **Navegación literal.** Los ítems de navegación del prompt = los de `ux-flow.md`, ítem por ítem. Stitch rellena con ítems SaaS genéricos ("Schedule", "Messages", "Settings") si no lo acotas: enuméralos y cierra con "nada más, sin ítems adicionales".
- **Accesibilidad en el prompt, no después**: no contradigas el resultado de `design_check contrast`; tamaños táctiles ≥44px si es móvil; jerarquía de headings explícita (un solo H1); focus visible en interactivos.
- **Nada de léxico AI-default**: fondos cream/sand/beige "por calidez", cards anidadas, sombras duras, iconos sólidos por defecto. Ver la sección anti-default de `reference/vocabulary.md`.

## Plantilla del borrador (`design/prompts/<slug>.md`)

```markdown
# Prompt: <nombre de la pantalla o estado>

## ScreenBrief
<bloque yaml de arriba, con fuentes, tipo de nodo, dials y correcciones vigentes>

## Persona
<rol senior usado>

## Capa 1 — Contexto
...
## Capa 2 — Estructura
...
## Capa 3 — Estética
...
## Capa 4 — Especificación técnica (valores literales de theme.css)
...
## Capa 5 — Estado a mostrar (solo si es nodo derivado: pantalla base completa de fondo + modal/drawer/estado encima, con su contenido exacto)
...

## Prohibiciones (de Fase 2)
...

## Casos de borde a generar
- [ ] vacío  - [ ] error  - [ ] carga  (marca los que apliquen; cada uno marcado es un nodo `[overlay]` o `[pantalla]` propio del árbol, con su propio prompt)

## Prompt final (texto exacto a enviar)
<el prompt compuesto, listo para copiar-pegar en la herramienta — para nodos derivados incluye la pantalla base completa en la descripción, no solo el modal/estado nuevo>

## Checklist
<los 18 puntos de reference/checklist.md, marcados — se rellena en la Etapa B, antes de enviar>

## Iteraciones
<solo si la pantalla pasó por el loop de calidad: una entrada por iteración con directivas atendidas,
 prompt exacto de cada edit_screens y resultado — formato en reference/refinement.md>
```

## Cierre

Verifica el borrador contra `reference/checklist.md` ítem por ítem y corrige el archivo ANTES de declararlo listo — no lo mandes "a ver qué sale". Marca los ítems en la sección `## Checklist` del propio borrador: es la evidencia de que la Etapa B ocurrió.
