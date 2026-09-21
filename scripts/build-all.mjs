import { buildOverview } from './build-overview.mjs';
import { buildSearch } from './build-search.mjs';
import { buildGeo } from './build-geo.mjs';
import { buildLlmsFull } from './build-llms-full.mjs';
import { checkI18n } from './check-i18n.mjs';

await buildOverview();
await buildSearch();
await buildGeo();
await buildLlmsFull();
await checkI18n();
console.log('[gen] 全部派生文件已生成');
