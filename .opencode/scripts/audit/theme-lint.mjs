// Herramienta de diseño: lint estructural del theme.css de la Fase 2.
// Verifica que el theme defina todos los grupos de tokens que frontend_engineer
// necesita, antes de pedir la aprobación de la fase.
// Uso: node scripts/audit/theme-lint.mjs [ruta/al/theme.css]
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { read, opencodeDir, positionals, report, finish } from './lib.mjs';

const oc = opencodeDir();
const cssPath = positionals()[0] || (oc ? join(oc, 'artifacts', 'design', 'theme.css') : null);
if (!cssPath || !existsSync(cssPath)) {
  console.error(`No existe ${cssPath ?? '(theme por defecto)'}. Pasa la ruta del theme como argumento.`);
  process.exit(2);
}

const content = read(cssPath);
const names = [...content.matchAll(/--([\w-]+)\s*:/g)].map((m) => m[1]);

const GROUPS = [
  { label: 'color primario', re: /^color-primary/ },
  { label: 'estados (success/error/warning)', re: /^color-(success|error|warning)/, min: 3 },
  { label: 'neutros', re: /^color-neutral/ , min: 2 },
  { label: 'tipografía: familia', re: /^font-family/ },
  { label: 'tipografía: tamaños', re: /^font-size/, min: 3 },
  { label: 'altura de línea', re: /^line-height/ },
  { label: 'unidad de espaciado', re: /^space/ },
  { label: 'radios de borde', re: /^radius/ },
  { label: 'sombras', re: /^shadow/ },
];

const findings = [];
const infos = [];

for (const { label, re, min = 1 } of GROUPS) {
  const count = names.filter((n) => re.test(n)).length;
  if (count < min) {
    findings.push(
      `Grupo "${label}" incompleto: ${count} token(s) encontrado(s), se esperan ≥${min}. frontend_engineer no tendrá de dónde sacar estos valores.`
    );
  }
}

const rotative = names.filter((n) => /^avatar-color-/.test(n)).length;
infos.push(
  rotative >= 4
    ? `Paleta rotativa por-ítem presente (${rotative} tokens).`
    : `Sin paleta rotativa (--avatar-color-N). Correcto SOLO si el lenguaje visual no usa variación por-ítem; si Stitch genera avatares/tags de colores, definirla antes de la Fase 4.`
);
infos.push(`Total: ${names.length} tokens en ${cssPath}.`);

finish(report('Lint estructural del theme', findings, infos));
