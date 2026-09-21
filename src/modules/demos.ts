import { t, getLang, onLangChange } from '../core/i18n';
import { esc } from '../core/dom';

type Bi = { zh: string; en: string };
const bi = (x: Bi): string => (getLang() === 'en' ? x.en : x.zh);

interface Demo {
  icon: string;
  title: Bi;
  desc: Bi;
  mount: (el: HTMLElement) => void;
  noGate?: boolean;
}

const COLOR_NAMES: Record<string, Bi> = {
  red: { zh: '红', en: 'RED' },
  green: { zh: '绿', en: 'GREEN' },
  blue: { zh: '蓝', en: 'BLUE' },
  purple: { zh: '紫', en: 'PURPLE' },
};
const COLOR_CSS: Record<string, string> = {
  red: '#d9534f',
  green: '#3f9b57',
  blue: '#3f7fc5',
  purple: '#9b6dcc',
};

/* ---------- 1. Stroop 效应 ---------- */
function stroopMount(el: HTMLElement): void {
  const keys = Object.keys(COLOR_NAMES);
  const TOTAL = 8;
  let trial = 0;
  let correct = 0;
  let times: number[] = [];
  let start = 0;
  let done = false;

  const paint = (): void => {
    if (done) return;
    const wordKey = keys[Math.floor(Math.random() * keys.length)];
    let inkKey = keys[Math.floor(Math.random() * keys.length)];
    if (Math.random() < 0.7) while (inkKey === wordKey) inkKey = keys[Math.floor(Math.random() * keys.length)];
    start = performance.now();
    el.innerHTML = `
      <p class="demo-play">${bi({ zh: `第 ${trial + 1}/${TOTAL} 题：点击「墨色」对应的按钮`, en: `Trial ${trial + 1}/${TOTAL}: click the INK color` })}</p>
      <div class="stroop-word" style="color:${COLOR_CSS[inkKey]}">${esc(COLOR_NAMES[wordKey][getLang()])}</div>
      <div class="stroop-opts">
        ${keys.map((k) => `<button class="stroop-btn" data-k="${k}" style="background:${COLOR_CSS[k]}">${esc(COLOR_NAMES[k][getLang()])}</button>`).join('')}
      </div>`;
    el.querySelectorAll<HTMLElement>('.stroop-btn').forEach((b) =>
      b.addEventListener('click', () => {
        times.push(Math.round(performance.now() - start));
        if (b.dataset.k === inkKey) correct++;
        if (++trial >= TOTAL) finish();
        else paint();
      }),
    );
  };

  const finish = (): void => {
    done = true;
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    el.innerHTML = `
      <p class="demo-play">${bi({ zh: `完成！正确 ${correct}/${TOTAL}，平均反应 ${avg} 毫秒。`, en: `Done! Correct ${correct}/${TOTAL}, avg ${avg} ms.` })}</p>
      <p class="demo-note">${bi({ zh: '当「字义」与「墨色」冲突时你变慢、更易错——这就是斯特鲁普效应：自动读词抢占了为颜色命名所需的注意力。', en: 'When word and ink clash you slow down and err more — the Stroop effect: automatic reading hijacks the attention needed to name the color.' })}</p>
      <button class="demo-btn" id="stroopAgain">${bi({ zh: '再来一次', en: 'Try again' })}</button>`;
    const again = document.getElementById('stroopAgain');
    if (again) again.addEventListener('click', () => { trial = 0; correct = 0; times = []; done = false; paint(); });
  };

  paint();
}

/* ---------- 2. Müller-Lyer 错觉 ---------- */
function mullerMount(el: HTMLElement): void {
  const explain = bi({
    zh: '两条线段其实一样长。向外的箭头让上端「显得」更长，这是缪勒-莱尔错觉——大脑用「角」推断深度与距离。',
    en: 'Both lines are the same length. Outward arrows make the top seem longer — the Müller-Lyer illusion: the brain reads angles as depth.',
  });
  const paint = (revealed = false): void => {
    el.innerHTML = `
      <p class="demo-play">${bi({ zh: '哪条线段更长？', en: 'Which line is longer?' })}</p>
      <svg class="illusion" viewBox="0 0 240 120" width="100%" height="160" role="img" aria-label="Müller-Lyer illusion">
        <line x1="40" y1="40" x2="200" y2="40" stroke="currentColor" stroke-width="3"/>
        <path d="M40 30 L40 50 M40 30 L52 40 L40 50" fill="none" stroke="currentColor" stroke-width="3"/>
        <path d="M200 30 L200 50 M200 30 L188 40 L200 50" fill="none" stroke="currentColor" stroke-width="3"/>
        <line x1="40" y1="90" x2="200" y2="90" stroke="currentColor" stroke-width="3"/>
        <path d="M40 80 L52 90 L40 100" fill="none" stroke="currentColor" stroke-width="3"/>
        <path d="M200 80 L188 90 L200 100" fill="none" stroke="currentColor" stroke-width="3"/>
        ${revealed ? '<line x1="40" y1="108" x2="200" y2="108" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4"/>' : ''}
      </svg>
      <div class="stroop-opts">
        <button class="demo-btn" data-a="top">${bi({ zh: '上边', en: 'Top' })}</button>
        <button class="demo-btn" data-a="bottom">${bi({ zh: '下边', en: 'Bottom' })}</button>
        <button class="demo-btn" data-a="same">${bi({ zh: '一样长', en: 'Same' })}</button>
      </div>
      <div class="demo-result" id="mlResult"></div>`;
    el.querySelectorAll<HTMLElement>('[data-a]').forEach((b) =>
      b.addEventListener('click', () => {
        const r = document.getElementById('mlResult');
        if (!r) return;
        const ok = b.dataset.a === 'same';
        r.innerHTML = `<p class="demo-note">${ok ? bi({ zh: '答对！', en: 'Correct!' }) : bi({ zh: '其实', en: 'Actually' })} ${esc(explain)}</p>
          <button class="demo-btn" id="mlReveal">${bi({ zh: '显示真实长度', en: 'Show true length' })}</button>`;
        const rev = document.getElementById('mlReveal');
        if (rev) rev.addEventListener('click', () => paint(true));
      }),
    );
  };
  paint();
}

/* ---------- 3. 数字广度（短时记忆） ---------- */
function digitMount(el: HTMLElement): void {
  let level = 3;
  let best = 0;

  const startGame = (): void => { level = 3; best = 0; nextRound(); };

  const nextRound = (): void => {
    const seq = Array.from({ length: level }, () => Math.floor(Math.random() * 10));
    el.innerHTML = `<p class="demo-play">${bi({ zh: `记住这 ${level} 位数字：`, en: `Remember these ${level} digits:` })}</p><div class="span-display" id="spanDisp"></div>`;
    const disp = document.getElementById('spanDisp');
    if (!disp) return;
    let i = 0;
    const tick = (): void => {
      if (i < seq.length) { disp.textContent = String(seq[i++]); setTimeout(tick, 800); }
      else setTimeout(ask, 500);
    };
    const ask = (): void => {
      el.innerHTML = `
        <p class="demo-play">${bi({ zh: `请输入你看到的 ${level} 位数字（按顺序）：`, en: `Enter the ${level} digits in order:` })}</p>
        <input class="span-input" id="spanInp" inputmode="numeric" maxlength="${level}" autocomplete="off" />
        <button class="demo-btn" id="spanGo">${bi({ zh: '提交', en: 'Submit' })}</button>
        <div class="demo-result" id="spanRes"></div>`;
      const inp = document.getElementById('spanInp') as HTMLInputElement | null;
      const go = document.getElementById('spanGo');
      if (!inp || !go) return;
      inp.focus();
      go.addEventListener('click', () => {
        const res = document.getElementById('spanRes');
        if (!res) return;
        if (inp.value === seq.join('')) {
          best = Math.max(best, level);
          res.innerHTML = `<p class="demo-note">${bi({ zh: `正确！进入 ${level + 1} 位。`, en: `Correct! On to ${level + 1}.` })}</p>`;
          level++;
          setTimeout(nextRound, 700);
        } else {
          res.innerHTML = `<p class="demo-note">${bi({ zh: `序列是 ${seq.join('')}。你的最佳广度：${best} 位（常人约 7±2）。`, en: `The sequence was ${seq.join('')}. Your best span: ${best} (most people ~7±2).` })}</p>
            <button class="demo-btn" id="spanAgain">${bi({ zh: '再玩一次', en: 'Play again' })}</button>`;
          const again = document.getElementById('spanAgain');
          if (again) again.addEventListener('click', startGame);
        }
      });
    };
    tick();
  };

  el.innerHTML = `<button class="demo-btn" id="spanStart">${bi({ zh: '开始记忆测试', en: 'Start memory test' })}</button>`;
  const st = document.getElementById('spanStart');
  if (st) st.addEventListener('click', startGame);
}

/* ---------- 4. 锚定效应 ---------- */
function anchorMount(el: HTMLElement): void {
  const anchors = [10, 65];
  const real = 28;
  const paint = (): void => {
    const a = anchors[Math.floor(Math.random() * anchors.length)];
    el.innerHTML = `
      <p class="demo-play">${bi({ zh: `先看一个数字：${a}。现在估计：非洲国家约占联合国会员国的百分之多少？`, en: `First, a number: ${a}. Now estimate: about what % of UN member states are African?` })}</p>
      <input class="span-input" id="ancInp" inputmode="numeric" autocomplete="off" placeholder="%" />
      <button class="demo-btn" id="ancGo">${bi({ zh: '提交估算', en: 'Submit estimate' })}</button>
      <div class="demo-result" id="ancRes"></div>`;
    const inp = document.getElementById('ancInp') as HTMLInputElement | null;
    const go = document.getElementById('ancGo');
    if (!inp || !go) return;
    go.addEventListener('click', () => {
      const v = parseInt(inp.value, 10);
      const res = document.getElementById('ancRes');
      if (!res) return;
      res.innerHTML = `<p class="demo-note">${bi({ zh: `你的估算：${isNaN(v) ? '—' : v}%。刚才的锚是 ${a}；研究显示高锚会拉高、低锚会拉低估计——这就是锚定效应。真实比例约 ${real}%。`, en: `Your estimate: ${isNaN(v) ? '—' : v}%. The anchor was ${a}; studies show high anchors pull estimates up, low anchors down — the anchoring effect. The real share is ~${real}%.` })}</p>
        <button class="demo-btn" id="ancAgain">${bi({ zh: '换个锚再试', en: 'Try another anchor' })}</button>`;
      const again = document.getElementById('ancAgain');
      if (again) again.addEventListener('click', paint);
    });
  };
  paint();
}

/* ---------- 5. 序列位置效应 ---------- */
function serialPositionMount(el: HTMLElement): void {
  const SHOWN = ['帽子', '苹果', '河流', '钢琴', '月亮', '书本', '火车', '星星'];
  const NEW = ['眼镜', '钥匙', '气球', '时钟'];
  const pool = [...SHOWN, ...NEW].sort(() => Math.random() - 0.5);

  const showSeq = (): void => {
    el.innerHTML = `<p class="demo-play">${bi({ zh: '记住下面 8 个词（每个约 1 秒）：', en: 'Memorize these 8 words (≈1s each):' })}</p><div class="span-display" id="spDisp"></div>`;
    const disp = document.getElementById('spDisp');
    if (!disp) return;
    let i = 0;
    const tick = (): void => {
      if (i < SHOWN.length) { disp.textContent = SHOWN[i++]; setTimeout(tick, 900); }
      else setTimeout(ask, 600);
    };
    tick();
  };
  const ask = (): void => {
    el.innerHTML = `
      <p class="demo-play">${bi({ zh: '刚才出现了哪些词？点出你记得的（可多选）：', en: 'Which words appeared? Tap all you recall (multi-select):' })}</p>
      <div class="stroop-opts" style="flex-wrap:wrap;gap:8px">
        ${pool.map((w) => `<button class="demo-btn sp-word" data-w="${esc(w)}">${esc(w)}</button>`).join('')}
      </div>
      <div class="demo-result" id="spRes"></div>`;
    const sel = new Set<string>();
    el.querySelectorAll<HTMLElement>('.sp-word').forEach((b) =>
      b.addEventListener('click', () => {
        if (sel.has(b.dataset.w!)) { sel.delete(b.dataset.w!); b.classList.remove('on'); }
        else { sel.add(b.dataset.w!); b.classList.add('on'); }
      }),
    );
    const go = document.createElement('button');
    go.className = 'demo-btn';
    go.textContent = bi({ zh: '看结果', en: 'See result' });
    go.addEventListener('click', () => {
      const recalled = SHOWN.map((w, idx) => ({ idx, hit: sel.has(w) }));
      const hits = recalled.filter((r) => r.hit).length;
      const fa = [...sel].filter((w) => !SHOWN.includes(w)).length;
      const res = document.getElementById('spRes');
      if (!res) return;
      res.innerHTML = `
        <p class="demo-note">${bi({ zh: `你认出 ${hits}/8 个旧词，误点 ${fa} 个新词。`, en: `You recalled ${hits}/8 old words and mis-clicked ${fa} new ones.` })}</p>
        <div class="sp-curve">${recalled.map((r) => `<span class="sp-col${r.hit ? ' on' : ''}"><i style="height:${r.hit ? 100 : 14}%"></i><b>${r.idx + 1}</b></span>`).join('')}</div>
        <p class="demo-note">${bi({ zh: '位置 1–2（首因）与 7–8（近因）通常记得最好——序列位置效应：开头进入长时记忆，结尾还在短时记忆。', en: 'Positions 1–2 (primacy) and 7–8 (recency) are usually best recalled — the serial-position effect: beginnings enter long-term memory, endings stay in short-term.' })}</p>
        <button class="demo-btn" id="spAgain">${bi({ zh: '再来一次', en: 'Try again' })}</button>`;
      document.getElementById('spAgain')?.addEventListener('click', () => { el.innerHTML = ''; showSeq(); });
    });
    el.appendChild(go);
  };
  showSeq();
}

/* ---------- 6. 框架效应 ---------- */
function framingMount(el: HTMLElement): void {
  type Ans = 'A' | 'B' | null;
  const ans: Ans[] = [null, null];
  const q = (i: number): void => {
    const gain = i === 0;
    el.innerHTML = `
      <p class="demo-play">${bi({ zh: gain ? '问题一（收益框架）：某疫病将致 600 人死亡。' : '问题二（损失框架）：同一场疫病，换种说法——', en: gain ? 'Q1 (gain frame): A disease will kill 600 people.' : 'Q2 (loss frame): the same disease, phrased differently—' })}</p>
      <p class="demo-note">${bi({ zh: gain ? '方案 A：确定救活 200 人。方案 B：1/3 概率救活 600 人，2/3 概率无人获救。你选？' : '方案 A：确定有 400 人死亡。方案 B：1/3 概率 0 人死亡，2/3 概率 600 人死亡。你选？', en: gain ? 'Plan A: surely save 200. Plan B: 1/3 save 600, 2/3 save none. Your pick?' : 'Plan A: surely 400 die. Plan B: 1/3 chance 0 die, 2/3 all 600 die. Your pick?' })}</p>
      <div class="stroop-opts">
        <button class="demo-btn" data-a="A">${bi({ zh: '方案 A', en: 'Plan A' })}</button>
        <button class="demo-btn" data-a="B">${bi({ zh: '方案 B', en: 'Plan B' })}</button>
      </div>
      <div class="demo-result" id="frRes"></div>`;
    el.querySelectorAll<HTMLElement>('[data-a]').forEach((b) =>
      b.addEventListener('click', () => {
        ans[i] = b.dataset.a as Ans;
        if (i === 0) q(1);
        else reveal();
      }),
    );
  };
  const reveal = (): void => {
    const switched = ans[0] !== ans[1];
    el.innerHTML = `
      <p class="demo-note">${bi({ zh: `你的选择：问题一选 ${ans[0]}，问题二选 ${ans[1]}。两题期望结果完全相同（都是救活 200 人），但说法一换，你的偏好${switched ? '就反转了' : '保持一致'}——这正是框架效应。`, en: `Your picks: Q1 ${ans[0]}, Q2 ${ans[1]}. Both have the same expected outcome (save 200), yet a wording swap ${switched ? 'flipped your preference' : 'kept it stable'} — the framing effect.` })}</p>
      <button class="demo-btn" id="frAgain">${bi({ zh: '重做', en: 'Redo' })}</button>`;
    document.getElementById('frAgain')?.addEventListener('click', () => { ans[0] = null; ans[1] = null; q(0); });
  };
  q(0);
}

/* ---------- 7. 基础概率忽视 ---------- */
function baseRateMount(el: HTMLElement): void {
  const paint = (): void => {
    el.innerHTML = `
      <p class="demo-play">${bi({ zh: '某病在人群中患病率 1%。一种检测：病人 100% 呈阳性；健康人 10% 会误报阳性。若某人检测阳性，他真的患病概率约为？', en: 'A disease affects 1% of people. A test: 100% positive if sick; 10% false-positive if healthy. If someone tests positive, roughly what is the true chance they are sick?' })}</p>
      <div class="stroop-opts">
        <button class="demo-btn" data-p="90">${bi({ zh: '约 90%', en: '~90%' })}</button>
        <button class="demo-btn" data-p="50">${bi({ zh: '约 50%', en: '~50%' })}</button>
        <button class="demo-btn" data-p="9">${bi({ zh: '约 9%', en: '~9%' })}</button>
      </div>
      <div class="demo-result" id="brRes"></div>`;
    el.querySelectorAll<HTMLElement>('[data-p]').forEach((b) =>
      b.addEventListener('click', () => {
        const r = document.getElementById('brRes');
        if (!r) return;
        const ok = b.dataset.p === '9';
        r.innerHTML = `<p class="demo-note">${ok ? bi({ zh: '答对！', en: 'Correct!' }) : bi({ zh: '其实是约 9%。', en: 'Actually ~9%.' })} ${bi({ zh: '1000 人里约 10 个真病人（全阳）+ 99 个健康人误阳，阳性中真病人仅 10/109≈9%。人们常忽视基础概率，被「阳性」吓到。', en: 'Of 1000 people, ~10 truly sick (all positive) + 99 healthy false-positives; true sick among positives is only 10/109≈9%. People ignore the base rate and fear the "positive".' })}</p>
          <button class="demo-btn" id="brAgain">${bi({ zh: '再看一次', en: 'See again' })}</button>`;
        document.getElementById('brAgain')?.addEventListener('click', paint);
      }),
    );
  };
  paint();
}

/* ---------- 8. 选择性注意 ---------- */
function attentionMount(el: HTMLElement): void {
  const SEQ = ['K', 'J', 'A', 'L', 'M', '7', 'P', 'A', 'Q', 'R'];
  const paint = (): void => {
    el.innerHTML = `<p class="demo-play">${bi({ zh: '盯住下方，数出字母 A 出现了几次：', en: 'Watch below and count how many times the letter A appears:' })}</p><div class="span-display" id="atDisp"></div>`;
    const disp = document.getElementById('atDisp');
    if (!disp) return;
    let i = 0;
    const tick = (): void => {
      if (i < SEQ.length) { disp.textContent = SEQ[i++]; setTimeout(tick, 650); }
      else ask();
    };
    tick();
  };
  const ask = (): void => {
    el.innerHTML = `
      <p class="demo-play">${bi({ zh: '字母 A 出现了几次？流里是否出现过「非字母」？', en: 'How many A\'s? Did any non-letter appear in the stream?' })}</p>
      <div class="stroop-opts">
        <button class="demo-btn" data-a="2">${bi({ zh: 'A 出现 2 次', en: 'A appeared twice' })}</button>
        <button class="demo-btn" data-a="wrong">${bi({ zh: 'A 出现其他次数', en: 'A other count' })}</button>
      </div>
      <div class="demo-result" id="atRes"></div>`;
    el.querySelectorAll<HTMLElement>('[data-a]').forEach((b) =>
      b.addEventListener('click', () => {
        const r = document.getElementById('atRes');
        if (!r) return;
        const ok = b.dataset.a === '2';
        r.innerHTML = `<p class="demo-note">${ok ? bi({ zh: '数对啦——', en: 'Right count — ' }) : bi({ zh: '其实 A 出现 2 次；', en: 'Actually A appeared twice; ' })}${bi({ zh: '你注意到中间那个「7」了吗？多数人只顾数 A，根本没看见数字——这就是选择性注意/注意盲视：专注目标时，意料之外的东西会被漏掉。', en: 'did you notice the "7" in the middle? Most people focus on counting A and never see the digit — selective attention / inattentional blindness: the unexpected gets missed.' })}</p>
          <button class="demo-btn" id="atAgain">${bi({ zh: '再看一次', en: 'Watch again' })}</button>`;
        document.getElementById('atAgain')?.addEventListener('click', paint);
      }),
    );
  };
  paint();
}

const demos: Demo[] = [
  { icon: '🎨', title: { zh: '斯特鲁普效应', en: 'Stroop Effect' }, desc: { zh: '字义与颜色冲突时，你的大脑会「卡住」。', en: 'When word and color clash, the brain stalls.' }, mount: stroopMount },
  { icon: '📐', title: { zh: '缪勒-莱尔错觉', en: 'Müller-Lyer Illusion' }, desc: { zh: '两条等长线段，为什么看起来一短一长？', en: 'Two equal lines that look unequal.' }, mount: mullerMount },
  { icon: '🧮', title: { zh: '数字广度（短时记忆）', en: 'Digit Span (Working Memory)' }, desc: { zh: '测测你的听觉/视觉短时记忆容量。', en: 'Test your short-term memory capacity.' }, mount: digitMount, noGate: true },
  { icon: '⚓', title: { zh: '锚定效应', en: 'Anchoring' }, desc: { zh: '一个随机数字，如何悄悄改写你的估计。', en: 'How a random number quietly skews your estimate.' }, mount: anchorMount },
  { icon: '📈', title: { zh: '序列位置效应', en: 'Serial-Position Effect' }, desc: { zh: '为什么开头和结尾的事最好记？', en: 'Why do first and last items stick best?' }, mount: serialPositionMount },
  { icon: '🔀', title: { zh: '框架效应', en: 'Framing Effect' }, desc: { zh: '同一件事，换个说法你就改主意。', en: 'Same facts, different wording, different choice.' }, mount: framingMount },
  { icon: '🩺', title: { zh: '基础概率忽视', en: 'Base-Rate Neglect' }, desc: { zh: '阳性≠患病：贝叶斯视角的陷阱。', en: 'Positive ≠ sick: a Bayesian trap.' }, mount: baseRateMount },
  { icon: '👀', title: { zh: '选择性注意', en: 'Selective Attention' }, desc: { zh: '只顾数 A，你漏掉了什么？', en: 'Count the A\'s — what did you miss?' }, mount: attentionMount },
];

export function mountDemos(): void {
  const root = document.getElementById('demosRoot');
  if (!root) return;
  const render = (): void => {
    root.innerHTML = demos
      .map(
        (d, i) => `<section class="demo">
          <div class="demo-head"><span class="demo-icon">${esc(d.icon)}</span>
            <div><h3>${esc(bi(d.title))}</h3><p class="demo-desc">${esc(bi(d.desc))}</p></div>
          </div>
          <div class="demo-body" id="demo-${i}"></div>
        </section>`,
      )
      .join('');
    demos.forEach((d, i) => {
      const el = document.getElementById('demo-' + i);
      if (!el) return;
      if (d.noGate) { d.mount(el); return; }
      el.innerHTML = `<div class="demo-start-wrap"><button class="demo-btn" id="demoStart-${i}">${esc(t('demos.start'))}</button></div>`;
      document.getElementById('demoStart-' + i)?.addEventListener('click', () => {
        el.innerHTML = '';
        d.mount(el);
      });
    });
  };
  render();
  onLangChange(render);
}
