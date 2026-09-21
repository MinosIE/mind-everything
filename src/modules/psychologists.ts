import type { ListModule } from '../core/types';
import { L } from '../core/i18n';
import { esc } from '../core/dom';

function listHtml(arr: unknown): string {
  const items = Array.isArray(arr) ? arr.filter(Boolean) : [];
  if (!items.length) return '';
  return `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
}

export const psychologists: ListModule = {
  id: 'psychologists',
  file: 'psychologists.json',
  titleKey: 'psychologists.title',
  subKey: 'psychologists.sub',
  filters: [{ field: 'field', labelKey: 'ui.field' }],
  card: (it, L) => ({
    title: L(it, 'name'),
    sub: [L(it, 'era'), L(it, 'field')].filter(Boolean).join(' · '),
    one: L(it, 'oneLiner'),
    tags: (L(it, 'keyIdeas') || []).slice(0, 3),
  }),
  detail: (it, L) => ({
    title: L(it, 'name'),
    sub: L(it, 'field'),
    sections: [
      { labelKey: 'ui.oneLiner', html: `<p>${esc(L(it, 'oneLiner'))}</p>` },
      { labelKey: 'ui.detail', html: `<p>${esc(L(it, 'detail'))}</p>` },
      { labelKey: 'ui.ideas', html: listHtml(L(it, 'keyIdeas')) },
      { labelKey: 'ui.works', html: listHtml(L(it, 'works')) },
    ],
    relatedIds: it.related || [],
    sources: it.sources || [],
  }),
};
