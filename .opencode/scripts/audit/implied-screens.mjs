// Auditoría: pantallas implícitas sin diseñar. Un link/botón con texto tipo
// "¿Olvidaste tu contraseña?", "Notificaciones", "Configuración" implica una
// pantalla/flujo completo — si esa pantalla nunca entró al inventario de
// ux-flow.md, ni Stitch la generó ni frontend_engineer la construyó, y el
// link queda apuntando a la nada (o a nada en absoluto).
//
// Dos modos, autodetectados por extensión de los archivos encontrados:
//   - HTML estático (mockups de Stitch, sin concepto de ruta): reporta cada
//     coincidencia como candidata — no hay forma mecánica de saber si ya
//     está cubierta por otra pantalla con nombre distinto, eso lo resuelve
//     el agente contra ux-flow.md.
//   - Código real (CODE_EXTS): además verifica si el link/botón tiene un
//     destino real (href/to/routerLink no vacío, o un handler que navega) —
//     si no lo tiene, es más grave: no es solo "sin diseñar", es un cascarón.
import { config, walk, read, rel, lineOf, CODE_EXTS, positionals, report, finish, skip } from './lib.mjs';

const DEFAULT_KEYWORDS = [
  'olvidaste tu contraseña', 'olvidé mi contraseña', 'recuperar contraseña', 'restablecer contraseña',
  'forgot password', 'reset password', 'recover password',
  'registrarse', 'crear cuenta', 'regístrate',
  'sign up', 'create account', 'register',
  'notificaciones', 'notifications',
  'configuración', 'ajustes', 'preferencias',
  'settings', 'preferences',
  'mi perfil', 'perfil', 'mi cuenta',
  'my profile', 'profile', 'my account', 'account settings',
  'ayuda', 'soporte', 'centro de ayuda',
  'help', 'support', 'help center',
  'términos y condiciones', 'términos de servicio',
  'terms of service', 'terms and conditions',
  'política de privacidad', 'privacidad',
  'privacy policy', 'privacy',
  'ver todo', 'ver más', 'ver historial',
  'see all', 'view all', 'view history',
  'cambiar contraseña', 'change password',
  'editar perfil', 'edit profile',
];

function keywordList() {
  const cfg = config();
  const extra = Array.isArray(cfg.impliedScreenKeywords) ? cfg.impliedScreenKeywords : [];
  return [...new Set([...DEFAULT_KEYWORDS, ...extra].map((k) => k.toLowerCase()))];
}

// Texto visible dentro de una etiqueta (<a>, <button>, o su equivalente JSX),
// sin sub-tags/atributos — suficiente para matchear contra el listado.
function visibleText(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

function hasRealDestination(tag, body) {
  const href = /href\s*=\s*["']([^"']*)["']/.exec(tag)?.[1];
  if (href !== undefined) return href.trim() !== '' && href.trim() !== '#' && !/^javascript:/.test(href);
  const to = /\bto\s*=\s*\{?["']([^"'}]*)["']\}?/.exec(tag)?.[1]; // React Router <Link to="...">
  if (to !== undefined) return to.trim() !== '';
  const routerLink = /\[?routerLink\]?\s*=\s*["']([^"']*)["']/.exec(tag)?.[1]; // Angular
  if (routerLink !== undefined) return routerLink.trim() !== '';
  // Sin atributo de navegación en la propia etiqueta: ¿el handler navega?
  return /\bnavigate\s*\(|\brouter\.(push|navigate)|\bnavigateByUrl\s*\(|\bgoto\s*\(/.test(body);
}

function scanFile(file, findings, seen) {
  const content = read(file);
  const keywords = keywordList();
  const isHtmlLike = file.endsWith('.html');

  // <a ...>...</a> y <button ...>...</button> (o Button/Link JSX/Angular
  // equivalentes vía la misma sintaxis de etiqueta) — cuerpo sin anidar tags
  // complejos, alcanza para el texto visible de un link/botón típico.
  const TAG_RE = /<(a|button|Button|Link|RouterLink)\b([^>]*)>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = TAG_RE.exec(content))) {
    const [full, , attrs, body] = m;
    const text = visibleText(body);
    if (!text) continue;
    const hit = keywords.find((k) => text.includes(k));
    if (!hit) continue;

    const key = `${rel(file)}:${hit}`;
    if (seen.has(key)) continue; // no repetir el mismo hallazgo en el mismo archivo
    seen.add(key);

    const line = lineOf(content, m.index);
    if (isHtmlLike) {
      findings.push(
        `${rel(file)}:${line} — texto "${hit}" implica una pantalla/flujo propio (candidata a revisar contra ux-flow.md).`
      );
    } else if (!hasRealDestination(attrs, body)) {
      findings.push(
        `${rel(file)}:${line} — texto "${hit}" sin destino real (href vacío/"#", sin \`to\`/\`routerLink\`, ni navegación en el handler): cascarón que implica una pantalla no construida.`
      );
    } else {
      findings.push(
        `${rel(file)}:${line} — texto "${hit}" con destino real: confirma que esa pantalla existe en ux-flow.md con datos dummy funcionales, no solo la ruta.`
      );
    }
    void full;
  }
}

const cfg = config();
const targets = [];
if (cfg.pagesDir) targets.push(cfg.pagesDir);
if (cfg.componentsDir) targets.push(cfg.componentsDir);

// Modo mockups: si se pasa una ruta explícita (ej. design/screens/), se usa
// esa en vez de pagesDir/componentsDir.
const explicit = positionals().filter((a) => !a.startsWith('-'));
const roots = explicit.length ? explicit : targets;

if (roots.length === 0) {
  skip(
    'Pantallas implícitas sin diseñar',
    'No se encontró pagesDir/componentsDir ni se pasó una ruta explícita — nada que auditar.'
  );
}

const files = roots.flatMap((dir) => [...walk(dir, CODE_EXTS), ...walk(dir, ['.html'])]);
const findings = [];
const seen = new Set();
for (const file of files) scanFile(file, findings, seen);

const infos = files.length === 0 ? ['No se encontraron archivos que auditar en las rutas dadas.'] : [];
finish(report('Pantallas implícitas sin diseñar', findings, infos));
