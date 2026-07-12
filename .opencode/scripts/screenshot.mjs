// Captura un screenshot headless de una URL (ruta de la app o file:// de un
// HTML de Stitch) usando Edge/Chrome instalado — sin dependencias.
// Uso: node .opencode/scripts/screenshot.mjs <url> <salida.png> [anchoxalto]
// Ej.:  node .opencode/scripts/screenshot.mjs http://localhost:5173/login qa/login.png 1280x800
//       node .opencode/scripts/screenshot.mjs .opencode/artifacts/design/screens/S1-login.html qa/login-design.png
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , target, out, size = '1280x800'] = process.argv;
if (!target || !out) {
  console.error('Uso: node screenshot.mjs <url|archivo.html> <salida.png> [anchoxalto]');
  process.exit(2);
}

const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];
const browser = BROWSERS.find(existsSync);
if (!browser) {
  console.error('No se encontró Edge ni Chrome instalado.');
  process.exit(2);
}

const url = /^https?:\/\//.test(target)
  ? target
  : pathToFileURL(isAbsolute(target) ? target : resolve(target)).href;
const outPath = isAbsolute(out) ? out : resolve(out);
mkdirSync(dirname(outPath), { recursive: true });

const res = spawnSync(
  browser,
  [
    '--headless',
    '--disable-gpu',
    '--hide-scrollbars',
    `--screenshot=${outPath}`,
    `--window-size=${size.replace('x', ',')}`,
    '--virtual-time-budget=8000',
    url,
  ],
  { encoding: 'utf8', timeout: 60_000 }
);

if (existsSync(outPath)) {
  console.log(`Screenshot guardado: ${outPath} (${url})`);
} else {
  console.error(`Falló la captura de ${url}\n${res.stderr?.slice(0, 500) ?? ''}`);
  process.exit(1);
}
