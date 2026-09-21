import { t, L, onLangChange } from './i18n';
import { esc } from './dom';
import { loadJson } from './data';
import { initTheme } from './theme';
import { initLangSwitch } from './i18n';
import { initSearch } from './search';
import { mountList, openDetailGlobal } from '../modules/shared';
import { listModules } from '../modules/index';
import { mountDemos } from '../modules/demos';
import { mountBigFive } from '../modules/bigfive';
import { mountSelfRating } from '../modules/selfrating';
import type { LObj } from './types';

const BUILT = new Set([
  'm-home',
  'm-concepts',
  'm-glossary',
  'm-psychologists',
  'm-schools',
  'm-biases',
  'm-experiments',
  'm-timeline',
  'm-everyday',
  'm-myths',
  'm-quiz',
  'm-compare',
  'm-demos',
  'm-bigfive',
  'm-selfrating',
]);

function go(id: string): void {
  document.querySelectorAll<HTMLElement>('.module').forEach((s) =>
    s.classList.toggle('active', s.id === id),
  );
  document.querySelectorAll<HTMLElement>('.modnav .mod').forEach((b) =>
    b.classList.toggle('active', b.dataset.go === id),
  );
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function mountNav(): void {
  document.querySelectorAll<HTMLElement>('.modnav .mod').forEach((b) =>
    b.addEventListener('click', () => go(b.dataset.go!)),
  );
}

async function mountOverview(): Promise<void> {
  let ov: LObj = {};
  const render = () => {
    const kpisEl = document.getElementById('kpis');
    if (kpisEl) {
      kpisEl.innerHTML = (ov.kpis || [])
        .map(
          (k: any) =>
            `<div class="kpi"><div class="num">${esc(k.count ?? '—')}</div><div class="label">${esc(
              t(k.titleKey),
            )}</div></div>`,
        )
        .join('');
    }
    const grid = document.getElementById('homeGrid');
    if (grid) {
      grid.innerHTML = (ov.entries || [])
        .map(
          (e: any) =>
            `<button class="home-card" data-go="m-${esc(e.id)}">
               <div class="emoji">${esc(e.icon)}</div>
               <h3>${esc(t(e.titleKey))}</h3>
               <p>${esc(t(e.descKey))}</p>
             </button>`,
        )
        .join('');
      grid.querySelectorAll<HTMLElement>('.home-card').forEach((b) =>
        b.addEventListener('click', () => go(b.dataset.go!)),
      );
    }
    const refsBox = document.getElementById('refsBox');
    const refList = document.getElementById('refList');
    if (refsBox && refList) {
      if (ov.refs && ov.refs.length) {
        refsBox.hidden = false;
        refList.innerHTML = ov.refs
          .map((r: any) => `<li>${esc(typeof r === 'string' ? r : r.label)}</li>`)
          .join('');
      } else {
        refsBox.hidden = true;
      }
    }
  };

  const kpisEl = document.getElementById('kpis');
  if (kpisEl) kpisEl.innerHTML = `<p class="count">${esc(t('ui.loading'))}</p>`;
  try {
    ov = await loadJson('overview.json');
    render();
    onLangChange(render);
  } catch {
    if (kpisEl) kpisEl.innerHTML = `<p class="count">${esc(t('ui.loadFail'))}</p>`;
  }
}

function mountPlaceholders(): void {
  const boxes: HTMLElement[] = [];
  document.querySelectorAll<HTMLElement>('.module').forEach((s) => {
    if (!BUILT.has(s.id)) {
      const box = s.querySelector<HTMLElement>('.placeholder');
      if (box) boxes.push(box);
    }
  });
  const render = () => boxes.forEach((b) => (b.textContent = t('ui.comingSoon')));
  render();
  onLangChange(render);
}

function mountToTop(): void {
  const btn = document.getElementById('toTop');
  if (!btn) return;
  const onScroll = () => btn.classList.toggle('show', window.scrollY > 400);
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function mountHeroMail(): void {
  const a = document.getElementById('heroMailLink') as HTMLAnchorElement | null;
  if (!a) return;
  const subject = encodeURIComponent(t('mail.subject'));
  const body = encodeURIComponent(t('mail.body'));
  a.href = `mailto:417913012@qq.com?subject=${subject}&body=${body}`;
}

export async function boot(): Promise<void> {
  initTheme();
  initLangSwitch();
  mountNav();
  mountPlaceholders();
  mountToTop();
  mountHeroMail();
  await mountOverview();
  listModules.forEach((m) => mountList(m));
  mountDemos();
  mountBigFive();
  mountSelfRating();
  initSearch(openDetailGlobal);
}
