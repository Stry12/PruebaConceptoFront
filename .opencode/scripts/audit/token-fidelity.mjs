// Auditoría: fidelidad de tokens. Detecta valores hex hardcodeados en estilos
// de páginas/componentes que YA tienen un token equivalente (deberían usar
// var(--token) o la variable del stack). Los hex sin token se reportan como
// INFO: pueden ser literales de Stitch preservados a propósito.
// Multi-stack: CSS/SCSS/LESS y <style> de Vue/Svelte. La fuente de tokens es el
// archivo global del proyecto (autodetectado o audit.config.json); si no
// existe, cae al theme.css de artifacts.
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { config, styleSources, read, rel, opencodeDir, report, finish, skip } from './lib.mjs';

const { srcDir, tokensFile } = config();
if (!srcDir) skip('Fidelidad de tokens', 'No se encontró directorio de código fuente — proyecto aún no generado, nada que auditar.');

const oc = opencodeDir();
const artifactTheme = oc ? join(oc, 'artifacts', 'design', 'theme.css') : null;
const source = tokensFile ?? (artifactTheme && existsSync(artifactTheme) ? artifactTheme : null);
if (!source) skip('Fidelidad de tokens', 'No se encontró archivo de tokens (ni en el proyecto ni en artifacts/design/theme.css) — nada que auditar.');

// Tokens: custom properties CSS y variables SCSS ($nombre: #hex).
const tokenByHex = new Map();
const tokensContent = read(source);
for (const m of tokensContent.matchAll(/(?:--|\$)([\w-]+):\s*(#[0-9a-fA-F]{3,8})\b/g)) {
  const hex = m[2].toLowerCase();
  if (!tokenByHex.has(hex)) tokenByHex.set(hex, []);
  tokenByHex.get(hex).push(m[1]);
}
if (tokenByHex.size === 0) skip('Fidelidad de tokens', `${rel(source)} no define tokens de color — nada que comparar.`);

const findings = [];
const literals = new Map(); // hex → count (sin token)

for (const { file, content, baseLine } of styleSources(srcDir)) {
  if (file === source) continue;
  for (const m of content.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    const hex = m[0].toLowerCase();
    const tokens = tokenByHex.get(hex);
    const line = baseLine + content.slice(0, m.index).split('\n').length;
    if (tokens) {
      findings.push(`${rel(file)}:${line} — ${m[0]} hardcodeado; usar el token "${tokens[0]}".`);
    } else {
      literals.set(hex, (literals.get(hex) || 0) + 1);
    }
  }
}

const infos = [...literals.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .map(
    ([hex, count]) =>
      `${hex} usado ${count} vez/veces sin token — válido si es un literal de Stitch preservado; si se repite mucho, candidato a token nuevo.`
  );
infos.push(`Fuente de tokens: ${rel(source)} (${tokenByHex.size} colores).`);

finish(report('Fidelidad de tokens (hex hardcodeados)', findings, infos));
