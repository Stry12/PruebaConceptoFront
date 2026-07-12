// Auditoría: duplicación de estilos entre páginas y patrones que deberían ser
// componentes compartidos. Versión ejecutable de la regla "Anti-duplicación"
// de frontend_engineer. Multi-stack: CSS/SCSS/LESS y <style> de Vue/Svelte.
import { config, styleSources, componentNames, cssClasses, rel, report, finish, skip } from './lib.mjs';

const { pagesDir, componentsDir } = config();
if (!pagesDir) skip('Duplicación de CSS entre páginas', 'No se encontró directorio de páginas — proyecto aún no generado, nada que auditar.');

// Palabras clave de patrones visuales → cómo reconocer un componente compartido existente.
const PATTERNS = [
  { kw: /(^|-)table($|-)/, label: 'Table', compRe: /table|grid/i },
  { kw: /(^|-)modal($|-)/, label: 'Modal', compRe: /modal|dialog/i },
  { kw: /side-panel|drawer/, label: 'SidePanel', compRe: /side-?panel|drawer/i },
  { kw: /(^|-)(btn|button)($|-)/, label: 'Button', compRe: /button/i },
  { kw: /(^|-)badge($|-)/, label: 'Badge', compRe: /badge|chip|tag/i },
  { kw: /(^|-)avatar($|-)/, label: 'Avatar', compRe: /avatar/i },
  { kw: /(^|-)stat(-card)?($|-)/, label: 'StatCard', compRe: /stat|kpi/i },
  { kw: /(^|-)(input|select|textarea|field)($|-)/, label: 'FormFields', compRe: /input|field|form|select|textarea/i },
];

const existing = componentNames(componentsDir);

const sources = styleSources(pagesDir);
const byClass = new Map(); // clase → [{file, line}]
const patternHits = new Map(); // label → Map<file, [clases]>

for (const { file, content, baseLine } of sources) {
  const classes = cssClasses(content, baseLine);
  for (const [cls, line] of classes) {
    if (!byClass.has(cls)) byClass.set(cls, []);
    byClass.get(cls).push({ file: rel(file), line });
    for (const { kw, label } of PATTERNS) {
      if (kw.test(cls)) {
        if (!patternHits.has(label)) patternHits.set(label, new Map());
        const perFile = patternHits.get(label);
        if (!perFile.has(rel(file))) perFile.set(rel(file), []);
        perFile.get(rel(file)).push(cls);
      }
    }
  }
}

const findings = [];
const infos = [];

// 1. Misma clase definida en 2+ archivos de página distintos.
for (const [cls, uses] of byClass) {
  const files = new Set(uses.map((u) => u.file));
  if (files.size > 1) {
    findings.push(
      `Clase ".${cls}" definida en ${files.size} páginas: ${uses
        .map((u) => `${u.file}:${u.line}`)
        .join(', ')} — extraer a un componente/hoja compartida.`
    );
  }
}

// 2. Patrones visuales redefinidos por página.
for (const [label, perFile] of patternHits) {
  const files = [...perFile.keys()];
  const { compRe } = PATTERNS.find((p) => p.label === label);
  const match = [...existing].find((n) => compRe.test(n));
  if (match) {
    for (const [file, classes] of perFile) {
      findings.push(
        `${file} define ${classes.length} clase(s) del patrón "${label}" (${classes
          .slice(0, 4)
          .join(', ')}${classes.length > 4 ? ', …' : ''}) pero ya existe el componente compartido "${match}" — usarlo.`
      );
    }
  } else if (files.length >= 2) {
    findings.push(
      `Patrón "${label}" definido por página en ${files.length} archivos (${files.join(
        ', '
      )}) y NO existe componente compartido equivalente — candidato claro a extracción.`
    );
  } else {
    infos.push(`Patrón "${label}" aparece solo en ${files[0]} — vigilar si se repite en otra página.`);
  }
}

if (sources.length === 0) infos.push('No se encontraron fuentes de estilo bajo el directorio de páginas.');

finish(report('Duplicación de CSS entre páginas', findings, infos));
