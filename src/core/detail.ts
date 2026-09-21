import { t } from './i18n';
import { esc } from './dom';
import type { DetailView } from './types';

export function renderDetail(view: DetailView, onRelated: (id: string) => void): void {
  const root = document.getElementById('detailRoot');
  if (!root) return;

  const sections = view.sections
    .map(
      (s) => `
      <div class="detail-section">
        <h4>${esc(t(s.labelKey))}</h4>
        <div class="body">${s.html}</div>
      </div>`,
    )
    .join('');

  const related = view.related && view.related.length
    ? `<div class="detail-section">
         <h4>${esc(t('ui.related'))}</h4>
         <div class="related-list">${view.related
           .map((r) => `<button class="related-link" data-rel="${esc(r.id)}">${esc(r.title)}</button>`)
           .join('')}</div>
       </div>`
    : '';

  const sources = view.sources && view.sources.length
    ? `<div class="detail-section">
         <h4>${esc(t('ui.sources'))}</h4>
         <div class="sources">${view.sources
           .map((s) => `${esc(s.label)}${s.year ? ' (' + esc(s.year) + ')' : ''}`)
           .join('；')}</div>
       </div>`
    : '';

  root.innerHTML = `
    <div class="detail-panel" role="dialog" aria-modal="true">
      <div class="detail-head">
        <h2>${esc(view.title)}</h2>
        <button class="detail-close" id="detailClose" aria-label="${esc(t('ui.close'))}">✕</button>
      </div>
      ${view.sub ? `<p class="detail-sub">${esc(view.sub)}</p>` : ''}
      ${sections}${related}${sources}
    </div>`;
  root.hidden = false;
  document.body.style.overflow = 'hidden';

  const close = () => {
    root.hidden = true;
    root.innerHTML = '';
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };

  root.querySelector('#detailClose')?.addEventListener('click', close);
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });
  document.addEventListener('keydown', onKey);

  root.querySelectorAll<HTMLElement>('.related-link').forEach((b) =>
    b.addEventListener('click', () => {
      const id = b.dataset.rel;
      if (id) onRelated(id);
    }),
  );
}
