// Ejecuta todas las auditorías de frontend y resume el veredicto.
// (contrast.mjs y theme-lint.mjs son herramientas de diseño, se ejecutan aparte.)
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const AUDITS = [
  'css-duplication.mjs',
  'route-reachability.mjs',
  'handler-wiring.mjs',
  'implied-screens.mjs',
  'token-fidelity.mjs',
  'registry-sync.mjs',
  'unlayered-css.mjs',
];

const results = [];
const extraArgs = process.argv.slice(2); // propaga --root a cada auditoría
for (const script of AUDITS) {
  const res = spawnSync(process.execPath, [join(dir, script), ...extraArgs], {
    encoding: 'utf8',
    cwd: process.cwd(),
  });
  process.stdout.write(res.stdout);
  if (res.stderr) process.stderr.write(res.stderr);
  results.push({ script, pass: res.status === 0 });
}

console.log('\n==================== RESUMEN ====================');
for (const { script, pass } of results) {
  console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${script}`);
}
const failed = results.filter((r) => !r.pass).length;
console.log(failed ? `\n${failed} auditoría(s) con hallazgos.` : '\nTodo PASS.');
process.exit(failed ? 1 : 0);
