import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ROOT, readJson, MODULES, BILINGUAL_FIELDS, isFilled } from "./lib.mjs";

/** 自定义挂载模块（不在 listModules / MODULES 内，但需要导航与 section） */
const CUSTOM_MODULE_IDS = ["demos", "bigfive", "selfrating"];

/** 期望在 index.html 出现的完整模块 id 集合（含首页） */
function expectedModuleIds() {
  return new Set(
    ["home", ...MODULES, ...CUSTOM_MODULE_IDS].map((id) => `m-${id}`),
  );
}

/** 校验 index.html：导航按钮与模块 section 必须与脚本/前端的模块清单一致 */
export async function checkHtmlModules() {
  const errors = [];
  let html = "";
  try {
    html = await readFile(join(ROOT, "index.html"), "utf8");
  } catch {
    errors.push("index.html 读取失败");
    return errors;
  }
  const expected = expectedModuleIds();
  const navIds = [...html.matchAll(/data-go="(m-[a-z-]+)"/g)].map((m) => m[1]);
  const sectionIds = [
    ...html.matchAll(/<section class="module[^"]*" id="(m-[a-z-]+)"/g),
  ].map((m) => m[1]);

  for (const id of expected) {
    if (!navIds.includes(id))
      errors.push(`index.html 导航缺少按钮 data-go="${id}"`);
    if (!sectionIds.includes(id))
      errors.push(`index.html 缺少模块 section id="${id}"`);
  }
  for (const id of navIds) {
    if (!expected.has(id)) {
      errors.push(
        `index.html 导航按钮 data-go="${id}" 未在任何模块清单中登记（scripts/lib.mjs MODULES 或 check-i18n CUSTOM_MODULE_IDS）`,
      );
    }
  }
  for (const id of sectionIds) {
    if (!expected.has(id)) {
      errors.push(`index.html 模块 section id="${id}" 未在任何模块清单中登记`);
    }
  }
  return errors;
}

/** 校验 BILINGUAL_FIELDS 不含 MODULES 之外的键 */
export function checkModuleRegistry() {
  const errors = [];
  for (const key of Object.keys(BILINGUAL_FIELDS)) {
    if (!MODULES.includes(key)) {
      errors.push(
        `BILINGUAL_FIELDS 含未知模块 "${key}"（不在 scripts/lib.mjs MODULES 中）`,
      );
    }
  }
  for (const m of MODULES) {
    if (!(m in BILINGUAL_FIELDS)) {
      errors.push(`MODULES 中的 "${m}" 未在 BILINGUAL_FIELDS 登记双语字段`);
    }
  }
  return errors;
}

export async function checkI18n() {
  const errors = [];
  const warnings = [];
  const allIds = new Set();

  // 收集所有 id
  for (const m of MODULES) {
    try {
      const arr = await readJson(m);
      if (Array.isArray(arr))
        arr.forEach((it) => it && it.id && allIds.add(it.id));
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
      const where = `${mod}.json[${i}](${it?.id || "?"})`;
      for (const f of fields) {
        const en = f + "En";
        if (!isFilled(it[en])) errors.push(`${where}: 缺少双语字段 ${en}`);
      }
      // related 悬空检查（仅警告）
      if (Array.isArray(it.related)) {
        it.related.forEach((rid) => {
          if (!allIds.has(rid))
            warnings.push(`${where}: related 引用了不存在的 id "${rid}"`);
        });
      }
    });
  }

  // 模块注册一致性（导航 section / 双语字段表）
  errors.push(...checkModuleRegistry());
  errors.push(...(await checkHtmlModules()));

  if (warnings.length) {
    console.warn(`[i18n] ${warnings.length} 条警告：`);
    warnings.slice(0, 20).forEach((w) => console.warn("  - " + w));
  }
  if (errors.length) {
    console.error(`[i18n] ${errors.length} 处双语缺失：`);
    errors.forEach((e) => console.error("  - " + e));
    throw new Error("i18n check failed");
  }
  console.log("[i18n] 双语校验通过 ✅");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  checkI18n().catch((e) => {
    console.error(e.message || e);
    process.exit(1);
  });
}
