import QRCode from 'qrcode';
import { ImagePlus } from 'lucide';
import { h, maskedLines } from '../engine/dom';
import { icon } from '../engine/icons';
import type { CommonFields } from '../engine/types';
import { define, instance, shell } from './base';

export interface FeedbackData extends CommonFields {
  /** Número da aula: o QR abre feedback.html?aula=N. */
  aula: number;
  /** Frase grande, até 2 linhas (\n). Padrão: "Como foi\na aula de hoje?". */
  frase?: string;
}

/** Endereço absoluto a partir do endereço em que o deck está aberto (o mesmo que os alunos usam). */
const absoluto = (rel: string) => new URL(rel, location.href).href;
const curto = (url: string) => url.replace(/^https?:\/\//, '').replace(/\?.*$/, '');

function qr(url: string, width: number) {
  const canvas = h('canvas.qr-canvas') as HTMLCanvasElement;
  QRCode.toCanvas(canvas, url, { width, margin: 1, color: { dark: '#050608', light: '#f2f4f9' } }).catch(() => canvas.remove());
  return canvas;
}

/**
 * Arquétipo 26 — Feedback da aula. Penúltimo slide de cada aula, antes do encerramento.
 * QR grande para o formulário (feedback.html?aula=N) e QR menor para o mural da turma (mural.html).
 * Os resultados ficam em feedback.html?resultados (chave do professor).
 */
export function feedback(data: FeedbackData) {
  return define('feedback', data, 'Feedback da aula', (d) => {
    const urlFeedback = absoluto(`feedback.html?aula=${d.aula}`);
    const urlMural = absoluto(`mural.html?enviar&aula=${d.aula}`);
    const passos = ['Nota de 1 a 5', 'Como foi o ritmo', 'Um comentário, se quiser'];
    const el = shell(
      'feedback',
      h(
        'div.feedback-main',
        h('p.pause-kicker', { 'data-step': 0, 'data-delay': 0.2 }, 'Antes de sair'),
        h('h1.feedback-frase', { 'data-step': 0, 'data-reveal': 'mask', 'data-delay': 0.3 }, ...maskedLines(d.frase ?? 'Como foi\na aula de hoje?')),
        h('p.feedback-sub', { 'data-step': 0, 'data-delay': 0.6 }, 'Aponte a câmera do celular para o QR. Leva 30 segundos e pode ser anônimo.'),
        h(
          'ol.feedback-passos',
          { 'data-step': 0, 'data-delay': 0.8 },
          ...passos.map((p, i) => h('li', h('span.feedback-n', String(i + 1)), h('span', p))),
        ),
        h(
          'div.feedback-mural',
          { 'data-step': 0, 'data-delay': 1.1 },
          h('div.feedback-mural-qr', qr(urlMural, 132)),
          h(
            'div',
            h('p.feedback-mural-title', icon(ImagePlus, 32), 'Fez algo hoje? Mostre no mural da turma.'),
            h('p.feedback-mural-sub', 'Prints, arquivos e um texto curto: ', h('span.feedback-url', curto(urlMural))),
          ),
        ),
      ),
      h(
        'aside.feedback-card',
        { 'data-step': 0, 'data-reveal': 'fade', 'data-delay': 0.5 },
        qr(urlFeedback, 400),
        h('p.feedback-card-label', `Avalie a Aula ${d.aula}`),
        h('p.feedback-url', curto(urlFeedback)),
      ),
    );
    return instance(el, { scene: d.scene ?? { key: 'ambient', params: { focus: [0.78, 0.45], intensity: 0.7 } } });
  });
}
