# Rúbrica de puntuación — 24 categorías en 6 grupos

Instrumento de medición del `art_director`. Escala 0-100 por categoría, con anclas fijas para que dos evaluaciones del mismo mockup den el mismo resultado (±3). Se puntúa contra la captura (`shots/iter-<n>.png`, viewport del config) Y el HTML descargado — la captura para composición/jerarquía, el HTML para valores exactos (hex, px, familias).

## Anclas universales (aplican a toda categoría)

| Score | Significa |
|---|---|
| **50** | Funcional pero genérico: es lo que Stitch produce sin dirección. Nada está roto, nada está decidido. |
| **75** | Competente: las decisiones son correctas y trazables a los artefactos, pero ejecutadas sin refinamiento — un diseñador junior cumplidor. |
| **90** | Excelente: intencional, refinado, con al menos una decisión memorable bien ejecutada. Publicable como producto real. El umbral por defecto vive aquí. |
| **98** | Excepcional: nivel de referente del vertical; nada que un director de diseño exigente cambiaría. Reservado — un 98 requiere justificación explícita. |

Valores intermedios se interpolan. Por debajo de 50: algo está objetivamente roto (solapamientos, texto ilegible, elementos cortados) — citarlo.

## Los 6 grupos (4 categorías cada uno)

Cada categoría lista qué mirar y sus descuentos típicos. Los techos de `intelligence/anti-patrones.md` se aplican ENCIMA de estas anclas.

### G1 — Composición (peso 20%)
1. **Jerarquía visual** — ¿el primer vistazo cae donde `ux-flow.md` dice que debe caer? Orden de lectura vs. jerarquía de información aprobada. Descuentos: elementos secundarios compitiendo con el primario (−10/−20), todo al mismo peso (≤60).
2. **Grid y alineación** — retícula consistente, bordes alineados, gutters regulares. Medir en la captura: elementos fuera de retícula sin intención (−5 c/u, ≤70 si es sistémico).
3. **Balance y escala** — distribución de masa visual, proporción entre bloques, escala de elementos coherente con su importancia. Densidad coherente con el dial declarado en el prompt.
4. **Espacio en blanco y ritmo** — el blanco como material de diseño: respiración entre secciones, ritmo vertical regular, agrupación por espacio (Gestalt: proximidad). Descuentos: relleno claustrofóbico o vacío sin intención (≤65), espaciados arbitrarios no múltiplos de la unidad base de `theme.css` (−10).

### G2 — Color y tipografía (peso 20%)
5. **Aplicación del color** — uso del sistema de `theme.css`: el primario reservado a acción/identidad, semánticos donde corresponde, paleta rotativa si el lenguaje visual la define. Descuentos: colores fuera del theme (−15 c/u), primario diluido en decoración (≤70).
6. **Contraste** — legibilidad de texto sobre cada superficie (cotejar pares contra el resultado de `design_check contrast` documentado en `design-tokens.md`). Texto esencial bajo AA aparente: ≤55 y directiva obligatoria.
7. **Tipografía** — familias correctas (las de Fase 2), escala respetada, pesos con propósito, jerarquía tipográfica clara sin depender solo del tamaño. Familia incorrecta o escala inventada: ≤60.
8. **Ritmo vertical y microtipografía** — line-height, longitud de línea (45-75 caracteres en bloques de texto), tracking en mayúsculas/labels, alineaciones de baseline aparentes. Es donde se distingue el 75 del 90.

### G3 — Sistema y consistencia (peso 15%)
9. **Consistencia de componentes** — botones/cards/inputs/badges idénticos entre sí en la pantalla: mismos radios, sombras, paddings, estados. Dos botones primarios distintos sin razón: −15.
10. **Consistencia global** — coherencia con pantallas ya aprobadas del proyecto (si las hay) y con el design system de Stitch: misma nav, mismos patrones para el mismo problema.
11. **Artesanía (craftsmanship)** — el detalle fino: bordes de 1px nítidos, sombras coherentes con una sola fuente de luz, iconografía de un solo estilo y peso, radios anidados correctos (radio interior < exterior), sin artefactos de generación (texto cortado, imágenes placeholder obvias).
12. **Modernidad** — el diseño pertenece a la práctica actual del vertical, sin perseguir moda vacía. Look de plantilla Bootstrap/Material sin personalizar: ≤60 (es prohibición típica de Fase 2).

### G4 — Marca y emoción (peso 15%)
13. **Personalidad de marca** — ¿se percibe el `brand-brief.md`? Las keywords visuales y la dirección elegida deben ser observables en decisiones concretas, no en promedio genérico.
14. **Sensación premium** — coherente con el nivel premium declarado (1-5) en el brief: materiales visuales cuidados, nada que parezca barato o por defecto. Nota: premium ≠ lujo; un producto utilitario nivel 2 bien ejecutado puntúa alto aquí.
15. **Originalidad** — ¿esta pantalla podría ser de cualquier producto? Entonces ≤60. La decisión de layout memorable de la estructura firma debe ser visible. Techo AP-1 si aparece el esqueleto default.
16. **Impacto emocional** — la respuesta que el brief pide (confianza, calma, energía...) es la que el mockup produce a primera vista. Se evalúa contra la dirección emocional del brief, no contra el gusto del evaluador.

### G5 — UX (peso 15%)
17. **Usabilidad** — la tarea principal de la pantalla (según `ux-flow.md`) se puede ejecutar sin averiguar cómo; controles reconocibles; leyes de UX aplicables (ver `leyes-ux.md`).
18. **Claridad de interacción** — todo lo clickeable parece clickeable y viceversa; el CTA primario es inequívoco; estados de componentes insinuados donde el prompt los pidió (`states.md`).
19. **Navegación** — la nav refleja el inventario real de Fase 3 (sin ítems genéricos inventados por Stitch), la ubicación actual es evidente, la profundidad es alcanzable.
20. **Carga cognitiva** — cantidad de decisiones simultáneas que la pantalla exige (Hick); agrupación que reduce elementos a chunks (Miller); progresive disclosure donde el árbol de estados lo define. Usar la evaluación de carga cognitiva de `impeccable/reference/critique.md`.

### G6 — Confianza y accesibilidad (peso 15%)
21. **Accesibilidad** — más allá del contraste (cat. 6): tamaños de target aparentes (≥44px táctil si aplica), jerarquía semántica plausible en el HTML (headings, landmarks), texto no transmitido solo por color, focus visible plausible.
22. **Confianza y credibilidad** — el diseño inspira confianza para el vertical (crítico en fintech/salud): datos presentados con precisión visual, sin exageraciones decorativas, microcopy plausible.
23. **Calidad del contenido de muestra** — datos dummy realistas y del dominio (nombres, cifras, títulos plausibles según `domain.md`), no "Lorem ipsum" ni "John Doe" (−15), cantidades que ejercitan el layout (textos largos, listas con suficientes ítems).
24. **Estados y casos de borde visibles** — si el prompt pidió vacío/error/carga u overlays, están y son coherentes con el layout base; si esta pantalla es un nodo derivado, la base se mantuvo intacta.

## Agregación

- Score de grupo = media simple de sus 4 categorías.
- **Score global = media ponderada de grupos**: G1 20% + G2 20% + G3 15% + G4 15% + G5 15% + G6 15%.
- Redondear al entero. Reportar los tres niveles: categoría, grupo, global.
- **Regla del suelo**: si cualquier categoría está <60, el global reportado no puede superar 85 aunque la media dé más — una debilidad seria no se promedia hacia la invisibilidad. Anotar cuándo se aplicó.

## Bandas de veredicto

| Condición | Veredicto |
|---|---|
| Global ≥ umbral (`design-quality.config.json`, default 90) Y sin categoría <60 | **APROBADA** — habilita el gate del usuario (no lo sustituye) |
| Global < umbral y quedan iteraciones | **ITERAR** — con `## Directivas` priorizadas |
| Ver criterios de techo en `protocolo-iteracion.md` | **TECHO** — escalar al usuario |
