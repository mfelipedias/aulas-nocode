// Gera a apostila em PDF a partir do roteiro web (public/roteiro-hackathon-bubble-make-sheets.html).
// O roteiro continua sendo a fonte única: este script reaproveita o conteúdo e o CSS dele,
// acrescenta capa, "como usar", sumário com páginas e o acabamento de impressão, e imprime com o Chromium.
//
// Duas passadas: a primeira descobre em que página cai cada etapa e subseção (marcadores lidos
// com pdftotext), a segunda imprime o PDF final com esses números no sumário e no mapa das etapas.
//
// Uso: npm run apostila   (requer Chromium/Chrome e poppler-utils; CHROME=/caminho/do/chrome para forçar)
import { readFileSync, writeFileSync, mkdtempSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { tmpdir, homedir } from 'node:os';
import { pathToFileURL } from 'node:url';

const raiz = resolve(import.meta.dirname, '../..');
const aqui = import.meta.dirname;
const ORIGEM = join(raiz, 'public/roteiro-hackathon-bubble-make-sheets.html');
const SAIDA = join(raiz, 'public/apostila-hackathon-bubble-make-sheets.pdf');

// Trechos escritos para o professor ou para a versão interativa, reescritos para a apostila do aluno.
// Se o roteiro mudar e um trecho não for encontrado, o script avisa em vez de falhar calado.
const TROCAS = [
  ['Cada cartão leva à etapa. Ao terminar uma, marque "Etapa concluída" no fim dela; o progresso fica salvo neste navegador.',
    'Cada cartão mostra a página em que a etapa começa; no PDF, clique nele para ir direto. Ao terminar uma etapa, marque o quadrado no fim dela.'],
  ['É a pergunta mais provável dos alunos.', 'É a pergunta mais comum.'],
  ['Decisões que valem uma pausa na aula', 'Decisões de projeto'],
  ['O T6 vale ouro em aula', 'Por que o T6 importa'],
  [' (os alunos usam o próprio nome)', ' (com o seu nome)'],
];

function chrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const pw = join(homedir(), '.cache/ms-playwright');
  if (existsSync(pw)) {
    const d = readdirSync(pw).filter((n) => /^chromium-\d+$/.test(n)).sort().pop();
    if (d) for (const sub of ['chrome-linux64/chrome', 'chrome-linux/chrome']) if (existsSync(join(pw, d, sub))) return join(pw, d, sub);
  }
  for (const b of ['google-chrome', 'chromium', 'chromium-browser']) {
    try { return execFileSync('which', [b]).toString().trim(); } catch {}
  }
  throw new Error('Chromium não encontrado. Defina CHROME=/caminho/do/chrome.');
}

function trecho(html, re, nome) {
  const m = html.match(re);
  if (!m) throw new Error(`Não achei ${nome} no roteiro.`);
  return m[1];
}

let src = readFileSync(ORIGEM, 'utf8');
for (const [de, para] of TROCAS) {
  if (!src.includes(de)) console.warn(`aviso: trecho não encontrado no roteiro: "${de.slice(0, 60)}…"`);
  src = src.split(de).join(para);
}

const estilo = trecho(src, /<style>([\s\S]*?)<\/style>/, 'o <style>');
const icones = trecho(src, /(<svg width="0" height="0"[\s\S]*?<\/svg>)/, 'os ícones');
const secoes = trecho(src, /(<section class="stage"[\s\S]*<\/section>)/, 'as seções');
const script = trecho(src, /<script>([\s\S]*?)<\/script>/, 'o script');
const titulo = trecho(src, /<header class="hero">[\s\S]*?<h1>([\s\S]*?)<\/h1>/, 'o título');
const descricao = trecho(src, /<meta name="description" content="([^"]*)"/, 'a descrição');
const fatos = trecho(src, /(<div class="facts">[\s\S]*?<\/div>\s*<\/div>)/, 'os números da capa');

const capa = readFileSync(join(aqui, 'capa.html'), 'utf8')
  .replace('{{TITULO}}', titulo)
  .replace('{{DESCRICAO}}', descricao)
  .replace('{{FATOS}}', fatos);

function montar(paginas) {
  return `<!doctype html>
<html lang="pt-BR" data-theme="light">
<head>
<meta charset="utf-8">
<title>Apostila · Roteiro de Construção · Hackathon No-Code 2026</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;600&display=block">
<style>${estilo}</style>
<style>${readFileSync(join(aqui, 'apostila.css'), 'utf8')}</style>
</head>
<body>
${icones}
${capa}
<main class="miolo">
${secoes}
</main>
<script>${script}</script>
<script>window.__PAGINAS=${JSON.stringify(paginas)};</script>
<script>${readFileSync(join(aqui, 'apostila.js'), 'utf8')}</script>
</body>
</html>`;
}

const bin = chrome();
const tmp = mkdtempSync(join(tmpdir(), 'apostila-'));

function imprimir(paginas, pdf) {
  const html = join(tmp, 'apostila.html');
  writeFileSync(html, montar(paginas));
  execFileSync(bin, [
    '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--no-pdf-header-footer', '--generate-pdf-document-outline',
    '--run-all-compositor-stages-before-draw', '--virtual-time-budget=20000',
    `--print-to-pdf=${pdf}`, pathToFileURL(html).href,
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
}

// 1ª passada: onde cai cada marcador?
const rascunho = join(tmp, 'rascunho.pdf');
imprimir(null, rascunho);
const texto = execFileSync('pdftotext', ['-enc', 'UTF-8', rascunho, '-']).toString();
const paginas = {};
texto.split('\f').forEach((pg, i) => {
  for (const m of pg.matchAll(/⟦([\w.-]+)⟧/g)) paginas[m[1]] ??= i + 1;
});
if (!paginas.s0) throw new Error('Os marcadores de página não apareceram no PDF de rascunho.');

// 2ª passada: PDF final com o sumário numerado.
imprimir(paginas, SAIDA);
const info = execFileSync('pdfinfo', [SAIDA]).toString();
console.log(`Apostila gerada: ${SAIDA} (${info.match(/Pages:\s+(\d+)/)[1]} páginas)`);
rmSync(tmp, { recursive: true, force: true });
