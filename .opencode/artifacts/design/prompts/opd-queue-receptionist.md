# Prompt: Cola OPD — Recepcionista

## Tipo de nodo
raíz

## Persona
Actúa como el Lead Product Designer de un sistema de gestión hospitalaria para LATAM. Diseña la pantalla de cola OPD para el recepcionista.

## Capa 1 — Contexto
Pantalla de gestión de la cola de atención ambulatoria (OPD) para el recepcionista. El recepcionista registra pacientes en la cola y los elimina si es necesario. Sistema HospitalMS, todos los textos en español.

## Capa 2 — Estructura
Layout con sidebar fija (240px) y contenido principal. Sidebar: logo "HospitalMS" arriba, ítems de navegación "Cola OPD" (activo, fondo teal light), "Buscar Paciente", "Registrar Paciente". Header derecha: nombre "María López" y rol "Recepcionista".

Contenido principal (fondo #F8FAFC):
- Barra superior: título "Cola de Atención" (Inter 600, 28px, #0F172A) + badge con conteo "5 pacientes" (fondo #CCFBF1, texto #0F766E, radio 4px) + botón "Agregar a cola" a la derecha (fondo #0F766E, texto blanco, radio 6px, ícono plus outline)
- Tabla completa: columnas — Paciente (avatar con iniciales + nombre), Hora de llegada, Estado (badge: "En espera" amarillo #FEF3C7/#92400E, "En atención" azul #DBEAFE/#1D4ED8, "Atendido" verde #DCFCE7/#16A34A), Acciones (ícono editar outline, ícono eliminar outline)
- 6 filas de datos dummy realistas (nombres español, horas variadas)
- Filas con hover sutil (background #F1F5F9)
- Bordes de tabla: 1px #E2E8F0

## Capa 3 — Estética
- Minimalista clínico, tabla limpia con líneas sutiles
- Badges de estado con colores suaves (fondo claro + texto oscuro, no fondos saturados)
- Avatar con iniciales usando paleta rotativa (colores 1-6 del design system)
- Sidebar con fondo blanco, borde derecho 1px #E2E8F0
- Botón primario teal, iconos outline Material Symbols peso 300

## Capa 4 — Especificación técnica
- Sidebar: width 240px, background #FFFFFF, border-right 1px #E2E8F0
- Header contenido: height auto, padding 32px, background #F8FAFC
- Tabla: width 100%, border-collapse, font Inter 400 14px
- Encabezados tabla: Inter 500 12px, color #475569, text-transform uppercase, letter-spacing 0.05em
- Filas: height 56px, border-bottom 1px #E2E8F0, hover bg #F1F5F9
- Avatar iniciales: 36px circle, font Inter 600 14px, fondo según rotación
- Badges estado: padding 4px 10px, border-radius 4px, Inter 500 12px
- Botón agregar: height 40px, padding 0 16px, bg #0F766E, color white, border-radius 6px, Inter 600 14px

## Prohibiciones
- Sin iconos sólidos, sin gradientes, sin look Bootstrap/Material, sin bordes pill, sin placeholders como labels

## Prompt final
Actúa como el Lead Product Designer de un sistema de gestión hospitalaria para LATAM. Diseña la pantalla de cola OPD para el recepcionista.

Contexto: El recepcionista gestiona la cola de atención ambulatoria — agrega pacientes y los elimina si es necesario. Sistema HospitalMS, textos en español.

Layout: Sidebar fija 240px con logo "HospitalMS", ítems "Cola OPD" (activo con fondo teal claro), "Buscar Paciente", "Registrar Paciente". Header con nombre "María López" y rol "Recepcionista". Contenido principal fondo #F8FAFC.

Barra superior: título "Cola de Atención" Inter semibold 28px #0F172A + badge "5 pacientes" fondo #CCFBF1 texto #0F766E radio 4px + botón "Agregar a cola" derecha, fondo #0F766E, texto blanco, radio 6px, ícono plus outline Material Symbols.

Tabla: columnas Paciente (avatar iniciales circulares 36px con paleta rotativa + nombre), Hora de llegada, Estado (badges: "En espera" fondo #FEF3C7 texto #92400E, "En atención" fondo #DBEAFE texto #1D4ED8, "Atendido" fondo #DCFCE7 texto #16A34A), Acciones (ícono editar outline, eliminar outline). 6 filas dummy realistas (nombres español). Filas hover #F1F5F9. Bordes 1px #E2E8F0. Encabezados Inter medium 12px #475569 uppercase.

Estética: Minimalista clínico. Badges con colores suaves (fondo claro + texto oscuro). Sidebar fondo blanco, borde derecho 1px #E2E8F0. Todo Inter, iconos Material Symbols outline peso 300.

Prohibiciones: Sin iconos sólidos, sin gradientes, sin Bootstrap/Material genérico, sin bordes pill, sin placeholders como labels.