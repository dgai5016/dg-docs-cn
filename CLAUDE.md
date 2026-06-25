# dg-docs-cn

英文技术文档中文翻译合集。每个翻译项目保留原框架（MkDocs Material / VitePress / mdBook），集中托管在 GitHub Pages，由 `site-index/`（VitePress）统一提供导航入口。

- **线上**：https://dgai5016.github.io/dg-docs-cn/
- **仓库**：https://github.com/dgai5016/dg-docs-cn
- **单项目 URL 规律**：`https://dgai5016.github.io/dg-docs-cn/{项目名}/`

## 目录结构

```
dg-docs-cn/
├── site-index/                          # 根索引页（VitePress）
│   ├── .vitepress/
│   │   ├── config.ts                    # base: '/dg-docs-cn/'
│   │   ├── scripts/build-projects.mjs   # 扫描所有 .project.json → projects.json
│   │   └── projects.json                # 自动生成，已 gitignore，勿手改
│   └── index.md
├── {项目名}/                            # 每个翻译项目一个目录，沿用原框架
│   ├── mkdocs.yml / .vitepress/ / book.toml   # 原框架配置（保留原 UI）
│   ├── docs/ 或 src/                   # 中文 markdown
│   └── .project.json                    # 项目元信息（CI 与索引页的唯一数据源）
├── .claude/skills/                      # 本仓库专属 skills
│   ├── dg-translate-tech-docs/          # 翻译引擎：英文文档 → 中文
│   ├── dg-import-docs/                  # 翻译产物 → 搬运进本仓库
│   └── dg-translate-and-import/         # 一条龙编排（翻译 + 搬运）
└── .github/workflows/deploy.yml         # GitHub Pages 自动部署
```

## 核心约定（务必遵守）

### `.project.json` 是每个项目的元信息中心

CI 据此选择构建方式，索引页据此展示卡片。新增/更新项目时必须生成。关键字段：

| 字段 | 说明 |
|------|------|
| `name` | 与目录名一致，作为 URL slug |
| `framework` | `mkdocs` / `vitepress` / `mdbook`，CI 据此分支构建 |
| `original_repo` / `original_url` | 原文仓库 / 在线站点 |
| `original_commit` / `original_commit_short` / `original_commit_date` | 翻译所基于的原文 commit，**增量更新时靠它比对** |
| `status` | `complete` / `partial` / `draft`，影响卡片角标 |
| `translated_at` / `last_updated_at` / `update_count` | 翻译新鲜度 |

### 框架白名单：只支持 `mkdocs` / `vitepress` / `mdbook`

遇到其他框架（Docusaurus、Docsify 等）不要现场适配，直接报错退出，要求先在 `dg-translate-tech-docs` 的 references 里加 framework 适配器。

### VitePress 项目必须改 `base`，MkDocs / mdBook 不用

VitePress 部署到子路径，`config.ts` 的 `base` 必须改为 `/dg-docs-cn/{项目名}/`，否则所有静态资源 404。MkDocs 由 CI 在子路径下托管，不需要改配置。mdBook 默认用相对路径，也无需改 `book.toml`（如需可在 `[output.html] site-url` 设置）。

### `site-index/.vitepress/projects.json` 勿手改

由 `build-projects.mjs` 扫描所有 `.project.json` 自动生成，已加入 `.gitignore`。改项目信息就改对应的 `.project.json`，然后重新构建。

### 翻译产物必须含 `.source-version.json`

`dg-translate-tech-docs` 会在产物根目录写 `.source-version.json`（原文 commit hash + date + message）。`dg-import-docs` 据此填充 `.project.json` 的 `original_commit*` 字段——这是增量更新机制的基石，不要丢。

## 常用工作流

### 新增一个翻译项目

```
/dg-translate-and-import github.com/{owner}/{repo}
```

编排 skill 会：调用 `dg-translate-tech-docs` 翻译全文 → 调用 `dg-import-docs` 搬运到 `dg-docs-cn/{项目名}/` → 配好 base URL → 生成 `.project.json` → 启动本地预览。

### 更新已存在的翻译项目

同样调用 `/dg-translate-and-import`，它会检测 `dg-docs-cn/{项目名}/.project.json` 已存在 → 进入更新模式：用 `git ls-remote` 拿远端 HEAD，跟 `original_commit` 比对，相等则报告无更新；不等则 `git diff {old}..{new} --name-only -- docs/` 列出变更文件，只翻译新增/修改部分（删除的中文版保留）。

### 本地预览

- 索引页：`cd site-index && npm install && npm run dev`
- MkDocs 项目：`cd {项目名} && mkdocs serve`
- VitePress 项目：`cd {项目名} && npm run docs:dev`
- mdBook 项目：`cd {项目名}/docs && mdbook serve`（book.toml 所在目录）

## 部署机制

push 到 `main` 触发 `.github/workflows/deploy.yml`：

1. 安装 Node 20 + Python 3.11 + `mkdocs-material` 及常用插件
2. 检测仓库内是否有 `framework=mdbook` 的项目，有才装 mdBook + 插件（`mdbook-toc` / `mdbook-tera`）
3. 构建 `site-index/`（VitePress）→ 产物复制到 `_site/` 根
4. 遍历仓库根所有含 `.project.json` 的子目录，按 `framework` 构建：
   - `mkdocs` → `mkdocs build` → 复制 `site/` 到 `_site/{项目名}/`
   - `vitepress` → `npm run docs:build` → 复制 `.vitepress/dist/` 到 `_site/{项目名}/`
   - `mdbook` → `mdbook build`（在 book.toml 所在目录）→ 复制 `book/` 到 `_site/{项目名}/`
5. 上传 `_site/` 到 GitHub Pages

**前置条件**：仓库 Settings → Pages → Source 必须设为 **GitHub Actions**（不是 gh-pages 分支）。

## Skill 分布

所有 skill 都在本仓库 `.claude/skills/`，组成完整的"翻译 → 搬运 → 索引"工作流：

| Skill | 职责 |
|-------|------|
| `dg-translate-tech-docs` | 翻译引擎：英文文档 → 中文，保留原框架（MkDocs Material / VitePress / mdBook） |
| `dg-import-docs` | 搬运：翻译产物 → `dg-docs-cn/{项目名}/`，配 base、生成 `.project.json` |
| `dg-translate-and-import` | 编排：翻译 + 搬运一条龙，含增量更新 |

历史上 `dg-translate-tech-docs` 曾放在外部 `dg-skills` 仓库，但它的产物格式（`.source-version.json`）专门为 `dg-import-docs` 设计，本质上属于本仓库工作流的一部分，于 2026-06 迁回。`dg-skills` 现在只保留真正通用的 skill（如 `dg-git-push`）。

## 当前项目

- `dataview/` —— Obsidian Dataview 中文文档（MkDocs Material，基于原文 commit `5ad0994` @ 2025-04-08，状态 `complete`）
