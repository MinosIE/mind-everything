# agent.md — 万物心理学（mind-everything）速查

面向接手本仓库的 AI Agent 的精简规格。完整规范见 [`AGENTS.md`](./AGENTS.md)。

## 一句话定位

纯静态、零框架、Vite + TypeScript 的心理学通识科普站；内容全部来自 `public/data/*.json`，前端只读 JSON 并渲染，不含业务内容。

## 必守约定

1. **数据驱动**：展示文案只来自 `public/data/*.json`，不要在前端硬写内容。改内容 = 改 JSON。
2. **中英双语成对**：展示字段成对（`term` / `termEn`）；界面词在 `src/core/i18n.ts` 的 `zh` / `en` 两对象，键名必须完全对齐，否则 `check-i18n` 报错。
3. **派生文件勿手改**：`overview.json` / `search.json` / `llms*.txt` / `sitemap.xml` 由 `scripts/` 生成；改数据后跑 `npm run gen`。
4. **XSS**：外部数据一律经 `src/core/dom.ts` 的 `esc()` 转义再进 `innerHTML`，禁止未转义拼接。
5. **中立**：争议内容并列多方观点，不站队、不诊断、不给药。
6. **相关跳转**：用 `related`（id 列表）指跨模块条目，由 `src/core/related.ts` 解析；id 必须真实存在。

## 两类模块

- **标准内容模块**（ListModule）：`concepts` `glossary` `psychologists` `schools` `biases` `experiments` `timeline` `everyday` `myths` `compare` `quiz`。在 `src/modules/index.ts` 的 `listModules` 注册，渲染走 `shared.ts` 的 `mountList`。新增要同步改 `index.html`（section + nav + host 节点）、`i18n.ts`、`scripts/lib.mjs`（MODULES / HOME_ENTRIES / BILINGUAL_FIELDS）。
- **自定义挂载模块**：`demos`（`mountDemos`）、`bigfive`（`mountBigFive`）、`selfrating`（`mountSelfRating`）。不走 ListModule，在 `src/core/app.ts` 的 `boot()` 直接调用，并在 `BUILT` 集合与 `index.html` 的 host 节点（`#demosRoot` / `#bigfiveRoot` / `#selfratingRoot`）登记。

## 常用命令

```bash
npm run gen      # 生成全部派生文件 + 双语校验（提交前必跑）
npm run build    # gen + tsc --noEmit + vite build → dist/（子路径 /mind-everything/）
npx tsc --noEmit # 类型检查
npm run check    # 仅 check-i18n
```

## 目录速查

- `public/data/`：源数据 + 派生数据
- `scripts/`：生成与校验脚本（读 `scripts/lib.mjs` 的规格）
- `src/core/`：i18n / theme / data / dom / app / detail / search / related / types
- `src/modules/`：shared 通用渲染器 + 各模块 + `index.ts` 注册表 + `types.ts` 接口
- `src/styles/`：tokens / base / components
- `index.html`：SPA 骨架（nav / homeGrid / 各 `section.m-module` / detailRoot / search / foot）
