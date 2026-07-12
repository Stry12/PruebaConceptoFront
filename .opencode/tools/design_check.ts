import { tool } from "@opencode-ai/plugin"
import { spawnSync } from "node:child_process"
import { join } from "node:path"

const SCRIPTS: Record<string, string> = {
  contrast: "contrast.mjs",
  "theme-lint": "theme-lint.mjs",
}

export default tool({
  description:
    "Herramientas de decisión de diseño para la Fase 2 de ui_designer, ejecutables sin bash. " +
    "'contrast': calcula el contraste WCAG 2.1 de cada token de color de primer plano contra cada fondo del theme " +
    "y marca los pares que no alcanzan AA (4.5:1 texto normal, 3:1 texto grande/componentes) — úsalo ANTES de pedir " +
    "la aprobación de la paleta, y de nuevo tras cualquier corrección de color. " +
    "'theme-lint': verifica que theme.css defina todos los grupos de tokens que frontend_engineer necesita " +
    "(primario, estados, neutros, tipografía, espaciado, radios, sombras, paleta rotativa si aplica) — " +
    "úsalo antes de cerrar la Fase 2 para no entregar un theme incompleto.",
  args: {
    check: tool.schema
      .enum(["contrast", "theme-lint"])
      .describe("Qué verificación de diseño ejecutar."),
    css: tool.schema
      .string()
      .optional()
      .describe(
        "Ruta del archivo de theme a verificar. Por defecto .opencode/artifacts/design/theme.css."
      ),
  },
  async execute(args, context) {
    const script = join(context.directory, ".opencode", "scripts", "audit", SCRIPTS[args.check])
    const argv = [script]
    if (args.css) argv.push(join(context.directory, args.css))
    const res = spawnSync(process.execPath, argv, {
      cwd: context.directory,
      encoding: "utf8",
      timeout: 60_000,
    })
    if (res.error) return `Error al ejecutar la verificación: ${res.error.message}`
    const out = `${res.stdout ?? ""}${res.stderr ?? ""}`.trim()
    return `${out}\n\n[exit code: ${res.status}]`
  },
})
