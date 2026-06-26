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
├── .claude/skills/                      # 本仓库专属 skills（dg-docs-cn-* 命名空间）
│   ├── dg-docs-cn/                      # 主入口：编排整条流水线
│   ├── dg-docs-cn-prepare/              # 决策：判断要翻什么（new/update + diff）
│   ├── dg-docs-cn-translate/            # 翻译引擎：英文文档 → 中文
│   └── dg-docs-cn-publish/              # 落地：搬运 + 配置 + 索引
└── .github/workflows/deploy.yml         # GitHub Pages 自动部署
```

## 核心约定（务必遵守）

### `.project.json` 是每个项目的元信息中心

CI 据此选择构建方式，索引页据此展示卡片。新增/更新项目时必须生成。关键字段：

| 字段 | 说明 |
|------|------|
| `name` | **严格 = 原仓库名**（目录名 / URL slug / repo 名三者一致，不接受用户覆盖） |
| `framework` | `mkdocs` / `vitepress` / `mdbook`，CI 据此分支构建 |
| `original_repo` / `original_url` | 原文仓库 / 在线站点 |
| `original_commit` / `original_commit_short` / `original_commit_date` | 翻译所基于的原文 commit，**增量更新时靠它比对** |
| `status` | `complete` / `partial` / `draft`，影响卡片角标 |
| `translated_at` / `last_updated_at` / `update_count` | 翻译新鲜度 |

### 项目目录名严格 = 原仓库名

新增项目时，目录名直接取 GitHub URL 中的 repo 名（如 `github.com/foo/bar-baz` → `dg-docs-cn/bar-baz/`）。**不接受用户自定义**——这样目录名 / URL slug / repo 名三者一致，无歧义。

### 框架白名单：只支持 `mkdocs` / `vitepress` / `mdbook`

遇到其他框架（Docusaurus、Docsify 等）不要现场适配，直接报错退出，要求先在 `dg-docs-cn-translate` 的 references 里加 framework 适配器。

### VitePress 项目必须改 `base`，MkDocs / mdBook 不用

VitePress 部署到子路径，`config.ts` 的 `base` 必须改为 `/dg-docs-cn/{项目名}/`，否则所有静态资源 404。MkDocs 由 CI 在子路径下托管，不需要改配置。mdBook 默认用相对路径，也无需改 `book.toml`（如需可在 `[output.html] site-url` 设置）。

### `site-index/.vitepress/projects.json` 勿手改

由 `build-projects.mjs` 扫描所有 `.project.json` 自动生成，已加入 `.gitignore`。改项目信息就改对应的 `.project.json`，然后重新构建。

### 翻译产物必须含 `.source-version.json`

`dg-docs-cn-translate` 会在产物根目录写 `.source-version.json`（原文 commit hash + date + message）。`dg-docs-cn-publish` 据此填充 `.project.json` 的 `original_commit*` 字段——这是增量更新机制的基石，不要丢。

## 常用工作流

### 新增一个翻译项目

```
/dg-docs-cn github.com/{owner}/{repo}
```

主入口会依次调用：
1. **`dg-docs-cn-prepare`** —— 检测模式（new）+ 框架 + upstream commit，输出 work order
2. **`dg-docs-cn-translate`** —— 按	work order 全量翻译，输出含 `.source-version.json` 的目录
3. **`dg-docs-cn-publish`** —— 搬运到 `dg-docs-cn/{repo-name}/`，配好 base URL、生成 `.project.json`、重建索引

### 更新已存在的翻译项目

同样调用 `/dg-docs-cn`，主入口会调 `dg-docs-cn-prepare` 检测 `dg-docs-cn/{slug}/.project.json` 已存在 → 进入更新模式：

- `git ls-remote` 拿远端 HEAD，跟 `original_commit` 比对
- 相等 → 报告「原文无更新」并退出
- 不等 → `git diff {old}..{new} --name-status -- docs/` 分类 A/M/D/R
- 用户选范围后只翻译新增/修改部分（删除的中文版保留，重命名的提示用户手动处理）
- `--extend-from` 把旧术语表传给 translate，保证术语连续性

### 单独调用 sub-skill

也可以跳过主入口，分别调用：

- `/dg-docs-cn-translate github.com/x/y` —— 不进流水线，直接全量翻译（standalone）
- `/dg-docs-cn-publish /path/to/translated-dir` —— 把翻译目录搬运进 dg-docs-cn

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

所有 skill 都在本仓库 `.claude/skills/`，共享 `dg-docs-cn-*` 命名空间，组成"决策 → 翻译 → 落地"三阶段流水线：

| Skill | 角色 | 职责 |
|-------|------|------|
| `dg-docs-cn` | 主入口 | 用户唯一面对的 skill。编排 prepare→translate→publish，处理异常路由和临时目录清理 |
| `dg-docs-cn-prepare` | 决策 | 检测新建/更新模式，git diff 算变更文件清单，输出 work order JSON |
| `dg-docs-cn-translate` | 翻译 | 英文 markdown → 中文，保留原框架；输出 `.source-version.json` / `.changed-files.json` |
| `dg-docs-cn-publish` | 落地 | 搬运到 `dg-docs-cn/{repo-name}/`，配 base URL、生成 `.project.json`、重建 site-index |

**流水线数据流**：prepare 输出 work order（JSON，会话内 + `/tmp/dg-prepare-{repo}/work-order.json` 双写）→ translate 和 publish 都从 work order 读参数。会话压缩时 sub-skill 可从文件读 fallback。

**历史**：这套 skill 前身是 3 个（`dg-translate-tech-docs` / `dg-import-docs` / `dg-translate-and-import`），后者把"决策"和"编排"混在一起，名字也掩盖了核心价值。2026-06 重构为现 4-skill 架构，职责切分更清晰。`dg-docs-cn-translate` 的产物格式（`.source-version.json`）专门为本流水线设计，本质属于本仓库工作流（曾放在外部 `dg-skills` 仓库，已迁回）。`dg-skills` 现在只保留真正通用的 skill（如 `dg-git-push`）。

## 当前项目

- `obsidian-dataview/` —— Obsidian Dataview 中文文档（MkDocs Material，基于原文 commit `5ad0994` @ 2025-04-08，状态 `complete`）
- `Templater/` —— Obsidian Templater 插件中文文档（mdBook，基于原文 commit `4293151` @ 2026-06-22，状态 `complete`）
