import type { IconNode } from 'lucide';
import { MonitorSmartphone, Server } from 'lucide';
import { h } from '../engine/dom';
import { icon } from '../engine/icons';
import { logoMark } from '../engine/logos';
import type { CommonFields } from '../engine/types';
import { platform } from '../content/platforms';
import { define, header, instance, shell } from './base';
import { codePanel } from './parts/code';

export interface Endpoint {
  /** Ex.: "Seu app no Bubble". Até ~22 caracteres. */
  rotulo: string;
  sub?: string;
  plataforma?: string;
  icone?: IconNode;
}

export interface RequestResponseData extends CommonFields {
  titulo: string;
  subtitulo?: string;
  cliente: Endpoint;
  servidor: Endpoint;
  requisicao: {
    metodo: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    /** Caminho ou URL curta (até ~44 caracteres). */
    url: string;
    /** Até 2 cabeçalhos ("Content-Type: application/json"). */
    cabecalhos?: string[];
    /** Corpo JSON, até 6 linhas. */
    corpo?: string;
  };
  resposta: {
    status: number;
    /** Ex.: "OK", "Created", "Not Found". */
    texto?: string;
    corpo?: string;
  };
}

function endpointBox(e: Endpoint, fallback: IconNode, side: 'l' | 'r') {
  const p = e.plataforma ? platform(e.plataforma) : null;
  return h(
    `div.rr-end.is-${side}`,
    { 'data-step': 0, 'data-delay': side === 'l' ? 0.2 : 0.3 },
    h('div.rr-end-mark', p ? logoMark(p, 48) : icon(e.icone ?? fallback, 48)),
    h('p.rr-end-label', e.rotulo),
    e.sub ? h('p.rr-end-sub', e.sub) : null,
  );
}

/** Requisição e resposta HTTP: cliente e servidor, com o pedido (passo 1) e a resposta (passo 2). */
export function requestResponse(data: RequestResponseData) {
  return define('requestResponse', data, data.titulo, (d) => {
    const rq = d.requisicao;
    const rs = d.resposta;
    const reqText = [`${rq.metodo} ${rq.url}`, ...(rq.cabecalhos ?? []), ...(rq.corpo ? ['', rq.corpo.trim()] : [])].join('\n');
    const resText = [`HTTP/1.1 ${rs.status} ${rs.texto ?? ''}`.trim(), ...(rs.corpo ? ['', rs.corpo.trim()] : [])].join('\n');
    const reqPanel = codePanel({ codigo: reqText, linguagem: 'http', tamanho: 'compacto', numeros: false });
    const resPanel = codePanel({ codigo: resText, linguagem: 'http', tamanho: 'compacto', numeros: false });
    const ok = rs.status < 400;
    const el = shell(
      'requestResponse',
      header(d.titulo, d.subtitulo),
      h(
        'div.rr-grid',
        endpointBox(d.cliente, MonitorSmartphone, 'l'),
        h(
          'div.rr-mid',
          h(
            'div.rr-msg.is-req',
            { 'data-step': 1 },
            h('div.rr-arrow', h('span.rr-arrow-label', 'Requisição'), h('span.rr-line'), h('span.rr-head')),
            reqPanel.el,
          ),
          h(
            `div.rr-msg.is-res${ok ? '' : '.is-error'}`,
            { 'data-step': 2 },
            h('div.rr-arrow.is-back', h('span.rr-head'), h('span.rr-line'), h('span.rr-arrow-label', 'Resposta')),
            resPanel.el,
          ),
        ),
        endpointBox(d.servidor, Server, 'r'),
      ),
    );
    return instance(el, {
      scene: d.scene ?? { key: 'ambient', params: { focus: [0.5, 0.9], intensity: 0.5, dust: 0.35 } },
    });
  });
}
