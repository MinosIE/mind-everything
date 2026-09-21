import type { ListModule } from '../core/types';
import { L } from '../core/i18n';
import { esc } from '../core/dom';

export const glossary: ListModule = {
  id: 'glossary',
  file: 'glossary.json',
  titleKey: 'glossary.title',
  subKey: 'glossary.sub',
  mode: 'list',
  inlineSearch: 'glossaryQuery',
  filters: [{ field: 'category', labelKey: 'ui.category' }],
  card: (it, L) => ({
    title: L(it, 'term'),
    sub: L(it, 'termEn'),
    one: L(it, 'def'),
    plain: L(it, 'plain'),
    tags: (it.tags || []).filter(Boolean),
  }),
  detail: (it, L) => ({
    title: L(it, 'term'),
    sub: L(it, 'termEn'),
    sections: [
      { labelKey: 'ui.def', html: `<p>${esc(L(it, 'def'))}</p>` },
      { labelKey: 'ui.plain', html: `<p>${esc(L(it, 'plain'))}</p>` },
    ],
    relatedIds: it.related || [],
    sources: it.sources || [],
  }),
};
