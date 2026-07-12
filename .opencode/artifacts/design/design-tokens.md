# Design Tokens — Hospital Management System

## Paleta de colores

### Primario: Teal médico (#0F766E)
**Justificación:** El teal combina la confianza del azul con la limpieza/asociación médica del verde. Es el color que la mente asocia instintivamente con entornos clínicos modernos (hospitales, apps de salud, seguros médicos). Transmit seriedad sin ser frío.

### Secundario: Azul interactivo (#2563EB)
**Justificación:** Para enlaces, acciones secundarias y elementos interactivos. Contrasta con el teal sin competir — el usuario distingue naturalmente "acciones primarias" (teal) de "acciones secundarias/navegación" (azul).

### Acento: Ámbar cálido (#D97706)
**Justificación:** Para badges de prioridad, alertas sutiles y elementos que requieren atención sin alarmar. En contexto médico, el ámbar comunica "precaución" sin la urgencia del rojo — ideal para estados como "en espera" o "pendiente".

### Neutros
Escala de grises con base ligeramente fría (blue-gray) para mantener coherencia con la paleta médica. El fondo usa un gris muy claro (#F8FAFC) en vez de blanco puro — reduce fatiga visual en uso prolongado.

### Estados semánticos
- **Éxito (#16A34A):** Verde saturado — prescripción completada, paciente registrado, acción exitosa.
- **Error (#DC2626):** Rojo estándar — errores de formulario, validación, eliminación.
- **Advertencia (#D97706):** Mismo que el ámbar acento — consistencia visual.

### Paleta rotativa (avatares/tags por-ítem)
El sistema maneja listas de pacientes y empleados. Para diferenciar visualmente elementos en listas sin depender solo de texto, se usa una paleta rotativa de 6 colores para avatares con iniciales y tags de categoría (especialidad, estado OPD).

**Regla WCAG AA:** Cada color tiene una variante `-light` (fondo claro) y se usa `--avatar-text-on-light` (neutral-900) como color de texto. Los colores 1, 2, 5 y 6 alcanzan 4.5:1 contra blanco y pueden usarse como fondo sólido con texto blanco. Los colores 3 (púrpura #7C3AED, 3.5:1) y 4 (rojo #DC2626, 3.6:1) **NO** alcanzan AA contra blanco — deben usar su variante `-light` con texto oscuro.

## Escala tipográfica

**Familia:** Inter (Google Fonts) — sans-serif de alto rendimiento en pantallas, diseñada específicamente para interfaces. Excelente legibilidad en tamaños pequeños (tablas, formularios), profesional sin ser genérica.

- **Headings:** Inter 600 (semibold) — peso lo bastante fuerte para jerarquía sin ser agresivo.
- **Body:** Inter 400 (regular) — lectura cómoda de formularios y tablas.
- **Caption/Labels:** Inter 500 (medium) — labels de formulario y metadatos.

Alturas de línea generosas (1.5 para body, 1.3 para headings) para legibilidad en pantallas con bastante texto.

## Espaciado y layout

- **Unidad base:** 8px — todos los espaciados son múltiplos de 8 (8, 12, 16, 24, 32, 48, 64).
- **Grid:** Sidebar fija de 240px + contenido principal fluido. Esto es un panel administrativo de escritorio, no necesita ser responsive.
- **Cards/paneles:** Padding de 24px, gap de 16px entre elementos.
- **Formularios:** Labels 8px arriba del input, inputs con 40px de alto para fácil interacción con mouse.

## Radios de borde

- **SM (4px):** Inputs, badges, tags pequeños — sutiles, solo suavizan esquinas.
- **MD (6px):** Cards, paneles — suficiente para no parecer "dura" sin ser redondeada.
- **LG (8px):** Modales, drawers — se sienten como elementos superpuestos.
- **Botones:** 6px — coherente con cards. No se usan bordes completamente redondeados (serían pill-shape, rompe el tono profesional).

## Elevación y sombras

- **Sombras sutiles** (2-4% opacidad) — dan profundidad sin llamar la atención. En sistema médico, la sobriedad visual es clave.
- **Sombras en interacción** (hover/focus) — ligeramente más pronunciadas para feedback de estado.
- No se usan sombras duras ni gradientes.

## Lenguaje visual

- **Estilo:** Minimalista clínico. Líneas limpias, mucho espacio en blanco, jerarquía clara por tamaño y peso tipográfico (no por color excesivo).
- **Iconografía:** Trazo fino (outline/stroke), nunca sólida/rellena. Los iconos de Material Symbols en peso 300-400 son ideales.
- **Imágenes:** No se usan fotos decorativas. Si hay ilustraciones, son minimalistas y abstractas (para empty states).
- **Tablas:** Líneas divisorias sutiles (1px, neutral-200), filas con hover ligero. Sin bordes pesados.
- **Cards:** Fondo blanco, borde sutil (neutral-200), sin sombra por defecto (solo en hover o estado elevado).

## Prohibiciones explícitas

1. **Nunca iconos sólidos/rellenos** — Solo trazo fino (outline/stroke). Los iconos sólidos se sienten pesados y poco profesionales en contexto médico.
2. **Sin gradientes genéricos** — No gradients de fondo en cards, headers, o botones. Colores planos y sólidos.
3. **Sin el look por defecto de Bootstrap/Material** — El sistema debe tener personalidad propia. No usar componentes vanilla de frameworks sin personalizar.
4. **Sin bordes completamente redondeados en botones** — Radio de 6px máximo. Los pills/botones redondos se asocian a consumo mobile, no a paneles administrativos médicos.
5. **Sin colores neón ni saturados en exceso** — La paleta es profesional, no lúdica. Los colores de acento son sutiles.
6. **Sin sombras duras o drop-shadows pronunciados** — Solo sombras de 2-4% opacidad.
7. **Sin texto sin label en formularios** — Todo input tiene un label visible (no placeholder como label). WCAG AA requiere labels persistentes.
8. **Sin animaciones largas o llamativas** — Transiciones de 150-200ms máximo. En entorno médico, la velocidad percibida es más importante que la decoración.

## Reglas de uso WCAG AA (obligatorias)

1. **Warning/ámbel:** Nunca texto blanco sobre `--color-warning` (#D97706) — ratio 2.2:1 (FAIL). Usar `--color-neutral-900` sobre `--color-warning-light` (#FEF3C7) — ratio 14.5:1. El ámbar sólido solo se usa para bordes, iconos decorativos y badges con fondo claro.
2. **Neutral-500 (#64748B):** Solo para texto grande (>18px bold o >24px regular). Ratio 3.9:1 contra blanco — FAIL para body text de 14px.
3. **Avatares púrpura/rojo:** Usar variante `-light` con `--avatar-text-on-light`. Ver regla en paleta rotativa arriba.
