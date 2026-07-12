// Herramienta de diseño: contraste WCAG 2.1 de los tokens de color de un theme.
// Uso: node scripts/audit/contrast.mjs [ruta/al/theme.css]
// Cruza tokens "de primer plano" contra tokens "de fondo" y reporta el ratio,
// con veredicto AA texto normal (>=4.5) y AA texto grande / componentes UI (>=3).
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { read, opencodeDir, positionals } from './lib.mjs';

const oc = opencodeDir();
const cssPath = positionals()[0] || (oc ? join(oc, 'artifacts', 'design', 'theme.css') : null);
if (!cssPath || !existsSync(cssPath)) {
  console.error(`No existe ${cssPath ?? '(theme por defecto)'}. Pasa la ruta del theme como argumento.`);
  process.exit(2);
}

const tokens = new Map();
for (const m of read(cssPath).matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
  tokens.set(m[1], m[2]);
}

function parseHex(hex) {
  let h = hex.slice(1);
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function luminance([r, g, b]) {
  const f = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(hexA, hexB) {
  const [la, lb] = [luminance(parseHex(hexA)), luminance(parseHex(hexB))];
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const isBg = (name) => /(bg|background|surface|light|white|-50$|-100$)/.test(name);
const backgrounds = [...tokens.entries()].filter(([n]) => isBg(n));
if (![...tokens.values()].includes('#ffffff')) backgrounds.push(['(blanco)', '#ffffff']);
const foregrounds = [...tokens.entries()].filter(([n]) => !isBg(n));

console.log(`\n== Contraste WCAG — ${cssPath} ==`);
console.log(`${tokens.size} tokens de color; ${foregrounds.length} de primer plano × ${backgrounds.length} fondos.\n`);

let failures = 0;
for (const [fgName, fgHex] of foregrounds) {
  for (const [bgName, bgHex] of backgrounds) {
    const ratio = contrast(fgHex, bgHex);
    const aa = ratio >= 4.5 ? 'AA texto' : ratio >= 3 ? 'AA grande/UI' : 'FALLA';
    if (ratio < 3) failures++;
    // Solo mostrar pares relevantes: fallos y aprobados justos, más un resumen.
    if (ratio < 4.5) {
      console.log(
        `  ${ratio < 3 ? 'WARN' : 'INFO'}  --${fgName} (${fgHex}) sobre --${bgName} (${bgHex}): ${ratio.toFixed(2)}:1 → ${aa}`
      );
    }
  }
}

console.log(
  `\nPares con ratio < 3:1 (no aptos ni para texto grande): ${failures}.` +
    `\nNota: un WARN solo importa si ese par se usa realmente como texto/fondo en el diseño —` +
    `\nel veredicto es insumo para ui_designer, no un bloqueo automático.`
);
process.exit(0);
