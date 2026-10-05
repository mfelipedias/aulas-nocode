import type { DeckDef } from '../engine/types';

type DeckLoader = () => Promise<{ default: DeckDef }>;

/**
 * Registro dos decks, descoberto automaticamente: toda pasta src/decks/aula-NN/ com um index.ts
 * vira a chave "NN" (carregada sob demanda). A galeria de QA fica em "galeria".
 * URL: index.html?aula=01 (padrão 01) ... ?aula=04, e index.html?aula=galeria.
 * Nova aula: basta criar a pasta aula-05/index.ts exportando um DeckDef; nada a registrar aqui.
 */
const AULAS = import.meta.glob<{ default: DeckDef }>('./aula-*/index.ts');

export const DECKS: Record<string, DeckLoader> = {
  ...Object.fromEntries(
    Object.entries(AULAS)
      .map(([path, load]) => [/aula-(\w+)\//.exec(path)?.[1] ?? path, load] as const)
      .sort(([a], [b]) => a.localeCompare(b)),
  ),
  galeria: () => import('./galeria/index'),
};

/** Normaliza o parâmetro ?aula= para a chave do registro ("1" -> "01"). */
export function deckKey(param: string | null): string {
  const raw = (param ?? '01').trim().toLowerCase();
  const key = /^\d+$/.test(raw) ? raw.padStart(2, '0') : raw;
  return key in DECKS ? key : '01';
}

export async function loadDeck(param: string | null): Promise<DeckDef> {
  return (await DECKS[deckKey(param)]()).default;
}

export const ACCENTS = {
  aula1: { base: '#4f7bff', tint: '#a8beff', deep: '#0d1a47' },
  aula2: { base: '#8b5cf6', tint: '#c9b6ff', deep: '#1f1147' },
  aula3: { base: '#1fc8a9', tint: '#8fead8', deep: '#06352e' },
  aula4: { base: '#f5a524', tint: '#ffd68f', deep: '#3a2606' },
} as const;
