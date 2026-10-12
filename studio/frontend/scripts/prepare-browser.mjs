import { mkdir, copyFile, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '../..');
const dest = path.join(root, 'frontend/public');
await mkdir(path.join(dest, 'python-runtime'), { recursive: true });
for (const name of ['pyodide.js','pyodide.mjs','pyodide.asm.mjs','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json']) {
  await copyFile(path.join(root,'frontend/node_modules/pyodide',name),path.join(dest,'python-runtime',name));
}
const sources = {};
async function collect(dir, prefix='pacce') {
  for(const entry of await readdir(dir,{withFileTypes:true})) {
    if (['api','utils','__pycache__'].includes(entry.name)) continue;
    const full=path.join(dir,entry.name), relative=prefix+'/'+entry.name;
    if(entry.isDirectory()) await collect(full,relative);
    else if(entry.name.endsWith('.py')) sources[relative]=await readFile(full,'utf8');
  }
}
await collect(path.join(root,'backend/src/pacce'));
sources['pacce_browser.py']=await readFile(path.join(root,'frontend/scripts/pacce_browser.py'),'utf8');
await writeFile(path.join(dest,'python-sources.json'),JSON.stringify(sources));
console.log('Motor Python preparado para navegador.');
