# dg-docs-cn

英文技术文档中文翻译合集。把英文技术文档（MkDocs Material / VitePress 构建）翻译为中文版本，集中托管在 GitHub Pages，统一提供导航入口。

## 目录结构

```
dg-docs-cn/
├── site-index/                       # 根索引页（VitePress），列出所有翻译项目
├── {项目名}/                         # 每个翻译项目一个目录，沿用原框架
│   ├── mkdocs.yml 或 .vitepress/    # 原框架配置
│   ├── docs/                         # 中文 markdown
│   └── .project.json                 # 项目元信息
├── .claude/skills/                   # 用户专属 skills（搬运 + 编排）
└── .github/workflows/deploy.yml      # 自动构建部署
```

## 访问

- 索引页：https://dgai5016.github.io/dg-docs-cn/
- 单项目：https://dgai5016.github.io/dg-docs-cn/{项目名}/

## 添加新翻译项目

仓库内的 `.claude/skills/dg-translate-and-import` 是一条龙编排 skill：

```
在 Claude Code 中：
/dg-translate-and-import github.com/{owner}/{repo}
```

它会调用 `dg-translate-tech-docs`（来自 dg-skills marketplace）翻译文档，
然后调用 `dg-import-docs`（本仓库内）把翻译产物搬运到本仓库的子目录、
配置好 base URL、生成 `.project.json`、纳入索引页。

## Skill 分布

| Skill | 位置 | 通用性 |
|-------|------|--------|
| `dg-translate-tech-docs` | 外部仓库 `dg-skills` | ✅ 通用，可发布 |
| `dg-import-docs` | `.claude/skills/` | ❌ 本仓库专属 |
| `dg-translate-and-import` | `.claude/skills/` | ❌ 本仓库专属 |

## 部署机制

push 到 `main` 分支后，`.github/workflows/deploy.yml` 自动：

1. 构建 `site-index/`（VitePress）→ 产物到主输出根
2. 遍历每个含 `.project.json` 的项目目录，按 `framework` 字段构建：
   - `mkdocs`: `mkdocs build` → 复制 `site/` 到主输出 `{项目名}/`
   - `vitepress`: `npm run docs:build` → 复制 `.vitepress/dist/` 到主输出 `{项目名}/`
3. 上传产物到 GitHub Pages

GitHub Pages 部署源需配置为 **GitHub Actions**（仓库 Settings → Pages → Source）。

## License

每个翻译项目的版权归原项目所有，本仓库仅提供中文翻译。整体仓库结构采用 MIT。
