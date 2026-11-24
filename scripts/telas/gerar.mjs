/**
 * Gera as telas ilustrativas (SVG) usadas nos slides no lugar de capturas de tela.
 * Cada arquivo em scripts/telas/aula-XX/*.mjs exporta `default` = { arquivo, svg } (ou uma lista deles),
 * com `arquivo` relativo a public/ (ex.: 'media/aula-04/tela-bubble-deploy.svg').
 * Uso: npm run telas            (todas)
 *      npm run telas -- aula-04 (só uma pasta)
 */
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, '../../public');
const filtro = process.argv[2];

const pastas = readdirSync(here, { withFileTypes: true })
  .filter((d) => d.isDirectory() && (!filtro || d.name === filtro))
  .map((d) => d.name)
  .sort();

let n = 0;
for (const pasta of pastas) {
  for (const f of readdirSync(join(here, pasta)).filter((x) => x.endsWith('.mjs')).sort()) {
    const mod = await import(pathToFileURL(join(here, pasta, f)).href);
    for (const t of [mod.default].flat()) {
      const out = join(pub, t.arquivo);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, t.svg);
      console.log(`public/${t.arquivo}  (${(t.svg.length / 1024).toFixed(0)} KB)`);
      n++;
    }
  }
}
console.log(`${n} tela(s) gerada(s).`);
