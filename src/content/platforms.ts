import {
  siAirtable,
  siCursor,
  siExcalidraw,
  siFigma,
  siFirebase,
  siFramer,
  siGithub,
  siGithubcopilot,
  siGlide,
  siMake,
  siN8n,
  siNotion,
  siPostman,
  siReplit,
  siRetool,
  siStripe,
  siSupabase,
  siTrello,
  siTypeform,
  siV0,
  siVercel,
  siWebflow,
  siWindsurf,
  siWix,
  siWordpress,
  siZapier,
} from 'simple-icons';
import type { LogoSource } from '../engine/logos';

export interface Platform extends LogoSource {
  category: CategoryId;
  /** Ferramenta citada na ementa da disciplina (destacada no último passo da constelação). */
  disciplina?: boolean;
  /**
   * Fora da constelação padrão da aula 1 (que mostra só as 19 plataformas base).
   * Continua disponível para logoTile/case/grid/flow e para constellation({ ids }).
   */
  extra?: boolean;
}

export type CategoryId = 'sites' | 'apps' | 'automacao' | 'dados' | 'ia';

export interface Category {
  id: CategoryId;
  label: string;
  /** Uma frase: o que essa família de ferramentas faz. */
  desc: string;
}

export const CATEGORIES: Category[] = [
  { id: 'sites', label: 'Sites e design', desc: 'Páginas, interfaces e protótipos' },
  { id: 'apps', label: 'Apps visuais', desc: 'Telas, dados e lógica' },
  { id: 'automacao', label: 'Automação', desc: 'Gatilhos e integrações' },
  { id: 'dados', label: 'Dados e back-end', desc: 'Tabelas, bancos e APIs' },
  { id: 'ia', label: 'Apps por IA', desc: 'Do texto ao app publicado' },
];

/**
 * Plataformas. Ordem de marca: SVG oficial em src/assets/logos/oficiais/<id>.svg > simple-icons > nome.
 * `restrita: true` = diretriz da marca exige permissão para o logo (Google, Microsoft, Anthropic,
 * OpenAI): aparece só o nome; mostre o produto com capturas feitas pelo professor.
 * `hex` = cor da marca para a luz difusa atrás do ladrilho (quando não vem do simple-icons).
 */
export const PLATFORMS: Platform[] = [
  // ---- Constelação base (aula 1): 19 plataformas ----
  { id: 'webflow', name: 'Webflow', si: siWebflow, category: 'sites', disciplina: true },
  { id: 'framer', name: 'Framer', si: siFramer, category: 'sites', disciplina: true },
  { id: 'figma', name: 'Figma', si: siFigma, category: 'sites', disciplina: true },
  { id: 'wix', name: 'Wix', si: siWix, category: 'sites' },

  { id: 'bubble', name: 'Bubble', hex: '#0205D3', category: 'apps', disciplina: true },
  { id: 'glide', name: 'Glide', si: siGlide, category: 'apps', disciplina: true },
  { id: 'appsheet', name: 'AppSheet', restrita: true, category: 'apps', disciplina: true },
  { id: 'flutterflow', name: 'FlutterFlow', hex: '#4B39EF', category: 'apps' },

  { id: 'make', name: 'Make', si: siMake, category: 'automacao', disciplina: true },
  { id: 'zapier', name: 'Zapier', si: siZapier, category: 'automacao', disciplina: true },
  { id: 'n8n', name: 'n8n', si: siN8n, category: 'automacao' },

  { id: 'airtable', name: 'Airtable', si: siAirtable, category: 'dados' },
  { id: 'notion', name: 'Notion', si: siNotion, category: 'dados' },
  { id: 'supabase', name: 'Supabase', si: siSupabase, category: 'dados' },
  { id: 'sheets', name: 'Google Sheets', restrita: true, category: 'dados' },

  { id: 'lovable', name: 'Lovable', hex: '#FF5C8A', category: 'ia' },
  { id: 'v0', name: 'v0', si: siV0, category: 'ia' },
  { id: 'bolt', name: 'Bolt.new', category: 'ia' },
  { id: 'replit', name: 'Replit', si: siReplit, category: 'ia' },

  // ---- Extras (casos, comparações, aulas 2 a 4) ----
  { id: 'wordpress', name: 'WordPress', si: siWordpress, category: 'sites', extra: true },
  { id: 'excalidraw', name: 'Excalidraw', si: siExcalidraw, category: 'sites', extra: true },
  { id: 'softr', name: 'Softr', category: 'apps', extra: true },
  { id: 'adalo', name: 'Adalo', category: 'apps', extra: true },
  { id: 'weweb', name: 'WeWeb', category: 'apps', extra: true },
  { id: 'retool', name: 'Retool', si: siRetool, category: 'apps', extra: true },
  { id: 'outsystems', name: 'OutSystems', hex: '#E9462A', category: 'apps', extra: true },
  { id: 'mendix', name: 'Mendix', hex: '#0CABF9', category: 'apps', extra: true },
  { id: 'powerapps', name: 'Power Apps', restrita: true, category: 'apps', extra: true },
  { id: 'powerautomate', name: 'Power Automate', restrita: true, category: 'automacao', extra: true },
  { id: 'typeform', name: 'Typeform', si: siTypeform, category: 'automacao', extra: true },
  { id: 'stripe', name: 'Stripe', si: siStripe, category: 'automacao', extra: true },
  { id: 'xano', name: 'Xano', category: 'dados', extra: true },
  { id: 'firebase', name: 'Firebase', restrita: true, si: siFirebase, category: 'dados', extra: true },
  { id: 'trello', name: 'Trello', si: siTrello, category: 'dados', extra: true },
  { id: 'postman', name: 'Postman', si: siPostman, category: 'dados', extra: true },
  { id: 'base44', name: 'Base44', category: 'ia', extra: true },
  { id: 'cursor', name: 'Cursor', si: siCursor, category: 'ia', extra: true },
  { id: 'windsurf', name: 'Windsurf', si: siWindsurf, category: 'ia', extra: true },
  { id: 'devin', name: 'Devin', category: 'ia', extra: true },
  { id: 'copilot', name: 'GitHub Copilot', si: siGithubcopilot, category: 'ia', extra: true },
  { id: 'github', name: 'GitHub', si: siGithub, category: 'dados', extra: true },
  { id: 'vercel', name: 'Vercel', si: siVercel, category: 'ia', extra: true },
  { id: 'aistudio', name: 'Google AI Studio', restrita: true, category: 'ia', extra: true },
  { id: 'gemini', name: 'Gemini', restrita: true, category: 'ia', extra: true },
  { id: 'chatgpt', name: 'ChatGPT', restrita: true, category: 'ia', extra: true },
  { id: 'codex', name: 'Codex', restrita: true, category: 'ia', extra: true },
  { id: 'claude', name: 'Claude', restrita: true, category: 'ia', extra: true },
  { id: 'claudecode', name: 'Claude Code', restrita: true, category: 'ia', extra: true },
];

export const platform = (id: string) => {
  const p = PLATFORMS.find((x) => x.id === id);
  if (!p) throw new Error(`Plataforma desconhecida: ${id}. Ids válidos estão em src/content/platforms.ts.`);
  return p;
};
