# .meta.json Schema

每个翻译项目目录下必须有 `.meta.json`，作为 dg-docs-cn 仓库识别项目、生成索引页卡片、CI 构建时识别 SSG 的元信息，**以及追踪原文版本以支持增量更新**。

## 完整字段

```json
{
  "name": "obsidian-dataview",
  "title": "Obsidian Dataview 中文文档",
  "description": "Obsidian Dataview 插件官方文档中文翻译",
  "ssg": "mkdocs",
  "status": "complete",
  "original_repo": "https://github.com/blacksmithgu/obsidian-dataview",
  "original_commit": "abc123def4567890abcdef1234567890abcdef12",
  "original_commit_short": "abc123d",
  "original_commit_date": "2026-06-15",
  "translated_at": "2026-06-24",
  "update_count": 0
}
```

## 字段说明

### 基础字段（项目标识）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 项目标识符，跟目录名一致，用作 URL slug（如 `obsidian-dataview` → `/obsidian-dataview/`） |
| `title` | string | ✅ | 索引页卡片显示的标题（中文） |
| `description` | string | ❌ | 一句话描述，显示在卡片上 |
| `original_repo` | string (URL) | ❌ | 原文 GitHub 仓库地址（同时作为索引页"原文 ↗"链接） |

### 版本追踪字段（支持增量更新）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `original_commit` | string (40 字符 SHA) | ❌ | 翻译时基于的原仓库 HEAD commit 完整 hash |
| `original_commit_short` | string (7 字符) | ❌ | commit hash 的短形式，卡片 tooltip 显示 |
| `original_commit_date` | string (date) | ❌ | commit 的日期（YYYY-MM-DD），卡片上「基于原文 {date}」|
| `translated_at` | string (date) | ✅ | **首次**翻译完成的日期，卡片上「📅 {date}」|
| `update_count` | integer | ❌ | 累计更新次数；首次为 0，每次更新 +1 |

**版本字段来源**：从 work order（`dg-docs-cn-prepare` 输出）合并：
- `work_order.new_commit` → `original_commit`
- `work_order.new_commit_short` → `original_commit_short`
- `work_order.new_commit_date` → `original_commit_date`（真实 upstream commit 日期）
- （publish 自己取日期）→ `translated_at`
- （用户输入或从 `original_repo` 推断）→ `original_repo`

### 构建字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `ssg` | enum | ✅ | `mkdocs` / `vitepress` / `mdbook`（其他值会让 CI 跳过构建）|
| `status` | enum | ✅ | `complete` / `partial` / `draft`，影响卡片角标（✅/🚧）|

## 校验规则

- `name` 必须与项目目录名一致，且**严格等于原仓库名**（不接受用户自定义，由 URL 推导）
- `name` 仅允许小写字母、数字、连字符（kebab-case）；大小写敏感（如 `Templater`）
- `ssg` 必须是 `mkdocs` / `vitepress` / `mdbook`
- `translated_at` / `original_commit_date` 必须是有效的 YYYY-MM-DD
- `original_commit` 必须是 40 字符的 hex string（如不空）
- `update_count` 必须 ≥ 0

## CI 如何使用

`.github/workflows/deploy.yml` 遍历仓库根的所有子目录：

1. 找到含 `.meta.json` 的目录
2. 读取 `ssg` 字段决定构建方式：
   - `mkdocs`: `mkdocs build` → 复制 `site/` 到 `_site/{目录名}/`
   - `vitepress`: `npm run docs:build` → 复制 `.vitepress/dist/` 到 `_site/{目录名}/`
   - `mdbook`: `mdbook build`（在 book.toml 所在目录）→ 复制 `book/` 到 `_site/{目录名}/`
3. 其他 SSG 值 → 跳过并警告

CI **不使用**版本字段（构建与版本无关）。

## 索引页如何使用

`site-index/.vitepress/scripts/build-projects.mjs` 遍历子目录：

1. 找到含 `.meta.json` 的目录
2. 读取所有字段（含版本字段）
3. 拼装成卡片数据，输出到 `.vitepress/projects.json`
4. `index.md` 渲染卡片时：
   - 显示 `title` / `description`
   - 显示 `status` 角标（✅/🚧）
   - 显示 `ssg` 徽章（不同颜色区分 mkdocs/vitepress/mdbook）
   - 显示版本新鲜度：「基于原文 {original_commit_date}」+「已更新 {update_count} 次」+「📅 {translated_at}」

具体字段映射见 [site-index-integration.md](site-index-integration.md)。

## 更新模式下哪些字段会变

`dg-docs-cn`（主入口）触发更新时，`dg-docs-cn-publish` 只修改版本字段，其他保持不动：

| 字段 | 更新时变化 |
|------|----------|
| `original_commit` | ✅ 替换为新 commit |
| `original_commit_short` | ✅ 替换 |
| `original_commit_date` | ✅ 替换（取自 work order 的真实 upstream commit 日期）|
| `update_count` | ✅ +1（值 = `work_order.update_count_before + 1`）|
| `name` / `title` / `description` / `original_repo` / `ssg` / `translated_at` / `status` | ❌ 保持 |

## 示例

### MkDocs 项目（首次翻译）

```json
{
  "name": "obsidian-dataview",
  "title": "Obsidian Dataview 中文文档",
  "description": "Obsidian Dataview 插件官方文档中文翻译",
  "ssg": "mkdocs",
  "status": "complete",
  "original_repo": "https://github.com/blacksmithgu/obsidian-dataview",
  "original_commit": "abc123def4567890abcdef1234567890abcdef12",
  "original_commit_short": "abc123d",
  "original_commit_date": "2026-06-15",
  "translated_at": "2026-06-24",
  "update_count": 0
}
```

### MkDocs 项目（更新 2 次后）

```json
{
  "name": "obsidian-dataview",
  "title": "Obsidian Dataview 中文文档",
  "description": "Obsidian Dataview 插件官方文档中文翻译",
  "ssg": "mkdocs",
  "status": "complete",
  "original_repo": "https://github.com/blacksmithgu/obsidian-dataview",
  "original_commit": "def4567890abcdef1234567890abcdef12345678",
  "original_commit_short": "def4567",
  "original_commit_date": "2026-08-20",
  "translated_at": "2026-06-24",
  "update_count": 2
}
```

注意：`translated_at` 是首次翻译日期（2026-06-24，之后不变），`original_commit_date` 是当前基于的原文 commit 日期（2026-08-20，每次更新跟着 upstream HEAD 变），`update_count` 是累计更新次数（每次 +1）。

## 已弃用字段（历史记录）

以下字段曾在 `.project.json` schema 中存在，于 2026-06 的元信息合并重构中删除：

| 字段 | 删除原因 |
|------|---------|
| `original_url` | 原文在线站点 URL；卡片只展示 `original_repo` 做"原文 ↗"链接，从未渲染此字段 |
| `original_branch` | 原仓库默认分支名；pipeline 用 `git clone`（默认分支）+ `git ls-remote HEAD`，从不显式读此字段 |
| `source_docs_path` | 原项目文档所在路径；SSG 检测靠文件签名（`detect-ssg.sh`），不读此字段 |
| `last_updated_at` | 最近一次更新日期；卡片只渲染 `translated_at`，此字段仅在 projects.json 里躺着 |

同时，旧 schema 把版本字段分散在两个文件里：`.project.json`（dg-docs-cn 视角）+ `.source-version.json`（translate 的产物）。重构后 `.source-version.json` 被废除，版本信息通过 work order 从 prepare 流到 publish，最终统一写入 `.meta.json`。
