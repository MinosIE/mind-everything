import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
export const DATA = join(ROOT, 'public', 'data');
export const OUT = join(ROOT, 'public');

export const BASE = '/mind-everything/';
export const SITE_URL = 'https://MinosIE.github.io' + BASE;
export const SITE = {
  repo: 'mind-everything',
  title: '万物心理学 · Mind of Everything',
};

/** 已上线/规划模块（id 与前端导航一一对应） */
export const MODULES = [
  'concepts',
  'glossary',
  'psychologists',
  'schools',
  'biases',
  'experiments',
  'timeline',
  'everyday',
  'myths',
  'quiz',
  'compare',
];

/** 首页入口卡（图标 + i18n 键，标题/描述由前端按语言渲染） */
export const HOME_ENTRIES = [
  { id: 'concepts', icon: '🧩', titleKey: 'entry.concepts.t', descKey: 'entry.concepts.d' },
  { id: 'glossary', icon: '📖', titleKey: 'entry.glossary.t', descKey: 'entry.glossary.d' },
  { id: 'psychologists', icon: '🧠', titleKey: 'entry.psychologists.t', descKey: 'entry.psychologists.d' },
  { id: 'schools', icon: '🏛️', titleKey: 'entry.schools.t', descKey: 'entry.schools.d' },
  { id: 'biases', icon: '🎭', titleKey: 'entry.biases.t', descKey: 'entry.biases.d' },
  { id: 'experiments', icon: '🔬', titleKey: 'entry.experiments.t', descKey: 'entry.experiments.d' },
  { id: 'timeline', icon: '🗓️', titleKey: 'entry.timeline.t', descKey: 'entry.timeline.d' },
  { id: 'everyday', icon: '🌆', titleKey: 'entry.everyday.t', descKey: 'entry.everyday.d' },
  { id: 'myths', icon: '💡', titleKey: 'entry.myths.t', descKey: 'entry.myths.d' },
  { id: 'quiz', icon: '✅', titleKey: 'entry.quiz.t', descKey: 'entry.quiz.d' },
  { id: 'compare', icon: '🌐', titleKey: 'entry.compare.t', descKey: 'entry.compare.d' },
  { id: 'demos', icon: '🎮', titleKey: 'entry.demos.t', descKey: 'entry.demos.d' },
  { id: 'bigfive', icon: '📊', titleKey: 'entry.bigfive.t', descKey: 'entry.bigfive.d' },
  { id: 'selfrating', icon: '🧪', titleKey: 'entry.selfrating.t', descKey: 'entry.selfrating.d' },
];

export const REFS = [
  '《心理学与生活》（Richard J. Gerrig 等，2022）',
  '《思考，快与慢》（Daniel Kahneman，2011）',
  '《改变心理学的 40 项研究》（Roger R. Hock，2017）',
  'American Psychological Association (APA) — apa.org',
  'Simply Psychology（simplypsychology.org，通识入门参考）',
];

/** 双语字段校验：键对应一个中文原字段，需存在同名的 `*En` 字段 */
export const BILINGUAL_FIELDS = {
  concepts: ['term', 'oneLiner', 'detail', 'example'],
  glossary: ['term', 'def', 'plain'],
  psychologists: ['name', 'field', 'oneLiner', 'detail', 'keyIdeas', 'works'],
  schools: ['name', 'oneLiner', 'core', 'founders', 'keyIdeas', 'strengths', 'criticisms'],
  biases: ['term', 'oneLiner', 'detail'],
  experiments: ['term', 'oneLiner', 'detail', 'ethics'],
  timeline: ['term', 'oneLiner', 'detail'],
  everyday: ['term', 'oneLiner', 'detail'],
  myths: ['term', 'oneLiner', 'detail'],
  compare: ['term', 'oneLiner', 'detail', 'west', 'east'],
  quiz: ['term', 'oneLiner', 'detail'],
};

export async function readJson(name) {
  return JSON.parse(await readFile(join(DATA, name.endsWith('.json') ? name : name + '.json'), 'utf8'));
}

export async function writeJson(name, obj) {
  await mkdir(DATA, { recursive: true });
  await writeFile(join(DATA, name.endsWith('.json') ? name : name + '.json'), JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

export async function writeOut(name, text) {
  await mkdir(OUT, { recursive: true });
  await writeFile(join(OUT, name), text, 'utf8');
}

export function isFilled(v) {
  if (Array.isArray(v)) return v.length > 0;
  return v !== undefined && v !== null && String(v).trim() !== '';
}
