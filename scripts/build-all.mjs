import { buildOverview } from "./build-overview.mjs";
import { buildGeo } from "./build-geo.mjs";
import { buildLlmsFull } from "./build-llms-full.mjs";
import { checkI18n } from "./check-i18n.mjs";

// 注：search.json 已移除 —— 前端搜索走内存注册表（related.ts），
// GEO 消费方用 llms*.txt 与各模块 JSON 即可，无需重复索引。
await buildOverview();
await buildGeo();
await buildLlmsFull();
await checkI18n();
console.log("[gen] 全部派生文件已生成");
