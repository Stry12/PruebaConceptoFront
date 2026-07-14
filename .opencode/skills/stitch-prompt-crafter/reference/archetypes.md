# Arquetipos de producto → estructura firma (derivación, no invención)

La estructura firma de la Fase 3 NO es un ejercicio creativo abierto: se **deriva** clasificando el producto (y el rol de cada pantalla) contra esta tabla. La creatividad del diseñador opera en la decisión memorable y en la estética — el esqueleto se hereda del arquetipo. El default "admin SaaS" deja de ser el punto de reposo: para usarlo hay que haber clasificado la pantalla en un arquetipo que lo pida.

## Procedimiento de clasificación (Fase 3, antes del inventario)

1. **Identifica el objeto central** desde `domain.md` y `discovery.md`: ¿qué mira/manipula el usuario el 80% del tiempo? (No "qué gestiona el sistema" — qué MIRA la persona.)
2. **Clasifica el producto** en un arquetipo primario. Los productos compuestos se clasifican **por rol de pantalla**: un sistema clínico puede ser `registros` en sus listados, `agenda` en citas y `analítica` en reportes — cada pantalla hereda el esqueleto de SU rol, no todas el del producto.
3. **Deriva la estructura firma**: objeto central + topología del arquetipo + referentes (los de la tabla, sustituibles por mejores del dominio concreto) + **una decisión memorable** (la única parte creativa: una frase, con lo que prohíbe incluido).
4. **Pregunta al usuario SOLO ante ambigüedad real**: dos arquetipos encajan con peso similar, o ninguno encaja. Ese es el único caso en que la decisión de esqueleto sube al humano; en el resto, la estructura firma llega a la aprobación de Fase 3 ya derivada y justificada.

## Tabla de arquetipos

### 1. Registros / CRUD administrativo (ERP, back-office, RRHH, inventario)
- **Objeto central**: el registro individual y su estado.
- **Esqueleto**: tabla densa de ancho completo o maestro-detalle; sidebar de navegación legítima.
- **Referentes**: Linear, Airtable, un ERP bien hecho (Epic para clínico).
- **Prohibido**: stat-cards en pantallas de listado salvo que la jerarquía de Fase 3 las pida explícitamente; cards-grid para datos tabulares.
- **¿Default SaaS?**: la tabla+sidebar SÍ; la fila de métricas NO (eso es del arquetipo analítica).

### 2. Analítica / BI (dashboards de métricas, reporting)
- **Objeto central**: la métrica y su tendencia.
- **Esqueleto**: data-first — stat-cards, gráficos, bento grid de widgets. **Único arquetipo donde la fila de stat-cards ES el punto.**
- **Referentes**: Grafana, Stripe Dashboard, Amplitude.
- **Prohibido**: métricas decorativas sin acción asociada; gráficos como relleno.

### 3. Biblioteca de contenido / medios (catálogos personales, galerías, streaming)
- **Objeto central**: la portada/artwork.
- **Esqueleto**: estanterías de scroll horizontal por colección, grid de portadas grandes, browsing visual; la navegación puede ser mínima (tabs/topbar).
- **Referentes**: Plex, Letterboxd, Spotify.
- **Prohibido**: stat-cards, "actividad reciente" en tabla, sidebar de admin — si la pantalla parece un panel de control, está mal clasificada.

### 4. E-commerce / catálogo de productos
- **Objeto central**: el producto (imagen + precio).
- **Esqueleto**: grid de producto con imagen dominante + ficha de producto (PDP) con jerarquía imagen → precio → CTA; filtros laterales o en topbar.
- **Referentes**: los líderes del vertical concreto (moda ≠ ferretería — elegir del dominio).
- **Prohibido**: tablas de productos; dashboard de tienda en la cara del comprador.

### 5. Mensajería / comunicación (chat, inbox, soporte)
- **Objeto central**: la conversación.
- **Esqueleto**: split-screen lista-de-hilos / conversación activa; el compositor siempre visible.
- **Referentes**: Slack, Intercom, Linear (triage).
- **Prohibido**: paginación de mensajes; métricas en la vista de conversación.

### 6. Agenda / reservas / planificación (citas, turnos, recursos)
- **Objeto central**: el bloque de tiempo.
- **Esqueleto**: calendar-first (semana/día como vista principal); la lista es vista secundaria, no la principal.
- **Referentes**: Google Calendar, Cal.com, Calendly.
- **Prohibido**: que la vista principal sea una tabla de citas — el tiempo se ve espacialmente.

### 7. Feed social / comunidad
- **Objeto central**: la publicación.
- **Esqueleto**: stream vertical de una columna con jerarquía autor → contenido → acciones; composición accesible arriba o flotante.
- **Referentes**: Twitter/X, LinkedIn feed, Discourse.
- **Prohibido**: grid de posts como cards uniformes; sidebar administrativa.

### 8. Editor / herramienta de creación (canvas, documentos, diseño, código)
- **Objeto central**: el lienzo/documento en edición.
- **Esqueleto**: canvas dominante (≥80% del viewport), chrome mínimo y colapsable, paneles contextuales.
- **Referentes**: Figma, Notion, VS Code.
- **Prohibido**: robarle viewport al lienzo con navegación permanente; dashboard como pantalla de inicio si el usuario viene a editar.

### 9. Formularios / trámites / flujo guiado (onboarding, solicitudes, checkout)
- **Objeto central**: el paso actual del proceso.
- **Esqueleto**: wizard/stepper de una columna, un grupo de decisión por paso, progreso visible; sin navegación lateral que invite a escapar.
- **Referentes**: Typeform, checkout de Stripe, Turbotax.
- **Prohibido**: el formulario-sábana de 30 campos; sidebar completa durante el flujo.

### 10. Lectura / longform / documentación
- **Objeto central**: el texto.
- **Esqueleto**: columna de lectura de 65-75ch, TOC lateral discreto, jerarquía tipográfica dominante.
- **Referentes**: Stripe Docs, Medium, gov.uk.
- **Prohibido**: cards para fragmentar el contenido; densidad de dashboard.

### 11. Operaciones geoespaciales / tiempo real (tracking, logística, monitoreo)
- **Objeto central**: el mapa o el estado vivo.
- **Esqueleto**: mapa/visualización dominante + panel lateral de detalle contextual; las listas son overlays, no páginas.
- **Referentes**: Uber (ops), Flightradar24, Samsara.
- **Prohibido**: enterrar el mapa detrás de una tabla.

### 12. Landing / campaña (registro marketing siempre)
- **Objeto central**: la promesa (mensaje + prueba).
- **Esqueleto**: stack narrativo en jerarquía Z: hero (mensaje + un CTA primario) → prueba social → beneficios → objeciones → CTA final. Sin chrome de aplicación.
- **Referentes**: Linear (landing), Stripe, Vercel.
- **Prohibido**: sidebar o densidad de dashboard; más de un CTA primario por viewport; hero que describe features en vez de la promesa.

### 13. Pricing / planes (registro marketing siempre)
- **Objeto central**: la comparación de planes.
- **Esqueleto**: 2-4 columnas de plan con el recomendado visualmente destacado, tabla comparativa debajo, FAQ al cierre.
- **Referentes**: Stripe, Notion, Figma (pricing).
- **Prohibido**: planes visualmente idénticos (sin recomendado); esconder el precio o la letra pequeña detrás de interacciones.

### 14. Onboarding / activación / paywall (registro marketing siempre)
- **Objeto central**: el siguiente paso único.
- **Esqueleto**: pariente del arquetipo 9 (wizard de foco único) pero con narrativa de valor: cada paso muestra el beneficio antes de pedir el dato; progreso visible; salidas discretas pero presentes.
- **Referentes**: Duolingo, Superhuman, Headspace.
- **Prohibido**: pedir datos antes de mostrar valor; formulario-sábana; ocultar el "saltar" cuando existe.

## Registro de pantalla (`producto` | `marketing`)

Además del arquetipo, cada pantalla del inventario de Fase 3 lleva un **registro**, que resuelve por pantalla la tensión "que venda ↔ que se use bien" (no se resuelve en abstracto a nivel de producto):

- **`producto`**: el diseño sirve a la tarea; el usuario ya está dentro y la retención viene de la usabilidad. Éxito = eficiencia, claridad, cero fricción. **Audacia 1-3.** Lente de auditoría: `impeccable reference/product.md`.
- **`marketing`**: el diseño persuade; el usuario está decidiendo si entra, paga o activa. Éxito = jerarquía persuasiva (promesa → prueba → CTA). **Audacia 3-5.** Lente de auditoría: `impeccable reference/brand.md`.

Los arquetipos 12-14 son siempre `marketing`. Cualquier otro arquetipo puede contener pantallas `marketing` puntuales — un empty state que invita a activar una función, una pantalla de upgrade dentro de una app `producto`. El registro viaja en el ScreenBrief y fija el rango del dial de audacia.

## Regla de cierre

Si tras clasificar una pantalla el esqueleto resultante coincide con el default `sidebar + stat-cards + grid/tabla`, tiene que ser porque su rol es `registros` (tabla, sin stat-cards) o `analítica` (stat-cards, porque son el contenido). Cualquier otra llegada a ese esqueleto es el prior de Stitch hablando — reclasifica. Y a la inversa: no fuerces originalidad donde el arquetipo pide convención (un calendario debe parecer un calendario); la diferenciación vive en la decisión memorable y en la estética de Fase 2, no en romper el patrón que el usuario ya sabe usar.
