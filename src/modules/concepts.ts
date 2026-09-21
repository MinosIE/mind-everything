import type { ListModule } from '../core/types';
import { L } from '../core/i18n';
import { esc } from '../core/dom';

export const concepts: ListModule = {
  id: 'concepts',
  file: 'concepts.json',
  titleKey: 'concepts.title',
  subKey: 'concepts.sub',
  filters: [{ field: 'category', labelKey: 'ui.category' }],
  card: (it, L) => ({
    title: L(it, 'term'),
    sub: L(it, 'termEn'),
    one: L(it, 'oneLiner'),
    tags: [L(it, 'category')].filter(Boolean),
    level: it.level,
  }),
  detail: (it, L) => ({
    title: L(it, 'term'),
    sub: L(it, 'termEn'),
    sections: [
      { labelKey: 'ui.oneLiner', html: `<p>${esc(L(it, 'oneLiner'))}</p>` },
      { labelKey: 'ui.detail', html: `<p>${esc(L(it, 'detail'))}</p>` },
      { labelKey: 'ui.example', html: `<p>${esc(L(it, 'example'))}</p>` },
    ],
    relatedIds: it.related || [],
    sources: it.sources || [],
  }),
};
