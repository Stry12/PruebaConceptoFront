# Biblioteca de patterns de diseño

Un archivo por pattern reutilizable, nombrado `<arquetipo-o-tipo>--<vertical>.md` (ej. `biblioteca-contenido--media.md`, `dashboard--fintech.md`, `wizard-importacion--general.md`). Los escribe y actualiza `art_director` en la consolidación, a partir de diseños APROBADOS (nunca de intentos rechazados — esos van a `anti-patrones.md` o a "soluciones rechazadas" del proyecto).

Cobertura esperada a medida que crece: landing, dashboard, auth, onboarding, perfil, pricing, analítica, navegación móvil, tablas, formularios, empty states, error states, settings, búsqueda, checkout — por vertical (SaaS, IA, e-commerce, fintech, salud, educación...) cuando el vertical cambie el pattern.

Plantilla:

```markdown
# <Nombre del pattern>
- **Arquetipo:** <de stitch-prompt-crafter/reference/archetypes.md>
- **Vertical:** <o "general">
- **Proyectos de origen:** <slugs con fecha>
- **Score típico:** <rango observado en la rúbrica, ej. "global 88-93; débil en Originalidad">
- **Screenshot:** <ruta a captura si existe, ej. copiada de art-direction/shots/ — opcional>

## Estructura de layout
<el esqueleto: zonas, proporciones, navegación — en el nivel de la "estructura firma" de ux-flow.md>

## Tokens que funcionaron
<decisiones de color/tipografía/spacing/radio trazables al theme.css aprobado>

## Jerarquía de componentes
<qué componentes lo componen y en qué orden de dominancia visual>

## Racional UX
<por qué este layout sirve a la tarea — trazado a leyes de UX o heurísticas cuando aplique>

## Notas de accesibilidad
<pares de contraste validados, tamaños mínimos, decisiones WCAG documentadas>

## Cuándo usarlo / cuándo no
<casos de uso recomendados y contraindicaciones>
```
