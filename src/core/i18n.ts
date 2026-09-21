import type { LObj, Lang } from './types';

const zh = {
  docTitle: '万物心理学 · Mind of Everything | 心理学通识科普',
  docDesc:
    '用心理学读懂人心：核心概念、名词词典、心理学家、心理学流派、认知偏差、著名实验、发展时间轴、生活中的心理学，中英双语、免费无广告。',

  heroTitle: '万物心理学 · Mind of Everything',
  heroSub:
    '用心理学读懂人心：从认知偏差、著名实验到流派与思想家，把「心智」拆成看得懂的常识。中立、结构化、中英双语、免费无广告。',
  heroIssue: '发现问题或有建议？欢迎提 Issue 或邮件反馈：',
  heroMail: '✉️ 邮件反馈',
  'mail.subject': '【万物心理学】问题反馈 / 建议',
  'mail.body':
    '您好，\n\n我想反馈 / 建议：\n（请简要描述您遇到的问题或想法）\n\n—— 页面模块 / 位置：\n（如：核心概念 - 确认偏误）\n\n—— 期望的改进（可选）：\n（如：……）\n\n谢谢！',

  themeToDark: '夜间',
  themeToLight: '日间',
  langLabel: '中文',

  'nav.home': '概览',
  'nav.concepts': '核心概念',
  'nav.glossary': '名词词典',
  'nav.psychologists': '心理学家',
  'nav.schools': '心理学流派',
  'nav.biases': '认知偏差',
  'nav.experiments': '著名实验',
  'nav.timeline': '发展时间轴',
  'nav.everyday': '生活中的心理学',
  'nav.myths': '常见误区',
  'nav.quiz': '小测验',
  'nav.compare': '中西对比',

  homeLead: '从核心概念、名词词典，到心理学家、流派与实验 —— 选一个板块开始',
  refsTitle: '主要参考资料与数据来源',
  refsSub: '本站内容为通识性整理，关键结论均标注来源与年份；不构成任何专业心理或医疗建议。',

  'entry.concepts.t': '核心概念',
  'entry.concepts.d': '心智、意识、记忆、情绪、动机、人格、归因与依恋',
  'entry.glossary.t': '名词词典',
  'entry.glossary.d': '认知偏差/防御机制/条件反射等术语的定义、大白话与英文',
  'entry.psychologists.t': '心理学家',
  'entry.psychologists.d': '从弗洛伊德到卡尼曼，他们各自回答了什么',
  'entry.schools.t': '心理学流派',
  'entry.schools.d': '精神分析、行为主义、认知、人本、进化、神经、积极',
  'entry.biases.t': '认知偏差',
  'entry.biases.d': '确认偏误、锚定、可得性、损失厌恶、从众',
  'entry.experiments.t': '著名实验',
  'entry.experiments.d': '斯坦福监狱、米尔格拉姆、棉花糖、小阿尔伯特',
  'entry.timeline.t': '发展时间轴',
  'entry.timeline.d': '从冯特 1879 到当代，心理学史关键节点',
  'entry.everyday.t': '生活中的心理学',
  'entry.everyday.d': '拖延、决策、亲密关系、职场、育儿、社交媒体',
  'entry.myths.t': '常见误区',
  'entry.myths.d': '「左脑人/右脑人」「血型性格」等辟谣',
  'entry.quiz.t': '小测验',
  'entry.quiz.d': '选择题自测 + 解析，本地计分不上传数据',
  'entry.compare.t': '中西对比',
  'entry.compare.d': '自我建构、情绪表达、育儿的跨文化差异',

  'concepts.title': '核心概念',
  'concepts.sub':
    '心理学的地基：心智、意识、记忆、情绪、动机、人格、归因与依恋。按分类与难度筛选，点击卡片看详解。',
  'glossary.title': '名词词典',
  'glossary.sub': '新闻与书里天天出现却说不清的词：定义 + 大白话 + 英文对照 + 相关概念。',
  'glossary.searchPlaceholder': '在词典内搜索：如「条件反射」「图式」「依恋」',
  'psychologists.title': '心理学家',
  'psychologists.sub': '弗洛伊德、皮亚杰、斯金纳、班杜拉、卡尼曼、马斯洛……他们各自回答了什么。',
  'schools.title': '心理学流派',
  'schools.sub': '同一颗心智，不同的解释处方：精神分析、行为主义、认知、人本、进化、神经、积极。',
  'biases.title': '认知偏差',
  'experiments.title': '著名实验',
  'timeline.title': '发展时间轴',
  'everyday.title': '生活中的心理学',
  'myths.title': '常见误区',
  'quiz.title': '小测验',
  'compare.title': '中西对比',

  searchPlaceholder: '搜索：概念 / 术语 / 心理学家 / 实验 / 流派，如「确认偏误」「卡尼曼」「斯坦福监狱」',
  searchEmpty: '没有找到匹配内容，换个更短的关键词试试。',
  searchHint: '输入关键词开始搜索。',
  'search.t.concept': '概念',
  'search.t.term': '术语',
  'search.t.psychologist': '心理学家',
  'search.t.school': '流派',
  'search.t.bias': '偏差',
  'search.t.experiment': '实验',
  'search.t.event': '节点',
  'search.t.everyday': '生活',
  'search.t.myth': '误区',
  'search.t.quiz': '测验',
  'search.t.compare': '对比',

  'kpi.concepts': '核心概念',
  'kpi.glossary': '词典术语',
  'kpi.psychologists': '心理学家',
  'kpi.schools': '流派',

  'ui.all': '全部',
  'ui.level': '难度',
  'ui.lvl1': '入门',
  'ui.lvl2': '进阶',
  'ui.lvl3': '拓展',
  'ui.count': '共 {n} 条',
  'ui.enter': '进入 →',
  'ui.oneLiner': '一句话',
  'ui.detail': '详解',
  'ui.example': '生活例子',
  'ui.related': '相关条目',
  'ui.sources': '来源',
  'ui.close': '关闭',
  'ui.loading': '加载中…',
  'ui.loadFail': '内容加载失败，请刷新页面重试。',
  'ui.def': '定义',
  'ui.plain': '大白话',
  'ui.ideas': '主要思想',
  'ui.works': '代表著作',
  'ui.founders': '代表人物',
  'ui.core': '核心主张',
  'ui.keyIdeas': '关键论点',
  'ui.strengths': '说服力所在',
  'ui.criticisms': '主要批评',
  'ui.category': '分类',
  'ui.field': '领域',
  'ui.era': '时期',
  'ui.comingSoon': '该模块正在建设中，敬请期待。',

  'foot.tip': '本站为通识科普，内容中立整理，不构成任何专业心理或医疗建议。',
  'foot.sister': '姊妹项目',
  'foot.data': '结构化数据',
  'foot.llms': 'AI 全文索引',
  'foot.disclaimer': '© 2026 万物心理学 · MIT License',
};

const en: typeof zh = {
  docTitle: 'Mind of Everything | A Plain-Language Guide to Psychology',
  docDesc:
    'Psychology explained in plain language: core concepts, glossary, thinkers, schools of thought, cognitive biases, famous experiments, history, and everyday psychology. Bilingual and ad-free.',

  heroTitle: 'Mind of Everything',
  heroSub:
    'Understand the human mind with psychology — from cognitive biases and famous experiments to schools of thought and key thinkers. Neutral, structured, bilingual and free of ads.',
  heroIssue: 'Found a problem or have a suggestion? Open an issue or send an email:',
  heroMail: '✉️ Email us',
  'mail.subject': '[Mind of Everything] Feedback / Suggestion',
  'mail.body':
    'Hi,\n\nI would like to share feedback / a suggestion:\n(please describe the issue or idea briefly)\n\n—— Page / module / location:\n(e.g. Core Concepts - Confirmation Bias)\n\n—— Expected improvement (optional):\n(e.g. ...)\n\nThanks!',

  themeToDark: 'Dark',
  themeToLight: 'Light',
  langLabel: 'English',

  'nav.home': 'Overview',
  'nav.concepts': 'Core Concepts',
  'nav.glossary': 'Glossary',
  'nav.psychologists': 'Thinkers',
  'nav.schools': 'Schools',
  'nav.biases': 'Biases',
  'nav.experiments': 'Experiments',
  'nav.timeline': 'Timeline',
  'nav.everyday': 'Everyday',
  'nav.myths': 'Myths',
  'nav.quiz': 'Quiz',
  'nav.compare': 'Compare',

  homeLead: 'From core concepts and glossary to thinkers, schools and experiments — pick a section to start.',
  refsTitle: 'References and data sources',
  refsSub:
    'This site is an educational summary. Key claims are labelled with source and year. Nothing here is professional psychological or medical advice.',

  'entry.concepts.t': 'Core Concepts',
  'entry.concepts.d': 'Mind, consciousness, memory, emotion, motivation, personality, attribution, attachment.',
  'entry.glossary.t': 'Glossary',
  'entry.glossary.d': 'Definitions, plain-language readings and English for bias/defense/conditioning terms.',
  'entry.psychologists.t': 'Thinkers',
  'entry.psychologists.d': 'From Freud to Kahneman — what question each of them set out to answer.',
  'entry.schools.t': 'Schools',
  'entry.schools.d': 'Psychoanalysis, behaviorism, cognitive, humanistic, evolutionary, neuropsych, positive.',
  'entry.biases.t': 'Cognitive Biases',
  'entry.biases.d': 'Confirmation, anchoring, availability, loss aversion, conformity.',
  'entry.experiments.t': 'Famous Experiments',
  'entry.experiments.d': 'Stanford prison, Milgram, marshmallow, Little Albert.',
  'entry.timeline.t': 'Timeline',
  'entry.timeline.d': 'From Wundt in 1879 to today — key turning points in psychology.',
  'entry.everyday.t': 'Everyday Psychology',
  'entry.everyday.d': 'Procrastination, decisions, relationships, work, parenting, social media.',
  'entry.myths.t': 'Myths Busted',
  'entry.myths.d': 'Left-brain/right-brain, blood-type personality and other debunked claims.',
  'entry.quiz.t': 'Quiz',
  'entry.quiz.d': 'Multiple-choice self-check with explanations, scored locally.',
  'entry.compare.t': 'Compare',
  'entry.compare.d': 'Cross-cultural differences in self, emotion, parenting.',

  'concepts.title': 'Core Concepts',
  'concepts.sub':
    'The foundations: mind, consciousness, memory, emotion, motivation, personality, attribution and attachment. Filter by category and level, then tap a card for details.',
  'glossary.title': 'Glossary',
  'glossary.sub':
    'Words that appear in the news but are rarely explained: definition, plain-language reading, English term and related concepts.',
  'glossary.searchPlaceholder': 'Search the glossary: e.g. "conditioning", "schema", "attachment"',
  'psychologists.title': 'Thinkers',
  'psychologists.sub':
    'Freud, Piaget, Skinner, Bandura, Kahneman, Maslow — and the question each of them set out to answer.',
  'schools.title': 'Schools of Thought',
  'schools.sub':
    'The same mind, different prescriptions: psychoanalysis, behaviorism, cognitive, humanistic, evolutionary, neuropsych, positive.',
  'biases.title': 'Cognitive Biases',
  'experiments.title': 'Famous Experiments',
  'timeline.title': 'Timeline',
  'everyday.title': 'Everyday Psychology',
  'myths.title': 'Myths Busted',
  'quiz.title': 'Quiz',
  'compare.title': 'Compare',

  searchPlaceholder: 'Search concepts, terms, thinkers, experiments, schools — e.g. "confirmation bias", "Kahneman"',
  searchEmpty: 'Nothing matched. Try a shorter keyword.',
  searchHint: 'Type a keyword to search.',
  'search.t.concept': 'Concept',
  'search.t.term': 'Term',
  'search.t.psychologist': 'Thinker',
  'search.t.school': 'School',
  'search.t.bias': 'Bias',
  'search.t.experiment': 'Experiment',
  'search.t.event': 'Event',
  'search.t.everyday': 'Everyday',
  'search.t.myth': 'Myth',
  'search.t.quiz': 'Quiz',
  'search.t.compare': 'Compare',

  'kpi.concepts': 'Concepts',
  'kpi.glossary': 'Glossary terms',
  'kpi.psychologists': 'Thinkers',
  'kpi.schools': 'Schools',

  'ui.all': 'All',
  'ui.level': 'Level',
  'ui.lvl1': 'Intro',
  'ui.lvl2': 'Intermediate',
  'ui.lvl3': 'Advanced',
  'ui.count': '{n} entries',
  'ui.enter': 'Open →',
  'ui.oneLiner': 'In one line',
  'ui.detail': 'Details',
  'ui.example': 'Example',
  'ui.related': 'Related',
  'ui.sources': 'Sources',
  'ui.close': 'Close',
  'ui.loading': 'Loading…',
  'ui.loadFail': 'Failed to load content. Please refresh the page.',
  'ui.def': 'Definition',
  'ui.plain': 'In plain language',
  'ui.ideas': 'Main ideas',
  'ui.works': 'Major works',
  'ui.founders': 'Key figures',
  'ui.core': 'Core claim',
  'ui.keyIdeas': 'Key arguments',
  'ui.strengths': 'Why it persuades',
  'ui.criticisms': 'Main criticisms',
  'ui.category': 'Category',
  'ui.field': 'Field',
  'ui.era': 'Era',
  'ui.comingSoon': 'This module is under construction. Stay tuned.',

  'foot.tip': 'An educational summary, neutral in tone. Nothing here is professional psychological or medical advice.',
  'foot.sister': 'Sister project',
  'foot.data': 'Structured data',
  'foot.llms': 'LLM full text',
  'foot.disclaimer': '© 2026 Mind of Everything · MIT License',
};

export const I18N: Record<Lang, typeof zh> = { zh, en };

let lang: Lang = 'zh';
const listeners: ((l: Lang) => void)[] = [];

function detectLang(): Lang {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q) return q === 'en' ? 'en' : 'zh';
    const stored = localStorage.getItem('lang');
    if (stored) return stored === 'en' ? 'en' : 'zh';
    return (navigator.language || 'zh').toLowerCase().startsWith('en') ? 'en' : 'zh';
  } catch {
    return 'zh';
  }
}

export function initLang(): Lang {
  lang = detectLang();
  return lang;
}

export function getLang(): Lang {
  return lang;
}

export function onLangChange(cb: (l: Lang) => void): void {
  listeners.push(cb);
}

export function setLang(next: Lang): void {
  if (next === lang) return;
  lang = next;
  try {
    localStorage.setItem('lang', lang);
  } catch {
    /* 隐私模式忽略 */
  }
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  document.documentElement.setAttribute('data-lang', lang);
  applyStaticLang();
  listeners.forEach((cb) => cb(lang));
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const dict = I18N[lang] as Record<string, string>;
  const base = zh as Record<string, string>;
  let s = dict[key] ?? base[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  return s;
}

export function L<T = string>(o: LObj | undefined | null, key: string): T {
  if (!o) return undefined as unknown as T;
  if (lang === 'en') {
    const v = o[key + 'En'];
    if (v !== undefined && v !== null && v !== '') return v as T;
  }
  return o[key] as T;
}

export function applyStaticLang(): void {
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((e) => {
    const key = e.dataset.i18n;
    if (key) e.textContent = t(key);
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-attr]').forEach((e) => {
    const spec = e.dataset.i18nAttr || '';
    spec.split(',').forEach((pair) => {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (attr && key) e.setAttribute(attr, t(key));
    });
  });
}

export function initLangSwitch(): void {
  const btn = document.getElementById('langBtn');
  const label = document.getElementById('langLabel');
  if (label) label.textContent = t('langLabel');
  if (btn) btn.addEventListener('click', () => setLang(lang === 'en' ? 'zh' : 'en'));
}
