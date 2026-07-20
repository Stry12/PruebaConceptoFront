# Design Tokens — MediaVault

> **Fase E2** · Color Strategist · 2026-07-19
> Fuente: `design/color-system.md` (aprobado). Todos los valores de color derivan de ahí.

---

## Dirección creativa registrada

**"Archivo Personal"** — cada usuario es el bibliotecario de su propio archivo digital. La interfaz toma la metáfora de estantería y catálogo editorial, pero con la calidez de un espacio íntimo y propio. Estrategia de color: Restrained (neutros tintados + un acento ≤10%). Nivel premium 3.

---

## 1. Color

Ver `design/color-system.md` para la narrativa completa. Los tokens se repiten aquí en tabla plana para referencia rápida.

### Acento

| Token | Light | Dark | Restricción |
|---|---|---|---|
| `--color-accent` | `#B5694E` | `#D48A6E` | ≤10% de superficie total. Solo CTAs, estados activos, badges |
| `--color-accent-hover` | `#A25C42` | `#E09C80` | Hover sobre elementos accent |
| `--color-accent-pressed` | `#8E4F38` | `#C07A5E` | Estado pressed |
| `--color-accent-bg` | `#FDF3EF` | `#3D2A22` | Fondo suave para badges/alertas accent |
| `--color-accent-bg-subtle` | `#FBF0EB` | `#2E2019` | Fondo suave alternativo (tabs, pills) |

### Neutros (escala completa)

| Token | Light | Dark |
|---|---|---|
| `--color-neutral-50` | `#FAF9F7` | `#1A1918` |
| `--color-neutral-100` | `#F0EFED` | `#1E1D1C` |
| `--color-neutral-200` | `#E2E0DD` | `#2A2927` |
| `--color-neutral-300` | `#C9C7C3` | `#363432` |
| `--color-neutral-400` | `#A8A5A0` | `#504D4A` |
| `--color-neutral-500` | `#86827D` | `#6B6763` |
| `--color-neutral-600` | `#6B6763` | `#86827D` |
| `--color-neutral-700` | `#504D4A` | `#A8A5A0` |
| `--color-neutral-800` | `#363432` | `#C9C7C3` |
| `--color-neutral-900` | `#1E1D1C` | `#F0EFED` |
| `--color-neutral-950` | `#131211` | `#FAF9F7` |

### Superficies

| Token | Light | Dark | Rol |
|---|---|---|---|
| `--color-bg` | `#FAF9F7` | `#131211` | Fondo global |
| `--color-surface` | `#FFFFFF` | `#1E1D1C` | Cards, paneles |
| `--color-surface-raised` | `#F0EFED` | `#2A2927` | Dropdowns, tooltips |
| `--color-surface-interactive` | `#E8E6E3` | `#33312F` | Hover states |
| `--color-surface-inverse` | `#1E1D1C` | `#F0EFED` | Modo inverso |

### Texto

| Token | Light | Dark | Mínimo contraste requerido |
|---|---|---|---|
| `--color-text` | `#1E1D1C` | `#F0EFED` | ≥7:1 (AAA) |
| `--color-text-secondary` | `#6B6763` | `#A8A5A0` | ≥4.5:1 (AA) |
| `--color-text-tertiary` | `#A8A5A0` | `#6B6763` | ≤3:1 — solo captions/hints |
| `--color-text-disabled` | `#C9C7C3` | `#504D4A` | Decorativo |
| `--color-text-on-accent` | `#FFFFFF` | `#FFFFFF` | ≥3:1 sobre accent |

### Bordes

| Token | Light | Dark |
|---|---|---|
| `--color-border` | `#E2E0DD` | `#363432` |
| `--color-border-strong` | `#C9C7C3` | `#504D4A` |
| `--color-border-focus` | `#B5694E` | `#D48A6E` |

### Estados semánticos

| Token | Light | Dark |
|---|---|---|
| `--color-success` | `#3D7A52` | `#6AAF82` |
| `--color-success-bg` | `#EEF6F0` | `#1A2E22` |
| `--color-success-bg-subtle` | `#E4F0E8` | `#15261B` |
| `--color-success-text` | `#2A5538` | `#8CC9A0` |
| `--color-warning` | `#B8862D` | `#E0A840` |
| `--color-warning-bg` | `#FDF5E8` | `#2E2618` |
| `--color-warning-bg-subtle` | `#FAF0DE` | `#262014` |
| `--color-warning-text` | `#8A6520` | `#E8C06A` |
| `--color-danger` | `#C25050` | `#E07070` |
| `--color-danger-bg` | `#FDF0F0` | `#2E1A1A` |
| `--color-danger-bg-subtle` | `#FAE8E8` | `#261515` |
| `--color-danger-text` | `#963838` | `#E89494` |
| `--color-info` | `#4A72A0` | `#6E96BE` |
| `--color-info-bg` | `#EEF3FA` | `#1A2230` |
| `--color-info-bg-subtle` | `#E4ECF5` | `#151C28` |
| `--color-info-text` | `#365578` | `#90B4D4` |

### Paleta rotativa (avatars, categorías, badges)

| Token | Light | Dark |
|---|---|---|
| `--avatar-color-1` | `#B5694E` | `#D48A6E` |
| `--avatar-color-2` | `#7B6B8A` | `#9A8AA8` |
| `--avatar-color-3` | `#5A7B6B` | `#7A9B8B` |
| `--avatar-color-4` | `#8A6B5A` | `#A88B7A` |
| `--avatar-color-5` | `#5A6B8A` | `#7A8BA8` |
| `--avatar-color-6` | `#8A7B5A` | `#A89A7A` |

### Aliases de compatibilidad (theme-lint)

| Alias | Apunta a | Light | Dark |
|---|---|---|---|
| `--color-primary` | `--color-accent` | `#B5694E` | `#D48A6E` |
| `--color-error` | `--color-danger` | `#C25050` | `#E07070` |

Los tokens canónicos son `--color-accent` y `--color-danger`. Los aliases existen para que `theme-lint` no reporte falsos negativos.

---

## 2. Tipografía

### Familias

| Token | Valor | Uso | Justificación |
|---|---|---|---|
| `--font-display` | `'Libre Baskerville', Georgia, 'Times New Roman', serif` | Títulos de página, nombres de colecciones, display grande | Editorial contenido: serif de transición con contraste moderado. Evoca catálogo bibliotecario sin ser anticuado. Georgia como fallback garantiza disponibilidad. |
| `--font-body` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | Cuerpo, metadata, navegación, formularios | Excelente legibilidad en tamaños pequeños, extensa tabla de pesos, diseñada para interfaces. La más usada del ecosistema web — el usuario la conoce sin saberlo. |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace` | IDs, URLs, datos técnicos (admin bulk import) | Para el contexto admin/carga masiva donde aparecen identifiers y datos estructurados. |

### Pesos

| Token | Valor | Uso |
|---|---|---|
| `--font-weight-regular` | `400` | Cuerpo de texto |
| `--font-weight-medium` | `500` | Labels de formulario, nav items, texto secundario con énfasis |
| `--font-weight-semibold` | `600` | Subtítulos, nombres de items, badges de estado |
| `--font-weight-bold` | `700` | Títulos de display, headings h1-h2 |

### Escala tipográfica

Base: `16px` (1rem). Ratio: ~1.25 (major third). Cada paso multiplica por ~1.125 o salta al siguiente.

| Token | Tamaño | Line-height | Uso |
|---|---|---|---|
| `--text-xs` | `0.75rem` (12px) | `1rem` (16px) | Captions, timestamps, badges pequeños |
| `--text-sm` | `0.875rem` (14px) | `1.25rem` (20px) | Metadata, hints, labels pequeños |
| `--text-base` | `1rem` (16px) | `1.5rem` (24px) | Cuerpo de texto, descripciones |
| `--text-lg` | `1.125rem` (18px) | `1.625rem` (26px) | Subtítulos, nombres de items en cards |
| `--text-xl` | `1.25rem` (20px) | `1.75rem` (28px) | Subtítulos de sección, títulos de card |
| `--text-2xl` | `1.5rem` (24px) | `2rem` (32px) | Títulos de página (h2) |
| `--text-3xl` | `1.875rem` (30px) | `2.25rem` (36px) | Títulos de página (h1) |
| `--text-4xl` | `2.25rem` (36px) | `2.75rem` (44px) | Display grande, hero de colección |
| `--text-5xl` | `3rem` (48px) | `3.5rem` (56px) | Display máximo (solo landing/dashboard principal) |

**Restricción:** `--text-5xl` solo se usa en la pantalla principal del dashboard o landing. No abusar de display grande — el brief dice "contenida", no "espectacular".

### Letter-spacing

| Token | Valor | Uso |
|---|---|---|
| `--tracking-tight` | `-0.02em` | Display grande (serif), títulos h1-h2 |
| `--tracking-normal` | `0` | Cuerpo, UI |
| `--tracking-wide` | `0.04em` | Labels, badges, metadata en uppercase |

### Aliases de compatibilidad (theme-lint)

Los siguientes aliases existen para que `theme-lint` detecte los grupos tipográficos. Apuntan a los mismos valores que los tokens canónicos:

| Alias | Apunta a | Ejemplo |
|---|---|---|
| `--font-family-display` | `--font-display` | `'Libre Baskerville', Georgia, serif` |
| `--font-family-body` | `--font-body` | `'Inter', -apple-system, sans-serif` |
| `--font-family-mono` | `--font-mono` | `'JetBrains Mono', monospace` |
| `--font-size-xs` | `--text-xs` | `0.75rem` |
| `--font-size-sm` | `--text-sm` | `0.875rem` |
| `--font-size-base` | `--text-base` | `1rem` |
| `--font-size-lg` | `--text-lg` | `1.125rem` |
| `--font-size-xl` | `--text-xl` | `1.25rem` |
| `--font-size-2xl` | `--text-2xl` | `1.5rem` |
| `--font-size-3xl` | `--text-3xl` | `1.875rem` |
| `--font-size-4xl` | `--text-4xl` | `2.25rem` |
| `--font-size-5xl` | `--text-5xl` | `3rem` |
| `--line-height-none` | `--leading-none` | `1rem` |
| `--line-height-tight` | `--leading-tight` | `1.25rem` |
| `--line-height-snug` | `--leading-snug` | `1.5rem` |
| `--line-height-normal` | `--leading-normal` | `1.625rem` |
| `--line-height-relaxed` | `--leading-relaxed` | `1.75rem` |
| `--line-height-loose` | `--leading-loose` | `2rem` |
| `--line-height-2xl` | `--leading-2xl` | `2.25rem` |
| `--line-height-3xl` | `--leading-3xl` | `2.75rem` |
| `--line-height-4xl` | `--leading-4xl` | `3.5rem` |

---

## 3. Espaciado y layout

### Unidad base

`4px` (0.25rem). Todos los espaciados son múltiplos de 4px. Esto genera alineación visual consistente y facilita el grid.

### Escala de espaciado

| Token | Valor | Uso típico |
|---|---|---|
| `--space-0` | `0` | — |
| `--space-0.5` | `2px` | Gap micro entre elementos inline |
| `--space-1` | `4px` | Padding interno de badges, gap entre icono y texto inline |
| `--space-1.5` | `6px` | Gap entre label y valor en metadata compacta |
| `--space-2` | `8px` | Padding de chips, gap en layouts apretados |
| `--space-3` | `12px` | Padding de cards pequeñas, gap en formularios |
| `--space-4` | `16px` | Padding estándar de cards, gap entre secciones de formulario |
| `--space-5` | `20px` | Gap entre cards en grid, padding de paneles |
| `--space-6` | `24px` | Padding de modales, gap entre secciones |
| `--space-8` | `32px` | Gap entre secciones mayores, padding de dashboards |
| `--space-10` | `40px` | Separación de áreas de contenido |
| `--space-12` | `48px` | Padding de página en desktop |
| `--space-16` | `64px` | Separación entre bloques de sección |
| `--space-20` | `80px` | Separación de hero sections |
| `--space-24` | `96px` | Máximo espaciado vertical de sección |

### Grid

| Token | Valor | Nota |
|---|---|---|
| `--grid-columns` | `12` | Grid estándar para desktop |
| `--grid-gutter` | `24px` (`--space-6`) | Gap entre columnas |
| `--grid-max-width` | `1280px` | Ancho máximo de contenido |
| `--grid-padding` | `24px` (`--space-6`) | Padding lateral en mobile/tablet |

**Breakpoints** (referencia, no tokens de color):
- Mobile: `<640px` — 1 columna, padding 16px
- Tablet: `640px–1024px` — 2-8 columnas, padding 24px
- Desktop: `>1024px` — 12 columnas, padding 24px, max-width 1280px

---

## 4. Bordes y radios

### Border radius

| Token | Valor | Uso |
|---|---|---|
| `--radius-none` | `0` | — |
| `--radius-sm` | `4px` | Badges, tags inline, progress bars |
| `--radius-md` | `6px` | Buttons, inputs, chips |
| `--radius-lg` | `8px` | Cards, paneles |
| `--radius-xl` | `12px` | Modales, dropdowns |
| `--radius-2xl` | `16px` | Avatares grandes, contenedores destacados |
| `--radius-full` | `9999px` | Circles, pills |

**Restricción:** No usar `--radius-xl` ni `--radius-2xl` en componentes de alta densidad (tablas, listas compactas). El brief dice "densidad con respiración" — los radios grandes consumen espacio horizontal.

### Border widths

| Token | Valor | Uso |
|---|---|---|
| `--border-width` | `1px` | Bordes estándar |
| `--border-width-strong` | `2px` | Bordes de focus ring, separadores prominentes |

---

## 5. Elevación y sombras

Sombras sutiles (≤10% opacidad, per vocabulario anti-default). Cada nivel complementa la escala de superficies tonales.

### Modo claro

| Token | Valor | Uso |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(30, 29, 28, 0.05)` | Elevación mínima: chips, badges flotantes |
| `--shadow-md` | `0 2px 8px rgba(30, 29, 28, 0.08)` | Cards, paneles |
| `--shadow-lg` | `0 4px 16px rgba(30, 29, 28, 0.10)` | Dropdowns, modales, popovers |
| `--shadow-xl` | `0 8px 32px rgba(30, 29, 28, 0.12)` | Tooltips flotantes, elementos drag |

### Modo oscuro

En dark mode, las sombras son menos efectivas sobre fondos oscuros. Se complementan con bordes sutiles + elevación tonal (superficies más claras).

| Token | Valor | Uso |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.2)` | Elevación mínima |
| `--shadow-md` | `0 2px 8px rgba(0, 0, 0, 0.25)` | Cards, paneles |
| `--shadow-lg` | `0 4px 16px rgba(0, 0, 0, 0.3)` | Dropdowns, modales |
| `--shadow-xl` | `0 8px 32px rgba(0, 0, 0, 0.35)` | Tooltips flotantes |

**Nota:** En dark mode, la separación visual entre superficies se logra principalmente por la escala tonal de superficies (bg → surface → raised), no por sombras. Las sombras son complementarias, no la solución primaria.

---

## 6. Transiciones

| Token | Valor | Uso |
|---|---|---|
| `--duration-fast` | `100ms` | Hover states, toggle switches |
| `--duration-normal` | `200ms` | Transiciones de color, opacity |
| `--duration-slow` | `300ms` | Apertura de modales, drawers |
| `--easing-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Movimiento estándar |
| `--easing-in` | `cubic-bezier(0.4, 0, 1, 1)` | Entradas |
| `--easing-out` | `cubic-bezier(0, 0, 0.2, 1)` | Salidas |

---

## 7. Lenguaje visual (iconografía e imagen)

### Iconografía

| Decisión | Valor | Justificación |
|---|---|---|
| Estilo de trazo | `lucide` (outline, 1.5px stroke) | Trazo fino y consistente. Ni sólido (pesado) ni duotone (decorativo). Alineado con "contenida" y "superficie pulida". |
| Tamaño base | `20px` (`--icon-size-base`) | Legible en UI sin dominar. |
| Tamaños | `16px`, `20px`, `24px`, `32px` | xs (inline), base, lg (navegación), xl (empty states) |
| Color heredado | `currentColor` | Los iconos heredan el color del texto circundante. Nunca color fijo excepto en estados semánticos. |

### Imagen

| Decisión | Valor | Justificación |
|---|---|---|
| Proporción de portadas | Mantener proporción original (cover) | "Tapizado rico" del brief: las portadas son protagonistas y respetan su geometría natural. |
| Placeholder sin imagen | Background `--color-neutral-200` + icono de tipo de contenido | "coverImage es opcional — la UI debe manejar items sin portada gracefully" (domain.md). |
| Border radius de imágenes | `--radius-lg` (8px) | Consistente con cards. No recortar con radios agresivos que distorsionen portadas. |
| Sombreado de portadas | Sin sombreado decorativo | La elevación de cards ya provee separación. Las portadas no necesitan framing artificial. |

---

## 8. Prohibiciones explícitas

Estas restricciones evitan el default genérico de Stitch y la erosión del sistema por implementación ad-hoc.

| # | Prohibición | Razón | Fuente |
|---|---|---|---|
| P-1 | **No fondo crema/beige/sand como "calidez"** | AP-2. La calidez se carga en acento, tipografía e imágenes. El fondo es `#FAF9F7` (S≈3%), no crema. | brand-brief AP-2, vocabulary.md |
| P-2 | **No sombras con opacidad >10% (light) / >35% (dark)** | Sombras duras son genéricas. La elevación se logra por escala tonal + sombras sutiles. | vocabulary.md anti-default |
| P-3 | **No dos acentos de intensidad similar** | La identidad requiere UN acento deliberado. Un segundo color saturado compite y confunde. | brand-brief: "El acento debe ser uno solo y deliberado" |
| P-4 | **No usar `--color-accent` como fondo de secciones grandes** | El acento ≤10% de superficie. Fondo de sección = `--color-surface` o `--color-surface-raised`. | vocabulary.md: Restrained strategy |
| P-5 | **No texto tertiary para información primaria** | `--color-text-tertiary` no cumple AA. Solo para captions, hints, timestamps — información redundada. | color-system.md decisión WCAG |
| P-6 | **No border-radius >8px en componentes de alta densidad** | Tablas, listas compactas, filas de datos usan `--radius-sm` o `--radius-none`. Los radios grandes consumen espacio horizontal. | brand-brief: "densidad con respiración" |
| P-7 | **No sombras como único separador de superficies** | La separación figura-fondo depende de la escala tonal de superficies, no de sombras. Sombras son complemento. | AP-2: "superficies con personalidad suficiente" |
| P-8 | **No gradientes decorativos** | La "superficie pulida" del brief es consistencia, no decoración. Superficies planas con escala tonal. | brand-brief: "La pulidez se siente en la consistencia, no en la decoración" |
| P-9 | **No ilustraciones decorativas en空 states** | Empty states usan iconos del sistema + texto. Las ilustraciones spot rompen la estética "contenida". | brand-brief: "contenida" — la interfaz es marco, no espectáculo |
| P-10 | **No colors de la paleta rotativa para texto informativo** | `--avatar-color-*` son decorativos (badges, bordes, fondos). Nunca para texto que el usuario debe leer como contenido. | color-system.md paleta rotativa |
| P-11 | **No `--text-5xl` fuera de pantalla principal/landing** | El display máximo es excepcional, no habitual. El brief dice "contenida" — la mayoría de títulos vive en `--text-2xl` a `--text-3xl`. | brand-brief: "contenida" |
| P-12 | **No font-family display para cuerpo ni viceversa** | Serif (`--font-display`) solo para headings/display. Sans (`--font-body`) para todo lo demás. No cruzar. | brand-brief: "Editorial contenido — jerarquía tipográfica con personalidad" |
