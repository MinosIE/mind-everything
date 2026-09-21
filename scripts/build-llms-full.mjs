import { readJson, writeOut, MODULES } from './lib.mjs';

function pick(it, key, lang) {
  if (lang === 'en') {
    const v = it[key + 'En'];
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return it[key];
}

function block(it, lang) {
  const lines = [];
  const title = pick(it, it.name ? 'name' : 'term', lang) || it.id;
  lines.push(`### ${title}`);
  if (it.era) lines.push(`- 年代：${it.era}`);
  if (it.field) lines.push(`- 领域：${pick(it, 'field', lang)}`);
  if (it.oneLiner) lines.push(`- ${pick(it, 'oneLiner', lang)}`);
  if (it.detail) lines.push(`- ${pick(it, 'detail', lang)}`);
  if (it.def) lines.push(`- 定义：${pick(it, 'def', lang)}`);
  if (it.plain) lines.push(`- 大白话：${pick(it, 'plain', lang)}`);
  if (Array.isArray(it.keyIdeas)) lines.push(`- 要点：${pick(it, 'keyIdeas', lang).join('；')}`);
  if (Array.isArray(it.works)) lines.push(`- 著作：${pick(it, 'works', lang).join('；')}`);
  if (Array.isArray(it.founders)) lines.push(`- 代表：${pick(it, 'founders', lang).join('；')}`);
  if (Array.isArray(it.tags)) lines.push(`- 标签：${it.tags.join('，')}`);
  return lines.join('\n');
}

export async function buildLlmsFull() {
  for (const lang of ['zh', 'en']) {
    const parts = [`# 万物心理学 · Mind of Everything（${lang === 'en' ? 'EN' : '中文'}全文）\n`];
    for (const m of MODULES) {
      let arr;
      try {
        arr = await readJson(m);
      } catch {
        continue;
      }
      if (!Array.isArray(arr)) continue;
      parts.push(`\n## ${m}\n`);
      for (const it of arr) parts.push(block(it, lang));
    }
    await writeOut(lang === 'en' ? 'llms-full-en.txt' : 'llms-full.txt', parts.join('\n') + '\n');
  }
  console.log('[llms-full] zh + en written');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildLlmsFull().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
