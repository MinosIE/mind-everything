import type { ListModule } from '../core/types';
import { L } from '../core/i18n';
import { esc } from '../core/dom';

export const compare: ListModule = {
  id: 'compare',
  file: 'compare.json',
  titleKey: 'compare.title',
  subKey: 'compare.sub',
  filters: [{ field: 'category', labelKey: 'ui.category' }],
  card: (it, L) => ({
    title: L(it, 'term'),
    sub: L(it, 'termEn'),
    one: L(it, 'oneLiner'),
    tags: [L(it, 'category')].filter(Boolean),
  }),
  detail: (it, L) => ({
    title: L(it, 'term'),
    sub: L(it, 'termEn'),
    sections: [
      { labelKey: 'ui.oneLiner', html: `<p>${esc(L(it, 'oneLiner'))}</p>` },
      { labelKey: 'ui.west', html: `<p>${esc(L(it, 'west'))}</p>` },
      { labelKey: 'ui.east', html: `<p>${esc(L(it, 'east'))}</p>` },
      { labelKey: 'ui.detail', html: `<p>${esc(L(it, 'detail'))}</p>` },
    ],
    relatedIds: it.related || [],
    sources: it.sources || [],
  }),
};
