# Fase 2 — Estrategia de Estilos e Identidad Visual

## Paleta de colores

### Primario: Indigo profundo (`#4338CA`)

**Psicología**: El índigo transmite confianza, profundidad y sofisticación sin la frialdad del azul corporativo. Evoca la sensación de una biblioteca personal — un espacio acogedor y organizado. Es un color que el usuario asocia con "mi espacio", no con una herramienta genérica.

### Secundario: Ámbar cálido (`#F59E0B`)

**Psicología**: El ámbar aporta calidez y energía. Representa la "luz" de la descubrimiento — encontrar algo nuevo, marcar un favorito, completar algo. Contrasta armónicamente con el índigo en la rueda de color (complementarios suaves). Se usa para acentos interactivos: botones primarios de acción, badges de estado activo, highlights.

### Neutros

| Token | Hex | Uso |
|---|---|---|
| `--color-neutral-50` | `#FAFAF9` | Fondo general de la app |
| `--color-neutral-100` | `#F5F5F4` | Fondo de cards, secciones alternas |
| `--color-neutral-200` | `#E7E5E4` | Bordes, separadores, divider lines |
| `--color-neutral-300` | `#D6D3D1` | Bordes hover, inputs inactivos |
| `--color-neutral-400` | `#A8A29E` | Iconos secundarios, placeholder text |
| `--color-neutral-500` | `#78716C` | Texto secundario, captions |
| `--color-neutral-600` | `#57534E` | Texto cuerpo secundario |
| `--color-neutral-700` | `#44403C` | Texto cuerpo principal |
| `--color-neutral-800` | `#292524` | Texto headings |
| `--color-neutral-900` | `#1C1917` | Texto de alto contraste, dark accents |

**Nota**: los neutros son cálidos (con base parda sutil) para mantener coherencia con la paleta índigo-ámbar y evitar la frialdad de grises neutros puros.

### Estados

| Token | Hex | Uso | Psicología |
|---|---|---|---|
| `--color-success` | `#16A34A` | Completado, guardado, confirmación | Verde universal de "todo bien" |
| `--color-error` | `#DC2626` | Errores, eliminaciones, alertas críticas | Rojo de atención inmediata |
| `--color-warning` | `#D97706` | Advertencias, estados pendientes con alerta | Ámbar oscuro — cautela sin alarmismo |
| `--color-info` | `#2563EB` | Informativo, enlaces, tooltips | Azul neutro de información |

### Paleta rotativa (avatares, badges de tipo, tags de categoría)

Se usa para dar identidad visual única a cada elemento de la biblioteca: iniciales de avatar, badges del tipo de contenido (book, film, manga, etc.), y tags de categoría. Cada tipo de contenido o categoría rota entre estos 6 colores.

| Token | Hex | Carácter |
|---|---|---|
| `--avatar-color-1` | `#7C3AED` | Violeta — creatividad, narrativa |
| `--avatar-color-2` | `#2563EB` | Azul — confiabilidad, información |
| `--avatar-color-3` | `#DB2777` | Rosa — pasión, entretenimiento |
| `--avatar-color-4` | `#16A34A` | Verde — crecimiento, aprendizaje |
| `--avatar-color-5` | `#D97706` | Ámbar — energía, descubrimiento |
| `--avatar-color-6` | `#0891B2` | Cian — frescura, audiovisual |

**Regla de uso**: el color se asigna por índice del tipo de contenido (book=1, film=2, series=3, manga=4, etc.) o por orden alfabético de categoría. El texto sobre estos fondos SIEMPRE es blanco (`#FFFFFF`).

---

## Escala tipográfica

**Familia**: **Inter** (Google Fonts) — both headings y body.

**Justificación**: Inter es una tipografía sans-serif diseñada específicamente para interfaces. Tiene excelente legibilidad en tamaños pequeños (captions, labels), una amplia gama de pesos (100–900), y un carácter neutro-moderno que no compite con el contenido visual (portadas). Es la opción más segura para una app que debe ser legible y rápida de escanear.

| Nivel | Tamaño | Peso | Line-height | Uso |
|---|---|---|---|---|
| `caption` | 12px (0.75rem) | 400 | 16px | Metadatos, fechas, texto auxiliar |
| `body-sm` | 14px (0.875rem) | 400 | 20px | Descripciones cortas, badges |
| `body` | 16px (1rem) | 400 | 24px | Texto cuerpo principal |
| `body-lg` | 18px (1.125rem) | 500 | 28px | Subtítulos de sección |
| `h3` | 20px (1.25rem) | 600 | 28px | Títulos de card, encabezados menores |
| `h2` | 24px (1.5rem) | 600 | 32px | Encabezados de sección |
| `h1` | 30px (1.875rem) | 700 | 36px | Títulos de página |
| `display` | 36px (2.25rem) | 700 | 40px | Títulos de hero/landing (si aplica) |

---

## Espaciado y layout

### Unidad base: 8px

Todos los espaciados son múltiplos de 8px para mantener ritmo visual consistente.

| Token | Valor | Uso |
|---|---|---|
| `--space-1` | 4px | Micro-espaciado (íconos inline, gaps mínimos) |
| `--space-2` | 8px | Espaciado entre elementos hermanos pequeños |
| `--space-3` | 12px | Padding interno de inputs, gaps de tags |
| `--space-4` | 16px | Padding de cards, spacing entre secciones menores |
| `--space-5` | 20px | Spacing entre secciones |
| `--space-6` | 24px | Padding de contenedores, spacing entre bloques |
| `--space-8` | 32px | Spacing entre secciones mayores |
| `--space-10` | 40px | Padding de página |
| `--space-12` | 48px | Spacing de secciones hero |

### Grid

- **Desktop (≥1024px)**: contenido principal con max-width de 1200px, centrado. Grid de 12 columnas con gutter de 24px.
- **Tablet (768–1023px)**: 8 columnas, gutter de 16px.
- **Mobile (<768px)**: 4 columnas, gutter de 16px.

### Bento grid para la biblioteca

Los items de la biblioteca se muestran en un **bento grid asimétrico** (no un grid uniforme de cards cuadradas): las portadas de los items destacados pueden ocupar 2 columnas, mientras los items normales ocupan 1. Esto rompe la monotonía y da protagonismo visual a los items seleccionados.

### Border radius

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 4px | Badges pequeños, tags |
| `--radius-md` | 8px | Cards, inputs, botones |
| `--radius-lg` | 12px | Modals, drawers, contenedores destacados |
| `--radius-xl` | 16px | Avatares grandes, portadas destacadas |
| `--radius-full` | 9999px | Botones pill, badges circulares |

### Elevación / Sombras

| Token | Valor | Uso |
|---|---|---|
| `--shadow-xs` | `0 1px 2px rgba(28,25,23,0.04)` | Sutil elevación de cards en reposo |
| `--shadow-sm` | `0 2px 4px rgba(28,25,23,0.06), 0 1px 2px rgba(28,25,23,0.04)` | Cards, dropdowns |
| `--shadow-md` | `0 4px 8px rgba(28,25,23,0.08), 0 2px 4px rgba(28,25,23,0.04)` | Modals, drawers, tooltips |
| `--shadow-lg` | `0 8px 16px rgba(28,25,23,0.10), 0 4px 8px rgba(28,25,23,0.06)` | Elementos elevados sobre todo |

**Nota**: las sombras usan la tonalidad del neutro-900 (`rgba(28,25,23,...)`) en vez de negro puro, para mantener la calidez de la paleta.

---

## Lenguaje visual

- **Estilo general**: Minimalista editorial. Limpio, con espacio generoso entre elementos, sin densidad excesiva. Cada pantalla tiene un foco claro.
- **Portadas como protagonistas**: las imágenes de cover son el elemento visual dominante. La interfaz las respeta con espacio suficiente y no las recorta agresivamente.
- **Iconografía**: Iconos de trazo fino (outline/stroke), no sólidos/rellenos. Estilo consistente (Lucide o Phosphor). Los iconos comunican, no decoran.
- **Interacciones**: Transiciones sutiles (150–200ms ease-out) en hover, focus y cambio de estado. Sin animaciones llamativas que distraigan del contenido.
- **Tono de copy**: Cercano, personal, sin ser informal excesivo. "Mi biblioteca", no "Panel de administración".

---

## Prohibiciones explícitas

1. **NO stat-cards de panel admin**: no se generan filas de "Total items: X | Completados: Y | Pendientes: Z" como bloque principal de ninguna pantalla. La información de resumen se integra de forma orgánica.
2. **NO sidebar de navegación fija**: la navegación se hace via bottom bar (mobile) o header horizontal (desktop). No sidebar tipo dashboard.
3. **NO iconos sólidos/rellenos**: solo trazo fino (outline). Los sólidos dan un look pesado y anticuado.
4. **NO gradientes genéricos de plantilla**: sin gradientes de fondo en cards, headers o botones. Superficies planas con color sólido.
5. **NO look por defecto de Bootstrap/Material sin personalizar**: se evita el aspecto "framework out of the box".
6. **NO texto sobre portadas sin contraste**: si hay texto superpuesto a una imagen, siempre con overlay de contraste legible.
7. **NO botones de acción sin contexto**: cada botón de acción debe estar cerca del contenido que afecta (regla de proximidad de Gestalt).
8. **NO layouts de 3+ columnas en mobile**: en pantallas pequeñas, todo se apila en 1 columna. Las cards pueden ser de 2 columnas como máximo en mobile.

---

## Decisiones de accesibilidad

- Todos los pares de color de texto contra fondo deben alcanzar **WCAG AA** (4.5:1 para texto normal, 3:1 para texto grande/componentes).
- Los colores de la paleta rotativa se usan como fondo con texto blanco — se verificó contraste.
- El focus-visible debe ser visible en todos los elementos interactivos (anillo de foco con `--color-primary`).
- Los colores de estado (success/error/warning) nunca se usan como ÚNICO indicador — siempre acompañados de icono o texto.

---

**¿Confirmas esta estrategia visual? ¿Algo que ajustar en colores, tipografía, o prohibiciones antes de pasar a la Fase 3 (UX)?**
