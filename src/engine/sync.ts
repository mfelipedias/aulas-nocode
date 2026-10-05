import type { DeckState } from './presentation';
import type { AccentKey, BackupVideo } from './types';

/** Dados do deck que a visão do apresentador precisa (enviados pela janela do deck). */
export interface DeckMeta {
  key: string;
  numero: number;
  titulo: string;
  accent: AccentKey;
  duracaoMin: number;
  slides: Array<{ title: string; notes?: string; video?: BackupVideo; media?: string[] }>;
}

/**
 * Protocolo entre a janela do deck e a visão do apresentador (BroadcastChannel, mesma origem).
 * O apresentador não importa os decks (nem o Three.js): recebe tudo por aqui.
 */
export type SyncMessage =
  | { type: 'state'; state: DeckState }
  | { type: 'meta'; meta: DeckMeta }
  | { type: 'hello' }
  | { type: 'cmd'; cmd: 'next' | 'prev' | 'blackout' | 'reduced' | 'video' | 'key'; key?: string }
  | { type: 'cmd'; cmd: 'goto'; index: number; step: number };

/** key = chave do deck no registro (?aula=01 -> "01"). */
export function channel(key: string) {
  const ch = new BroadcastChannel(`nocode-deck:${key}`);
  return {
    send(msg: SyncMessage) {
      ch.postMessage(msg);
    },
    on(fn: (msg: SyncMessage) => void) {
      ch.addEventListener('message', (e) => fn(e.data as SyncMessage));
    },
    close() {
      ch.close();
    },
  };
}
