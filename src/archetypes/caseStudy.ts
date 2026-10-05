import { gsap } from 'gsap';
import { Building2 } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import { logoMark, markKind } from '../engine/logos';
import { M, motion } from '../engine/motion';
import type { CommonFields } from '../engine/types';
import { platform } from '../content/platforms';
import { define, instance, shell, sourceLine } from './base';
import { mediaView, type Midia } from './parts/media';

export interface CaseResult {
  /** Número que conta (ex.: 40). Use `texto` para valores não numéricos. */
  valor?: number;
  casas?: number;
  prefixo?: string;
  /** Ex.: "%", " s", "x", " mil". */
  sufixo?: string;
  /** Valor pronto quando não for número contável (ex.: "5 min -> 40 s"). */
  texto?: string;
  /** O que o número mede (até ~50 caracteres). */
  rotulo: string;
}

export interface CaseData extends CommonFields {
  /** Nome da empresa/projeto. Sem logo da empresa: o nome em texto (nunca imitação). */
  empresa: string;
  /** Logo oficial da empresa (opcional), caminho em public/ (ex.: media/aula-03/icatu-logo.svg). */
  logoEmpresa?: Midia;
  /** Setor, país, porte (até ~50 caracteres). */
  contexto?: string;
  /** Plataforma usada (id de content/platforms.ts). */
  plataforma?: string;
  /** Até ~140 caracteres cada. */
  problema: string;
  solucao: string;
  /** 1 a 3 resultados. */
  resultados: CaseResult[];
  /** Obrigatória. "TODO-fonte: ..." aparece em âmbar. */
  fonte: string;
}

/** Estudo de caso: empresa, problema, solução e números de resultado (que contam). */
export function caseStudy(data: CaseData) {
  return define('case', data, `Caso: ${data.empresa}`, (d, ctx) => {
    const p = d.plataforma ? platform(d.plataforma) : null;
    const counters = d.resultados.map((r) => {
      const fmt = (v: number) => v.toLocaleString('pt-BR', { minimumFractionDigits: r.casas ?? 0, maximumFractionDigits: r.casas ?? 0 });
      const num = h('span.case-num', r.texto ?? fmt(r.valor ?? 0));
      return { r, num, fmt, state: { v: 0 } };
    });
    const brand = d.logoEmpresa
      ? h('div.case-logo', mediaView({ ...d.logoEmpresa, ajuste: 'conter', posicao: 'left center' }, ctx).el)
      : h('div.case-logo.is-text', icon(Building2, 40));
    const el = shell(
      'case',
      h(
        'div.case-grid',
        h(
          'div.case-main',
          h(
            'header.case-head',
            { 'data-step': 0, 'data-delay': 0.1 },
            brand,
            h('div', h('h1.case-company', d.empresa), d.contexto ? h('p.case-context', d.contexto) : null),
          ),
          h('div.case-block', { 'data-step': 0, 'data-delay': 0.35 }, h('p.case-label', 'Problema'), h('p.case-text', d.problema)),
          h(
            'div.case-block',
            { 'data-step': 1 },
            h('p.case-label', 'Solução', p ? h('span.case-with', 'com', logoMark(p, 40), markKind(p) === 'symbol' ? h('span', p.name) : null) : null),
            h('p.case-text', d.solucao),
          ),
        ),
        h(
          'div.case-results',
          ...counters.map((c, i) =>
            h(
              'div.case-result',
              { 'data-step': 2, 'data-delay': i * 0.12 },
              h('p.case-value', c.r.prefixo ? h('span.case-affix', c.r.prefixo) : null, c.num, c.r.sufixo ? h('span.case-affix', c.r.sufixo) : null),
              h('p.case-result-label', c.r.rotulo),
            ),
          ),
        ),
      ),
      sourceLine(d.fonte, 2, 'case-source'),
    );
    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.78, 0.55], intensity: 0.8 } },
      onStep(step, dir) {
        counters.forEach((c, i) => {
          if (c.r.texto !== undefined || c.r.valor === undefined) return;
          gsap.killTweensOf(c.state);
          const target = step >= 2 ? c.r.valor : 0;
          const render = () => (c.num.textContent = c.fmt(c.state.v));
          if (dir === 1 && step === 2 && !motion.reduced) {
            c.state.v = 0;
            gsap.to(c.state, { v: target, duration: M.count, ease: 'power3.out', delay: 0.2 + i * 0.12, onUpdate: render });
          } else {
            c.state.v = target;
            render();
          }
        });
      },
    });
  });
}
