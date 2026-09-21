import { t, getLang, onLangChange } from '../core/i18n';
import { esc } from '../core/dom';

type Bi = { zh: string; en: string };
const bi = (x: Bi): string => (getLang() === 'en' ? x.en : x.zh);

const DIMS = [
  { key: 'O', name: { zh: '开放性 Openness', en: 'Openness' } },
  { key: 'C', name: { zh: '尽责性 Conscientiousness', en: 'Conscientiousness' } },
  { key: 'E', name: { zh: '外向性 Extraversion', en: 'Extraversion' } },
  { key: 'A', name: { zh: '宜人性 Agreeableness', en: 'Agreeableness' } },
  { key: 'N', name: { zh: '神经质 Neuroticism', en: 'Neuroticism' } },
];

const ITEMS: { q: Bi; dim: string; rev: boolean }[] = [
  { q: { zh: '我喜欢尝试新的食物、音乐或想法。', en: 'I enjoy trying new foods, music or ideas.' }, dim: 'O', rev: false },
  { q: { zh: '我对抽象或哲学问题感兴趣。', en: 'I am interested in abstract or philosophical questions.' }, dim: 'O', rev: false },
  { q: { zh: '做事前我通常会先列个计划。', en: 'I usually make a plan before doing things.' }, dim: 'C', rev: false },
  { q: { zh: '我容易拖延，常把事情留到最后一刻。', en: 'I tend to procrastinate and leave things to the last minute.' }, dim: 'C', rev: true },
  { q: { zh: '在聚会中我通常主动和人交谈。', en: 'At parties I usually start conversations with people.' }, dim: 'E', rev: false },
  { q: { zh: '热闹过后，我更想独处来「充电」。', en: 'After socializing, I prefer to recharge alone.' }, dim: 'E', rev: true },
  { q: { zh: '我尽量不与人争执，容易相信别人。', en: 'I avoid conflict and tend to trust people.' }, dim: 'A', rev: false },
  { q: { zh: '面对不公，我倾向于直接表达不满。', en: 'When treated unfairly, I speak up directly.' }, dim: 'A', rev: true },
  { q: { zh: '小事也容易让我紧张或情绪波动。', en: 'Small things easily make me tense or moody.' }, dim: 'N', rev: false },
  { q: { zh: '我总体上比较冷静，不易焦虑。', en: 'I am generally calm and not easily anxious.' }, dim: 'N', rev: true },
];

export function mountBigFive(): void {
  const root = document.getElementById('bigfiveRoot');
  if (!root) return;
  const answers: (number | null)[] = ITEMS.map(() => null);

  const render = (): void => {
    root.innerHTML = `
      <p class="bf-intro">${esc(t('bf.intro'))}</p>
      <ol class="bf-list">
        ${ITEMS.map((it, i) => `
          <li class="bf-item">
            <p class="bf-q">${esc(bi(it.q))}</p>
            <div class="bf-scale-row">
              <span class="bf-anchor">${esc(t('bf.anchorLow'))}</span>
              <div class="bf-scale" role="radiogroup" aria-label="${esc(bi(it.q))}">
                ${[1, 2, 3, 4, 5].map((n) => `
                  <label class="bf-opt${answers[i] === n ? ' on' : ''}">
                    <input type="radio" name="bf-${i}" value="${n}" ${answers[i] === n ? 'checked' : ''}/>
                    <span>${n}</span>
                  </label>`).join('')}
              </div>
              <span class="bf-anchor">${esc(t('bf.anchorHigh'))}</span>
            </div>
          </li>`).join('')}
      </ol>
      <div class="bf-actions">
        <button class="demo-btn" id="bfSubmit">${esc(t('bf.submit'))}</button>
        <button class="demo-btn ghost" id="bfReset">${esc(t('bf.reset'))}</button>
      </div>
      <div class="demo-result" id="bfResult"></div>
      <p class="bf-disclaimer">${esc(t('bf.disclaimer'))}</p>`;

    root.querySelectorAll<HTMLInputElement>('input[type=radio]').forEach((inp) => {
      inp.addEventListener('change', () => {
        const idx = Number(inp.name.split('-')[1]);
        answers[idx] = Number(inp.value);
        root.querySelectorAll<HTMLElement>(`.bf-item:nth-child(${idx + 1}) .bf-opt`).forEach((o, j) =>
          o.classList.toggle('on', j + 1 === answers[idx]),
        );
      });
    });
    document.getElementById('bfSubmit')?.addEventListener('click', compute);
    document.getElementById('bfReset')?.addEventListener('click', () => { answers.fill(null); render(); });
  };

  const compute = (): void => {
    const r = document.getElementById('bfResult');
    if (!r) return;
    if (answers.some((a) => a === null)) {
      r.innerHTML = `<p class="demo-note warn">${esc(t('bf.unanswered'))}</p>`;
      return;
    }
    const scores: Record<string, number[]> = {};
    DIMS.forEach((d) => (scores[d.key] = []));
    ITEMS.forEach((it, i) => scores[it.dim].push(it.rev ? 6 - (answers[i] as number) : (answers[i] as number)));
    const bars = DIMS.map((d) => {
      const arr = scores[d.key];
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      const pct = Math.round(((avg - 1) / 4) * 100);
      const lvl = pct >= 66 ? t('bf.levelHigh') : pct <= 34 ? t('bf.levelLow') : t('bf.levelMid');
      return `<div class="bf-bar">
        <span class="bf-bar-name">${esc(bi(d.name))}</span>
        <span class="bf-track"><span class="bf-fill" style="width:${pct}%"></span></span>
        <span class="bf-pct">${pct}% · ${esc(lvl)}</span>
      </div>`;
    }).join('');
    r.innerHTML = `<h3 class="bf-result-title">${esc(t('bf.resultTitle'))}</h3>${bars}<p class="demo-note">${esc(t('bf.tip'))}</p>`;
  };

  render();
  onLangChange(render);
}
