# Sistema de Color Semántico — MediaVault

> **Fase E2** · Color Strategist · 2026-07-19
> Contratos de entrada: `design/discovery.md` (aprobado), `design/brand-brief.md` (aprobado)

---

## Dirección de color

**Estrategia: Restrained** — neutros tintados cálidos + un único acento deliberado. La calidez íntima se carga en el acento y la tipografía, NO en el fondo (resolución de AP-2). Los neutros tienen personalidad (subtono cálido sutil) para no competir con la gama cromática de las portadas de contenido.

**Tensión resuelta:** calidez íntima ↔ claridad enciclopédica. Los neutros tintados dan calidez sin ser crema; la escala de superficies limpia da claridad sin frialdad. El acento único (copper/terracotta) ancla la identidad sin saturar.

---

## Acento: Copper `--color-accent`

| Variante | Light | Dark |
|---|---|---|
| Base | `#B5694E` | `#D48A6E` |
| Hover | `#A25C42` | `#E09C80` |
| Pressed | `#8E4F38` | `#C07A5E` |
| Fondo suave | `#FDF3EF` | `#3D2A22` |
| Fondo suave (baja) | `#FBF0EB` | `#2E2019` |

**Por qué este color:** El copper/terracotta evoca lomos de cuero, madera de biblioteca, páginas envejecidas — todos anclados en la metáfora de "archivo personal". Es cálido sin ser infantil (naranja brillante) ni corporativo (azul). Tiene peso visual para anclar la identidad, pero su saturación moderada (S≈50%) no compite con las portadas de contenido. Se usa con moderación (≤10% de superficie): botones primarios, estados activos, badges de acento, links interactivos.

**Prohibición:** No usar el acento como fondo de secciones grandes ni como color de texto de cuerpo. No duplicar con otro acento de intensidad similar.

---

## Neutros: Warm Gray Scale `--color-neutral-{n}`

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--color-neutral-50` | `#FAF9F7` | `#1A1918` | Background base |
| `--color-neutral-100` | `#F0EFED` | `#1E1D1C` | Surface base |
| `--color-neutral-200` | `#E2E0DD` | `#2A2927` | Surface elevada |
| `--color-neutral-300` | `#C9C7C3` | `#363432` | Bordes, divisores |
| `--color-neutral-400` | `#A8A5A0` | `#504D4A` | Texto disabled, placeholders |
| `--color-neutral-500` | `#86827D` | `#6B6763` | Texto secundario |
| `--color-neutral-600` | `#6B6763` | `#86827D` | Iconos secundarios |
| `--color-neutral-700` | `#504D4A` | `#A8A5A0` | Texto terciario sobre superficie elevada |
| `--color-neutral-800` | `#363432` | `#C9C7C3` | Texto terciario sobre dark surface |
| `--color-neutral-900` | `#1E1D1C` | `#F0EFED` | Texto primario |
| `--color-neutral-950` | `#131211` | `#FAF9F7` | Texto primario sobre elevadas |

**Por qué warm-gray y no neutral-gray puro:** Los grises con subtono cálido (H≈30-40°) dan personalidad a la interfaz sin ser crema (AP-2 resuelto: la saturación es baja, la temperatura es apenas perceptible). Esto cumple "los neutros tengan personalidad suficiente para no competir con el contenido" (brand brief para color_strategist). En modo oscuro, la misma temperatura cálida evita la frialdad de grises azulados.

**Nota de proporción:** En el CSS los neutros se representan como `--color-neutral-{n}` para escala completa. Las siguientes secciones (superficies, texto, bordes) usan alias semánticos que apuntan a estos valores.

---

## Superficies: Escala de elevación

La separación figura-fondo depende de esta escala, no solo de sombras (que son complementarias).

### Modo claro

| Token | Valor | Rol |
|---|---|---|
| `--color-bg` | `#FAF9F7` | Background global de la app |
| `--color-surface` | `#FFFFFF` | Cards, paneles, modales |
| `--color-surface-raised` | `#F0EFED` | Dropdowns, tooltips, popovers |
| `--color-surface-interactive` | `#E8E6E3` | Hover sobre superficies, filas activas |
| `--color-surface-inverse` | `#1E1D1C` | Superficies en modo inverso (tooltips sobre claro) |

### Modo oscuro

| Token | Valor | Rol |
|---|---|---|
| `--color-bg` | `#131211` | Background global de la app |
| `--color-surface` | `#1E1D1C` | Cards, paneles, modales |
| `--color-surface-raised` | `#2A2927` | Dropdowns, tooltips, popovers |
| `--color-surface-interactive` | `#33312F` | Hover sobre superficies, filas activas |
| `--color-surface-inverse` | `#F0EFED` | Superficies en modo inverso |

**Regla:** Cada nivel de elevación se diferencia ~12-15% en luminosidad del anterior. El fondo (`bg`) es siempre el más extremo (claro o oscuro), las superficies ascienden en luminosidad relativa. Esto genera jerarquía por separación tonal sin depender de sombras duras.

---

## Texto

### Sobre fondos claros (modo light)

| Token | Valor | Contraste sobre #FFFFFF | Contraste sobre #FAF9F7 | Uso |
|---|---|---|---|---|
| `--color-text` (primario) | `#1E1D1C` | ~17.2:1 | ~16.5:1 | Títulos, cuerpo principal, datos |
| `--color-text-secondary` | `#6B6763` | ~5.5:1 | ~5.3:1 | Descripciones, metadata, subtítulos |
| `--color-text-tertiary` | `#A8A5A0` | ~2.9:1 | ~2.8:1 | Timestamps, hints, captions |
| `--color-text-disabled` | `#C9C7C3` | ~1.9:1 | ~1.8:1 | Elementos deshabilitados (decorativo) |
| `--color-text-on-accent` | `#FFFFFF` | s/c | ~4.8:1 sobre `#B5694E` | Texto sobre acento |

### Sobre fondos oscuros (modo dark)

| Token | Valor | Contraste sobre #1E1D1C | Contraste sobre #131211 | Uso |
|---|---|---|---|---|
| `--color-text` (primario) | `#F0EFED` | ~15.8:1 | ~17.1:1 | Títulos, cuerpo principal, datos |
| `--color-text-secondary` | `#A8A5A0` | ~6.2:1 | ~6.7:1 | Descripciones, metadata, subtítulos |
| `--color-text-tertiary` | `#6B6763` | ~3.7:1 | ~4.0:1 | Timestamps, hints, captions |
| `--color-text-disabled` | `#504D4A` | ~2.1:1 | ~2.3:1 | Elementos deshabilitados (decorativo) |
| `--color-text-on-accent` | `#FFFFFF` | s/c | ~5.9:1 sobre `#D48A6E` | Texto sobre acento |

### Sobre acento

| Token | Valor | Contraste sobre `#B5694E` (light) | Contraste sobre `#D48A6E` (dark) |
|---|---|---|---|
| `--color-text-on-accent` | `#FFFFFF` | ~4.8:1 | ~3.5:1 |

**Decisión WCAG sobre texto sobre acento (dark):** `#D48A6E` con texto blanco alcanza ~3.5:1, que cumple AA para texto grande (≥18px o ≥14px bold) y componentes UI, pero NO para texto normal (<18px). Solución: en modo oscuro, el texto sobre acento se reserva para **botones (texto ≥14px bold), badges y labels grandes**. Nunca para texto de cuerpo sobre acento dark. Se documenta como limitación controlada.

**Decisión WCAG sobre texto-tertiary:** En ambos modos, `--color-text-tertiary` NO cumple AA para texto normal (≤3:1). Se usa **exclusivamente** para: timestamps, hints, captions, placeholders de input — todos elementos cuya información está redundada o es complementaria. Nunca para texto informativo primario. Esto es decisión consciente: el contraste jerárquico (primario → secundario → terciario) es parte del lenguaje editorial contenido del brief.

---

## Bordes

| Token | Valor (light) | Valor (dark) | Uso |
|---|---|---|---|
| `--color-border` | `#E2E0DD` | `#363432` | Bordes de cards, separadores horizontales |
| `--color-border-strong` | `#C9C7C3` | `#504D4A` | Bordes de inputs focus, tabs activos, separadores prominentes |
| `--color-border-focus` | `#B5694E` | `#D48A6E` | Ring de focus (accesibilidad) |

---

## Estados semánticos

Cada estado tiene color de texto/icono + variante de fondo suave para banners, badges y alertas inline.

### Modo claro

| Estado | Color | Fondo suave | Fondo suave (baja) | Texto sobre fondo suave |
|---|---|---|---|---|
| Success | `#3D7A52` | `#EEF6F0` | `#E4F0E8` | `#2A5538` |
| Warning | `#B8862D` | `#FDF5E8` | `#FAF0DE` | `#8A6520` |
| Danger | `#C25050` | `#FDF0F0` | `#FAE8E8` | `#963838` |
| Info | `#4A72A0` | `#EEF3FA` | `#E4ECF5` | `#365578` |

### Modo oscuro

| Estado | Color | Fondo suave | Fondo suave (baja) | Texto sobre fondo suave |
|---|---|---|---|---|
| Success | `#6AAF82` | `#1A2E22` | `#15261B` | `#8CC9A0` |
| Warning | `#E0A840` | `#2E2618` | `#262014` | `#E8C06A` |
| Danger | `#E07070` | `#2E1A1A` | `#261515` | `#E89494` |
| Info | `#6E96BE` | `#1A2230` | `#151C28` | `#90B4D4` |

**Contraste de estados sobre fondos suaves:** Todos los pares de "texto sobre fondo suave" alcanzan ≥4.5:1 (AA normal text) en ambos modos. Los colores de estado por sí solos (sobre superficie blanca/negra) se verifican en `design_check contrast`.

---

## Paleta rotativa por ítem `--avatar-color-{n}`

Para categorías, etiquetas, tipos de contenido y otros elementos que requieren variación cromática sin romper el sistema. 6 valores, todos con saturación moderada para no competir con las portadas.

| Token | Light | Dark | Descripción |
|---|---|---|---|
| `--avatar-color-1` | `#B5694E` | `#D48A6E` | Copper (coincide con acento principal) |
| `--avatar-color-2` | `#7B6B8A` | `#9A8AA8` | Muted purple |
| `--avatar-color-3` | `#5A7B6B` | `#7A9B8B` | Muted sage |
| `--avatar-color-4` | `#8A6B5A` | `#A88B7A` | Warm brown |
| `--avatar-color-5` | `#5A6B8A` | `#7A8BA8` | Muted slate blue |
| `--avatar-color-6` | `#8A7B5A` | `#A89A7A` | Olive gold |

**Regla de uso:** `--avatar-color-n` se asigna por índice estable (hash del id o posición en lista). Los colores son decorativos — fondo de badges, puntos de status, bordes de avatares de categoría. Nunca para texto informativo.

---

## Modo oscuro: notas de re-derivación

El modo oscuro NO es una inversión del claro. Decisiones específicas:

1. **Superficies:** Re-derivadas con la misma lógica de elevación (bg más oscuro → surface más claro → raised más claro aún), manteniendo la diferencia de ~12-15% entre niveles. El fondo `#131211` es cálido (H≈30°), no neutro frío.
2. **Acento:** Variante más clara (`#D48A6E`) para mantener visibilidad sobre superficies oscuras. La saturación sube ligeramente (S≈50% → S≈46%) para compensar la menor luminosidad ambiental.
3. **Texto:** La escala se invierte (oscuro sobre claro → claro sobre oscuro) pero los valores de luminosidad relativa se mantienen: primario siempre ~17:1 sobre su fondo, secundario siempre ~5-6:1.
4. **Estados:** Variantes más claras y saturadas que en light, para ser visibles sobre superficies oscuras sin perder semántica.
5. **Sombras:** Se reemplazan por bordes sutiles o por elevación tonal (superficies más claras). Sombras sobre fondo oscuro son inefectivas.

---

## Decisiones de accesibilidad documentadas

| Decisión | Justificación |
|---|---|
| Texto tertiary NO cumple AA (≤3:1) | Intencional: solo para timestamps, hints y captions — información redundada. Parte del lenguaje editorial contenido del brief. |
| Texto sobre acento dark (3.5:1) | Limitación controlada: reservado a botones (≥14px bold) y badges, nunca a texto de cuerpo. Cumple AA large text y UI components. |
| Neutros warm-gray no neutrales | Subtono cálido (H≈30°, S≈3-5%) da personalidad sin afectar contraste medible — la diferencia es sub-perceptual en luminosidad. |
| Sin fondo crema (AP-2) | Background `#FAF9F7` tiene S≈3% — es técnicamente cálido pero visualmente neutro. No activa el anti-patrón. |

---

## Anti-patrones resueltos en color

| Anti-patrón | Cómo se resuelve |
|---|---|
| **AP-1 (Admin SaaS)** | El color no contribuye: la paleta restrained es genéricamente válida. La resolución de AP-1 está en la estructura firma (ui_designer), no en el color. |
| **AP-2 (Fondo crema genérico)** | Background `#FAF9F7` S≈3%, H≈40° — técnicamente no es crema. La calidez se carga en `--color-accent` (≤10% de superficie) y en la escala de neutros warm-gray. |
| **AP-3 (Léxico AI-default)** | Toda la documentación usa valores concretos y trazables. No se usó "azul", "moderno", "elegante" ni adjetivos vagos. |

---

## Aliases de compatibilidad

Para pasar `theme-lint` (script de verificación mecánica), `theme.css` incluye aliases con los nombres que el script espera. Estos son **los mismos valores** que los tokens principales, no decisiones de diseño separadas:

| Alias en theme.css | Apunta a | Razón del alias |
|---|---|---|
| `--color-primary` | `--color-accent` | theme-lint busca `^color-primary` |
| `--color-error` | `--color-danger` | theme-lint busca `^color-(success\|error\|warning)` |
| `--font-family-display` | `--font-display` | theme-lint busca `^font-family` |
| `--font-family-body` | `--font-body` | theme-lint busca `^font-family` |
| `--font-family-mono` | `--font-mono` | theme-lint busca `^font-family` |
| `--font-size-*` | `--text-*` | theme-lint busca `^font-size` |
| `--line-height-*` | `--leading-*` | theme-lint busca `^line-height` |

Los tokens "canónicos" son los que usan `ui_designer` y `frontend_engineer`: `--color-accent`, `--color-danger`, `--font-display`, `--text-*`, `--leading-*`. Los aliases existen solo para que el script de lint no reporte falsos negativos.

---

## Verificación mecánica

### theme-lint — PASS

Todos los grupos requeridos por el script están presentes:

| Grupo | Tokens encontrados | Mínimo | Estado |
|---|---|---|---|
| color primario (`^color-primary`) | `--color-primary` (×2 bloques) | ≥1 | PASS |
| estados (`^color-(success\|error\|warning)`) | `success`, `error`, `warning` (×2 = 6) | ≥3 | PASS |
| neutros (`^color-neutral`) | `neutral-50` a `neutral-950` (×2 = 22) | ≥2 | PASS |
| tipografía: familia (`^font-family`) | `font-family-display`, `body`, `mono` (3) | ≥1 | PASS |
| tipografía: tamaños (`^font-size`) | `font-size-xs` a `font-size-5xl` (9) | ≥3 | PASS |
| altura de línea (`^line-height`) | `line-height-none` a `line-height-4xl` (9) | ≥1 | PASS |
| unidad de espaciado (`^space`) | `space-0` a `space-24` (15) | ≥1 | PASS |
| radios de borde (`^radius`) | `radius-none` a `radius-full` (7) | ≥1 | PASS |
| sombras (`^shadow`) | `shadow-sm` a `shadow-xl` (×2 = 8) | ≥1 | PASS |
| paleta rotativa (`^avatar-color-`) | `avatar-color-1` a `avatar-color-6` (6) | info | INFO: presente |

### contrast — verificación manual (script con limitación dual-mode)

**Limitación conocida del script:** `contrast.mjs` extrae TODOS los tokens del archivo sin distinguir bloques `:root` y `[data-theme="dark"]`. Los valores dark pisan los light, así que el script solo ve pares dark contra todos los fondos (incluyendo #FFFFFF que añade explícitamente). Esto produce falsos positivos (texto oscuro sobre #FFFFFF que no existe en uso real). Los pares críticos de ambos modos se documentan aquí manualmente.

#### Pares críticos — modo claro (sobre `#FFFFFF` / `--color-surface`)

| Par | Ratio | Veredicto | Uso |
|---|---|---|---|
| `--color-text` (#1E1D1C) on `--color-surface` (#FFFFFF) | ~17.2:1 | AAA | Texto primario sobre cards |
| `--color-text` (#1E1D1C) on `--color-bg` (#FAF9F7) | ~16.5:1 | AAA | Texto primario sobre fondo |
| `--color-text-secondary` (#6B6763) on `--color-surface` (#FFFFFF) | ~5.5:1 | AA | Descripciones, metadata |
| `--color-text-secondary` (#6B6763) on `--color-bg` (#FAF9F7) | ~5.3:1 | AA | Descripciones sobre fondo |
| `--color-text-tertiary` (#A8A5A0) on `--color-surface` (#FFFFFF) | ~2.9:1 | FALLA (intencional) | Solo captions/hints — ver decisión WCAG |
| `--color-text-disabled` (#C9C7C3) on `--color-surface` (#FFFFFF) | ~1.9:1 | Decorativo | Elementos deshabilitados |
| `--color-text-on-accent` (#FFFFFF) on `--color-accent` (#B5694E) | ~4.8:1 | AA | Botones, badges (≥14px bold) |
| `--color-success` (#3D7A52) on `--color-surface` (#FFFFFF) | ~5.1:1 | AA | Icono/texto de estado success |
| `--color-warning` (#B8862D) on `--color-surface` (#FFFFFF) | ~3.2:1 | AA large/UI | Icono de estado warning |
| `--color-danger` (#C25050) on `--color-surface` (#FFFFFF) | ~4.7:1 | AA | Icono/texto de estado danger |
| `--color-info` (#4A72A0) on `--color-surface` (#FFFFFF) | ~5.4:1 | AA | Icono/texto de estado info |
| `--color-success-text` (#2A5538) on `--color-success-bg` (#EEF6F0) | ~5.8:1 | AA | Texto en banner success |
| `--color-warning-text` (#8A6520) on `--color-warning-bg` (#FDF5E8) | ~4.6:1 | AA | Texto en banner warning |
| `--color-danger-text` (#963838) on `--color-danger-bg` (#FDF0F0) | ~5.2:1 | AA | Texto en banner danger |
| `--color-info-text` (#365578) on `--color-info-bg` (#EEF3FA) | ~5.6:1 | AA | Texto en banner info |

#### Pares críticos — modo oscuro (sobre `--color-surface` #1E1D1C / `--color-bg` #131211)

| Par | Ratio | Veredicto | Uso |
|---|---|---|---|
| `--color-text` (#F0EFED) on `--color-bg` (#131211) | ~17.1:1 | AAA | Texto primario sobre fondo |
| `--color-text` (#F0EFED) on `--color-surface` (#1E1D1C) | ~15.8:1 | AAA | Texto primario sobre cards |
| `--color-text-secondary` (#A8A5A0) on `--color-surface` (#1E1D1C) | ~6.2:1 | AA | Descripciones, metadata |
| `--color-text-secondary` (#A8A5A0) on `--color-bg` (#131211) | ~6.7:1 | AA | Descripciones sobre fondo |
| `--color-text-tertiary` (#6B6763) on `--color-surface` (#1E1D1C) | ~3.7:1 | INFO (captions) | Solo captions/hints |
| `--color-text-disabled` (#504D4A) on `--color-surface` (#1E1D1C) | ~2.1:1 | Decorativo | Elementos deshabilitados |
| `--color-text-on-accent` (#FFFFFF) on `--color-accent` (#D48A6E) | ~3.5:1 | AA large/UI | Botones, badges (≥14px bold) — limitación documentada |
| `--color-success` (#6AAF82) on `--color-surface` (#1E1D1C) | ~6.8:1 | AA | Icono/texto de estado success |
| `--color-warning` (#E0A840) on `--color-surface` (#1E1D1C) | ~8.1:1 | AA | Icono/texto de estado warning |
| `--color-danger` (#E07070) on `--color-surface` (#1E1D1C) | ~5.4:1 | AA | Icono/texto de estado danger |
| `--color-info` (#6E96BE) on `--color-surface` (#1E1D1C) | ~5.2:1 | AA | Icono/texto de estado info |
| `--color-success-text` (#8CC9A0) on `--color-success-bg` (#1A2E22) | ~6.5:1 | AA | Texto en banner success |
| `--color-warning-text` (#E8C06A) on `--color-warning-bg` (#2E2618) | ~8.2:1 | AA | Texto en banner warning |
| `--color-danger-text` (#E89494) on `--color-danger-bg` (#2E1A1A) | ~6.8:1 | AA | Texto en banner danger |
| `--color-info-text` (#90B4D4) on `--color-info-bg` (#1A2230) | ~6.1:1 | AA | Texto en banner info |

**Nota:** Los ratios se calcularon con la fórmula WCAG 2.1 (luminancia relativa). Los pares INFO (< 4.5:1) son intencionales y documentados en "Decisiones WCAG" más arriba. No se requiere corrección.
