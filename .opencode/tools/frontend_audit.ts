import { tool } from "@opencode-ai/plugin"
import { spawnSync } from "node:child_process"
import { join } from "node:path"

const SCRIPTS: Record<string, string> = {
  all: "run-all.mjs",
  css: "css-duplication.mjs",
  routes: "route-reachability.mjs",
  handlers: "handler-wiring.mjs",
  implied: "implied-screens.mjs",
  tokens: "token-fidelity.mjs",
  registry: "registry-sync.mjs",
  layers: "unlayered-css.mjs",
}

export default tool({
  description:
    "Ejecuta las auditorías mecánicas del frontend y devuelve el reporte con veredicto PASS/FAIL. " +
    "Checks: 'css' (duplicación de estilos entre páginas y patrones que deberían ser componentes compartidos), " +
    "'routes' (rutas huérfanas sin entrada de navegación), " +
    "'handlers' (modales/botones de escritura que no invocan ningún servicio), " +
    "'implied' (texto tipo 'Olvidaste tu contraseña'/'Notificaciones'/'Configuración' que implica una pantalla propia — " +
    "úsala con `path` apuntando a `.opencode/artifacts/design/screens` para chequear mockups de Stitch, o sin `path` " +
    "para chequear el código ya construido, donde además marca los que no tienen ningún destino real), " +
    "'tokens' (valores hex hardcodeados que ya tienen token en global.css), " +
    "'registry' (componentes fantasma: registrados en frontend-architecture.md pero inexistentes en el código), " +
    "'layers' (CSS sin @layer que anula las utilidades de Tailwind v4 — ej. un reset global * {margin:0;padding:0}), " +
    "'all' (todas menos 'implied' contra mockups, que es un chequeo aparte). Son la versión ejecutable de las " +
    "auditorías de frontend_engineer/ui_designer: un FAIL debe corregirse o justificarse antes de dar una pantalla por terminada.",
  args: {
    check: tool.schema
      .enum(["all", "css", "routes", "handlers", "implied", "tokens", "registry", "layers"])
      .describe("Qué auditoría ejecutar. Usa 'all' para el veredicto completo."),
    root: tool.schema
      .string()
      .optional()
      .describe(
        "Directorio del proyecto a auditar (relativo al workspace o absoluto). " +
          "Por defecto el workspace; útil cuando la app vive en un subdirectorio (ej. 'hospital-frontend') " +
          "o para auditar otro proyecto."
      ),
    path: tool.schema
      .string()
      .optional()
      .describe(
        "Solo para check:'implied'. Ruta explícita a escanear en vez de pagesDir/componentsDir del proyecto " +
          "(ej. '.opencode/artifacts/design/screens' para auditar los mockups de Stitch antes de construir el código)."
      ),
  },
  async execute(args, context) {
    const script = join(context.directory, ".opencode", "scripts", "audit", SCRIPTS[args.check])
    const rootArgs = args.root ? ["--root", join(context.directory, args.root)] : []
    const pathArgs = args.path ? [join(context.directory, args.path)] : []
    const res = spawnSync(process.execPath, [script, ...rootArgs, ...pathArgs], {
      cwd: context.directory,
      encoding: "utf8",
      timeout: 60_000,
    })
    if (res.error) return `Error al ejecutar la auditoría: ${res.error.message}`
    const out = `${res.stdout ?? ""}${res.stderr ?? ""}`.trim()
    return `${out}\n\n[exit code: ${res.status}]`
  },
})
