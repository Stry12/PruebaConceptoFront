# Filosofía y criterio experto (para juzgar y para especificar)

Marcos de juicio de los mejores diseñadores/escuelas, destilados en preguntas y tests APLICABLES — no citas decorativas. Lo usan `art_director` (antes de puntuar: es la lente; la rúbrica es el instrumento) y `ui_designer` (al componer specs: es lo que separa una spec correcta de una excelente). Nada de aquí introduce valores visuales — introduce CRITERIO.

## 1. Dieter Rams — "menos, pero mejor" (test de honestidad del diseño)

Las 10 se condensan en 6 preguntas de crítica. Un "no" en cualquiera es una debilidad puntuable:

1. **¿Es útil?** Cada elemento sirve a la tarea del usuario o es decoración. La decoración sin función se elimina, no se "mejora".
2. **¿Es comprensible por sí solo?** Si un control necesita explicación (tooltip que compensa un icono ambiguo, label que compensa un layout confuso), el diseño falló antes.
3. **¿Es discreto?** El diseño es herramienta, no protagonista. La marca aparece en los momentos que importan (registro `marketing`), no gritando en cada superficie de producto.
4. **¿Es honesto?** Nada promete lo que no hace: un control con apariencia interactiva que no responde, un estado "cargando" que oculta un error, un CTA que dramatiza una acción trivial.
5. **¿Es consecuente hasta el último detalle?** La calidad se juzga en el peor detalle, no en el mejor: el estado raro, la card 11 de 12, el texto más largo. "Thorough down to the last detail" es literal.
6. **¿Sobra algo?** "Tan poco diseño como sea posible": ante la duda entre añadir y quitar, quitar. La versión excelente de una pantalla suele tener MENOS piezas que la mediocre, mejor resueltas.

## 2. Vignelli Canon — las tres capas de toda decisión

Toda decisión de diseño se evalúa en tres planos; una pantalla excelente responde en los tres:

- **Semántica** — ¿el diseño SIGNIFICA lo correcto? (¿la jerarquía visual cuenta la historia del dominio? ¿lo más importante para el usuario ES lo más prominente?). Una biblioteca cuyo grid no celebra las portadas falla semánticamente aunque esté "bien maquetada".
- **Sintáctica** — ¿la gramática es disciplinada? (grid consistente, mismos espaciados para las mismas relaciones, misma anatomía en instancias repetidas). La disciplina sintáctica es lo que el ojo lee como "intencional" vs "generado".
- **Pragmática** — ¿se entiende y se usa sin fricción? (legibilidad, affordances, accesibilidad). Si semántica y sintáctica no sobreviven al uso real, no valen.

Más dos vares de Vignelli: **apropiado** (la solución correcta para ESTE dominio y público — lo que es excelente en un fintech es ruido en una biblioteca personal) y **atemporal** (desconfía del recurso de moda: si la única justificación de un efecto es "se lleva", es candidato a eliminación).

## 3. Tufte — el test de eliminación

- **Ratio tinta/información**: ¿qué fracción de los píxeles comunica algo? Bordes dobles, fondos que no separan nada, sombras redundantes, iconos que repiten lo que el texto ya dice = "chartjunk" de interfaz.
- **Test aplicable**: por cada elemento decorativo pregunta "¿si lo quito, se pierde información o estructura?" Si no — quítalo y deja que el espacio haga el trabajo.
- La densidad no es enemiga: datos ricos bien organizados (small multiples, tablas con ritmo) son MÁS elegantes que la misma información diluida en cards infladas.

## 4. Refactoring UI — decisiones operativas de jerarquía

- **La jerarquía es EL trabajo**: no todo elemento pelea con tamaño — pesa con color y peso tipográfico antes que con px. Des-enfatizar lo secundario suele funcionar mejor que enfatizar lo primario.
- **Empieza con demasiado blanco** y quita después — nunca al revés. El espacio insuficiente es el defecto #1 del diseño generado.
- **Sistema de tonos, no colores sueltos**: 8-10 tonos de gris, 5-10 tonos por color principal, elegidos por adelantado. Los grises pueden (deben) estar temperados hacia la personalidad del theme — gris puro es ausencia de decisión.
- **Los labels son el último recurso**: antes de "Autor: García Márquez", prueba si formato y posición ya comunican el rol del dato.
- **Profundidad con luz coherente**: una sola fuente de luz; sombra = elevación semántica (qué flota sobre qué), no decoración.

## 5. Craft de interacción (escuela Rauno/Vercel, Emil Kowalski)

- **La robustez es craft**: las interacciones core (scroll, input, navegación) deben funcionar SIEMPRE, bajo estrés real (texto larguísimo, red lenta, teclado, viewport pequeño). Un hover exquisito no compensa un scroll roto.
- **Los detalles invisibles se acumulan**: `tabular-nums`, sin layout-shift al hover (el peso tipográfico no cambia en hover/selected), sin zonas muertas entre ítems de una lista, focos que respetan el radio, selección estilizada. Ninguno se nota solo; juntos son la diferencia entre "app" y "producto".
- **Inmediatez**: interacciones frecuentes <200ms y sin animación superflua; el motion se gasta en los momentos de valor (Peak-End), no en lo rutinario.
- **UI optimista**: el feedback aparece donde ocurrió el gesto, al instante; el servidor confirma después.

## 6. Cómo se forma el criterio (aprender del diseño — mecánica, no inspiración)

1. **Calibra contra el mejor, no contra el promedio.** Antes de puntuar o especificar, nombra 2-3 referentes top del vertical (los de `brand-brief.md`/`sistemas-plataforma.md`) y pregunta: "¿qué haría este referente en esta pantalla que aquí falta?" — un 90 significa "publicable junto a ellos", no "mejor que la iteración anterior".
2. **Nombra lo que ves.** El criterio se ejercita con vocabulario preciso: no "se ve raro" sino "la card 3 rompe el ritmo sintáctico del grid — footer 8px más alto". Lo que no puedes nombrar no puedes corregirlo ni enseñarlo (por eso las directivas exigen los 7 campos).
3. **Estudia el delta.** Tras cada iteración: ¿qué directiva movió más el score y POR QUÉ funcionó? Esa relación causa-efecto es el aprendizaje real — se consolida en `intelligence/` (feedback loop del art_director) y se prioriza en el proyecto siguiente.
4. **Roba estructura, nunca identidad.** De un referente se toma la DECISIÓN (por qué funciona su jerarquía, cómo resuelve el estado vacío), jamás sus valores (paleta, tipografía) — los valores del proyecto salen de su propio theme. Copiar identidad es lo que produce diseño genérico Y contaminación entre proyectos.
5. **El gusto se entrena con el peor caso.** Al revisar, busca activamente: el fixture más largo, el estado más raro, la instancia n-ésima. Los expertos se distinguen en los bordes, no en el happy path.
