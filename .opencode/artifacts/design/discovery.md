# Fase 1 — Descubrimiento y Requerimientos

## Propósito y problema central

**Mi Biblioteca Multimedia** es una aplicación web para centralizar toda la información de contenido multimedia que una persona ha consumido, está consumiendo o desea consumir. Resuelve el problema real de:

- Olvidar dónde se obtuvo cada contenido.
- No saber qué ya se consumió y qué queda pendiente.
- No tener un lugar único que cruce libros, películas, series, manga, podcasts, cursos, etc.
- No poder recomendar ni reencontrar contenido con eficiencia.

## Público objetivo

- **Quién**: Personas consumidoras de contenido digital variado (20–50 años, perfil variado, no-técnico).
- **Contexto de uso**: Uso casual y frecuente — rápido acceso desde el móvil o el escritorio, momentos de ocio o decisión ("¿qué veo ahora?").
- **Nivel técnico**: Bajo. La interfaz debe ser intuitiva sin curva de aprendizaje.
- **Expectativa**: rapidez, simplicidad, que "se sienta como algo propio".

## Plataforma(s)

- **Web responsiva**: funciona bien en desktop (≥1024px) y móvil (≥375px). Se privilegia mobile-first por el patrón de uso esperado (consultas rápidas desde el celular).

## Roles (MVP)

| Rol | Capacidad |
|---|---|
| **Usuario regular** | Consulta, agrega, edita, organiza su biblioteca. Busca, filtra, crea colecciones/listas, marca favoritos. |
| **Administrador** | Todo lo anterior + CRUD completo sobre items, carga masiva vía planilla, revisión previa a incorporación, prevención de duplicados. |

> **Decisión MVP**: se implementa un solo usuario por defecto con un switch de rol para demostración. No hay autenticación multi-tenant.

## Restricciones conocidas

- Sin dependencia de servicios externos de autenticación (MVP).
- Sin backend real declarado aún — la interfaz debe estar desacoplada y asumir un mock/API genérica.
- Búsqueda debe ser rápida ante miles de items (sin degradación visible).
- El contenido es heterogéneo: no todos los tipos soportan los mismos campos (ej. un podcast no tiene "páginas"), pero la interfaz debe ser homogénea y no confusa por eso.

## Contexto relevante para UX

- **El objeto central** es el **MediaItem** — es lo que el usuario busca, filtra, ordena, consume y compara. La interfaz debe poner el contenido al frente, no la navegación.
- **Los filtros son críticos**: el usuario pasará más tiempo buscando/filtrando que navegando árboles de menú. Los filtros deben ser combinables, visibles y de un toque.
- **Las portadas dan vida visual**: las imágenes de portada son el principal diferenciador visual entre items. La interfaz debe hacerlas protagonistas sin sacrificar funcionalidad.
- **El estado es la información más útil**: "lo que estoy viendo ahora", "lo que tengo pendiente", "lo que me gustó" — estas preguntas deben responderse con un vistazo.
- **El admin necesita eficiencia**: carga masiva, prevención de duplicados, edición rápida. La interfaz admin no debe ser más compleja de lo necesario.

---

**¿Confirmas que este resumen refleja correctamente el alcance del proyecto? ¿Algo que agregar o corregir antes de pasar a la Fase 2 (estrategia visual)?**
