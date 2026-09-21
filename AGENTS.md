# AGENTS.md — 万物心理学（mind-everything）

供 AI Agent（与未来的自己）快速理解本工程、在不破坏既有约定的前提下改动代码/数据。

## 这是什么

一个**纯静态**心理学通识科普站，用原生 DOM + 字符串模板渲染，零运行时框架。数据全部是 `public/data/*.json`，前端只读取 JSON，不注入业务逻辑。技术栈 Vite + TypeScript，按模块代码分割。

姊妹项目 [`econ-everything`](https://MinosIE.github.io/econ-everything/) 与 [`chinese-dynasty-timeline`](https://MinosIE.github.io/chinese-dynasty-timeline/) 是同一工程范式（无框架静态站 + GEO 派生文件），可对照参考。

## 核心约定（务必遵守）

1. **数据驱动 / 无后端**：所有展示内容来自 `public/data/*.json`。不要在前端硬写内容文案。新增/修改内容 = 改 JSON。
2. **中英双语成对**：每个展示字段都成对出现 —— 中文原文（如 `term`）与其英译（`termEn`）。新增任何带 `*En` 对应物的字段，必须同时补上 `*En`，否则 `scripts/check-i18n.mjs` 会报错。**界面词表**在 `src/core/i18n.ts` 的 `zh` / `en` 两个对象里，键必须完全对齐。
3. **派生文件由脚本生成，不要手改**：`overview.json` / `search.json` / `llms*.txt` / `robots.txt` / `sitemap.xml` 均由 `scripts/` 生成。改动数据后跑 `npm run gen`。
4. **防 LLM 误读**：数据里关键结论要给 `sources`（label/year，尽量带 `url`）；涉及争议（实验伦理、流派优劣、文化差异）并列多方观点，不站队、不诊断、不提供治疗建议。
5. **XSS 安全**：所有外部数据都经过 `src/core/dom.ts` 的 `esc()` 转义后才进 `innerHTML`。新增渲染代码时，**绝不要**把未经 `esc()` 的字段直接拼进模板。
6. **跨模块相关跳转**用 `related` 字段（id 列表）指向任意模块条目，由 `src/core/related.ts` 注册、运行时解析，支持跨模块跳转。id 必须真实存在（`check-i18n` 会警告悬空引用）。

## 目录速查

- `public/data/`：人工维护的源数据（`concepts/glossary/psychologists/schools.json` 等）+ 脚本生成的派生文件（`overview/search.json`）。
- `scripts/`：`build-all` / `build-overview` / `build-search` / `build-geo` / `build-llms-full` / `check-i18n`（Node ESM，读取 `scripts/lib.mjs` 的规格配置）。
- `src/core/`：`i18n` `theme` `data` `dom` `app` `detail` `search` `related` `types`。
- `src/modules/`：`shared.ts`（卡片网格/列表/详情/相关按钮的通用渲染器）+ 各内容模块 `concepts/glossary/psychologists/schools.ts` + `index.ts`（模块注册表）+ `types.ts`（各模块的 TS 接口）。
- `src/styles/`：设计令牌 `tokens.css`（陶土橙 `#C2683D` + 暖金 `#D99A3E`，含深/浅色主题）、基础 `base.css`、组件 `components.css`。
- `index.html`：SPA 骨架，包含导航 `#modNav`、首页 `#homeGrid`、每个模块的 `<section class="module" id="m-xxx">` 及内部 host 节点（如 `#conceptsGrid`）、详情面板 `#detailRoot`、搜索 `#search`/`#searchResults`、页脚 `#foot`。

## 新增一个内容模块的标准流程

1. 在 `public/data/` 新增 `xxx.json`（字段遵循既有模块结构 + 双语成对 + `id` 唯一）。
2. 在 `src/modules/` 写 `xxx.ts`，导出 `ListModule`：`card(it, L)` 返回卡片视图、`detail(it, L)` 返回详情（含 `relatedIds` 与 `sources`）。
3. 在 `index.html` 的 `#content` 内加 `<section id="m-xxx">`（含 `mod-head` 标题、可选 `#xxxFilters` 筛选条、`#xxxGrid` 容器），并在 `#modNav` 加导航按钮。
4. 在 `src/modules/index.ts` 注册 `{ id:'m-xxx', ... }`（放入 `listModules`）。
5. 在 `src/core/i18n.ts` 补 `nav.xxx` / `entry.xxx` / `xxx.title` / `xxx.sub` 的中英双语。
6. 在 `scripts/lib.mjs` 的 `MODULES`、`HOME_ENTRIES`、`BILINGUAL_FIELDS` 中登记（overview/search/sitemap/双语校验需要）。
7. `npm run gen` → `npm run build` → 本地预览验证。

## 校验 / 构建

- `npm run gen`：生成全部派生文件并做双语校验。提交前必跑。
- `npm run build`：生产构建到 `dist/`（base 已设为 `/mind-everything/`）。
- `npx tsc --noEmit`：类型检查。
- 本地预览：`npm run build` 后用任意静态服务器以 **子路径 `/mind-everything/`** 提供 `dist/`（如 `python3 -m http.server --directory /tmp/ghpages` 且 `dist` 位于 `/tmp/ghpages/mind-everything/`）。

## 已验证

- P0 五个模块（概览/核心概念/名词词典/心理学家/流派）全部渲染；首页 KPI/入口/参考文献正常。
- 搜索跨模块命中并跳转；详情面板含相关条目与来源；中英切换全局生效。
- `npm run gen` 双语校验通过（`check-i18n` 零缺失）。
