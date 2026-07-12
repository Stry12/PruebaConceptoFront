// Utilidades compartidas por los scripts de auditoría. Sin dependencias externas.
// Soporta múltiples stacks: React/Next (tsx/jsx), Angular (ts + html + scss),
// Vue y Svelte (SFC con <style>), y JS/TS plano.
//
// Las rutas se autodetectan; un proyecto puede fijarlas explícitamente creando
// `.opencode/audit.config.json`:
//   { "srcDir": "src", "pagesDir": "src/pages", "componentsDir": "src/components",
//     "tokensFile": "src/styles/global.css", "publicRoutes": ["/login"] }
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename, extname, resolve, dirname } from 'node:path';

// Raíz del proyecto a auditar: --root <ruta> (o --root=<ruta>), variable de
// entorno AUDIT_ROOT, o el directorio actual. Todos los scripts la heredan.
function resolveRoot() {
  const i = process.argv.findIndex((a) => a === '--root' || a.startsWith('--root='));
  let root = null;
  if (i !== -1) {
    root = process.argv[i].includes('=')
      ? process.argv[i].split('=').slice(1).join('=')
      : process.argv[i + 1];
  } else if (process.env.AUDIT_ROOT) {
    root = process.env.AUDIT_ROOT;
  }
  return root ? resolve(root) : process.cwd();
}

export const ROOT = resolveRoot();

// Argumentos posicionales sin el flag --root (para scripts como contrast.mjs
// que reciben una ruta como argumento).
export function positionals() {
  const args = process.argv.slice(2);
  const out = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--root') {
      i++; // saltar también su valor
    } else if (!args[i].startsWith('--root=')) {
      out.push(args[i]);
    }
  }
  return out;
}

// Busca `relPath` en ROOT y hasta 4 niveles hacia arriba (el proyecto auditado
// puede ser un subdirectorio y .opencode/ vivir en el padre).
export function findUp(relPath, from = ROOT) {
  let dir = from;
  for (let k = 0; k < 5; k++) {
    const p = join(dir, relPath);
    if (existsSync(p)) return p;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

// Directorio .opencode más cercano (en ROOT o ancestros). Puede ser null.
export function opencodeDir() {
  return findUp('.opencode');
}

export const STYLE_EXTS = ['.css', '.scss', '.sass', '.less'];
export const SFC_EXTS = ['.vue', '.svelte'];
export const CODE_EXTS = ['.tsx', '.jsx', '.ts', '.js', ...SFC_EXTS];

export function walk(dir, ext) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full, ext));
    else if (ext.some((e) => name.endsWith(e))) out.push(full);
  }
  return out;
}

export function read(file) {
  return readFileSync(file, 'utf8');
}

export function rel(file) {
  return relative(ROOT, file).replace(/\\/g, '/');
}

export function lineOf(content, index) {
  return content.slice(0, index).split('\n').length;
}

let cfgCache = null;

export function config() {
  if (cfgCache) return cfgCache;
  let user = {};
  // La config puede vivir en ROOT/.opencode o en un ancestro (proyecto en
  // subdirectorio). Sus rutas se resuelven contra el directorio que contiene
  // ese .opencode, no contra ROOT — así significan lo mismo desde cualquier cwd.
  let cfgBase = ROOT;
  const oc = opencodeDir();
  const cfgFile = oc ? join(oc, 'audit.config.json') : null;
  if (cfgFile && existsSync(cfgFile)) {
    try {
      user = JSON.parse(readFileSync(cfgFile, 'utf8'));
      cfgBase = dirname(oc);
    } catch {
      console.error('AVISO: .opencode/audit.config.json inválido — se usan defaults.');
    }
  }
  const first = (cands) => {
    for (const c of cands) {
      const p = join(ROOT, c);
      if (existsSync(p)) return p;
    }
    return null;
  };
  cfgCache = {
    srcDir: user.srcDir ? join(cfgBase, user.srcDir) : first(['src', 'app']),
    pagesDir: user.pagesDir
      ? join(cfgBase, user.pagesDir)
      : first(['src/pages', 'src/app/pages', 'src/views', 'src/routes', 'app/pages', 'src/app']),
    componentsDir: user.componentsDir
      ? join(cfgBase, user.componentsDir)
      : first([
          'src/components',
          'src/shared/components',
          'src/app/shared/components',
          'src/app/components',
          'src/lib/components',
        ]),
    tokensFile: user.tokensFile
      ? join(cfgBase, user.tokensFile)
      : first([
          'src/styles/global.css',
          'src/styles/globals.css',
          'src/styles/theme.css',
          'src/global.css',
          'src/index.css',
          'src/styles.css',
          'src/styles.scss',
          'src/app/styles.scss',
        ]),
    publicRoutes: user.publicRoutes ?? ['/login'],
    impliedScreenKeywords: user.impliedScreenKeywords ?? [],
  };
  return cfgCache;
}

// Fuentes de estilo de un directorio: archivos de estilo puros + bloques
// <style> embebidos en SFC de Vue/Svelte. Devuelve [{file, content, baseLine}].
export function styleSources(dir) {
  if (!dir) return [];
  const out = [];
  for (const f of walk(dir, STYLE_EXTS)) out.push({ file: f, content: read(f), baseLine: 0 });
  for (const f of walk(dir, SFC_EXTS)) {
    const content = read(f);
    const re = /<style[^>]*>([\s\S]*?)<\/style>/g;
    let m;
    while ((m = re.exec(content))) {
      out.push({ file: f, content: m[1], baseLine: lineOf(content, m.index) - 1 });
    }
  }
  return out;
}

// Nombres de componentes existentes en el directorio de componentes compartidos:
// exports nombrados (React/TS/JS), clases (Angular — se añade también el nombre
// sin el sufijo "Component"), y nombre de archivo para SFC (Vue/Svelte).
export function componentNames(dir) {
  const names = new Set();
  if (!dir) return names;
  for (const f of walk(dir, ['.tsx', '.jsx', '.ts', '.js'])) {
    const content = read(f);
    for (const m of content.matchAll(/export\s+(?:default\s+)?(?:const|function|class)\s+([A-Z]\w*)/g)) {
      names.add(m[1]);
      if (m[1].endsWith('Component')) names.add(m[1].slice(0, -'Component'.length));
    }
  }
  for (const f of walk(dir, SFC_EXTS)) {
    const base = basename(f, extname(f));
    names.add(base.charAt(0).toUpperCase() + base.slice(1));
  }
  return names;
}

// Extrae los nombres de clase usados como selectores en un bloque CSS/SCSS.
// Devuelve Map<clase, línea de primera aparición>.
export function cssClasses(content, baseLine = 0) {
  const classes = new Map();
  const re = /(^|\})([^{}]*)\{/g;
  let m;
  while ((m = re.exec(content))) {
    const selector = m[2];
    if (selector.trim().startsWith('@')) continue; // @media, @keyframes, etc.
    const start = m.index + m[1].length;
    const classRe = /\.([a-zA-Z][\w-]*)/g;
    let c;
    while ((c = classRe.exec(selector))) {
      if (!classes.has(c[1])) classes.set(c[1], baseLine + lineOf(content, start + c.index));
    }
  }
  return classes;
}

export function report(title, findings, infos = []) {
  console.log(`\n== ${title} ==`);
  if (findings.length === 0 && infos.length === 0) {
    console.log('OK — sin hallazgos.');
  }
  for (const f of findings) console.log(`  WARN  ${f}`);
  for (const i of infos) console.log(`  INFO  ${i}`);
  return findings.length;
}

export function finish(warnCount) {
  console.log(
    warnCount > 0
      ? `\nRESULTADO: FAIL (${warnCount} hallazgo(s) que corregir o justificar)`
      : '\nRESULTADO: PASS'
  );
  process.exit(warnCount > 0 ? 1 : 0);
}

export function skip(title, reason) {
  console.log(`== ${title} ==\n${reason}`);
  process.exit(0);
}
