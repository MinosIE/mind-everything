import { readJson, MODULES, BILINGUAL_FIELDS, isFilled } from './lib.mjs';

export async function checkI18n() {
  const errors = [];
  const warnings = [];
  const allIds = new Set();

  // 收集所有 id
  for (const m of MODULES) {
    try {
      const arr = await readJson(m);
      if (Array.isArray(arr)) arr.forEach((it) => it && it.id && allIds.add(it.id));
    } catch {
      /* 该模块尚未创建，跳过 */
    }
  }

  // 双语字段校验
  for (const [mod, fields] of Object.entries(BILINGUAL_FIELDS)) {
    let arr;
    try {
      arr = await readJson(mod);
    } catch {
      continue;
    }
    if (!Array.isArray(arr)) continue;
    arr.forEach((it, i) => {
      const where = `${mod}.json[${i}](${it?.id || '?'})`;
      for (const f of fields) {
        const en = f + 'En';
        if (!isFilled(it[en])) errors.push(`${where}: 缺少双语字段 ${en}`);
      }
      // related 悬空检查（仅警告）
      if (Array.isArray(it.related)) {
        it.related.forEach((rid) => {
          if (!allIds.has(rid)) warnings.push(`${where}: related 引用了不存在的 id "${rid}"`);
        });
      }
    });
  }

  if (warnings.length) {
    console.warn(`[i18n] ${warnings.length} 条警告：`);
    warnings.slice(0, 20).forEach((w) => console.warn('  - ' + w));
  }
  if (errors.length) {
    console.error(`[i18n] ${errors.length} 处双语缺失：`);
    errors.forEach((e) => console.error('  - ' + e));
    throw new Error('i18n check failed');
  }
  console.log('[i18n] 双语校验通过 ✅');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkI18n().catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
}
