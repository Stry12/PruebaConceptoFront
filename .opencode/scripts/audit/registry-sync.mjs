// Auditoría: sincronía del registro de arquitectura. El registro de componentes
// de .opencode/artifacts/frontend/frontend-architecture.md debe reflejar el
// código real: ni componentes fantasma (registrados pero inexistentes) ni
// componentes sin registrar. Multi-stack: exports TS/JS, clases Angular
// (con o sin sufijo "Component"), SFC Vue/Svelte por nombre de archivo.
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { config, componentNames, read, opencodeDir, report, finish, skip } from './lib.mjs';

const oc = opencodeDir();
const registryFile = oc ? join(oc, 'artifacts', 'frontend', 'frontend-architecture.md') : null;
if (!registryFile || !existsSync(registryFile)) skip('Sincronía registro ↔ código', 'No existe frontend-architecture.md — nada que verificar.');

const { srcDir, componentsDir } = config();
if (!srcDir) {
  skip(
    'Sincronía registro ↔ código',
    'Existe frontend-architecture.md pero no hay código fuente — si el proyecto se reinició, el registro es de una corrida anterior y debe archivarse o regenerarse.'
  );
}
if (!componentsDir) {
  skip('Sincronía registro ↔ código', 'No se encontró directorio de componentes compartidos — declara componentsDir en .opencode/audit.config.json.');
}

const exported = componentNames(componentsDir);

// Componentes declarados en las tablas del registro: primera celda "| Nombre |",
// solo dentro de secciones cuyo encabezado mencione componentes.
const registered = new Set();
let inComponentSection = false;
for (const line of read(registryFile).split('\n')) {
  const heading = line.match(/^#{2,4}\s+(.*)/);
  if (heading) {
    inComponentSection = /component/i.test(heading[1]);
    continue;
  }
  if (!inComponentSection) continue;
  const m = line.match(/^\|\s*([A-Z][A-Za-z]*)\s*\|/);
  if (m && m[1] !== 'Component') registered.add(m[1]);
}

const findings = [];
const infos = [];

for (const name of registered) {
  if (!exported.has(name) && !exported.has(name + 'Component')) {
    findings.push(
      `"${name}" está en el registro de frontend-architecture.md pero NO existe en ${componentsDir.replace(/\\/g, '/')} — registro fantasma o componente sin construir.`
    );
  }
}
for (const name of exported) {
  const base = name.endsWith('Component') ? name.slice(0, -'Component'.length) : name;
  if (!registered.has(name) && !registered.has(base)) {
    infos.push(`"${name}" existe en el código pero no aparece en el registro — registrarlo.`);
  }
}

finish(report('Sincronía registro ↔ código', findings, infos));
