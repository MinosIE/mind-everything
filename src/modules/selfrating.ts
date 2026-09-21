import { t, getLang, onLangChange } from '../core/i18n';
import { esc } from '../core/dom';

type Bi = { zh: string; en: string };
const bi = (x: Bi): string => (getLang() === 'en' ? x.en : x.zh);

interface Scale {
  key: string;
  name: Bi;
  items: { q: Bi; rev: boolean }[];
  hi: Bi;
  lo: Bi;
}

const SCALES: Scale[] = [
  {
    key: 'stress',
    name: { zh: '压力知觉', en: 'Perceived Stress' },
    items: [
      { q: { zh: '过去一个月，我常因突发状况感到心烦意乱。', en: 'In the past month, I was often upset by unexpected things.' }, rev: false },
      { q: { zh: '过去一个月，我觉得自己能掌控生活节奏。', en: 'In the past month, I felt in control of my life.' }, rev: true },
      { q: { zh: '过去一个月，我常感到压力大到难以承受。', en: 'In the past month, I often felt overwhelmed by stress.' }, rev: false },
    ],
    hi: { zh: '近期压力偏高，留意休息与倾诉。', en: 'Stress runs high lately — rest and talk it out.' },
    lo: { zh: '近期压力可控，状态不错。', en: 'Stress is manageable — you’re doing fine.' },
  },
  {
    key: 'sleep',
    name: { zh: '睡眠质量', en: 'Sleep Quality' },
    items: [
      { q: { zh: '我入睡较快、夜里较少惊醒。', en: 'I fall asleep quickly and rarely wake at night.' }, rev: false },
      { q: { zh: '白天我常犯困、提不起精神。', en: 'I often feel sleepy and low-energy during the day.' }, rev: true },
      { q: { zh: '我每晚的睡眠时长基本足够。', en: 'My nightly sleep is roughly enough.' }, rev: false },
    ],
    hi: { zh: '睡眠质量较好。', en: 'Sleep quality looks good.' },
    lo: { zh: '睡眠似乎偏差，可以看看作息。', en: 'Sleep seems poor — check your routine.' },
  },
  {
    key: 'procrast',
    name: { zh: '拖延倾向', en: 'Procrastination' },
    items: [
      { q: { zh: '面对任务，我常拖到最后一刻才动手。', en: 'I often leave tasks to the last minute.' }, rev: false },
      { q: { zh: '我习惯先把重要的事做完再放松。', en: 'I finish important tasks before relaxing.' }, rev: true },
      { q: { zh: '即便有 deadline，我也常分心去做别的事。', en: 'Even with a deadline, I get distracted by other things.' }, rev: false },
    ],
    hi: { zh: '拖延倾向偏高，试试把任务拆小。', en: 'Procrastination runs high — break tasks smaller.' },
    lo: { zh: '行动力不错，较少拖延。', en: 'You act promptly — little procrastination.' },
  },
  {
    key: 'mindful',
    name: { zh: '正念觉察', en: 'Mindful Awareness' },
    items: [
      { q: { zh: '我常能察觉自己当下的情绪和身体感受。', en: 'I often notice my current feelings and body sensations.' }, rev: false },
      { q: { zh: '我容易被手机或杂念带跑，忘了正在做的事。', en: 'I get carried away by phone or stray thoughts, forgetting what I’m doing.' }, rev: true },
      { q: { zh: '我吃饭或走路时也常分心想别的事。', en: 'Even eating or walking, my mind drifts to other things.' }, rev: true },
    ],
    hi: { zh: '觉察力较好，活在当下。', en: 'Good awareness — present in the moment.' },
    lo: { zh: '容易走神，可以练练专注呼吸。', en: 'Easily distracted — try focused breathing.' },
  },
];

// 每个量表内各题在扁平 answers 数组中的全局下标
const SCALE_IDX: number[][] = [];
{
  let gi = 0;
  SCALES.forEach((s) => {
    const arr: number[] = [];
    s.items.forEach(() => arr.push(gi++));
    SCALE_IDX.push(arr);
  });
}

export function mountSelfRating(): void {
  const root = document.getElementById('selfratingRoot');
  if (!root) return;
  const answers: (number | null)[] = SCALE_IDX.flatMap((a) => a.map(() => null));

  const render = (): void => {
    let gi = 0;
    let html = `<p class="bf-intro">${esc(t('sr.intro'))}</p><ol class="bf-list">`;
    SCALES.forEach((s) => {
      html += `<li class="sr-group"><div class="sr-group-name">${esc(bi(s.name))}</div>`;
      s.items.forEach((it) => {
        const i = gi++;
        html += `<div class="bf-item">
          <p class="bf-q">${esc(bi(it.q))}</p>
          <div class="bf-scale-row">
            <span class="bf-anchor">${esc(t('sr.anchorLow'))}</span>
            <div class="bf-scale" role="radiogroup">
              ${[1, 2, 3, 4, 5].map((n) => `<label class="bf-opt${answers[i] === n ? ' on' : ''}"><input type="radio" name="sr-${i}" value="${n}" ${answers[i] === n ? 'checked' : ''}/><span>${n}</span></label>`).join('')}
            </div>
            <span class="bf-anchor">${esc(t('sr.anchorHigh'))}</span>
          </div></div>`;
      });
      html += `</li>`;
    });
    html += `</ol><div class="bf-actions">
      <button class="demo-btn" id="srSubmit">${esc(t('sr.submit'))}</button>
      <button class="demo-btn ghost" id="srReset">${esc(t('sr.reset'))}</button>
    </div><div class="demo-result" id="srResult"></div>
    <p class="bf-disclaimer">${esc(t('sr.disclaimer'))}</p>`;
    root.innerHTML = html;

    root.querySelectorAll<HTMLInputElement>('input[type=radio]').forEach((inp) => {
      inp.addEventListener('change', () => {
        const idx = Number(inp.name.split('-')[1]);
        answers[idx] = Number(inp.value);
        const parent = inp.closest('.bf-scale');
        parent?.querySelectorAll<HTMLElement>('.bf-opt').forEach((o, j) => o.classList.toggle('on', j + 1 === answers[idx]));
      });
    });
    document.getElementById('srSubmit')?.addEventListener('click', compute);
    document.getElementById('srReset')?.addEventListener('click', () => { answers.fill(null); render(); });
  };

  const compute = (): void => {
    const r = document.getElementById('srResult');
    if (!r) return;
    if (answers.some((a) => a === null)) {
      r.innerHTML = `<p class="demo-note warn">${esc(t('sr.unanswered'))}</p>`;
      return;
    }
    const bars = SCALES.map((s, si) => {
      let sum = 0;
      s.items.forEach((it, ii) => {
        const gi = SCALE_IDX[si][ii];
        sum += it.rev ? 6 - (answers[gi] as number) : (answers[gi] as number);
      });
      const avg = sum / s.items.length;
      const pct = Math.round(((avg - 1) / 4) * 100);
      const lvlKey = pct >= 66 ? 'sr.levelHigh' : pct <= 34 ? 'sr.levelLow' : 'sr.levelMid';
      const note = pct >= 66 ? s.hi : pct <= 34 ? s.lo : { zh: '居中，无特别提示。', en: 'Mid — no special note.' };
      return `<div class="bf-bar">
        <span class="bf-bar-name">${esc(bi(s.name))}</span>
        <span class="bf-track"><span class="bf-fill" style="width:${pct}%"></span></span>
        <span class="bf-pct">${pct}% · ${esc(t(lvlKey))}</span>
      </div>
      <p class="demo-note">${esc(bi(note))}</p>`;
    }).join('');
    r.innerHTML = `<h3 class="bf-result-title">${esc(t('sr.resultTitle'))}</h3>${bars}<p class="demo-note">${esc(t('sr.tip'))}</p>`;
  };

  render();
  onLangChange(render);
}
