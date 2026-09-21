import type { ListModule } from '../core/types';
import { L } from '../core/i18n';
import { esc } from '../core/dom';

export const experiments: ListModule = {
  id: 'experiments',
  file: 'experiments.json',
  titleKey: 'experiments.title',
  subKey: 'experiments.sub',
  filters: [{ field: 'category', labelKey: 'ui.category' }],
  card: (it, L) => ({
    title: L(it, 'term'),
    sub: [it.year, L(it, 'termEn')].filter(Boolean).join(' · '),
    one: L(it, 'oneLiner'),
    tags: [L(it, 'category')].filter(Boolean),
  }),
  detail: (it, L) => ({
    title: L(it, 'term'),
    sub: [it.year, L(it, 'termEn')].filter(Boolean).join(' · '),
    sections: [
      { labelKey: 'ui.oneLiner', html: `<p>${esc(L(it, 'oneLiner'))}</p>` },
      { labelKey: 'ui.detail', html: `<p>${esc(L(it, 'detail'))}</p>` },
      { labelKey: 'ui.ethics', html: `<p>${esc(L(it, 'ethics'))}</p>` },
    ],
    relatedIds: it.related || [],
    sources: it.sources || [],
  }),
};
