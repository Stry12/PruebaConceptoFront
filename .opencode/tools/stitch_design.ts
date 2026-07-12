import { tool } from "@opencode-ai/plugin"
import { readFileSync } from "node:fs"
import { join } from "node:path"

// Llama al MCP de Stitch por HTTP directo, evitando la capa de validación del
// cliente MCP (que rechaza los esquemas con $defs/$ref de las tools de design
// system con "invalid argument" aunque los valores sean correctos).
async function stitchCall(directory: string, toolName: string, args: unknown) {
  const cfg = JSON.parse(readFileSync(join(directory, "opencode.json"), "utf8"))
  const stitch = cfg?.mcp?.stitch
  if (!stitch?.url || !stitch?.headers?.["X-Goog-Api-Key"]) {
    return "Error: no se encontró la configuración del MCP `stitch` (url + X-Goog-Api-Key) en opencode.json."
  }
  const res = await fetch(stitch.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "X-Goog-Api-Key": stitch.headers["X-Goog-Api-Key"],
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name: toolName, arguments: args },
    }),
  })
  const text = await res.text()
  if (!res.ok) return `HTTP ${res.status}: ${text.slice(0, 1500)}`
  try {
    const json = JSON.parse(text)
    if (json.error) return `Error MCP: ${JSON.stringify(json.error).slice(0, 1500)}`
    const content = json.result?.content?.map((c: any) => c.text).join("\n") ?? text
    return content.slice(0, 4000)
  } catch {
    return text.slice(0, 4000)
  }
}

export const create_design_system = tool({
  description:
    "Crea un design system en un proyecto de Stitch vía HTTP directo. Úsala cuando la tool MCP " +
    "`stitch_create_design_system` falle con 'invalid argument' pese a valores correctos (bug conocido " +
    "de validación del cliente con esquemas $ref). Devuelve el id `assets/<id>` que debe registrarse en " +
    "screens.md y pasarse como `designSystem` en cada generate_screen_from_text.",
  args: {
    projectId: tool.schema.string().describe("ID del proyecto Stitch, sin el prefijo projects/"),
    displayName: tool.schema.string().describe("Nombre del design system"),
    customColor: tool.schema.string().describe("Color primario/seed en hex, ej. #2563A0"),
    headlineFont: tool.schema.string().describe("Fuente de headings, enum de Stitch, ej. INTER"),
    bodyFont: tool.schema.string().describe("Fuente de cuerpo, enum de Stitch, ej. INTER"),
    roundness: tool.schema
      .enum(["ROUND_TWO", "ROUND_FOUR", "ROUND_EIGHT", "ROUND_TWELVE", "ROUND_FULL"])
      .describe("Radio de esquinas"),
    colorMode: tool.schema.enum(["LIGHT", "DARK"]).describe("Modo de color"),
    colorVariant: tool.schema
      .enum(["MONOCHROME", "NEUTRAL", "TONAL_SPOT", "VIBRANT", "EXPRESSIVE", "FIDELITY", "CONTENT"])
      .optional()
      .describe("Variante del sistema de color dinámico (opcional)"),
    designMdFile: tool.schema
      .string()
      .optional()
      .describe(
        "Ruta (relativa a la raíz del proyecto) de un archivo markdown con las guías de diseño, " +
          "ej. .opencode/artifacts/design/DESIGN.md — se lee del disco y se envía como designMd; " +
          "NUNCA pegues el contenido a mano ni lo codifiques tú"
      ),
    updateAssetName: tool.schema
      .string()
      .optional()
      .describe(
        "Si se pasa (formato assets/<id>), hace update_design_system sobre ese asset en vez de crear uno nuevo"
      ),
  },
  async execute(args, context) {
    const theme: Record<string, unknown> = {
      colorMode: args.colorMode,
      customColor: args.customColor,
      headlineFont: args.headlineFont,
      bodyFont: args.bodyFont,
      roundness: args.roundness,
    }
    if (args.colorVariant) theme.colorVariant = args.colorVariant
    if (args.designMdFile) {
      try {
        theme.designMd = readFileSync(join(context.directory, args.designMdFile), "utf8")
      } catch (e: any) {
        return `Error leyendo ${args.designMdFile}: ${e.message}`
      }
    }
    const designSystem = { displayName: args.displayName, theme }
    if (args.updateAssetName) {
      return stitchCall(context.directory, "update_design_system", {
        name: args.updateAssetName,
        projectId: args.projectId,
        designSystem,
      })
    }
    return stitchCall(context.directory, "create_design_system", {
      projectId: args.projectId,
      designSystem,
    })
  },
})

export const upload_design_md = tool({
  description:
    "Sube un DESIGN.md a un proyecto de Stitch codificándolo a base64 desde el archivo en disco. " +
    "SIEMPRE usa esta tool en vez de la MCP `stitch_upload_design_md` directa: el base64 debe calcularse " +
    "programáticamente — un modelo no puede generarlo a mano sin corromper el contenido.",
  args: {
    projectId: tool.schema.string().describe("ID del proyecto Stitch, sin el prefijo projects/"),
    designMdFile: tool.schema
      .string()
      .describe("Ruta relativa del markdown, ej. .opencode/artifacts/design/DESIGN.md"),
  },
  async execute(args, context) {
    let designMdBase64: string
    try {
      const buf = readFileSync(join(context.directory, args.designMdFile))
      designMdBase64 = buf.toString("base64")
    } catch (e: any) {
      return `Error leyendo ${args.designMdFile}: ${e.message}`
    }
    return stitchCall(context.directory, "upload_design_md", {
      projectId: args.projectId,
      designMdBase64,
    })
  },
})
