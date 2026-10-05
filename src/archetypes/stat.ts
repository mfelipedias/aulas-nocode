import { gsap } from 'gsap';
import { h } from '../engine/dom';
import { M, motion } from '../engine/motion';
import type { CommonFields } from '../engine/types';
import { define, instance, shell } from './base';

export interface StatSecondary {
  /** Número (conta junto com o principal) ou texto pronto (ex.: "US$ 6,6 bi"). */
  valor: number | string;
  prefixo?: string;
  sufixo?: string;
  casas?: number;
  /** O que o segundo número significa (até ~70 caracteres). */
  rotulo: string;
}

export interface StatData extends CommonFields {
  /** Pergunta ou contexto exibido antes do número (passo 0). */
  contexto: string;
  valor: number;
  /**
   * Valor de partida da contagem (padrão 0). Maior que `valor` = contagem regressiva
   * (ex.: de: 120, valor: 0 conta de 120 até 0).
   */
  de?: number;
  prefixo?: string;
  sufixo?: string;
  casas?: number;
  /** O que o número significa (entra com o número). */
  descricao: string;
  /** Número secundário, à direita (ou sob a descrição quando há gráfico de unidades). */
  secundario?: StatSecondary;
  /** Fonte da informação. Use "TODO-fonte: ..." enquanto não houver citação confirmada. */
  fonte: string;
  /** Gráfico de unidades 10 x 10 (só faz sentido para percentuais). Padrão: true se sufixo = "%". */
  unidades?: boolean;
}

/** Arquétipo 4 — Estatística com número animado (para cima ou regressivo) e gráfico de unidades. */
export function stat(data: StatData) {
  return define('stat', data, `${data.prefixo ?? ''}${data.valor}${data.sufixo ?? ''}`, (d) => {
    const fmtN = (v: number, casas = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: casas, maximumFractionDigits: casas });
    const fmt = (v: number) => fmtN(v, d.casas ?? 0);
    const from = d.de ?? 0;
    const numEl = h('span.stat-num', fmt(from));
    const showUnits = d.unidades ?? d.sufixo === '%';
    const dots = showUnits ? Array.from({ length: 100 }, () => h('span.dot')) : [];
    const isTodo = /TODO-fonte/i.test(d.fonte);
    const sec = d.secundario;
    const secNum = sec && typeof sec.valor === 'number' ? (sec.valor as number) : null;
    const secEl = sec ? h('span.stat-second-num', secNum !== null ? fmtN(0, sec.casas ?? 0) : String(sec.valor)) : null;
    const secBlock = sec
      ? h(
          `div.stat-second${showUnits ? '.is-inline' : ''}`,
          { 'data-step': 1, 'data-reveal': 'fade', 'data-delay': 0.5 },
          h(
            'p.stat-second-value',
            sec.prefixo ? h('span.stat-second-affix', sec.prefixo) : null,
            secEl,
            sec.sufixo ? h('span.stat-second-affix', sec.sufixo) : null,
          ),
          h('p.stat-second-label', sec.rotulo),
        )
      : null;

    const el = shell(
      'stat',
      h('h2.t-h2.stat-context', { 'data-step': 0, 'data-delay': 0.3 }, d.contexto),
      h(
        'div.stat-figure',
        { 'data-step': 1, 'data-reveal': 'fade' },
        h('div.stat-value', d.prefixo ? h('span.stat-affix', d.prefixo) : null, numEl, d.sufixo ? h('span.stat-affix', d.sufixo) : null),
        h('p.stat-desc', d.descricao),
        showUnits ? secBlock : null,
      ),
      showUnits ? h('div.stat-units', { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 0.6, 'aria-hidden': 'true' }, ...dots) : secBlock,
      h(`p.stat-source${isTodo ? '.is-todo' : ''}`, { 'data-step': 1, 'data-delay': 0.9 }, d.fonte),
    );

    const counter = { v: from, s: 0 };
    const render = () => {
      numEl.textContent = fmt(counter.v);
      if (secEl && secNum !== null) secEl.textContent = fmtN(counter.s, sec!.casas ?? 0);
      if (showUnits) {
        const lit = Math.round(counter.v);
        dots.forEach((dot, i) => dot.classList.toggle('is-on', i < lit));
      }
    };

    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.28, 0.55], intensity: 0.8 } },
      onStep(step, dir) {
        gsap.killTweensOf(counter);
        const target = step >= 1 ? d.valor : from;
        const secTarget = step >= 1 && secNum !== null ? secNum : 0;
        if (dir === 1 && step === 1 && !motion.reduced) {
          counter.v = from;
          counter.s = 0;
          gsap.to(counter, { v: target, s: secTarget, duration: M.count, ease: 'power3.out', delay: 0.15, onUpdate: render });
        } else {
          counter.v = target;
          counter.s = secTarget;
          render();
        }
      },
    });
  });
}
