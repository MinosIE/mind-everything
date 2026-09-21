import type { ListModule } from '../core/types';
import { L, t } from '../core/i18n';
import { esc } from '../core/dom';

export const quiz: ListModule = {
  id: 'quiz',
  file: 'quiz.json',
  titleKey: 'quiz.title',
  subKey: 'quiz.sub',
  card: (it, L) => ({
    title: L(it, 'term'),
    sub: L(it, 'termEn'),
    one: L(it, 'oneLiner'),
    tags: [t('search.t.quiz')],
  }),
  detail: (it, L) => {
    const opts = Array.isArray(it.options) ? it.options : [];
    const optionsHtml = opts
      .map((o: any) => {
        const mark = o.correct ? ' <span class="opt-correct">✓</span>' : '';
        return `<li>${esc(L(o, 'text'))}${mark}</li>`;
      })
      .join('');
    return {
      title: L(it, 'term'),
      sub: L(it, 'termEn'),
      sections: [
        { labelKey: 'ui.options', html: `<ul class="quiz-opts">${optionsHtml}</ul>` },
        { labelKey: 'ui.detail', html: `<p>${esc(L(it, 'detail'))}</p>` },
      ],
      relatedIds: it.related || [],
      sources: it.sources || [],
    };
  },
};
