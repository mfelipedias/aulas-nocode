import { feedback } from '../archetypes';
import type { SlideDef } from '../engine/types';

/** Insere o slide "Como foi a aula?" (QR do feedback e do mural) antes do encerramento, que é o último slide. */
export function comFeedback(aula: number, slides: SlideDef[]): SlideDef[] {
  return [
    ...slides.slice(0, -1),
    feedback({
      aula,
      title: 'Feedback da aula',
      notes: `Deixar o QR na tela por 1 a 2 minutos enquanto respondem (é anônimo por padrão).
QR menor: mural da turma, para enviar prints e arquivos do que fizeram hoje.
Resultados em feedback.html?resultados (pede a CHAVE_PROFESSOR do .env).`,
    }),
    ...slides.slice(-1),
  ];
}
