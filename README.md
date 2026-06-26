# dg-docs-cn

英文技术文档中文翻译合集。把英文技术文档（MkDocs Material / VitePress / mdBook 构建）翻译为中文版本，集中托管在 GitHub Pages，统一提供导航入口。

## 目录结构

```
dg-docs-cn/
├── site-index/                       # 根索引页（VitePress），列出所有翻译项目
├── {项目名}/                         # 每个翻译项目一个目录，沿用原 SSG
│   ├── mkdocs.yml / .vitepress/ / book.toml    # 原 SSG 配置
│   ├── docs/ 或 src/                 # 中文 markdown
│   └── .meta.json                    # 项目元信息
├── .claude/skills/                   # 翻译流水线 skills（dg-docs-cn-* 命名空间）
└── .github/workflows/deploy.yml      # 自动构建部署
```

## 访问

- 索引页：https://dgai5016.github.io/dg-docs-cn/
- 单项目：https://dgai5016.github.io/dg-docs-cn/{项目名}/

## 添加新翻译项目

仓库内的 `.claude/skills/dg-docs-cn` 是用户唯一入口，编排整条流水线：

```
在 Claude Code 中：
/dg-docs-cn github.com/{owner}/{repo}
```

它会依次调用：
1. `dg-docs-cn-prepare` —— 判断要翻什么（新建/更新、文件清单）
2. `dg-docs-cn-translate` —— 翻译英文文档为中文
3. `dg-docs-cn-publish` —— 搬运到本仓库子目录、配置 base URL、生成 `.meta.json`、纳入索引页

项目目录名严格 = 原仓库名（URL 决定，不接受自定义）。

## Skill 分布

所有 skill 都在本仓库 `.claude/skills/`，共享 `dg-docs-cn-*` 命名空间，组成"决策 → 翻译 → 落地"流水线：

| Skill | 角色 | 职责 |
|-------|------|------|
| `dg-docs-cn` | 主入口 | 编排 prepare→translate→publish，处理异常和清理 |
| `dg-docs-cn-prepare` | 决策 | 判断新建/更新模式，git diff 算变更文件清单 |
| `dg-docs-cn-translate` | 翻译 | 英文 → 中文，保留原 SSG |
| `dg-docs-cn-publish` | 落地 | 搬运 + 配置 + 索引 |

## 部署机制

push 到 `main` 分支后，`.github/workflows/deploy.yml` 自动：

1. 构建 `site-index/`（VitePress）→ 产物到主输出根
2. 遍历每个含 `.meta.json` 的项目目录，按 `ssg` 字段构建：
   - `mkdocs`: `mkdocs build` → 复制 `site/` 到主输出 `{项目名}/`
   - `vitepress`: `npm run docs:build` → 复制 `.vitepress/dist/` 到主输出 `{项目名}/`
   - `mdbook`: `mdbook build` → 复制 `book/` 到主输出 `{项目名}/`
3. 上传产物到 GitHub Pages

GitHub Pages 部署源需配置为 **GitHub Actions**（仓库 Settings → Pages → Source）。

## License

每个翻译项目的版权归原项目所有，本仓库仅提供中文翻译。整体仓库结构采用 MIT。
