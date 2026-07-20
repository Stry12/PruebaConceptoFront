# Registros por proyecto

Un archivo `<slug-proyecto>.md` por proyecto que pasó por el loop de calidad. Lo escribe `art_director` en la consolidación (al cierre del loop, delegado por `orchestrator`). Append-only: si un proyecto se re-corre, se añade una sección nueva con fecha, no se reescribe la historia.

Plantilla:

```markdown
# <Nombre del proyecto> (<slug>)
- **Fecha:** <YYYY-MM-DD>
- **Vertical:** <fintech / salud / biblioteca multimedia / ...>
- **Arquetipo dominante:** <de archetypes.md>
- **Pantalla firma:** <slug> (<por qué se eligió>)

## Evolución de scores
| Iteración | Global | Grupo más débil | Veredicto |
|---|---|---|---|

## Directivas con mayor delta
<las 3-5 directivas del art_director que más subieron el score, con delta observado — verbatim>

## Prompts de edición exitosos
<los prompts de edit_screens que produjeron mejora, verbatim, con su delta>

## Soluciones rechazadas
<qué se intentó y no funcionó o el usuario rechazó, y por qué — evita repetirlo>

## Sistema de diseño aprobado (snapshot)
<resumen: paleta con hex, tipografías, spacing base, radios, decisión de layout memorable — suficiente para retrieval, no el theme.css completo>

## Lecciones candidatas
<observaciones de UNA ocurrencia — se promueven a heuristics.md / anti-patrones.md solo si reaparecen en otro proyecto>
```
