import { allItems } from './related';
import { t, L } from './i18n';
import { esc } from './dom';

interface Hit {
  id: string;
  title: string;
  sub: string;
  typeLabel: string;
}

export function initSearch(openDetailById: (id: string) => void): void {
  const input = document.getElementById('search') as HTMLInputElement | null;
  const box = document.getElementById('searchResults');
  if (!input || !box) return;

  let hits: Hit[] = [];

  const titleOf = (item: any): string =>
    String(L(item, 'name') ?? L(item, 'term') ?? item.id ?? '');

  const render = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      box.hidden = true;
      box.innerHTML = '';
      return;
    }
    hits = [];
    allItems().forEach((entry, id) => {
      const title = titleOf(entry.item);
      const sub = String(L(entry.item, 'oneLiner') ?? L(entry.item, 'plain') ?? '');
      const hay = (title + ' ' + sub + ' ' + id).toLowerCase();
      if (hay.includes(q)) {
        hits.push({ id, title, sub, typeLabel: t(entry.typeLabelKey) });
      }
    });
    if (!hits.length) {
      box.hidden = false;
      box.innerHTML = `<div class="sr-empty">${esc(t('searchEmpty'))}</div>`;
      return;
    }
    box.hidden = false;
    box.innerHTML = hits
      .map(
        (h, i) =>
          `<button class="sr-item" data-i="${i}"><span class="sr-tag">${esc(
            h.typeLabel,
          )}</span><span>${esc(h.title)}</span></button>`,
      )
      .join('');
    box.querySelectorAll<HTMLElement>('.sr-item').forEach((b) =>
      b.addEventListener('click', () => {
        const h = hits[Number(b.dataset.i)];
        box.hidden = true;
        input.value = '';
        if (h) openDetailById(h.id);
      }),
    );
  };

  input.addEventListener('input', render);
  input.addEventListener('blur', () => setTimeout(() => (box.hidden = true), 150));

  const placeholder = input.getAttribute('placeholder') || t('searchPlaceholder');
  input.setAttribute('placeholder', placeholder);
}
