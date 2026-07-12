# Prompt: Login

## Tipo de nodo
raíz

## Persona
Actúa como el Lead Product Designer de un sistema de gestión hospitalaria para LATAM. Diseña una pantalla de login profesional y limpia, inspirada en paneles administrativos de salud modernos como Epic MyChart o Cerner.

## Capa 1 — Contexto
Pantalla de autenticación para un sistema de gestión hospitalaria (HospitalMS). Los usuarios son recepcionistas, doctores y administradores que acceden desde estaciones de trabajo fijas (escritorio). El sistema digitaliza procesos manuales en papel. Todos los textos en español.

## Capa 2 — Estructura
Layout de pantalla completa dividido en dos mitades:
- **Mitad izquierda (50%):** Panel de color sólido teal médico (#0F766E) con el nombre del sistema "HospitalMS" en grande, un ícono médico sutil (estetoscopio o cruz), y una frase descriptiva como "Sistema de Gestión Hospitalaria" en texto blanco.
- **Mitad derecha (50%):** Fondo blanco (#FFFFFF) con el formulario de login centrado verticalmente. El formulario contiene:
  - Título "Iniciar Sesión" en Inter 600, 22px, color neutral-900 (#0F172A)
  - Campo "Correo electrónico" — input con label visible arriba (Inter 500, 14px, neutral-600), placeholder "usuario@hospital.com", bordes neutral-200 (#E2E8F0), radio 4px
  - Campo "Contraseña" — input tipo password con label visible, ícono de ojo para mostrar/ocultar
  - Botón "Iniciar Sesión" — ancho completo, fondo teal (#0F766E), texto blanco, radio 6px, Inter 600 14px
  - Mensaje de error inline (oculto por defecto): "Correo o contraseña incorrectos" en rojo (#DC2626) bajo el botón

## Capa 3 — Estética
- Estilo minimalista clínico — nada de gradientes, nada de sombras pesadas
- El panel izquierdo es color teal sólido (#0F766E), sin textura ni gradiente
- Inputs con bordes sutiles (1px solid #E2E8F0), focus ring en teal (#0F766E) con opacidad
- El formulario tiene un card sutil con sombra-xs (0 1px 2px rgba(15,23,42,0.04))
- Tipografía Inter en toda la pantalla
- Iconos de Material Symbols en peso 300 (outline/stroke)
- Espaciado generoso entre campos (gap de 20px)

## Capa 4 — Especificación técnica
- Background del panel izquierdo: #0F766E
- Background del panel derecho: #FFFFFF
- Fuente: Inter, todos los pesos (400, 500, 600)
- Títulos: Inter 600, 22px, line-height 1.3
- Labels: Inter 500, 14px, color #475569
- Inputs: height 40px, border 1px solid #E2E8F0, border-radius 4px, font Inter 400 14px
- Botón primario: background #0F766E, color white, border-radius 6px, height 44px, Inter 600 14px
- Error text: #DC2626, Inter 400, 12px
- Sombras: solo card del formulario con shadow-xs
- No usar iconos sólidos, no gradientes, no bordes redondeados excesivos

## Prohibiciones (de Fase 2)
- Nunca iconos sólidos/rellenos
- Sin gradientes genéricos
- Sin el look por defecto de Bootstrap/Material
- Sin bordes completamente redondeados en botones
- Sin colores neón ni saturados
- Sin placeholders como labels
- Sin animaciones largas

## Casos de borde a generar
- [ ] Credenciales incorrectas (mensaje de error visible)
- [ ] Formulario vacío (campos sin validar)

## Prompt final
Actúa como el Lead Product Designer de un sistema de gestión hospitalaria para LATAM. Diseña una pantalla de login profesional y limpia.

Contexto: Pantalla de autenticación para HospitalMS — sistema de gestión hospitalaria que digitaliza procesos en papel. Los usuarios son recepcionistas, doctores y administradores en estaciones de escritorio. Todos los textos en español.

Layout: Pantalla completa dividida en dos mitades. Mitad izquierda (50%): panel de color sólido teal #0F766E con el nombre "HospitalMS" grande en blanco, un ícono médico sutil de trazo fino, y la frase "Sistema de Gestión Hospitalaria" debajo. Mitad derecha (50%): fondo blanco con formulario de login centrado verticalmente.

Formulario: Título "Iniciar Sesión" en Inter semibold 22px color #0F172A. Campo "Correo electrónico" con label visible arriba (Inter medium 14px, color #475569), placeholder "usuario@hospital.com", bordes #E2E8F0, radio 4px. Campo "Contraseña" con label visible, ícono de ojo para mostrar/ocultar. Botón "Iniciar Sesión" ancho completo, fondo #0F766E, texto blanco, radio 6px, Inter semibold 14px, altura 44px. Mensaje de error inline "Correo o contraseña incorrectos" en #DC2626, 12px.

Estética: Minimalista clínico. Sin gradientes, sin sombras pesadas. Panel izquierdo teal sólido sin textura. Inputs con bordes sutiles 1px #E2E8F0, focus ring en teal. Card del formulario con sombra sutil (0 1px 2px rgba(15,23,42,0.04)). Tipografía Inter en toda la pantalla. Iconos Material Symbols peso 300 outline/stroke. Espaciado generoso entre campos (gap 20px).

Prohibiciones: Sin iconos sólidos, sin gradientes, sin look Bootstrap/Material genérico, sin bordes pill en botones, sin colores neón, sin placeholders como labels, sin animaciones largas.
