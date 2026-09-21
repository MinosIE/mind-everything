import type { ListModule } from '../core/types';
import { L } from '../core/i18n';
import { esc } from '../core/dom';

function listHtml(arr: unknown): string {
  const items = Array.isArray(arr) ? arr.filter(Boolean) : [];
  if (!items.length) return '';
  return `<ul>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
}

export const schools: ListModule = {
  id: 'schools',
  file: 'schools.json',
  titleKey: 'schools.title',
  subKey: 'schools.sub',
  filters: [{ field: 'era', labelKey: 'ui.era' }],
  card: (it, L) => ({
    title: L(it, 'name'),
    sub: L(it, 'era'),
    one: L(it, 'oneLiner'),
    tags: (L(it, 'keyIdeas') || []).slice(0, 3),
  }),
  detail: (it, L) => ({
    title: L(it, 'name'),
    sub: L(it, 'era'),
    sections: [
      { labelKey: 'ui.core', html: `<p>${esc(L(it, 'core'))}</p>` },
      { labelKey: 'ui.founders', html: listHtml(L(it, 'founders')) },
      { labelKey: 'ui.keyIdeas', html: listHtml(L(it, 'keyIdeas')) },
      { labelKey: 'ui.strengths', html: `<p>${esc(L(it, 'strengths'))}</p>` },
      { labelKey: 'ui.criticisms', html: `<p>${esc(L(it, 'criticisms'))}</p>` },
    ],
    relatedIds: it.related || [],
    sources: it.sources || [],
  }),
};
