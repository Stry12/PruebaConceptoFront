// Auditoría: alcanzabilidad de rutas (paso 8.1 de frontend_engineer): toda ruta
// protegida debe tener una entrada de navegación; toda entrada de navegación
// debe tener ruta. Multi-stack: React Router / Next / Angular Router / Vue
// Router / SvelteKit (heurística sobre patrones de declaración comunes).
import { config, walk, read, rel, CODE_EXTS, report, finish, skip } from './lib.mjs';

const { srcDir, publicRoutes } = config();
if (!srcDir) skip('Alcanzabilidad de rutas', 'No se encontró directorio de código fuente — proyecto aún no generado, nada que auditar.');

const PUBLIC = new Set(publicRoutes);
const files = walk(srcDir, [...CODE_EXTS, '.html']);

// Archivos que parecen definir rutas (router config).
const ROUTER_HINT = /createBrowserRouter|createRouter|<Route[\s>]|RouterModule|provideRouter|routes\s*[:=]\s*\[/;

const routes = new Set();
const navPaths = new Set();
const routeFiles = [];

for (const file of files) {
  const content = read(file);

  if (ROUTER_HINT.test(content)) {
    routeFiles.push(rel(file));
    // path="/x" (JSX/Angular template) y path: '/x' | path: "x" (objetos de rutas).
    for (const m of content.matchAll(/\bpath\s*[:=]\s*["'`]([^"'`*]*)["'`]/g)) {
      let p = m[1];
      if (p === '' || p === '**') continue;
      if (!p.startsWith('/')) p = '/' + p; // Angular/Vue anidado usa paths sin barra
      routes.add(p);
    }
  }

  // Referencias de navegación en cualquier archivo.
  for (const m of content.matchAll(/\b(?:to|routerLink|href)\s*=\s*["'{]+["'`]?(\/[\w\-/]*)["'`]?/g)) {
    navPaths.add(m[1]);
  }
  for (const m of content.matchAll(/\b(?:navigate|push|navigateByUrl|goto)\(\s*["'`](\/[\w\-/]*)["'`]/g)) {
    navPaths.add(m[1]);
  }
  // Arrays de navegación: { ..., path: '/x' } fuera de router config se cuenta
  // como navegación solo si el archivo NO define rutas (ej. items de sidebar).
  if (!ROUTER_HINT.test(content)) {
    for (const m of content.matchAll(/\bpath\s*:\s*["'`](\/[\w\-/]*)["'`]/g)) {
      navPaths.add(m[1]);
    }
  }
}

if (routes.size === 0) {
  skip(
    'Alcanzabilidad de rutas',
    'No se detectó configuración de rutas (React Router/Angular/Vue/SvelteKit) — si el proyecto usa enrutamiento por archivos (Next/SvelteKit puro), declara las rutas en .opencode/audit.config.json o verifica manualmente.'
  );
}

const findings = [];
const infos = [];

for (const route of routes) {
  if (PUBLIC.has(route)) continue;
  if (route.includes(':') || route.includes('[')) continue; // rutas con parámetros: se alcanzan desde listados
  if (!navPaths.has(route)) {
    findings.push(`Ruta "${route}" declarada en el router pero sin entrada de navegación — pantalla huérfana.`);
  }
}

for (const path of navPaths) {
  const matches = [...routes].some(
    (r) => r === path || (r.includes(':') && new RegExp('^' + r.replace(/:[^/]+/g, '[^/]+') + '$').test(path))
  );
  if (!matches && !PUBLIC.has(path) && path !== '/') {
    findings.push(`La navegación referencia "${path}" pero no existe esa ruta en el router.`);
  }
}

infos.push(`Rutas declaradas (${routeFiles.join(', ')}): ${[...routes].sort().join(', ')}`);
infos.push(`Paths de navegación: ${[...navPaths].sort().join(', ') || '(ninguno)'}`);

finish(report('Alcanzabilidad de rutas', findings, infos));
