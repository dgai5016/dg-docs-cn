# site-index 集成说明

dg-docs-cn 的索引页（`site-index/`）是一个独立的 VitePress 项目，自动从仓库根的所有 `.meta.json` 文件中读取项目列表。

## 工作流程

```
{repo-root}/
├── obsidian-dataview/.meta.json ┐
├── Templater/.meta.json ────────┤
├── {其他项目}/.meta.json ────────┤── build-projects.mjs 扫描
│                                │
│                                ▼
│                   site-index/.vitepress/projects.json
│                                │
│                                ▼
│                   site-index/index.md <script setup>
│                   import projectsData from './.vitepress/projects.json'
│                                │
│                                ▼
│                   渲染项目卡片列表
```

## 添加新项目后

新项目目录创建 `.meta.json` 后，运行：

```bash
cd site-index
npm run build:projects
```

会重新扫描所有子目录，更新 `.vitepress/projects.json`。

## build-projects.mjs 内部行为

| 步骤 | 行为 |
|------|------|
| 1. 找仓库根 | 优先 `git rev-parse --show-toplevel`；fallback 向上找含 `site-index` 的目录 |
| 2. 列出子目录 | 排除 `.` 开头的隐藏目录、`node_modules`、`site-index` 本身 |
| 3. 逐个检查 | 只处理含 `.meta.json` 的目录 |
| 4. 解析 JSON | 解析失败时打印警告并跳过该目录 |
| 5. 拼装数据 | 添加 `dirName`（目录名）、`url`（`/dg-docs-cn/{目录名}/`）字段 |
| 6. 排序 | 按 `title` 字段中文 locale 排序 |
| 7. 输出 | 写入 `.vitepress/projects.json` |

## 字段映射

`.meta.json` 字段到卡片展示的映射：

| .meta.json 字段 | 卡片展示 |
|-----------------|---------|
| `title` | 卡片主标题（`<h3>`） |
| `description` | 卡片描述文字（最多 2 行） |
| `ssg` | 左上角徽章（mkdocs 紫色，vitepress 绿色，mdbook 橙色） |
| `status` | 右上角图标（complete=✅，其他=🚧） |
| `translated_at` | 底部日期 |
| `original_commit_date` | 底部「基于原文 {date}」 |
| `update_count` | 底部「已更新 N 次」（>0 时显示） |
| `original_repo` | 底部"原文 ↗"链接 |
| （派生）`url` | 卡片点击跳转地址 |

## 本地预览

```bash
cd site-index
npm install          # 首次需要
npm run dev          # 启动 dev server
# 访问 http://127.0.0.1:5173/
```

`npm run dev` 会先自动跑 `build:projects` 再启动 VitePress dev server。

## 部署

CI（`.github/workflows/deploy.yml`）中：

1. `cd site-index && npm install && npm run build`
   - `npm run build` 会先跑 `build:projects`，再跑 `vitepress build`
2. `cp -r site-index/.vitepress/dist/* _site/`
3. 遍历每个项目，构建并复制到 `_site/{项目名}/`
4. 上传 `_site/` 到 GitHub Pages

最终用户访问：
- 索引页：`https://dgai5016.github.io/dg-docs-cn/`
- 单项目：`https://dgai5016.github.io/dg-docs-cn/{项目名}/`

## 故障排查

| 问题 | 排查 |
|------|------|
| 新项目没出现在索引页 | 跑 `cd site-index && npm run build:projects`，看输出列出的项目数 |
| 卡片显示但点击 404 | 项目目录下 SSG 配置有问题，CI 跳过了构建；看 Actions 日志 |
| 卡片描述显示「暂无描述」 | `.meta.json` 的 `description` 字段为空，补上即可 |
| SSG 徽章颜色错 / 显示 unknown | 检查 `.meta.json` 的 `ssg` 字段拼写（必须小写：`mkdocs` / `vitepress` / `mdbook`） |
