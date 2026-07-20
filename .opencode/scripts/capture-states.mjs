#!/usr/bin/env node
// Capturador de ESTADOS de componentes con Playwright (menús abiertos, modales,
// hover, focus...) en múltiples viewports. Complementa a screenshot.mjs (que solo
// fotografía la carga estática de una URL).
//
// Uso:
//   node .opencode/scripts/capture-states.mjs <plan.json> [dirProyecto]
//
//   dirProyecto (default mediavault-frontend) solo se usa para resolver Playwright
//   desde sus node_modules. El dev server debe estar YA corriendo (dev-server.mjs start).
//
// Formato del plan (JSON, una entrada por pantalla):
// {
//   "base": "http://localhost:5173",
//   "viewports": ["1280x800", "390x844", "768x1024", "1920x1080"],   // opcional: si falta, usa design-quality.config.json
//   "salida": ".opencode/artifacts/art-direction/shots/estados",     // opcional
//   "pantallas": [
//     { "slug": "biblioteca", "ruta": "/", "estados": [
//       { "nombre": "base" },
//       { "nombre": "menu-abierto",  "acciones": [ { "click": "button[aria-haspopup='menu']" } ] },
//       { "nombre": "modal-agregar", "acciones": [ { "click": "text=Añadir" } ] },
//       { "nombre": "card-focus",    "acciones": [ { "press": "Tab" }, { "press": "Tab" } ] },
//       { "nombre": "card-hover",    "acciones": [ { "hover": "article >> nth=0" } ] }
//     ]}
//   ]
// }
// Acciones soportadas: click | hover | press (tecla global) | fill {selector,valor}
//                      | esperar (ms o selector). Tras las acciones: 350ms de settle.
//
// Salida: <salida>/<slug>--<estado>--<viewport>.png + resumen OK/ERROR por captura.
// Un estado que falla NO detiene el resto (se reporta y sigue).

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const planFile = process.argv[2];
const projectDir = process.argv[3] || 'mediavault-frontend';
if (!planFile || !fs.existsSync(planFile)) {
  console.error('Uso: node .opencode/scripts/capture-states.mjs <plan.json> [dirProyecto]');
  process.exit(1);
}
const plan = JSON.parse(fs.readFileSync(planFile, 'utf8'));

let viewports = plan.viewports;
if (!viewports || !viewports.length) {
  try { viewports = JSON.parse(fs.readFileSync('.opencode/design-quality.config.json', 'utf8')).viewports; } catch {}
}
viewports = viewports && viewports.length ? viewports : ['1280x800', '390x844', '768x1024', '1920x1080'];
const base = (plan.base || 'http://localhost:5173').replace(/\/$/, '');
const outDir = plan.salida || path.join('.opencode', 'artifacts', 'art-direction', 'shots', 'estados');
fs.mkdirSync(outDir, { recursive: true });

const require_ = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require_(path.resolve(projectDir, 'node_modules', '@playwright/test')));
} catch {
  try { ({ chromium } = require_(path.resolve(projectDir, 'node_modules', 'playwright'))); }
  catch { console.error(`ERROR no se encontró Playwright en ${projectDir}/node_modules — ¿falta npm install / npx playwright install?`); process.exit(1); }
}

async function aplicarAccion(page, a) {
  if (a.click) await page.click(a.click, { timeout: 5000 });
  else if (a.hover) await page.hover(a.hover, { timeout: 5000 });
  else if (a.press) await page.keyboard.press(a.press);
  else if (a.fill) await page.fill(a.fill.selector, a.fill.valor, { timeout: 5000 });
  else if (a.esperar) {
    if (typeof a.esperar === 'number') await page.waitForTimeout(a.esperar);
    else await page.waitForSelector(a.esperar, { timeout: 8000 });
  } else throw new Error(`acción desconocida: ${JSON.stringify(a)}`);
}

const browser = await chromium.launch();
const fallos = [];
let ok = 0;
for (const vp of viewports) {
  const [w, h] = vp.split('x').map(Number);
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  for (const pantalla of plan.pantallas || []) {
    for (const estado of pantalla.estados || [{ nombre: 'base' }]) {
      const nombre = `${pantalla.slug}--${estado.nombre}--${vp}.png`;
      const destino = path.join(outDir, nombre);
      const page = await ctx.newPage();
      try {
        await page.goto(base + (pantalla.ruta || '/'), { waitUntil: 'networkidle', timeout: 20000 });
        for (const a of estado.acciones || []) await aplicarAccion(page, a);
        await page.waitForTimeout(350); // settle: transiciones/overlays terminan de pintar
        await page.screenshot({ path: destino });
        console.log(`OK    ${nombre}`);
        ok++;
      } catch (e) {
        console.error(`ERROR ${nombre} — ${String(e.message || e).split('\n')[0]}`);
        fallos.push(nombre);
      } finally {
        await page.close();
      }
    }
  }
  await ctx.close();
}
await browser.close();
console.log(`\nCapturas: ${ok} OK · ${fallos.length} con error${fallos.length ? ' → ' + fallos.join(', ') : ''}`);
process.exit(ok === 0 ? 1 : 0);
