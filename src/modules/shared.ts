import type { ListModule, LObj } from '../core/types';
import { loadJson } from '../core/data';
import { registerItem, registerModuleType, getItem } from '../core/related';
import { getLang, t, L, onLangChange } from '../core/i18n';
import { esc } from '../core/dom';
import { renderDetail } from '../core/detail';
import { moduleById } from './index';

const TYPE_LABEL: Record<string, string> = {
  concepts: 'search.t.concept',
  glossary: 'search.t.term',
  psychologists: 'search.t.psychologist',
  schools: 'search.t.school',
  biases: 'search.t.bias',
  experiments: 'search.t.experiment',
  timeline: 'search.t.event',
  everyday: 'search.t.everyday',
  myths: 'search.t.myth',
  quiz: 'search.t.quiz',
  compare: 'search.t.compare',
};

export function typeLabelKeyFor(id: string): string {
  return TYPE_LABEL[id] || 'search.t.topic';
}

function titleOf(item: LObj): string {
  return String(L(item, 'name') ?? L(item, 'term') ?? item.id ?? '');
}

export function openDetailGlobal(id: string): void {
  const entry = getItem(id);
  if (!entry) return;
  const m = moduleById[entry.moduleId];
  if (!m) return;
  const md = m.detail(entry.item, L);
  const related = (md.relatedIds || [])
    .map((rid) => {
      const e = getItem(rid);
      const title = e ? titleOf(e.item) : rid;
      return { id: rid, title };
    })
    .filter((r) => r.title);
  renderDetail(
    { title: md.title, sub: md.sub, sections: md.sections, related, sources: md.sources },
    openDetailGlobal,
  );
}

export function mountList(m: ListModule): void {
  registerModuleType(m.id, typeLabelKeyFor(m.id));
  const mode = m.mode || 'grid';
  const grid = document.getElementById(m.id + 'Grid');
  const listEl = document.getElementById(m.id + 'List');
  const filterHost = document.getElementById(m.id + 'Filters');
  const countEl = document.getElementById(m.id + 'Count');
  const host = (grid || listEl) as HTMLElement | null;
  if (!host) return;

  let data: LObj[] = [];
  let activeFilters: Record<string, string> = {};
  let query = '';

  const matches = (it: LObj): boolean => {
    if (m.filters) {
      for (const f of m.filters) {
        const act = activeFilters[f.field];
        if (act && act !== t('ui.all')) {
          const v = String(L(it, f.field) ?? it[f.field] ?? '');
          if (v !== act) return false;
        }
      }
    }
    if (m.inlineSearch && query) {
      const hay = [
        L(it, 'term'),
        L(it, 'termEn'),
        L(it, 'plain'),
        L(it, 'def'),
        L(it, 'name'),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!hay.includes(query.toLowerCase())) return false;
    }
    return true;
  };

  const render = (): void => {
    const items = data.filter(matches);
    if (countEl) countEl.textContent = t('ui.count', { n: items.length });

    if (mode === 'list') {
      host.innerHTML =
        items
          .map((it) => {
            const cv = m.card(it, L);
            const tags = (cv.tags || [])
              .filter(Boolean)
              .map((x) => `<span class="chip">${esc(x)}</span>`)
              .join('');
            return `<button class="gloss-item" data-id="${esc(it.id)}">
                <div class="g-head"><span class="g-term">${esc(cv.title)}</span><span class="g-en">${esc(
                  cv.sub || '',
                )}</span></div>
                <p class="g-def">${esc(cv.one || '')}</p>
                ${cv.plain ? `<p class="g-plain">${esc(cv.plain)}</p>` : ''}
                ${tags ? `<div class="c-tags">${tags}</div>` : ''}
              </button>`;
          })
          .join('') || `<p class="count">${esc(t('searchEmpty'))}</p>`;
      host
        .querySelectorAll<HTMLElement>('.gloss-item')
        .forEach((b) => b.addEventListener('click', () => openDetailGlobal(b.dataset.id!)));
    } else {
      host.innerHTML =
        items
          .map((it) => {
            const cv = m.card(it, L);
            const lvl = cv.level ? `<span class="chip accent">${esc(cv.level)}</span>` : '';
            const tags = (cv.tags || [])
              .filter(Boolean)
              .map((x) => `<span class="chip">${esc(x)}</span>`)
              .join('');
            return `<button class="card" data-id="${esc(it.id)}">
                <span class="c-title">${esc(cv.title)}</span>
                ${cv.sub ? `<span class="c-sub">${esc(cv.sub)}</span>` : ''}
                ${cv.one ? `<span class="c-one">${esc(cv.one)}</span>` : ''}
                <span class="c-tags">${lvl}${tags}</span>
              </button>`;
          })
          .join('') || `<p class="count">${esc(t('searchEmpty'))}</p>`;
      host
        .querySelectorAll<HTMLElement>('.card')
        .forEach((b) => b.addEventListener('click', () => openDetailGlobal(b.dataset.id!)));
    }
  };

  const renderFilters = (): void => {
    if (!m.filters || !filterHost) return;
    filterHost.innerHTML = m.filters
      .map((f) => {
        const opts = Array.from(
          new Set(data.map((it) => String(L(it, f.field) ?? it[f.field] ?? '')).filter(Boolean)),
        );
        return [t('ui.all'), ...opts]
          .map((o) => {
            const act = (activeFilters[f.field] || t('ui.all')) === o ? ' active' : '';
            return `<button class="filter${act}" data-f="${esc(f.field)}" data-v="${esc(o)}">${esc(
              o,
            )}</button>`;
          })
          .join('');
      })
      .join('');
    filterHost.querySelectorAll<HTMLElement>('.filter').forEach((b) =>
      b.addEventListener('click', () => {
        activeFilters[b.dataset.f!] = b.dataset.v!;
        renderFilters();
        render();
      }),
    );
  };

  loadJson<LObj[]>(m.file)
    .then((arr) => {
      data = arr;
      arr.forEach((it) => registerItem(it.id, m.id, it));
      renderFilters();
      render();
    })
    .catch(() => {
      host.innerHTML = `<p class="count">${esc(t('ui.loadFail'))}</p>`;
    });

  if (m.inlineSearch) {
    const inp = document.getElementById(m.inlineSearch) as HTMLInputElement | null;
    if (inp) inp.addEventListener('input', () => {
      query = inp.value;
      render();
    });
  }

  onLangChange(() => {
    activeFilters = {};
    renderFilters();
    render();
  });
}
