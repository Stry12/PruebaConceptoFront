---
name: unwired-ui
description: Use when checking which UI controls lack real functionality (decorative buttons, modals that only close, fake success toasts, handlers without service calls), when triaging frontend_audit "handlers" findings, or when adding functionality that the Stitch screens didn't cover — growing the app from shared components and theme tokens instead of leaving hollow buttons. Framework-agnostic: applies to React, Angular, Vue, Svelte, TS or JS.
---

# UI sin cablear: detectarla y hacerla crecer desde la base

Una pantalla "terminada" con botones que no hacen nada es el defecto más engañoso del pipeline: compila, pasa el build, se ve idéntica al diseño… y miente al usuario. Esta skill cubre cómo encontrar esos huecos y qué hacer con cada uno, **en cualquier stack** (React, Angular, Vue, Svelte, TS/JS — la auditoría reconoce la sintaxis de los cuatro).

## Detección: `frontend_audit` con `check: "handlers"`

La auditoría detecta 4 clases de hueco (en orden de gravedad). "Handler de click" significa `onClick` (React/JSX), `@click` (Vue), `(click)` (Angular) o `on:click` (Svelte); "servicio" significa cualquier `*Service.método()`, `this.xService.método()`, mutador de hook/composable, `emit`/`dispatch` o navegación:

| Clase | Ejemplo real ocurrido (React, pero la clase es universal) | Señal en cualquier stack |
|---|---|---|
| **Éxito falso** | "Guardar Receta" cerraba el modal y hacía `addToast('success', …)` sin llamar a ningún servicio | Notificación de éxito (toast/snackbar/MatSnackBar/notify) sin invocación de servicio en el mismo handler. Las notificaciones NO cuentan como acción |
| **Handler decorativo** | `handleSave()` de Configuración: solo mostraba el toast | Función/método `handleX`/`onX` (const, function o método de clase) sin servicio, emit ni navegación |
| **Botón sin handler** | "Ver Perfil", "Ver todo", "Generar Reporte" con `cursor-pointer` pero sin click | Botón sin handler de click ni `type="submit"` dentro de un form con submit real |
| **Confirmación que solo cierra** | Botón de confirmación con `onClick={() => setShow(false)}` / `@click="show = false"` / `(click)="show = false"` | Cierra el modal sin acción; "Cancelar"/"Cerrar" y variantes secondary/outline/ghost están exentos |

Interpretación: cada WARN se **cablea o se justifica por escrito** — nunca se elimina el control para "limpiar" la auditoría, y nunca se deja una notificación de éxito sin acción real detrás.

## Remediación: crecer desde la base, no quedarse en lo básico

El diseño de Stitch solo cubre lo que se generó; la app real necesita más. Orden de decisión para cablear un hueco (los nombres de carpeta son los del proyecto; el rol es lo fijo):

1. **¿Existe ya el contrato?** (interfaz/puerto en `core/interfaces/` o equivalente) → cablear el handler al método del servicio a través del punto de composición del stack (provider/context en React, servicio inyectado por DI en Angular, `provide/inject` o composable en Vue, context/store en Svelte). Es el caso "Guardar Receta": `IPrescriptionService.create()` ya existía, solo faltaba llamarlo.
2. **¿El contrato existe pero le falta el método?** → añadir el método a la interfaz + implementarlo en el servicio dummy (con mutación real de los datos mock) + cablear. Ej.: `changePassword` en `IAuthService`.
3. **¿No existe la entidad?** (ej. Configuración del sistema) → crear el ciclo completo desde la base: interfaz → servicio dummy → registro en el punto de composición → cablear. El dominio (`domain.md`) manda: si la entidad no está en el dominio, reportar al `orchestrator` antes de inventarla.
4. **¿Es navegación?** (ej. "Ver Perfil") → conectar a la ruta existente del inventario de `ux-flow.md` con el router del stack; si la vista destino no existe, es un hallazgo para el pipeline de diseño, no un TODO silencioso.

**La UI nueva se compone SIEMPRE desde la base existente**: los componentes compartidos del proyecto (Modal/Dialog, ConfirmDialog, Input, Select, Toast/Snackbar… vivan en `shared/components/`, `src/app/shared/` o `src/lib/components/`) + los tokens de `theme.css` (o el theme nativo del stack generado desde él). Nunca estilos nuevos inventados ni colores fuera de la paleta — así lo que crece más allá de Stitch sigue siendo visualmente indistinguible de lo aprobado. Si hace falta un patrón que no existe como componente, se construye una vez en la carpeta de componentes compartidos (desde tokens) y se registra en `frontend-architecture.md`, no se maqueta ad-hoc en la página.

## Verificación

- Estática: `frontend_audit check:"handlers"` debe quedar en PASS (o con justificaciones escritas). Acepta `root` si la app vive en un subdirectorio.
- Runtime (`qa_verifier`): ejecutar la acción y confirmar efecto observable — una notificación de éxito NO es efecto observable; la fila nueva en la tabla, el contador que cambia o el dato persistido sí.
