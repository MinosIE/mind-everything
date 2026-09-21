import type { ListModule } from '../core/types';
import { L } from '../core/i18n';
import { esc } from '../core/dom';

export const timeline: ListModule = {
  id: 'timeline',
  file: 'timeline.json',
  titleKey: 'timeline.title',
  subKey: 'timeline.sub',
  mode: 'timeline',
  card: (it, L) => ({
    title: L(it, 'term'),
    sub: L(it, 'termEn'),
    one: L(it, 'oneLiner'),
  }),
  detail: (it, L) => ({
    title: L(it, 'term'),
    sub: [it.year, L(it, 'termEn')].filter(Boolean).join(' · '),
    sections: [
      { labelKey: 'ui.oneLiner', html: `<p>${esc(L(it, 'oneLiner'))}</p>` },
      { labelKey: 'ui.detail', html: `<p>${esc(L(it, 'detail'))}</p>` },
    ],
    relatedIds: it.related || [],
    sources: it.sources || [],
  }),
};
