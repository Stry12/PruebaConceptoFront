# Prompt: Cola OPD — Doctor

## Tipo de nodo
raíz

## Persona
Actúa como el Lead Product Designer de un sistema de gestión hospitalaria para LATAM. Diseña la pantalla de cola OPD para el doctor.

## Capa 1 — Contexto
El doctor ve la cola de pacientes en espera y puede atenderlos. Sistema HospitalMS, textos en español.

## Capa 2 — Estructura
Sidebar: logo "HospitalMS", ítems "Cola OPD" (activo), "Buscar Paciente". Header: Dr. Alejandro Ruiz, Cardiología.

Contenido: Título "Pacientes en Espera" + badge conteo. Debajo, cards horizontales de pacientes (no tabla — el doctor necesita ver más info por paciente). Cada card: avatar iniciales + nombre + hora + diagnóstico previo (si existe) + badge estado + botón "Atender" (teal) o "En atención" (azul, deshabilitado). 4-5 cards de dummy data.

## Capa 3 — Estética
Cards con fondo blanco, borde 1px #E2E8F0, radio 6px, hover con sombra sutil. Layout vertical con gap 16px. Botón "Atender" prominent teal.

## Capa 4 — Especificación
Cards: bg white, border 1px #E2E8F0, border-radius 6px, padding 20px. Avatar 40px circle. Nombre Inter 600 16px #0F172A. Hora Inter 400 14px #475569. Botón Atender: bg #0F766E, texto white, radio 6px, height 36px.

## Prohibiciones
Sin iconos sólidos, sin gradientes, sin Bootstrap/Material, sin bordes pill.

## Prompt final
Actúa como el Lead Product Designer de un sistema de gestión hospitalaria para LATAM. Diseña la cola OPD para el doctor.

Contexto: El doctor ve pacientes en espera y los atiende. HospitalMS, textos español.

Sidebar: logo "HospitalMS", ítems "Cola OPD" (activo teal claro), "Buscar Paciente". Header: "Dr. Alejandro Ruiz - Cardiología".

Contenido: Título "Pacientes en Espera" Inter semibold 28px + badge "4 pacientes" fondo #CCFBF1 texto #0F766E. Cards de pacientes: fondo blanco, borde 1px #E2E8F0, radio 6px, padding 20px, gap 16px. Cada card: avatar iniciales 40px (paleta rotativa) + nombre Inter 600 16px + hora + badge estado (mismos colores que la vista de recepcionista) + botón "Atender" fondo #0F766E texto blanco radio 6px. Hover card: sombra sutil. 4-5 cards dummy realistas (nombres español, horas variadas, distintos estados).

Estética: Minimalista clínico. Cards limpias, sin sombras pesadas. Todo Inter. Iconos Material Symbols outline peso 300. Sin iconos sólidos, sin gradientes, sin Bootstrap/Material.