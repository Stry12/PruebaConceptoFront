// Auditoría: CSS sin capa que anula las utilidades de Tailwind v4.
// En Tailwind v4 las utilidades viven en @layer utilities, y CUALQUIER regla
// sin capa les gana en la cascada sin importar especificidad. Un reset global
// (* { margin: 0; padding: 0 }) fuera de @layer anula todos los paddings y
// márgenes de utilidades de la app entera — este defecto ya ocurrió en la
// práctica y es invisible para tsc/build. Solo aplica si el proyecto usa Tailwind.
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { config, walk, read, rel, STYLE_EXTS, ROOT, report, finish, skip } from './lib.mjs';

const { srcDir } = config();
if (!srcDir) skip('CSS sin capa vs Tailwind', 'No se encontró directorio de código fuente — nada que auditar.');

// ¿El proyecto usa Tailwind? (dependencia declarada o @import "tailwindcss")
const styleFiles = walk(srcDir, STYLE_EXTS);
let usesTailwind = styleFiles.some((f) => /@import\s+["']tailwindcss["']/.test(read(f)));
if (!usesTailwind) {
  for (const pj of [join(ROOT, 'package.json'), ...walk(ROOT, ['package.json']).slice(0, 5)]) {
    if (existsSync(pj) && /"tailwindcss"/.test(read(pj))) {
      usesTailwind = true;
      break;
    }
  }
}
if (!usesTailwind) skip('CSS sin capa vs Tailwind', 'El proyecto no usa Tailwind — auditoría no aplicable.');

// Parser mínimo: recorre bloques top-level; @layer/@theme/@keyframes/@font-face/
// @property se saltan completos; @media/@supports se recorren por dentro;
// el resto son reglas sin capa → se analizan.
function* unlayeredRules(css, offset = 0) {
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open === -1) return;
    // Las sentencias sin bloque (@import ...; @charset ...;) terminan en ';' —
    // el selector real es solo lo que sigue al último ';'.
    const selector = css.slice(i, open).split(';').pop().trim();
    let depth = 1;
    let j = open + 1;
    while (j < css.length && depth > 0) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    const body = css.slice(open + 1, j - 1);
    if (/^@(layer|theme|keyframes|font-face|property|import|charset)/.test(selector)) {
      // saltar entero
    } else if (/^@(media|supports)/.test(selector)) {
      yield* unlayeredRules(body, offset + open + 1);
    } else if (!selector.startsWith('@')) {
      yield { selector, body, index: offset + i };
    }
    i = j;
  }
}

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));

const findings = [];
const infos = [];

for (const file of styleFiles) {
  const raw = read(file);
  const css = stripComments(raw);
  for (const { selector, body, index } of unlayeredRules(css)) {
    const line = css.slice(0, index).split('\n').length;
    const isUniversalOrRoot = /(^|\s|,)(\*|html|body)(\s|,|$|\{)/.test(selector + '{');
    const resetsBoxModel = /(^|[\s;{])(margin|padding)\s*:/.test(body);
    const isElement = /^[a-z][a-z0-9]*([\s,:.[>+~]|$)/.test(selector);
    if (isUniversalOrRoot && resetsBoxModel) {
      findings.push(
        `${rel(file)}:${line} — "${selector.slice(0, 40)}" sin @layer resetea margin/padding: anula TODAS las utilidades de espaciado de Tailwind (viven en @layer utilities). Muévelo a @layer base o elimínalo (el preflight ya lo hace).`
      );
    } else if (isElement && selector !== ':root' && !selector.startsWith('::-webkit')) {
      infos.push(
        `${rel(file)}:${line} — selector de elemento "${selector.slice(0, 40)}" sin @layer: le gana a cualquier utilidad de Tailwind sobre esas propiedades. Recomendado moverlo a @layer base.`
      );
    }
  }
}

if (findings.length === 0 && infos.length === 0) infos.push('Todo el CSS global está correctamente en capas.');

finish(report('CSS sin capa vs Tailwind', findings, infos));
