#!/usr/bin/env node
// Lanzador de dev server SIN BLOQUEO para los agentes del pipeline.
//
// Problema que resuelve: `npm run dev` en primer plano nunca retorna y el agente
// queda pegado esperando. Este script arranca el server DESACOPLADO, espera a que
// responda HTTP, imprime READY y TERMINA — dejando el server vivo en background.
//
// Uso:
//   node .opencode/scripts/dev-server.mjs start [dirProyecto] [--port=5173] [--timeout=90]
//   node .opencode/scripts/dev-server.mjs status
//   node .opencode/scripts/dev-server.mjs stop
//
//   start  → SIEMPRE reinicia limpio: mata el server rastreado anterior Y cualquier
//            proceso que esté escuchando en el puerto (zombis de runs previos), y
//            levanta Vite en el PUERTO FIJO con --strictPort (jamás auto-incrementa
//            a un puerto nuevo). Salida: "READY http://localhost:<puerto>/ pid=<pid>"
//   status → "RUNNING <url> pid=<pid>" | "DEAD" | "NOT_STARTED"
//   stop   → mata el árbol de procesos (taskkill /T en Windows) y limpia el estado.
//
// Defaults: dirProyecto = mediavault-frontend · puerto = 5173 · timeout = 90s
// Estado y log en .opencode/.dev-server/ (ignorado por git).

import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const STATE_DIR = path.join('.opencode', '.dev-server');
const STATE_FILE = path.join(STATE_DIR, 'state.json');
const LOG_FILE = path.join(STATE_DIR, 'dev-server.log');
const IS_WIN = process.platform === 'win32';

const cmd = process.argv[2];
const rest = process.argv.slice(3);
const projectDir = rest.find(a => !a.startsWith('--')) || 'mediavault-frontend';
const PORT = Number((rest.find(a => a.startsWith('--port=')) || '').split('=')[1]) || 5173;
const timeoutS = Number((rest.find(a => a.startsWith('--timeout=')) || '').split('=')[1]) || 90;

function readState() {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch { return null; }
}
function pidAlive(pid) {
  try { process.kill(pid, 0); return true; } catch { return false; }
}
async function httpOk(url) {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    return res.status < 500;
  } catch { return false; }
}
function killTree(pid) {
  if (IS_WIN) spawnSync('taskkill', ['/pid', String(pid), '/T', '/F'], { stdio: 'ignore' });
  else { try { process.kill(-pid, 'SIGTERM'); } catch { try { process.kill(pid, 'SIGTERM'); } catch {} } }
}
// Mata cualquier proceso escuchando en el puerto (zombis de runs anteriores).
function killPortListeners(port) {
  const pids = new Set();
  if (IS_WIN) {
    const out = spawnSync('netstat', ['-ano'], { encoding: 'utf8' }).stdout || '';
    for (const line of out.split('\n')) {
      const m = line.match(new RegExp(`TCP\\s+\\S+:${port}\\s+\\S+\\s+LISTENING\\s+(\\d+)`));
      if (m) pids.add(Number(m[1]));
    }
  } else {
    const out = spawnSync('lsof', ['-ti', `:${port}`], { encoding: 'utf8' }).stdout || '';
    out.split('\n').filter(Boolean).forEach(p => pids.add(Number(p)));
  }
  pids.delete(process.pid);
  for (const pid of pids) { console.log(`(matando proceso previo en :${port} — pid ${pid})`); killTree(pid); }
  return pids.size;
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function start() {
  if (!fs.existsSync(path.join(projectDir, 'package.json'))) {
    console.error(`ERROR no existe ${projectDir}/package.json`);
    process.exit(1);
  }
  // SIEMPRE reinicio limpio: primero el server rastreado, después cualquier zombi en el puerto.
  const prev = readState();
  if (prev && pidAlive(prev.pid)) killTree(prev.pid);
  try { fs.unlinkSync(STATE_FILE); } catch {}
  if (killPortListeners(PORT) > 0) await sleep(1200); // dar tiempo a que el SO libere el puerto
  fs.mkdirSync(STATE_DIR, { recursive: true });
  const out = fs.openSync(LOG_FILE, 'w');

  // Lanzamos el binario de Vite DIRECTO con node (nada de cmd.exe/npm: los .cmd son batch
  // y un CTRL+C heredado de la consola los deja colgados en "¿Terminar trabajo por lotes (S/N)?").
  const viteBin = path.join(projectDir, 'node_modules', 'vite', 'bin', 'vite.js');
  if (!fs.existsSync(viteBin)) {
    console.error(`ERROR no existe ${viteBin} — ¿falta npm install, o el proyecto no usa Vite? (si no es Vite, adapta este script al binario del dev server real)`);
    process.exit(1);
  }
  // --strictPort: si el puerto sigue ocupado, Vite FALLA en vez de auto-incrementar a un puerto nuevo.
  const child = spawn(process.execPath, [path.resolve(viteBin), '--port', String(PORT), '--strictPort'], {
    cwd: projectDir, detached: true, stdio: ['ignore', out, out], windowsHide: true,
  });
  child.unref();

  // 1) el log revela el puerto real (Vite puede auto-incrementarlo si 5173 está ocupado)
  const deadline = Date.now() + timeoutS * 1000;
  let url = null;
  let died = false;
  while (Date.now() < deadline && !url) {
    await sleep(700);
    const log = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, 'utf8') : '';
    const m = log.match(/https?:\/\/localhost:(\d+)/);
    if (m) { url = `http://localhost:${m[1]}/`; break; }
    if (!pidAlive(child.pid)) { died = true; break; } // murió sin publicar URL → fallar rápido
  }
  if (died) {
    const tail = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, 'utf8').split('\n').slice(-15).join('\n') : '(sin log)';
    console.error(`ERROR el dev server murió al arrancar — log:\n${tail}`);
    process.exit(1);
  }
  // 2) y el server debe responder de verdad
  let ready = false;
  while (url && Date.now() < deadline && !ready) {
    ready = await httpOk(url);
    if (!ready) await sleep(700);
  }
  if (!ready) {
    killTree(child.pid);
    console.error(`ERROR el dev server no respondió en ${timeoutS}s — revisa ${LOG_FILE}`);
    const tail = fs.existsSync(LOG_FILE) ? fs.readFileSync(LOG_FILE, 'utf8').split('\n').slice(-15).join('\n') : '(sin log)';
    console.error(tail);
    process.exit(1);
  }
  fs.writeFileSync(STATE_FILE, JSON.stringify({ pid: child.pid, url, projectDir, startedAt: new Date().toISOString() }, null, 2));
  console.log(`READY ${url} pid=${child.pid}`);
}

async function status() {
  const s = readState();
  if (!s) { console.log('NOT_STARTED'); return; }
  if (!pidAlive(s.pid)) { console.log('DEAD'); return; }
  console.log((await httpOk(s.url)) ? `RUNNING ${s.url} pid=${s.pid}` : `STARTING_OR_STUCK ${s.url} pid=${s.pid}`);
}

function stop() {
  const s = readState();
  if (!s) { console.log('NOT_STARTED'); return; }
  killTree(s.pid);
  try { fs.unlinkSync(STATE_FILE); } catch {}
  console.log(`STOPPED pid=${s.pid}`);
}

if (cmd === 'start') await start();
else if (cmd === 'status') await status();
else if (cmd === 'stop') stop();
else { console.error('Uso: dev-server.mjs start [dir] [timeoutS] | status | stop'); process.exit(1); }
