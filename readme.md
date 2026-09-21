# 万物心理学 · Mind of Everything

一个零框架、中英双语的心理学通识科普静态站。用原生 DOM + 字符串模板渲染，数据全部来自 `public/data/*.json`，Vite + TypeScript 打包，按模块代码分割。

- 线上预览：`https://minosie.github.io/mind-everything/`
- 姊妹站：[`econ-everything`](https://minosie.github.io/econ-everything/)（经济学）· [`chinese-dynasty-timeline`](https://minosie.github.io/chinese-dynasty-timeline/)（中国历史时间轴）

## 特色

不只是「读」——还能「亲手感受」心理学：

- **互动小实验**：Stroop、缪勒-莱尔错觉、数字广度（短时记忆）、锚定效应、序列位置效应、框架效应、基础概率忽视、选择性注意/变化盲视，每个实验先「开始」再上手玩。
- **大五自测**：10 题 Likert 自评，生成你的 OCEAN 人格剖面（非诊断）。
- **心理自评**：压力、睡眠、拖延、正念 4 个迷你量表，生成近期状态快照（非诊断）。

加上通识内容模块：核心概念、名词词典、心理学家、流派、认知偏差、著名实验、发展时间轴、生活中的心理学、常见误区、中西对比、小测验。

## 技术栈

- 构建：Vite 8 + TypeScript 7（严格类型）
- 渲染：原生 DOM / 字符串模板，无 React / Vue 等运行时框架
- 数据：`public/data/*.json`（人工维护的源数据 + 脚本生成的派生文件）
- 样式：`tokens.css`（陶土橙 `#C2683D` + 暖金 `#D99A3E`，深/浅色主题）+ `base.css` + `components.css`
- 默认部署子路径：`/mind-everything/`

## 快速开始

```bash
npm install
npm run dev        # 生成派生数据 + 启动 Vite 开发服务器
npm run build      # 生成数据 + 类型检查 + 生产构建到 dist/
npm run preview    # 构建后在子路径 /mind-everything/ 下预览
npm run check      # 仅做中英双语校验（check-i18n）
```

> 改动 `public/data/*.json` 后务必跑 `npm run gen`（或 `npm run dev`），重新生成 `overview.json` / `llms*.txt` / `sitemap.xml`。

## 目录结构

```
public/data/   源数据（概念/词典/心理学家/流派/偏差/实验/时间轴/生活/误区/对比/测验）
                + 脚本生成的派生文件（overview.json 等）
scripts/        build-all / build-overview / build-geo / build-llms-full / check-i18n
src/core/       i18n · theme · data · dom(esc) · app · detail · search · related · types
src/modules/    shared.ts(通用渲染器) + 各内容模块 + demos/bigfive/selfrating(自定义挂载) + index.ts(注册表)
src/styles/     tokens.css · base.css · components.css
index.html      SPA 骨架（导航 / 首页 / 各模块 section / 详情面板 / 搜索 / 页脚）
```

## 内容约定（简版）

- **数据驱动**：所有展示文案来自 JSON，前端不硬写内容；改内容 = 改 JSON。
- **中英成对**：展示字段成对（`term` / `termEn`），界面词在 `src/core/i18n.ts` 的 `zh` / `en` 对象里键名对齐。
- **衍生文件不手改**：由 `scripts/` 生成，改数据后跑 `npm run gen`。
- **安全**：外部数据一律经 `src/core/dom.ts` 的 `esc()` 转义再进 `innerHTML`。
- **中立**：争议话题并列多方观点，不站队、不诊断、不提供治疗建议。

给 AI Agent 的完整工程规范见 [`AGENTS.md`](./AGENTS.md)。

## License

MIT
