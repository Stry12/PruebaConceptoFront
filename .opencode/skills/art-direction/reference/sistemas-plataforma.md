# Sistemas de diseño de referencia — digest evaluable

Lo que un director de diseño usa de cada sistema para JUZGAR, no documentación de los sistemas. Sirven como vara de calibración para G3 (sistema y consistencia) y cat. 12 (modernidad): un mockup no tiene que seguir ninguno, pero sus principios revelan descuidos objetivos. Regla general: si el proyecto declara inspiración en uno de estos (brand-brief/referentes), sus reglas se vuelven exigibles; si no, son heurísticas de calidad.

## Apple Human Interface Guidelines (HIG)
Principios exigibles: **claridad** (el texto legible a todo tamaño, iconos precisos, funcionalidad evidente), **deferencia** (la UI sirve al contenido, no compite con él — clave en arquetipos de biblioteca/contenido), **profundidad** (jerarquía por capas coherente: lo elevado está encima por una razón). Señales de descuido: cromas decorativos sobre contenido, controles que gritan más que el contenido que gobiernan, targets táctiles <44pt en diseño que se declara móvil.

## Material Design 3
Aporta la vara de: **sistema de elevación coherente** (superficies con niveles discretos, no sombras arbitrarias por elemento), **color por roles** (primary/secondary/surface/on-surface — equivale al sistema semántico de `color-system.md`; texto "on-X" siempre derivado del rol X), **estados definidos** (hover/focus/pressed/disabled como capas consistentes). Señal de descuido: sombras de 4 valores distintos sin escala; colores aplicados por elemento y no por rol.

## IBM Carbon
La vara de productos densos de datos (arquetipos registros/analítica): **grid de 2x** (spacing en múltiplos consistentes), **tablas serias** (alineación numérica a la derecha, headers diferenciados, densidades definidas), **jerarquía tipográfica utilitaria** (pocas variantes, muy consistentes). Señal de descuido: una tabla con celdas numéricas centradas, paddings de fila irregulares, o más de 2 pesos tipográficos dentro de la tabla.

## Microsoft Fluent
La vara de: **coherencia entre densidades** (compacto y cómodo comparten estructura), **iluminación/material coherente** (si hay acrílicos/blur, una sola lógica de profundidad), **teclado y foco como ciudadanos de primera** (en mockup: focus rings plausibles, orden de lectura lógico en el HTML).

## Shopify Polaris
La vara de productos transaccionales/comerciales: **el mercader primero** (jerarquía guiada por la tarea que genera valor, no por la estructura de datos), **microcopy accionable** (botones con verbo+objeto: "Guardar producto", no "OK"/"Enviar"), **estados vacíos que activan** (un empty state es una oportunidad de onboarding, no un "No hay datos"). Señal de descuido: CTAs genéricos, empty states pasivos en pantallas de registro `marketing`.

## Nielsen Norman Group — las 10 heurísticas
Ya están documentadas con anclas 0-4 en `impeccable/reference/critique.md` — usar ESA versión, no re-derivarlas. En esta rúbrica alimentan cat. 17-19; las más visibles en mockup estático: visibilidad del estado del sistema (¿dónde estoy?, ¿qué está pasando?), reconocimiento antes que recuerdo (opciones visibles vs. memorizadas), diseño estético y minimalista (cada elemento compite por atención — el que no aporta, resta).

## Refactoring UI (conceptos operativos)
Los trucos de calibre fino que separan 75 de 90 (cat. 8 y 11): jerarquía por peso y color antes que por tamaño; no usar gris puro sobre fondos con temperatura (el gris hereda el matiz del fondo); los labels no compiten con los datos (el dato es la estrella); sombras con intención de elevación, no de decoración; bordes solo donde el espacio no alcanza para separar; empezar con demasiado espacio y quitar, no al revés.
