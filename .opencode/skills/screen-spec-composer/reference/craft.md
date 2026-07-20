# Craft visual: contención, consistencia y ritmo (obligatorio en toda spec)

Reglas destiladas de sistemas de diseño de referencia (Apple HIG y skills derivadas: grid de 8pt, proporción de color, anatomía fija de componentes) + defectos reales observados en este pipeline (elementos derramados fuera de su card, controles repetidos en posiciones distintas, espaciados aplastados). El compositor las convierte en `[MUST]` de las secciones 5, 7, 8 y 18; no son opcionales.

## 1. Anatomía de slots para componentes repetidos (anti-derrame)

Todo componente que se repite en grid/lista (card, fila, tile) se especifica como **slots fijos**, no como "contenido apilado":

- Declara las zonas con nombre y orden: ej. `media` (portada, ratio fijo) → `body` (título + metadatos) → `footer` (acciones). El footer SIEMPRE existe aunque esté vacío — es lo que garantiza que la acción `…` caiga en el mismo lugar en todas las instancias.
- **Alturas gobernadas por el slot, no por el contenido**: título con line-clamp y altura reservada (ej. `line-clamp-2` + `min-height` de 2 líneas) para que un título largo no empuje el footer de SU card ni desalinee la fila.
- **Instancias de una fila = misma altura**: el grid estira las cards (`grid` + `h-full`, body con `flex-grow`, footer anclado abajo). Prohibido que cada card mida según su contenido.
- **Contención estricta**: todo hijo posicionado (`absolute`) se ancla a la RAÍZ del componente (`position: relative` en la card) y queda DENTRO de su borde redondeado (`overflow-hidden` cuando es decorativo; si el hijo debe sobresalir — badge de notificación — se declara explícitamente en la spec con su offset). Un elemento que cruza el borde de su contenedor sin declaración es defecto bloqueante.
- **El mismo control, el mismo sitio**: la spec fija la posición del control repetido con offset exacto respecto de su slot (ej. "`…` en footer, alineado al inicio, `var(--space-4)` del borde inferior e izquierdo") — igual en las N instancias, con contenido corto o largo.

## 2. Ritmo de espaciado (grid de 8pt)

- Todo espaciado divisible por 8 (o 4 para ajustes finos) — y SIEMPRE vía tokens `var(--space-*)`, nunca valores sueltos.
- **Mínimos de respiración**: entre bloques hermanos de una barra/encabezado, mínimo `var(--space-4)`; entre una acción primaria y el metadato que la sigue (ej. botón "+ Añadir" y el contador "N elementos"), mínimo `var(--space-3)` vertical — elementos "pegados" son defecto, no detalle.
- Ritmo descendente dentro de un componente: separaciones internas menores que las externas (el gap entre cards > padding interno de card > gap entre título y metadato).

## 3. Color con proporción (contra el "casi blanco y negro")

- **Regla 60/30/10**: ~60% superficie neutra, ~30% superficies/estructura secundaria, ~10% color con intención (accent/primario/semánticos). Si una captura queda <5% de color no-neutro, la pantalla está infra-colorizada: o faltan los portadores de color del dominio (portadas, imágenes, badges semánticos) o la paleta no se está aplicando.
- En dominios con imagen (biblioteca, catálogo, media): **la imagen ES el color principal de la pantalla**. La spec exige fixtures con imágenes reales (sección 17) — un grid de placeholders grises invalida la evaluación visual completa y no puede aprobarse.
- Los estados semánticos (completado/en progreso/pendiente) llevan color semántico del theme, no solo texto gris.
- Modo oscuro: paleta propia del theme (`[data-theme="dark"]`), nunca inversión de colores.

## 4. Tipografía y elevación

- Máximo 4 tamaños y 2 pesos por pantalla (los del theme); si la spec necesita un quinto tamaño, es señal de jerarquía mal resuelta.
- Radios en jerarquía descendente: contenedor > card > botón > input (los del theme); un hijo nunca tiene radio mayor que su contenedor.
- Sombras sutiles y en capas (las del theme, máx. 2 niveles visibles por pantalla); nunca una sola sombra dura como separador único.

## 5. Feedback

- Ninguna interacción sin feedback visible (hover/active/focus del theme); todo cambio de estado tiene transición (duración/easing de `motion-craft`), respetando `prefers-reduced-motion`.

## 6. Jerarquía de texto medible (contra el "todo gris igual")

- Tres niveles con valores, no adjetivos: encabezados a 100% de énfasis (`--text-primary`), cuerpo ~80% (`--text-secondary`), metadatos 60-70% (`--text-tertiary`/`--text-muted`) — la spec asigna nivel a CADA texto de la pantalla. Si dos textos adyacentes tienen el mismo nivel y distinto rol, la jerarquía está mal resuelta.
- **El valor pesa más que su etiqueta**: en pares label/valor ("Elementos: 8"), el VALOR lleva el énfasis — nunca al revés.
- Números que se comparan o actualizan (contadores, stats, precios): variante tabular/monospace (`font-variant-numeric: tabular-nums`) para que no bailen.
- Contenedores de texto corrido ≤600px de ancho.

## 7. Regla del multiplicador en espaciado (proximidad operacionalizada)

- Elementos RELACIONADOS se separan X; el grupo siguiente se separa ≥2X (ej. título↔metadato `var(--space-2)` ⇒ card↔card `var(--space-4)` o más). Es la versión medible de "agrupar lo que va junto": si el gap intra-grupo ≈ gap inter-grupo, el ojo no ve grupos — es exactamente el defecto "está muy pegado / todo flota igual".

## 8. Sombra y microcopy

- Sombra tintada al fondo (nunca gris puro/negro sobre fondo con color); interior sutil en botones para dimensión — siempre los tokens de sombra del theme.
- Microcopy especificado, no improvisado: los empty states llevan guía + CTA con texto REAL en la spec ("Tu biblioteca está vacía — Añade tu primer libro"), nunca "No hay datos". Etiquetas de acción con verbo concreto ("Añadir libro", no "Nuevo"). El copy de la spec es contrato igual que los tokens.
- **Momento pico del flujo** (Peak-End): la spec identifica el momento de mayor valor del flujo de la pantalla (ej. completar un ítem, terminar de añadir) y especifica su feedback (sección 15) — es donde el motion tiene retorno real, no en decorar el scroll.

## Criterios de aceptación derivados (van a la sección 18 de la spec)

- [ ] Contención: el bounding box de cada hijo visible queda dentro del bounding box de su card (test Playwright por instancia; excepciones solo las declaradas).
- [ ] Consistencia: el control repetido (`…`, favorito) tiene el mismo offset relativo a su card en TODAS las instancias (tolerancia ±2px), con títulos de 1 y de 2+ líneas.
- [ ] Alturas: todas las cards de una misma fila del grid miden lo mismo (tolerancia ±1px).
- [ ] Ritmo: ningún par de bloques hermanos con separación < `var(--space-3)`.
- [ ] Color: los portadores de color del dominio (imágenes/badges) presentes en los fixtures — cero placeholders grises.
- [ ] Jerarquía de texto: cada texto tiene nivel asignado (primary/secondary/muted); ningún par label/valor con el énfasis invertido; contadores con números tabulares.
- [ ] Multiplicador: gap inter-grupo ≥ 2× gap intra-grupo en las agrupaciones declaradas.
- [ ] Empty state con copy real (guía + CTA) — verificable en captura del estado vacío.
