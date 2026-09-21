import { readJson, writeJson, HOME_ENTRIES, REFS, MODULES } from './lib.mjs';

const KPI_SPECS = [
  { file: 'concepts', titleKey: 'kpi.concepts' },
  { file: 'glossary', titleKey: 'kpi.glossary' },
  { file: 'psychologists', titleKey: 'kpi.psychologists' },
  { file: 'schools', titleKey: 'kpi.schools' },
  { file: 'biases', titleKey: 'kpi.biases' },
  { file: 'experiments', titleKey: 'kpi.experiments' },
  { file: 'timeline', titleKey: 'kpi.timeline' },
  { file: 'everyday', titleKey: 'kpi.everyday' },
  { file: 'myths', titleKey: 'kpi.myths' },
  { file: 'compare', titleKey: 'kpi.compare' },
  { file: 'quiz', titleKey: 'kpi.quiz' },
];

export async function buildOverview() {
  const kpis = [];
  for (const k of KPI_SPECS) {
    let count = 0;
    try {
      const arr = await readJson(k.file);
      count = Array.isArray(arr) ? arr.length : 0;
    } catch {
      count = 0;
    }
    kpis.push({ file: k.file + '.json', titleKey: k.titleKey, count });
  }
  const overview = { kpis, entries: HOME_ENTRIES, refs: REFS };
  await writeJson('overview.json', overview);
  console.log(`[overview] kpis=${kpis.map((k) => k.count).join('/')} entries=${HOME_ENTRIES.length}`);
}

// 允许单独运行
if (import.meta.url === `file://${process.argv[1]}`) {
  buildOverview().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
