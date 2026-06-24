# .project.json Schema

每个翻译项目目录下必须有 `.project.json`，作为 dg-docs-cn 仓库识别项目、生成索引页卡片、CI 构建时识别框架的元信息，**以及追踪原文版本以支持增量更新**。

## 完整字段

```json
{
  "name": "dataview",
  "title": "Obsidian Dataview 中文文档",
  "description": "Obsidian Dataview 插件官方文档中文翻译",
  "original_url": "https://blacksmithgu.github.io/obsidian-dataview/",
  "original_repo": "https://github.com/blacksmithgu/obsidian-dataview",

  "original_branch": "master",
  "original_commit": "abc123def4567890abcdef1234567890abcdef12",
  "original_commit_short": "abc123d",
  "original_commit_date": "2026-06-15",

  "framework": "mkdocs",
  "source_docs_path": "docs/",
  "translated_at": "2026-06-24",
  "last_updated_at": "2026-06-24",
  "update_count": 0,
  "status": "complete"
}
```

## 字段说明

### 基础字段（项目标识）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 项目标识符，跟目录名一致，用作 URL slug（如 `dataview` → `/dataview/`） |
| `title` | string | ✅ | 索引页卡片显示的标题（中文） |
| `description` | string | ❌ | 一句话描述，显示在卡片上 |
| `original_url` | string (URL) | ❌ | 原文档在线地址 |
| `original_repo` | string (URL) | ❌ | 原文 GitHub 仓库地址 |

### 版本追踪字段（支持增量更新）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `original_branch` | string | ❌ | 翻译时基于的原仓库默认分支（如 `master` / `main`） |
| `original_commit` | string (40 字符 SHA) | ❌ | 翻译时基于的原仓库 HEAD commit 完整 hash |
| `original_commit_short` | string (7 字符) | ❌ | commit hash 的短形式，用于显示 |
| `original_commit_date` | string (date) | ❌ | commit 的日期（YYYY-MM-DD），给人看的「翻译基于何时」 |
| `translated_at` | string (date) | ✅ | **首次**翻译完成的日期 |
| `last_updated_at` | string (date) | ❌ | **最近一次**更新翻译的日期；首次翻译时与 `translated_at` 相同 |
| `update_count` | integer | ❌ | 累计更新次数；首次为 0，每次更新 +1 |

**版本字段来源**：从 `.source-version.json`（dg-translate-tech-docs 1.1+ 的产物）合并：
- `.source-version.json.branch` → `original_branch`
- `.source-version.json.commit` → `original_commit`
- `.source-version.json.commit_short` → `original_commit_short`
- `.source-version.json.commit_date` → `original_commit_date`

### 构建字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `framework` | enum | ✅ | `mkdocs` 或 `vitepress`（其他值会让 CI 跳过构建） |
| `source_docs_path` | string | ❌ | 原项目文档所在路径（如 `docs/`），仅作记录 |
| `status` | enum | ✅ | `complete` / `partial` / `draft`，影响卡片角标（✅/🚧） |

## 校验规则

- `name` 必须与项目目录名一致
- `name` 仅允许小写字母、数字、连字符（kebab-case）
- `framework` 必须是 `mkdocs` 或 `vitepress`
- `translated_at` / `last_updated_at` / `original_commit_date` 必须是有效的 YYYY-MM-DD
- `original_commit` 必须是 40 字符的 hex string（如不空）
- `update_count` 必须 ≥ 0

## CI 如何使用

`.github/workflows/deploy.yml` 遍历仓库根的所有子目录：

1. 找到含 `.project.json` 的目录
2. 读取 `framework` 字段决定构建方式：
   - `mkdocs`: `mkdocs build` → 复制 `site/` 到 `_site/{目录名}/`
   - `vitepress`: `npm run docs:build` → 复制 `.vitepress/dist/` 到 `_site/{目录名}/`
3. 其他框架值 → 跳过并警告

CI **不使用**版本字段（构建与版本无关）。

## 索引页如何使用

`site-index/.vitepress/scripts/build-projects.mjs` 遍历子目录：

1. 找到含 `.project.json` 的目录
2. 读取所有字段（含版本字段）
3. 拼装成卡片数据，输出到 `.vitepress/projects.json`
4. `index.md` 渲染卡片时：
   - 显示 `title` / `description`
   - 显示 `status` 角标
   - **可显示版本新鲜度**：「基于原文 {original_commit_date}」+「已更新 {update_count} 次」

具体字段映射见 [site-index-integration.md](site-index-integration.md)。

## 更新模式下哪些字段会变

`dg-translate-and-import` 触发更新时，`dg-import-docs` 只修改版本字段，其他保持不动：

| 字段 | 更新时变化 |
|------|----------|
| `original_commit` | ✅ 替换为新 commit |
| `original_commit_short` | ✅ 替换 |
| `original_commit_date` | ✅ 替换 |
| `original_branch` | 通常不变（除非原仓库改了默认分支） |
| `last_updated_at` | ✅ 替换为今天 |
| `update_count` | ✅ +1 |
| `translated_at` | ❌ 保持（首次翻译日期不变） |
| `name` / `title` / `description` / `original_url` / `original_repo` | ❌ 保持 |
| `framework` / `source_docs_path` / `status` | ❌ 保持 |

## 示例

### MkDocs 项目（首次翻译）

```json
{
  "name": "dataview",
  "title": "Obsidian Dataview 中文文档",
  "description": "Obsidian Dataview 插件官方文档中文翻译",
  "original_url": "https://blacksmithgu.github.io/obsidian-dataview/",
  "original_repo": "https://github.com/blacksmithgu/obsidian-dataview",
  "original_branch": "master",
  "original_commit": "abc123def4567890abcdef1234567890abcdef12",
  "original_commit_short": "abc123d",
  "original_commit_date": "2026-06-15",
  "framework": "mkdocs",
  "source_docs_path": "docs/",
  "translated_at": "2026-06-24",
  "last_updated_at": "2026-06-24",
  "update_count": 0,
  "status": "complete"
}
```

### MkDocs 项目（更新 2 次后）

```json
{
  "name": "dataview",
  "title": "Obsidian Dataview 中文文档",
  "description": "Obsidian Dataview 插件官方文档中文翻译",
  "original_url": "https://blacksmithgu.github.io/obsidian-dataview/",
  "original_repo": "https://github.com/blacksmithgu/obsidian-dataview",
  "original_branch": "master",
  "original_commit": "def4567890abcdef1234567890abcdef12345678",
  "original_commit_short": "def4567",
  "original_commit_date": "2026-08-20",
  "framework": "mkdocs",
  "source_docs_path": "docs/",
  "translated_at": "2026-06-24",
  "last_updated_at": "2026-09-15",
  "update_count": 2,
  "status": "complete"
}
```

注意：`translated_at` 是首次翻译日期（2026-06-24），`last_updated_at` 是最近更新日期（2026-09-15），`original_commit_date` 是当前基于的原文 commit 日期（2026-08-20）。
