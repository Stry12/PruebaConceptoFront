---
name: frontend-state-sync
description: Use when implementing or reviewing state shared across pages/components (auth session, current user, cross-page data), when a login/logout/mutation updates one component but not the rest of the app, or when writing hooks/composables/services that wrap state — prevents the "each consumer has its own local copy of the state" bug. Framework-agnostic: React, Angular, Vue, Svelte.
---

# Estado compartido entre componentes: la trampa de la copia local por consumidor

## El bug (ocurrió de verdad en este pipeline, en React — pero existe en todos los stacks)

`App` y `LoginPage` consumían `useAuth()` por separado. El hook guardaba el usuario en un `useState` **local a cada instancia**: al hacer login se actualizaba la copia de `LoginPage`, y la copia de `App` (que decide si mostrar login o la aplicación) nunca se enteraba. Síntoma: el login "funciona" pero la app no navega; el logout "funciona" pero la UI no reacciona.

**Regla general (independiente del framework):** cada mecanismo de estado local por consumidor — `useState` en un hook de React, `ref()` creado DENTRO de un composable de Vue, una variable de instancia en un componente Svelte, un servicio Angular provisto por-componente (`providers: []` en el decorador) — crea una copia NUEVA por cada consumidor. Si dos componentes necesitan ver el mismo valor, ese valor debe vivir **una sola vez** en un lugar compartido al que los consumidores se suscriben.

## Patrón correcto por stack (elige el idiomático, no mezcles)

| Stack | Dónde vive el estado compartido | Cómo se suscriben los consumidores |
|---|---|---|
| **React** | `Context.Provider` en el punto de composición (idiomático), pub/sub a nivel de módulo, o store (Zustand/Redux) | `useContext` dentro del hook / suscripción en `useEffect` |
| **Angular** | Servicio `providedIn: 'root'` (singleton) con `signal` o `BehaviorSubject` — NUNCA en `providers` de un componente si el estado es compartido | Inyección del servicio + `async` pipe / lectura del signal |
| **Vue** | `ref`/`reactive` declarado a NIVEL DE MÓDULO dentro del composable (fuera de la función), o Pinia | Llamar al composable — todos reciben la MISMA ref |
| **Svelte** | `writable`/`readable` store en un módulo, o runas `$state` en un `.svelte.ts` compartido | `$store` / importar el estado del módulo |

El fix aplicado en este proyecto (`core/hooks/use-auth.ts`) usa pub/sub a nivel de módulo: variable compartida + `Set` de suscriptores, el hook se suscribe en `useEffect` y las mutaciones notifican a todos. Funciona en cualquier stack con el mismo esquema; cuidado: es estado global de módulo — resetéalo entre tests.

## Checklist al escribir/revisar código que envuelve estado

- [ ] ¿Este valor lo consume más de un componente/página? Si sí, ¿el estado existe UNA sola vez (context, singleton, módulo, store) o una copia por consumidor (bug)?
- [ ] ¿Las mutaciones (login, create, updateStatus…) notifican a TODOS los consumidores, o solo actualizan la copia de quien las llamó?
- [ ] Sesión/usuario actual: ¿el shell de la app y los guards de ruta reaccionan al login/logout sin recargar la página?
- [ ] Listas compartidas entre pantallas (ej. cola OPD visible en recepción y en doctor): ¿una mutación en una pantalla se refleja en la otra al volver a ella?

## Cómo se detecta

Estáticamente es difícil (el código es válido en todos los frameworks); la señal más fiable es en **runtime** (`qa_verifier`, verificación funcional): ejecutar login y confirmar que la aplicación completa reacciona (redirección, navegación con el rol correcto), no solo la página del formulario. Ante el síntoma "la acción funciona pero la UI de otro componente no se entera", buscar la copia local por consumidor: `useState` dentro del hook compartido (React), `ref()` dentro del cuerpo del composable (Vue), servicio en `providers` del componente (Angular), estado no exportado desde módulo (Svelte).
