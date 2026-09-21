import { readJson, writeJson, MODULES } from './lib.mjs';

export async function buildSearch() {
  const index = [];
  for (const m of MODULES) {
    let arr;
    try {
      arr = await readJson(m);
    } catch {
      continue;
    }
    if (!Array.isArray(arr)) continue;
    for (const it of arr) {
      if (!it || !it.id) continue;
      const title = it.name || it.term || '';
      const titleEn = it.nameEn || it.termEn || title;
      const sub = it.oneLiner || it.plain || it.def || '';
      const subEn = it.oneLinerEn || it.plainEn || it.defEn || sub;
      index.push({
        id: it.id,
        module: m,
        title,
        titleEn,
        sub,
        subEn,
        tags: Array.isArray(it.tags) ? it.tags : [],
      });
    }
  }
  await writeJson('search.json', index);
  console.log(`[search] ${index.length} entries`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildSearch().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
