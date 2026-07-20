# Principios de Gestalt — criterios de detección en un mockup

Cómo se manifiesta (o se viola) cada principio en una captura estática. Alimentan sobre todo las categorías de G1 (composición) y la 20 (carga cognitiva). Para cada uno: qué buscar y la señal de violación citable como evidencia.

## Proximidad
Los elementos cercanos se perciben como grupo. **Buscar:** ¿el espacio DENTRO de un grupo (label↔input, título↔meta, icono↔texto) es menor que el espacio ENTRE grupos? **Violación citable:** un label equidistante de dos inputs; gap entre cards igual al padding interno de la card (el ojo no sabe dónde termina una unidad); secciones sin más separación entre sí que entre sus propios ítems.

## Similitud
Lo que se ve igual se interpreta como lo mismo. **Buscar:** elementos con la misma función comparten forma/color/tamaño; elementos con función distinta se diferencian. **Violación citable:** links y texto plano con el mismo estilo; un botón secundario idéntico al primario; dos badges del mismo tipo con radios o pesos distintos (esto además descuenta en cat. 9).

## Figura-fondo
La relación entre el contenido y su superficie debe ser inequívoca. **Buscar:** las superficies elevadas (cards, modales) se separan del fondo por un mecanismo claro (delta de color de la escala de superficies, borde, o sombra — idealmente no los tres a la vez). **Violación citable:** card del mismo color que el fondo separada solo por una sombra difusa apenas visible (síntoma de AP-2); modal sin scrim ni jerarquía sobre el contenido de atrás.

## Continuidad
El ojo sigue líneas y alineaciones. **Buscar:** los bordes izquierdos del contenido forman una línea continua; las filas de una tabla/lista mantienen las columnas ópticamente alineadas. **Violación citable:** un bloque arrancando 8px fuera del eje que todo lo demás respeta; celdas numéricas alineadas a la izquierda rompiendo la columna visual.

## Cierre
La mente completa formas incompletas — permite sugerir sin dibujar todo. **Buscar:** carruseles/estanterías que cortan el último ítem en el borde (correcto: invita a scrollear); contenedores insinuados por agrupación sin caja. **Violación citable:** el corte accidental — un elemento cercenado por el viewport sin intención de affordance (también es descuento de artesanía, cat. 11).

## Región común
Elementos dentro de un mismo contenedor se perciben relacionados. **Buscar:** las cajas agrupan lo que de verdad va junto. **Violación citable:** una card que mezcla contenidos sin relación (síntoma de stat-card de relleno, AP-1); controles de un formulario repartidos entre contenedores distintos sin razón.

## Destino común / Von Restorff (énfasis)
Lo distinto atrae la mirada — el énfasis es un presupuesto limitado. **Buscar:** UN elemento distinto por pantalla como máximo compitiendo por atención primaria (el CTA, el dato clave). **Violación citable:** tres elementos con color de acento del mismo peso pidiendo atención a la vez (descuenta jerarquía, cat. 1, y aplicación de color, cat. 5).
