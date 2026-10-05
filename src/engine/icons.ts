import { createElement, type IconNode } from 'lucide';

/**
 * Ícone Lucide como SVG. Traço de 1,5 unidades no viewBox de 24 => 2 px renderizados a 32 px
 * (nunca abaixo de 2 px, regra de legibilidade no Meet).
 */
export function icon(node: IconNode, size = 40, cls = 'icon'): SVGElement {
  const sw = size >= 32 ? 1.5 : 2;
  return createElement(node, {
    width: size,
    height: size,
    'stroke-width': sw,
    class: cls,
    'aria-hidden': 'true',
  });
}
