# Prompt: Buscar Paciente

## Tipo de nodo
raíz

## Persona
Actúa como el Lead Product Designer de un sistema de gestión hospitalaria para LATAM. Diseña la pantalla de búsqueda de pacientes.

## Prompt final
Actúa como el Lead Product Designer de un sistema de gestión hospitalaria para LATAM. Diseña la pantalla de búsqueda de pacientes.

Contexto: Recepcionista y doctor buscan pacientes existentes por nombre o ID. HospitalMS, textos español.

Sidebar: logo "HospitalMS", ítems "Cola OPD", "Buscar Paciente" (activo teal claro), "Registrar Paciente" (solo recepcionista). Header: nombre y rol del usuario.

Contenido: Título "Buscar Paciente" Inter semibold 28px #0F172A. Campo de búsqueda prominente (ancho completo, 48px alto, fondo blanco, borde 1px #E2E8F0, radio 4px, ícono búsqueda Material Symbols outline peso 300 a la izquierda, placeholder "Buscar por nombre, ID o teléfono..."). Debajo, lista de resultados: 5-6 pacientes dummy. Cada resultado: avatar iniciales 40px (paleta rotativa) + nombre completo Inter 600 16px + teléfono + email en Inter 400 14px #475569. Resultados con hover #F1F5F9, borde inferior 1px #E2E8F0. Debajo de la lista, empty state sutil: "Ingrese un nombre o ID para buscar" en Inter 400 14px #64748B.

Estética: Minimalista clínico. Campo de búsqueda con sombra sutil al focus (ring teal). Todo Inter. Iconos Material Symbols outline peso 300. Sin iconos sólidos, sin gradientes, sin Bootstrap/Material.