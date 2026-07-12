// Auditoría: cableado de handlers (paso 7 de frontend_engineer): todo handler
// de acción debe invocar un método de servicio (o mutador de hook/composable),
// y ningún botón de confirmación debe limitarse a cerrar el modal.
// Multi-stack: React/JSX, Angular (this.xService), Vue/Svelte (SFC).
import { config, walk, read, rel, lineOf, CODE_EXTS, report, finish, skip } from './lib.mjs';

const { pagesDir } = config();
if (!pagesDir) skip('Cableado de handlers y modales', 'No se encontró directorio de páginas — proyecto aún no generado, nada que auditar.');

const pages = walk(pagesDir, CODE_EXTS);

// Extrae el cuerpo entre llaves balanceadas a partir de la primera "{" tras `start`.
function extractBody(content, start) {
  const open = content.indexOf('{', start);
  if (open === -1) return '';
  let depth = 0;
  for (let i = open; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) return content.slice(open, i + 1);
    }
  }
  return content.slice(open);
}

// ¿El cuerpo de un handler efectúa una acción real?
function actsOnState(body, mutators) {
  if (/\b(?:this\.)?\w*[sS]ervice\.\w+\s*\(/.test(body)) return true; // servicio (React/Angular/Vue)
  if (/\b(?:\$?emit|dispatch)\s*\(/.test(body)) return true; // delega hacia arriba (Vue/Svelte/stores)
  if (/\bnavigate\s*\(|\brouter\.(push|navigate)|\bnavigateByUrl\s*\(|\bgoto\s*\(/.test(body)) return true; // navegación
  return [...mutators].some((name) => new RegExp(`\\b${name}\\s*\\(`).test(body));
}

const findings = [];
const infos = [];

for (const file of pages) {
  const content = read(file);

  // Mutadores destructurados de hooks/composables: const { create, update } = useX(...)
  // Los toasts/notificaciones NO cuentan como acción real: un handler que solo
  // muestra "guardado correctamente" sin llamar a un servicio es éxito falso.
  const mutators = new Set();
  for (const m of content.matchAll(/const\s*\{([^}]+)\}\s*=\s*use[A-Z]\w*\(/g)) {
    for (const raw of m[1].split(',')) {
      const name = raw.split(':').pop().trim();
      if (name && !/toast|notif|snack|alert/i.test(name)) mutators.add(name);
    }
  }

  // 1a. Handlers como const/function (React, Vue script setup, Svelte).
  for (const m of content.matchAll(/(?:const|function)\s+((?:handle|on)[A-Z]\w*)\s*=?\s*(?:async\s*)?\(/g)) {
    const body = extractBody(content, m.index);
    if (!actsOnState(body, mutators)) {
      findings.push(
        `${rel(file)}:${lineOf(content, m.index)} — "${m[1]}" no invoca servicio, mutador, emit ni navegación: posible acción decorativa.`
      );
    }
  }

  // 1b. Métodos de clase (Angular): onGuardar() { ... } / handleDelete(): void { ... }
  if (/@Component|export\s+class\s+\w+/.test(content)) {
    for (const m of content.matchAll(/^\s{2,}(?:async\s+)?((?:handle|on)[A-Z]\w*)\s*\([^)]*\)\s*(?::\s*[\w<>\[\] |]+)?\s*\{/gm)) {
      const body = extractBody(content, m.index);
      if (!actsOnState(body, mutators)) {
        findings.push(
          `${rel(file)}:${lineOf(content, m.index)} — método "${m[1]}" no invoca servicio ni navegación: posible acción decorativa.`
        );
      }
    }
  }

  // 2. Controles inline que solo cierran un modal. Cancelar/cerrar es legítimo:
  //    se reconoce por la etiqueta visible DESPUÉS del onClick (>Cancelar<) o
  //    por variantes de botón secundarias.
  const CLOSE_PATTERNS = [
    /onClick=\{\(\)\s*=>\s*(set\w+)\((false|null)\)\}/g, // React
    /@click\s*=\s*["'](show\w+|is\w+Open)\s*=\s*false["']/g, // Vue
    /\(click\)\s*=\s*["'](show\w+|is\w+Open)\s*=\s*false["']/g, // Angular
  ];
  const isCancelCtx = (before, after) =>
    /cancel|cerrar|close|volver|entendido/i.test(after) ||
    /variant="(outline|ghost|secondary)"/.test(before) ||
    /aria-label="[^"]*(cerrar|close)/i.test(before);
  for (const re of CLOSE_PATTERNS) {
    for (const m of content.matchAll(re)) {
      const before = content.slice(Math.max(0, m.index - 250), m.index);
      const after = content.slice(m.index + m[0].length, m.index + m[0].length + 80);
      if (isCancelCtx(before, after)) continue;
      findings.push(
        `${rel(file)}:${lineOf(content, m.index)} — control cuyo click solo cierra un modal (${m[1]}): confirmar que no es un botón de confirmación sin cablear.`
      );
    }
  }

  // 3. Éxito falso: onClick inline cuyo cuerpo cierra el modal y/o muestra un
  //    toast de éxito sin invocar ninguna acción real. Es el defecto más
  //    engañoso: el usuario ve "guardado correctamente" y no se guardó nada.
  for (const m of content.matchAll(/onClick=\{\(\)\s*=>\s*\{([^{}]*)\}\}/g)) {
    const body = m[1];
    const fakesSuccess = /addToast\(\s*['"`]success|toast\.success|showSuccess/i.test(body);
    if (fakesSuccess && !actsOnState(body, mutators)) {
      findings.push(
        `${rel(file)}:${lineOf(content, m.index)} — onClick muestra toast de ÉXITO sin invocar ningún servicio: éxito falso (el usuario cree que se guardó y no se guardó nada).`
      );
    }
  }

  // 4. Botones sin ningún handler: decorativos. type="submit" dentro de un
  //    form con onSubmit es legítimo.
  for (const m of content.matchAll(/<(Button|button)\b[^>]*>/g)) {
    const tag = m[0];
    if (/onClick|@click|\(click\)|on:click/.test(tag)) continue;
    if (/type="submit"/.test(tag)) continue;
    if (/disabled/.test(tag)) continue;
    findings.push(
      `${rel(file)}:${lineOf(content, m.index)} — <${m[1]}> sin onClick ni type="submit": botón decorativo. Cablearlo a una acción/navegación real o justificarlo.`
    );
  }
}

if (pages.length === 0) infos.push('No se encontraron páginas que auditar.');
else if (findings.length === 0) infos.push(`${pages.length} archivo(s) de página revisados; todos los handlers efectúan acciones reales.`);

finish(report('Cableado de handlers y modales', findings, infos));
