import { Timer } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import { logoMark, markKind } from '../engine/logos';
import type { CommonFields } from '../engine/types';
import { PLATFORMS, platform } from '../content/platforms';
import { define, instance, shell, sourceLine } from './base';
import { mediaStack, type Midia } from './parts/media';

export interface DemoData extends CommonFields {
  /**
   * id em content/platforms.ts (mostra o logo). Qualquer outro texto (ex.: 'Navegador + ViaCEP')
   * aparece como nome em texto, sem logo.
   */
  plataforma: string;
  titulo: string;
  /** O que vamos construir, em ordem (são passos reais da demo). */
  passos: string[];
  duracao: string;
  /** Endereço exibido na barra do navegador. */
  url: string;
  /** Captura real (caminho em public/). Sem captura: esquema do que será construído. */
  captura?: string;
  /** Descrição da captura (texto alternativo e quadro pendente). Padrão: "Captura de tela: <plataforma>". */
  capturaDescricao?: string;
  /** Troca a captura da moldura a partir de um passo (o passo n = item n da lista acendeu). */
  trocas?: Array<{ passo: number; captura: string; descricao?: string }>;
  /** Esquema exibido quando não há captura. */
  esquema?: { titulo: string; campos: string[]; botao: string };
  /** Fonte (veículo e data), no pé do slide, na mesma posição do stat. */
  fonte?: string;
}

/** Arquétipo 9 — Passagem para demonstração ao vivo. Tecla V abre o vídeo de backup. */
export function demo(data: DemoData) {
  return define('demo', data, `Demo: ${data.titulo}`, (d, ctx) => {
    const known = PLATFORMS.some((x) => x.id === d.plataforma);
    const p = known ? platform(d.plataforma) : { id: 'texto', name: d.plataforma, restrita: true };
    const trocas = [...(d.trocas ?? [])].sort((a, b) => a.passo - b.passo);
    const shots: Midia[] = d.captura
      ? [
          { src: d.captura, descricao: d.capturaDescricao ?? `Captura de tela: ${p.name}` },
          ...trocas.map((t) => ({ src: t.captura, descricao: t.descricao ?? `Captura de tela: ${p.name}` })),
        ]
      : [];
    const stack = shots.length ? mediaStack(shots, ctx) : null;
    const inner = stack
      ? stack.el
      : d.esquema
        ? h(
            'div.wire',
            h('div.wire-nav', h('span.wire-logo'), h('span.wire-link'), h('span.wire-link'), h('span.wire-link')),
            h(
              'div.wire-body',
              h(
                'div.wire-copy',
                h('p.wire-title', d.esquema.titulo),
                h('span.wire-line'),
                h('span.wire-line.short'),
                h(
                  'div.wire-form',
                  ...d.esquema.campos.map((c) => h('div.wire-field', h('span.wire-field-label', c))),
                  h('div.wire-button', d.esquema.botao),
                ),
              ),
              h('div.wire-image', h('span.wire-image-label', 'Imagem do evento')),
            ),
          )
        : null;

    const el = shell(
      'demo',
      h(
        'div.demo-left',
        h('p.demo-kicker', { 'data-step': 0, 'data-delay': 0.2 }, h('span.live-dot'), 'Demonstração ao vivo'),
        h('div.demo-platform', { 'data-step': 0, 'data-delay': 0.3 }, logoMark(p, 56), markKind(p) === 'symbol' ? h('span.demo-platform-name', p.name) : null),
        h('h1.t-h1.demo-title', { 'data-step': 0, 'data-delay': 0.4 }, d.titulo),
        h(
          'ol.demo-steps',
          ...d.passos.map((s, i) =>
            h('li', { 'data-step': i + 1 }, h('span.demo-step-n', String(i + 1)), h('span', s)),
          ),
        ),
        h('p.demo-duration', { 'data-step': 0, 'data-delay': 0.6 }, icon(Timer, 32), h('span', d.duracao)),
      ),
      sourceLine(d.fonte, 0, 'source-foot'),
      h(
        'div.demo-right',
        { 'data-step': 0, 'data-delay': 0.35 },
        h(
          'div.browser',
          h(
            'div.browser-bar',
            h('span.browser-dots', h('i'), h('i'), h('i')),
            h('span.browser-url', d.url),
          ),
          h('div.browser-view', inner),
        ),
      ),
    );

    if (d.fonte) el.classList.add('has-source');
    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.75, 0.5], intensity: 1 } },
      onStep(step, dir) {
        if (!stack) return;
        let layer = 0;
        trocas.forEach((t, i) => {
          if (step >= t.passo) layer = i + 1;
        });
        stack.show(layer, dir !== 0);
      },
    });
  });
}
