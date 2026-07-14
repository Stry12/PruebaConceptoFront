# Design System — Mi Biblioteca Multimedia

## Color Palette

### Primary
- Primary: #4338CA (Indigo profundo — confianza, profundidad)
- Primary Hover: #3730A3
- Primary Light: #EEF2FF

### Secondary
- Secondary: #F59E0B (Ámbar cálido — energía, descubrimiento)
- Secondary Hover: #D97706
- Secondary Light: #FFFBEB

### Neutrals (calientes, base parda sutil)
- Neutral 50: #FAFAF9 (fondo general)
- Neutral 100: #F5F5F4 (fondo de cards)
- Neutral 200: #E7E5E4 (bordes, separadores)
- Neutral 300: #D6D3D1 (bordes hover)
- Neutral 400: #A8A29E (iconos secundarios, placeholder)
- Neutral 500: #78716C (texto secundario, captions)
- Neutral 600: #57534E (texto cuerpo secundario)
- Neutral 700: #44403C (texto cuerpo principal)
- Neutral 800: #292524 (texto headings)
- Neutral 900: #1C1917 (texto alto contraste)

### States
- Success: #16A34A (completado, guardado)
- Success Light: #F0FDF4
- Error: #DC2626 (errores, eliminaciones)
- Error Light: #FEF2F2
- Warning: #D97706 (advertencias, pendientes con alerta)
- Warning Light: #FFFBEB
- Info: #2563EB (informativo, enlaces)
- Info Light: #EFF6FF

### Rotating Palette (avatars, type badges, category tags)
- Avatar 1: #7C3AED (violeta — creatividad, narrativa)
- Avatar 2: #2563EB (azul — confiabilidad, información)
- Avatar 3: #DB2777 (rosa — pasión, entretenimiento)
- Avatar 4: #16A34A (verde — crecimiento, aprendizaje)
- Avatar 5: #D97706 (ámbar — energía, descubrimiento)
- Avatar 6: #0891B2 (cian — frescura, audiovisual)

## Typography

- Font Family: Inter (Google Fonts)
- Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Scale
- Caption: 12px, weight 400, line-height 16px
- Body SM: 14px, weight 400, line-height 20px
- Body: 16px, weight 400, line-height 24px
- Body LG: 18px, weight 500, line-height 28px
- H3: 20px, weight 600, line-height 28px
- H2: 24px, weight 600, line-height 32px
- H1: 30px, weight 700, line-height 36px
- Display: 36px, weight 700, line-height 40px

## Spacing

- Base unit: 8px
- Space 1: 4px
- Space 2: 8px
- Space 3: 12px
- Space 4: 16px
- Space 5: 20px
- Space 6: 24px
- Space 8: 32px
- Space 10: 40px
- Space 12: 48px

## Border Radius

- SM: 4px (badges, tags)
- MD: 8px (cards, inputs, buttons)
- LG: 12px (modals, drawers)
- XL: 16px (avatars, featured covers)
- Full: 9999px (pill buttons, circular badges)

## Elevation / Shadows

- XS: 0 1px 2px rgba(28,25,23,0.04)
- SM: 0 2px 4px rgba(28,25,23,0.06), 0 1px 2px rgba(28,25,23,0.04)
- MD: 0 4px 8px rgba(28,25,23,0.08), 0 2px 4px rgba(28,25,23,0.04)
- LG: 0 8px 16px rgba(28,25,23,0.10), 0 4px 8px rgba(28,25,23,0.06)

## Visual Language

- Style: Minimalist editorial. Clean surfaces, generous whitespace, content-forward.
- Covers as protagonists: cover images are the dominant visual element. The interface respects them with sufficient space.
- Iconography: Outline/stroke icons only (1.5px stroke weight). No filled/solid icons. Style: Lucide or Phosphor.
- Interactions: Subtle transitions (150-200ms ease-out) on hover, focus, state changes. No flashy animations.
- Copy tone: Personal, approachable. "Mi biblioteca", not "Panel de administración".

## Prohibitions

1. NO stat-cards as main blocks on any screen
2. NO fixed sidebar navigation — use bottom bar (mobile) or horizontal topbar (desktop)
3. NO solid/filled icons — outline/stroke only
4. NO generic gradients on backgrounds, headers, or buttons
5. NO unstyled Bootstrap/Material default look
6. NO text over cover images without contrast overlay
7. NO buttons without contextual proximity to the content they affect
8. NO 3+ column layouts on mobile — stack to 1 column, max 2 columns for cards
