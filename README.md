# Deck v2: aulas ao vivo de No-Code Development Platforms

Apresentação web (Vite + TypeScript + Three.js + GSAP) das quatro aulas ao vivo da disciplina No-Code Development Platforms (08, 15, 22 e 29/10/2026). Roda offline, sem nenhum aluno, em 1920 × 1080.

## Comandos

```bash
npm install          # uma vez
npm run dev          # desenvolvimento: http://localhost:5180
npm run build        # checagem de tipos + build estático em dist/
npm run preview      # serve dist/ em http://localhost:5181 (use este na aula)
```

## Subir numa VPS com Docker

Requisito: Docker com o plugin Compose. Na VPS:

```bash
git clone https://github.com/mfelipedias/aulas-nocode.git
cd aulas-nocode
docker compose up -d
```

As aulas ficam em `http://<ip-da-vps>:8080`. Para usar outra porta, crie um `.env` a partir do `.env.example` e mude `PORTA`.

- **Capturas e vídeos:** copie para `public/media/aula-0N/` dentro da pasta clonada (por exemplo com `scp`). A pasta é montada no container, então os arquivos aparecem na hora, sem rebuild.
- **Atualizar o deck:** `git pull && docker compose up -d --build`.
- **Parar:** `docker compose down`.
- **HTTPS com domínio:** aponte o proxy reverso que já roda na VPS (Nginx, Caddy ou Traefik) para `http://127.0.0.1:8080`. O container não precisa de nenhuma configuração extra.

## Endereços

| URL | O que abre |
|---|---|
| `index.html` (sem parâmetros) | Painel principal: as quatro aulas com data, slides, "Apresentar" (deck + apresentador), pendências e PDF; teclas 1 a 4 abrem a aula |
| `index.html?aula=01` ... `?aula=04` | Deck de cada aula (descoberta automática de `src/decks/aula-NN/`) |
| `index.html?aula=galeria` | Galeria com todos os arquétipos |
| `presenter.html?aula=0N` | Visão do apresentador (ou tecla P no deck) |
| `index.html?aula=0N&rascunho=1` | Mostra em âmbar as capturas que ainda faltam |
| `index.html?aula=0N&print=1` | Todos os slides para PDF (Ctrl+P, sem margens, com gráficos de fundo) |
| `index.html?aula=0N#/12/3` | Link direto para o slide 12, passo 3 |

## Teclas

Seta direita, espaço ou Page Down avançam; seta esquerda ou Page Up voltam. O ou Esc: visão geral. P: apresentador. A: volta ao painel das aulas. F: tela cheia. B ou ponto: tela preta. V: vídeo de backup. T: pausa a contagem da pausa e o cronômetro do slide. M: movimento reduzido. D: fps. H: ajuda.

## Onde está cada coisa

- `src/decks/aula-0N/`: conteúdo de cada aula (dados e notas do apresentador).
- `src/archetypes/`: os arquétipos de slide.
- `public/media/aula-0N/`: capturas e vídeos de backup (os que ainda não existem aparecem como "Captura pendente").
- O guia de autoria, a direção de arte e a lista de produção ficam na pasta de planejamento do professor, fora deste repositório.

## Marcas e logotipos

Os logotipos em `src/assets/logos/oficiais/` foram obtidos nas páginas oficiais de marca de cada empresa e são usados aqui apenas de forma editorial e educacional. Eles pertencem às respectivas empresas e não estão cobertos por nenhuma licença deste repositório. Origem, data e regras de uso de cada arquivo: [`src/assets/logos/FONTES.md`](src/assets/logos/FONTES.md). Demais ícones de marca vêm do pacote [simple-icons](https://simpleicons.org) (CC0 para os dados; as marcas continuam pertencendo aos donos).
