// Auditoría: firma del esqueleto default "admin SaaS" (sidebar + fila de
// stat-cards). Es la plantilla a la que Stitch regresa para cualquier dominio;
// solo es legítima cuando el arquetipo de la pantalla la pide (analítica para
// stat-cards, registros para tabla+sidebar — ver la skill stitch-prompt-crafter,
// reference/archetypes.md). Cada hallazgo es una CANDIDATA: el agente la cruza
// contra la estructura firma y la jerarquía de ux-flow.md — este script no
// puede saber si la pantalla es un dashboard de analítica legítimo.
//
// Detección (heurística, sin dependencias):
//   - Sidebar: <aside>, clase sidebar/sidenav, o <nav> con >=4 links.
//   - Fila de métricas: >=3 nodos de texto numéricos ("247", "1.024", "89%")
//     seguidos cada uno de una etiqueta corta alfabética ("Total",
//     "Completados"), agrupados en una ventana acotada del documento.
// Sirve tanto para mockups de Stitch (.html) como para código construido
// (JSX/templates), porque ambos exponen los textos como >texto<.
import { config, walk, read, rel, lineOf, CODE_EXTS, positionals, report, finish, skip, opencodeDir } from './lib.mjs';
import { join, dirname } from 'node:path';
import { existsSync } from 'node:fs';

const NUM_RE = /^[+-]?\$?\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?\s?%?$/; // 247 · 1.024 · 89% · $12,5
const LABEL_RE = /^[^\d]{3,40}$/; // etiqueta corta sin dígitos ("Total", "En progreso")
const WINDOW = 2500; // ancho máx. en caracteres para considerar métricas "en la misma fila"

function textNodes(content) {
  const nodes = [];
  const re = />([^<>{}]+)</g; // texto visible entre tags; excluye expresiones JSX {..}
  let m;
  while ((m = re.exec(content))) {
    const text = m[1].replace(/\s+/g, ' ').trim();
    if (text) nodes.push({ text, index: m.index + 1 });
  }
  return nodes;
}

function hasSidebar(content) {
  if (/<aside\b/i.test(content)) return true;
  if (/class(Name)?\s*=\s*["'][^"']*\b(sidebar|side-nav|sidenav)\b/i.test(content)) return true;
  const navs = content.match(/<nav\b[\s\S]*?<\/nav>/gi) ?? [];
  return navs.some((n) => (n.match(/<a\b/gi) ?? []).length >= 4);
}

// Métrica = nodo numérico cuyo vecino inmediato (anterior o siguiente) es una
// etiqueta corta sin dígitos. Descarta paginaciones ("1 2 3", vecinos también
// numéricos) y celdas de tabla con ids/horas (vecinos largos o con dígitos).
function metricNodes(nodes) {
  const metrics = [];
  for (let i = 0; i < nodes.length; i++) {
    if (!NUM_RE.test(nodes[i].text)) continue;
    const prev = nodes[i - 1]?.text ?? '';
    const next = nodes[i + 1]?.text ?? '';
    if (LABEL_RE.test(next) || LABEL_RE.test(prev)) metrics.push(nodes[i]);
  }
  return metrics;
}

// Agrupa métricas cercanas; una "fila" son >=3 métricas dentro de la ventana.
function metricRows(metrics) {
  const rows = [];
  let run = [];
  for (const m of metrics) {
    if (run.length && m.index - run[0].index > WINDOW) {
      if (run.length >= 3) rows.push(run);
      run = [];
    }
    run.push(m);
  }
  if (run.length >= 3) rows.push(run);
  return rows;
}

function scanFile(file, findings) {
  const content = read(file);
  const rows = metricRows(metricNodes(textNodes(content)));
  if (rows.length === 0) return;
  const sidebar = hasSidebar(content);
  for (const row of rows) {
    const line = lineOf(content, row[0].index);
    const sample = row.slice(0, 4).map((n) => `"${n.text}"`).join(', ');
    if (sidebar) {
      findings.push(
        `${rel(file)}:${line} — firma del esqueleto default (sidebar + fila de ${row.length} métricas: ${sample}). ` +
          `Solo es legítima si el rol de la pantalla es analítica/registros según la estructura firma de ux-flow.md — verifícalo.`
      );
    } else {
      findings.push(
        `${rel(file)}:${line} — fila de ${row.length} stat-cards (${sample}) sin rastro en verificación mecánica: ` +
          `confirma que está en la jerarquía de esa pantalla en ux-flow.md; si no está, es relleno de Stitch.`
      );
    }
  }
}

const cfg = config();
const explicit = positionals().filter((a) => !a.startsWith('-'));
const roots = [];
if (explicit.length) {
  roots.push(...explicit);
} else {
  // Sin ruta explícita: mockups descargados (si existen) + código de páginas.
  const oc = opencodeDir();
  if (oc) {
    const screens = join(dirname(oc), '.opencode', 'artifacts', 'design', 'screens');
    if (existsSync(screens)) roots.push(screens);
  }
  if (cfg.pagesDir) roots.push(cfg.pagesDir);
}

if (roots.length === 0) {
  skip(
    'Esqueleto default (sidebar + stat-cards)',
    'No se encontró design/screens ni pagesDir, y no se pasó ruta explícita — nada que auditar.'
  );
}

const files = roots.flatMap((dir) => [...walk(dir, ['.html']), ...walk(dir, CODE_EXTS)]);
const findings = [];
for (const file of files) scanFile(file, findings);

const infos = files.length === 0 ? ['No se encontraron archivos que auditar en las rutas dadas.'] : [];
finish(report('Esqueleto default (sidebar + stat-cards)', findings, infos));
