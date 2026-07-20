# Leyes de UX — cómo se violan en un mockup estático

Un mockup no se puede usar, pero casi todas las leyes de UX dejan huella visual evaluable. Para cada ley: qué es, y la señal citable en una captura/HTML. Alimentan G5 (UX) y la cat. 17-20.

## Ley de Fitts
El tiempo para alcanzar un objetivo depende de su tamaño y distancia. **Señal en mockup:** targets primarios pequeños o arrinconados; acciones frecuentes lejos de donde está la atención (ej. el CTA de una lista al fondo de la página); targets táctiles aparentes <44px en diseño móvil; acciones destructivas PEGADAS a acciones frecuentes (esto es violación aunque el tamaño sea correcto).

## Ley de Hick
Más opciones = más tiempo de decisión. **Señal:** una nav con >7 ítems al mismo nivel sin agrupar; una pantalla que ofrece 4+ acciones primarias equivalentes; un formulario que muestra todos los campos avanzados sin progressive disclosure cuando el árbol de estados definía un overlay para eso.

## Ley de Miller (chunking)
La memoria de trabajo maneja ~7±2 elementos; agrupar reduce la carga. **Señal:** listas largas sin agrupación visual (fechas, categorías, secciones); un dashboard con 10 métricas sueltas del mismo peso; IDs/números largos sin formatear en grupos.

## Ley de Jakob
Los usuarios esperan que tu producto funcione como los que ya conocen. **Señal:** patrones convencionales invertidos sin ganancia (buscador que no está arriba, carrito que no está a la derecha, logo que no vuelve al home aparente); iconografía no estándar para acciones estándar (un icono inventado para "editar"). OJO: no confundir con originalidad legítima de la estructura firma — la violación es convención rota SIN decisión de diseño que lo justifique en `ux-flow.md`.

## Ley de Tesler (conservación de la complejidad)
La complejidad no desaparece: o la absorbe el diseño o la paga el usuario. **Señal:** un flujo complejo (import wizard, checkout) mostrado como una única pantalla densa en vez de pasos; campos pidiendo datos que el sistema podría derivar; jerga del dominio sin traducir cuando el público de `discovery.md` no es experto.

## Efecto Von Restorff
Lo distintivo se recuerda. **Señal positiva esperable:** el CTA primario es visualmente único en la pantalla. **Violación:** varios elementos "únicos" compitiendo (ver énfasis en `gestalt.md`), o el elemento distintivo es decorativo mientras la acción principal se camufla.

## Regla peak-end
La experiencia se juzga por su pico y su final. **Señal en mockup:** los momentos pico del flujo (confirmación de éxito, empty state inicial, finalización de wizard) diseñados con la MENOR atención de la pantalla — un flujo cuyo final es un toast genérico mientras el listado intermedio está sobre-diseñado tiene las prioridades invertidas.

## Efecto estética-usabilidad
Lo bello se percibe más usable — es un multiplicador, no un sustituto. **Uso correcto en la rúbrica:** una pantalla estéticamente fuerte NO compra puntos de G5; al revés: si G4 puntúa alto y G5 bajo, señalarlo explícitamente ("belleza que maquilla fricción") — es exactamente el caso donde este efecto engaña a un revisor complaciente.
