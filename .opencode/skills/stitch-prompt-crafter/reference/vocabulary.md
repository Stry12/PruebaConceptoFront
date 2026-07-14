# Banco de vocabulario para prompts de Stitch

Regla única: sustituye todo adjetivo genérico por una descripción concreta y sensorial. Si una palabra podría describir cualquier app, no describe la tuya. El léxico elegido para la primera pantalla de un lote se REUTILIZA literalmente en el resto del lote — cambiar de léxico a mitad de lote rompe la consistencia visual.

## Sustituciones base (nunca envíes la columna izquierda)

| En vez de... | Usa... |
|---|---|
| "que se vea cool / bonito" | el lenguaje visual REAL de la Fase 2, ej. "retro-futurista con acentos neón, texturas de scanline CRT, tipografía cyberpunk" |
| "azul" | "paleta monocromática índigo con highlights azul eléctrico y negro mate" |
| "un layout normal" | "bento grid con proporciones variables, esquinas redondeadas, escalado sutil en hover" |
| "moderno" | distingue "vintage" (textura, autenticidad, grano de papel) de "retro" (homenaje estilizado a una época, ej. synthwave 80s) — no son sinónimos |
| "limpio / minimalista" | "superficie blanca neutra, una sola familia tipográfica en 3 pesos, un único acento de color por vista, separación por espacio en vez de por líneas" |
| "profesional" | nombra el referente de craft: "nivel Linear/Stripe: densidad controlada, alineación estricta a grid de 8px, cero decoración sin función" |
| "amigable / cercano" | "esquinas 12-16px, ilustraciones spot con paleta saturada, microcopy en segunda persona, botones pill" |
| "elegante" | "serif de alto contraste solo en display, cuerpo sans neutro, mucho aire vertical (secciones de 96-128px), paleta de 2 tintas + 1 acento" |

## Léxicos por estética (elige UNO por proyecto y decláralo en la Capa 3)

- **Clínico-preciso** (salud, laboratorio, back-office crítico): superficie neutra clara, color solo semántico (estados), tablas densas con cebra sutil, badges con fondo al 10-15% y texto del color pleno, cero decoración. Referentes: Epic refinado, Linear. Prohibir: gradientes, ilustraciones decorativas.
- **Editorial / magazine** (contenido, portfolios, longform): jerarquía tipográfica dominante (display grande, hasta clamp máx ~6rem), columnas de lectura de 65-75ch, imágenes a sangre, pies de foto en caption. Prohibir: cards para todo, grids uniformes.
- **Fintech / confianza** (banca, pagos, seguros): un azul/verde profundo como primario dominante, numerales tabulares para cifras, mucha estructura visible (bordes de 1px, no sombras), microcopy sobrio. Prohibir: colores play, esquinas muy redondeadas.
- **Herramienta técnica densa** (dashboards de ingeniería, consolas, admin): densidad 4-5, monospace para identificadores/códigos, filas de 40px, indicadores de estado tipo dot, atajos visibles. Prohibir: hero sections, espaciado editorial.
- **Consumer cálido** (retail, comida, lifestyle): fotografía protagonista, chips y pills, esquinas 12-16px, acento saturado en CTAs, tono cercano. Prohibir: tablas densas, grises fríos.
- **Premium / lujo**: paleta de muy baja saturación o drenched en un tono profundo, serif display, espaciado extremo, materiales (texturas sutiles, no flat puro). Prohibir: badges chillones, densidad alta.
- **Retro-futurista / expresivo** (gaming, eventos, campañas): neón sobre oscuro, glow controlado, tipografía display idiosincrática, composición asimétrica. Prohibir: neutralidad corporativa.

## Topología de layout (Capa 2 — usa estos nombres, no "un layout con cosas")

`sidebar fija de Npx` · `bento grid de proporciones variables` · `split-screen 60/40` · `stack vertical de secciones` · `masonry` · `estanterías de scroll horizontal` · `tabla densa de ancho completo` · `panel maestro-detalle` · `wizard/stepper` · `jerarquía en F` (escaneo de listas) · `jerarquía en Z` (landing). Declara siempre: orden de lectura y qué elemento domina el primer viewport (lo que se ve sin scroll).

Esta lista no es un menú para elegir al azar: la topología se deriva de la **estructura firma** aprobada al inicio de `ux-flow.md` (objeto central del producto + referentes reales del dominio + decisión de layout memorable). Si el objeto central es visual (portadas, fotos, mapas, conversaciones), la respuesta casi nunca es una tabla con stat-cards.

## Estrategia de color (declárala, no la dejes emerger)

- **Restrained**: neutros tintados + un acento ≤10% de la superficie. Default de producto/herramienta.
- **Committed**: un color saturado carga 30-60% de la superficie. Marca con identidad.
- **Full palette**: 3-4 roles de color con uso deliberado (ej. data viz).
- **Drenched**: la superficie ES el color. Heroes y campañas.

## Iconografía (siempre explícita — Stitch por defecto usa iconos sólidos y pesados)

Declara: estilo de trazo (`trazo fino 1.5px` / `sólido` / `duotone`), tamaño base, y la prohibición inversa ("nunca versiones rellenas" o viceversa). Un solo estilo por proyecto.

## Léxico anti-default (prohibiciones que van en cada prompt)

- **El esqueleto "admin SaaS" por defecto** (`sidebar + fila de stat-cards + grid/tabla de contenido`): es el cream/beige de la estructura — la plantilla a la que Stitch regresa para cualquier dominio, y hace que dos productos con identidades visuales distintas se sientan la misma app. Usarlo exige justificación escrita desde el objeto central del producto (la estructura firma de `ux-flow.md`), nunca se hereda en silencio.
- **Stat-cards y widgets no pedidos**: Stitch añade filas de métricas de relleno en pantallas de listado ("24 Total", "3 Pendientes"...). Todo bloque de contenido del prompt debe trazarse a la jerarquía de Fase 3 — si no está en `ux-flow.md`, se elimina del borrador, igual que la navegación fantasma.
- **Cream/sand/beige como fondo "cálido"**: es EL default de IA. La calidez se carga en acento + tipografía + imágenes, no en el fondo. Fondo = blanco/neutro verdadero o un tono claramente de la marca.
- **Cards anidadas**: siempre mal. Cards solo cuando son la mejor affordance, no como contenedor por defecto.
- **Sombras duras / genéricas**: especifica la sombra exacta de `theme.css` (típicamente ≤10% de opacidad).
- **Look Bootstrap/Material sin personalizar**: prohibición estándar en la Capa 4.
- **Texto gris claro "por elegancia"**: el cuerpo respeta el contraste validado por `design_check` (≥4.5:1).
- **Ítems de navegación de relleno** ("Schedule", "Messages", "Settings"): la navegación es la de `ux-flow.md`, enumerada y cerrada con "nada más".
