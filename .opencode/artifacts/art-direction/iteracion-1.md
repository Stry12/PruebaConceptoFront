# Art Direction — Iteración 1 — Biblioteca

Fecha: 2026-07-19 · Viewport: 1280x800 & 390x844 · Umbral: 90 · Iteración 1/3
Capturas: shots/iter-1-1280x800.png, shots/iter-1-390x844.png · HTML: .opencode/artifacts/design/specs/biblioteca.md (modo frontend-directo)

## Veredicto: ITERAR
El score global de la iteración 1 es **60**, quedando por debajo del umbral de **90** requerido. Se requiere una segunda iteración para corregir desalineaciones críticas de layout, omisiones de la ScreenSpec y control de fallbacks.

## Scores

| Grupo | Categoría | Score | Evidencia |
|---|---|---|---|
| G1 — Composición | 1. Jerarquía visual | 45 | Buscador redundante en desktop (topbar y header). Chips en móvil apilados en 6 filas sepultando el contenido. |
| G1 — Composición | 2. Grid y alineación | 55 | Chips envueltos de forma asimétrica e inconsistente en desktop y móvil. |
| G1 — Composición | 3. Balance y escala | 60 | La masa visual de la filter bar en móvil ocupa casi el 40% del viewport vertical inicial, desequilibrando la pantalla. |
| G1 — Composición | 4. Espacio en blanco y ritmo | 50 | Falta de ritmo y aire consistente en la cabecera debido al apilamiento de controles. |
| G2 — Color y tipografía | 5. Aplicación del color | 70 | Se usan los tokens correctos del theme, pero la imagen rota de "Breaking Bad" expone el fondo blanco plano y el icono nativo del navegador. |
| G2 — Color y tipografía | 6. Contraste | 80 | Los textos y chips del theme cumplen con las especificaciones de contraste WCAG AA. |
| G2 — Color y tipografía | 7. Tipografía | 85 | Uso correcto de 'Libre Baskerville' (serif) para títulos y 'Inter' (sans-serif) para el resto del contenido. |
| G2 — Color y tipografía | 8. Ritmo vertical y microtipografía | 80 | Alturas de línea y truncado de textos correctos en la tarjeta de medio. |
| G3 — Sistema y consistencia | 9. Consistencia de componentes | 75 | Las tarjetas de medios son homogéneas, pero los inputs de búsqueda difieren estéticamente. |
| G3 — Sistema y consistencia | 10. Consistencia global | 65 | Inconsistencia de navegación: el buscador del App Shell compite con el buscador de la página. Bottom tab bar en móvil incompleto. |
| G3 — Sistema y consistencia | 11. Artesanía (craftsmanship) | 40 | Ausencia absoluta del footer de la tarjeta de medios con sus botones de acción (Estrella favorito y menú `…`), que son un [MUST] explícito. |
| G3 — Sistema y consistencia | 12. Modernidad | 65 | El wrapping desordenado de chips y la cabecera abigarrada le restan pulidez visual al producto. |
| G4 — Marca y emoción | 13. Personalidad de marca | 60 | La idea de "catálogo personal íntimo" se ve comprometida por el aspecto de buscador utilitario tosco y la visualización de imágenes rotas. |
| G4 — Marca y emoción | 14. Sensación premium | 50 | Los fallos de contención y omisión de componentes se sienten más cercanos a un borrador descuidado que a un producto premium Nivel 3. |
| G4 — Marca y emoción | 15. Originalidad | 55 | El layout cae en un esqueleto saturado de controles genéricos en lugar de dar un protagonismo limpio a las portadas. |
| G4 — Marca y emoción | 16. Impacto emocional | 55 | No se logra la sensación de "esto es mío y está bien cuidado" debido a los bugs visuales aparentes. |
| G5 — UX | 17. Usabilidad | 45 | Imposible marcar favoritos o desplegar el menú contextual desde la tarjeta; el usuario no tiene acceso a las acciones secundarias clave. |
| G5 — UX | 18. Claridad de interacción | 50 | El rating de 5 estrellas al final de la tarjeta es ambiguo y sustituye al botón único de favorito del footer. |
| G5 — UX | 19. Navegación | 60 | En móvil, la barra de pestañas inferior no muestra el tercer tab ("Listas"). |
| G5 — UX | 20. Carga cognitiva | 50 | El usuario se enfrenta a múltiples inputs de búsqueda y a un bloque masivo de chips desordenados. |
| G6 — Confianza y accesibilidad | 21. Accesibilidad | 65 | Zonas táctiles de chips amontonadas en móvil dificultan la interacción física. |
| G6 — Confianza y accesibilidad | 22. Confianza y credibilidad | 60 | La presencia de una portada rota en la carga inicial de los fixtures da una sensación de inestabilidad y falta de robustez. |
| G6 — Confianza y accesibilidad | 23. Calidad del contenido de muestra | 70 | Los metadatos de los items coinciden con el dominio, pero se ve afectado por la falta de carga de la portada de "Breaking Bad". |
| G6 — Confianza y accesibilidad | 24. Estados y casos de borde visibles | 40 | El caso de borde de ítem sin portada o portada fallida se renderiza roto en lugar de usar el placeholder de la especificación. |

### Resumen de Grupos

| Grupo | Score |
|---|---|
| G1 — Composición (20%) | 52.50 |
| G2 — Color y tipografía (20%) | 78.75 |
| G3 — Sistema y consistencia (15%) | 61.25 |
| G4 — Marca y emoción (15%) | 55.00 |
| G5 — UX (15%) | 51.25 |
| G6 — Confianza y accesibilidad (15%) | 58.75 |
| **Global (ponderado)** | **60** |

*(Se aplica el redondeo al entero más cercano. La regla del suelo no es restrictiva aquí ya que el promedio ponderado directo es 60.19).*

---

## Fortalezas

1. **Fidelidad Tipográfica**: Implementación impecable del contraste tipográfico entre el título en Serif de la página y el cuerpo de texto en Sans.
2. **Aplicación cromática base**: Fiel cumplimiento de la gama cálida de neutros y acentos definidos en `color-system.md`.

---

## Debilidades

1. **Falta de Footer en MediaCard**: Las tarjetas omiten por completo el slot del footer, ocultando los botones de estrella favorito y menú contextual `…` (afecta a Usabilidad y Artesanía - Severidad Crítica).
2. **Visualización de Portada Rota**: "Breaking Bad" muestra un recuadro vacío y el icono nativo de broken link en vez del placeholder de respaldo (afecta a Casos de Borde y Confianza - Severidad Alta).
3. **Filtros mal estructurados en Móvil**: La barra de filtros no realiza scroll horizontal y se rompe en 6 filas consecutivas (afecta a Jerarquía visual y Carga cognitiva - Severidad Alta).
4. **Redundancia del buscador**: Dos barras de búsqueda idénticas visibles simultáneamente en el viewport desktop (afecta a Carga cognitiva - Severidad Media).
5. **Falta del botón "+" en móvil**: No hay forma de agregar nuevos contenidos desde el breakpoint móvil (afecta a Usabilidad - Severidad Alta).

---

## Mejoras concretas (priorizadas)

| Prioridad | Mejora | Categorías que sube | Impacto esperado (puntos) |
|---|---|---|---|
| Alta | Implementar el footer con botón favorito y menú contextual en MediaCard | Usabilidad, Artesanía, Jerarquía visual | +15 |
| Alta | Resolver la barra de filtros móvil con scroll horizontal sin wrap | Jerarquía visual, Carga cognitiva, Alineación | +10 |
| Alta | Implementar fallback visual para imágenes de portada rotas | Casos de borde, Confianza | +5 |
| Media | Eliminar la barra de búsqueda redundante en el header (conservando solo la del App Shell en desktop) o integrarlas | Carga cognitiva, Consistencia global | +5 |
| Media | Colocar botón "+" en cabecera móvil y arreglar bottom tab bar para mostrar "Listas" | Usabilidad, Navegación | +5 |

---

## Directivas

### D1.1 Componente exacto: MediaCard (Footer y Acciones)
* **Problema observado:** Las tarjetas carecen de pie de página (footer) y de botones interactivos para marcar favoritos o abrir el menú de acciones contextuales. Solo se muestra la valoración por estrellas.
* **Impacto en el usuario:** El usuario no puede añadir a favoritos ni realizar gestiones sobre los ítems (editar, borrar, coleccionar) desde la vista principal de la biblioteca.
* **Principio violado:** Usabilidad (G5.17), Artesanía (G3.11).
* **Severidad:** Crítica.
* **Cambio recomendado:** Añadir un contenedor footer a la tarjeta con un borde superior sutil (`var(--border-width) solid var(--color-border)`). Posicionar dentro un botón de estrella de Lucide a la izquierda (`aria-label` dinámico, `aria-pressed` según `isFavorite`) y un botón con icono `MoreHorizontal` de Lucide a la derecha. Mantener z-index superior para evitar que el pseudo-elemento `::after` del enlace de la tarjeta bloquee sus clics.
* **Criterio de aceptación:** Las tarjetas muestran los dos iconos en el pie de página, con la separación horizontal correcta (`justify-content: space-between`), y hacer clic en ellos no dispara la navegación de la tarjeta.

### D1.2 Componente exacto: MediaCard (Image Fallback / Portada Rota)
* **Problema observado:** El ítem "Breaking Bad" muestra una imagen rota con el estilo del navegador por defecto.
* **Impacto en el usuario:** Sensación de descuido técnico, mala experiencia visual y ruptura de la estética del catálogo.
* **Principio violado:** Casos de borde (G6.24), Confianza y credibilidad (G6.22).
* **Severidad:** Alta.
* **Cambio recomendado:** Programar un fallback en el componente de imagen de portada de modo que ante un evento `onError` o un valor de URL inválido/nulo, se renderice un contenedor `div` con fondo `var(--color-neutral-200)`, bordes `var(--radius-lg)` y el icono del tipo de contenido (`Tv` de Lucide para series, `BookOpen` para libros, etc.) centrado con tamaño de 32px en color `var(--color-neutral-400)`.
* **Criterio de aceptación:** Ninguna tarjeta muestra el icono nativo de imagen rota del navegador; el ítem sin portada ("Breaking Bad") muestra el placeholder limpio del sistema.

### D1.3 Componente exacto: FilterChips (Filtros en Móvil)
* **Problema observado:** En el viewport de 390x844, los chips de tipo de contenido y estado de consumo se apilan verticalmente ocupando 6 filas y tapando el grid.
* **Impacto en el usuario:** Se reduce drásticamente el espacio útil de pantalla y arruina la composición visual inicial.
* **Principio violado:** Jerarquía visual (G1.1), Carga cognitiva (G5.20).
* **Severidad:** Alta.
* **Cambio recomendado:** Configurar el contenedor de chips para el breakpoint móvil con un layout `flex-direction: row`, `flex-wrap: nowrap` y `overflow-x: auto` con `scroll-snap-type: x proximity`. Ocultar scrollbar si es necesario pero permitir el deslizamiento horizontal fluido.
* **Criterio de aceptación:** En móvil, los chips se muestran en una sola fila deslizable horizontalmente por cada grupo de filtros.

### D1.4 Componente exacto: Page Header / App Shell (Redundancia de Búsqueda)
* **Problema observado:** Se presentan dos campos de entrada de búsqueda simultáneamente en la pantalla desktop (uno en el App Shell superior y otro en el cuerpo de la página).
* **Impacto en el usuario:** Confusión sobre cuál barra usar y sobrecarga visual en la cabecera.
* **Principio violado:** Consistencia global (G3.10), Carga cognitiva (G5.20).
* **Severidad:** Media.
* **Cambio recomendado:** Mantener únicamente el buscador del header de la página en la vista de biblioteca, u ocultar la del App Shell cuando esta ruta esté activa.
* **Criterio de aceptación:** Existe un único input de búsqueda visible y operativo en el primer impacto visual de la pantalla.

### D1.5 Componente exacto: Page Header / Bottom Navigation (Controles Móviles)
* **Problema observado:** El botón "+" para agregar ítems no aparece en móvil. La barra de navegación inferior en móvil está recortada o incompleta, mostrando solo "Biblioteca" y "Colecciones".
* **Impacto en el usuario:** El usuario móvil no puede registrar nuevos elementos multimedia ni navegar a la sección de Listas.
* **Principio violado:** Usabilidad (G5.17), Navegación (G5.19).
* **Severidad:** Alta.
* **Cambio recomendado:** 
  1. En móvil, renderizar el botón "+" en la cabecera a la derecha del título "Biblioteca" con un tamaño táctil mínimo de 44x44px.
  2. Ajustar la distribución de flex/ancho del bottom tab bar para albergar correctamente las 3 pestañas principales ("Biblioteca", "Colecciones", "Listas") con un espaciado equidistante.
* **Criterio de aceptación:** El botón "+" es visible e interactivo en la cabecera móvil. El tab bar inferior muestra los tres iconos y textos de navegación correctos en 390x844.
