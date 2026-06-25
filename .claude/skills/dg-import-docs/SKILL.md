---
name: dg-import-docs
description: Imports an already-translated Chinese documentation project into the dg-docs-cn repository. Takes a translated project directory (output of dg-translate-tech-docs) and places it under dg-docs-cn/{name}/, adjusts deployment config (VitePress base URL, etc.), creates .project.json (with original commit info from .source-version.json), and registers it in the site-index. Supports both 新建模式 (first-time import) and 更新模式 (incremental update). Use when user says "搬运到 dg-docs-cn", "导入到 dg-docs-cn", "更新 dataview 翻译", or invokes /dg-import-docs with a local project path. This skill is dg-docs-cn specific — not portable to other destination repos.
version: 1.1.0
---

# Import Docs into dg-docs-cn

把已经翻译好的中文文档项目搬运到 `dg-docs-cn` 仓库，配置好部署相关参数，纳入索引页。**支持首次搬运和增量更新两种模式。**

**前置条件**：被搬运的目录必须是 `dg-translate-tech-docs` 的产物（含框架配置 + `.source-version.json`）。

**职责边界**：
- ✅ 复制项目（或变更文件）到 `dg-docs-cn/{name}/`
- ✅ 修改 VitePress 的 `base` 字段
- ✅ 检查 MkDocs 的 `site_url` 是否需要清理
- ✅ 创建/更新 `.project.json`，合并 `.source-version.json` 的版本字段
- ✅ 触发索引页重建
- ✅ **更新模式**：根据 `.changed-files.json` 只复制变更文件，避免覆盖未翻译的英文原文
- ❌ **不做翻译**——翻译由 `dg-translate-tech-docs` 完成
- ❌ **不自动 push**——让用户验证后手动 push

## User Input Tools

When this skill prompts the user, follow this tool-selection rule (priority order):

1. **Prefer built-in user-input tools** exposed by the current agent runtime — e.g., `AskUserQuestion`, `request_user_input`, `clarify`, `ask_user`, or any equivalent.
2. **Fallback**: if no such tool exists, emit a numbered plain-text message and ask the user to reply with the chosen number/answer for each question.
3. **Batching**: if the tool supports multiple questions per call, combine all applicable questions into a single call; if only single-question, ask them one at a time in priority order.

## Workflow

### Step 1: Locate dg-docs-cn Repo Root

```bash
# 优先用 git
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)

# fallback：从当前目录向上找含 .claude/skills/dg-import-docs 的目录
[ -z "$REPO_ROOT" ] && REPO_ROOT=$(cd "$(dirname "$0")/../../../.." && pwd)
```

本 skill 应该被从 dg-docs-cn 仓库内触发，正常情况下 cwd 就是仓库根。

### Step 2: Verify Source Project & Detect Mode

检查用户提供的源目录（参数）：

| 检查项 | 含义 |
|--------|------|
| 含 `mkdocs.yml` / `.vitepress/config.{ts,js}` / `book.toml` | 是有效的翻译产物 |
| 含 `.source-version.json` | dg-translate-tech-docs 1.1+ 产物，含原文 commit 等版本信息 |
| 含 `.changed-files.json` | 增量翻译产物，列出本次变更的文件清单 |

**如果都不是有效框架** → 报错退出：「源目录不是有效的翻译产物，缺少 mkdocs.yml / .vitepress/config.{ts,js} / book.toml」

**如果缺少 `.source-version.json`** → 警告：「未检测到版本信息，.project.json 的版本字段将为空。建议用 dg-translate-tech-docs 1.1+ 重新生成。」继续执行（版本字段留空）。

### Step 3: Collect Parameters

**自动判别模式：**

```bash
TARGET_DIR="$REPO_ROOT/{项目目录名}"
PROJECT_JSON="$TARGET_DIR/.project.json"

if [ -f "$PROJECT_JSON" ]; then
  MODE="update"    # 更新模式
else
  MODE="new"       # 新建模式
fi
```

通过用户输入工具问以下问题（新建模式问全部；更新模式大部分从现有 .project.json 继承）：

| 问题 | 新建模式默认 | 更新模式默认 |
|------|------------|------------|
| 项目目录名 | 源目录 basename | **从现有 .project.json 读 name**，不允许改 |
| 项目标题 | 从源项目配置读取 | 从现有 .project.json 读 |
| 项目描述 | 空 | 从现有 .project.json 读 |
| 原文 URL | 空 | 从现有 .project.json 读 |
| 原文仓库 URL | 空 | 从现有 .project.json 读 |

如果用户提供了 `original_repo` URL，可以从中推断 owner/repo。

### Step 4: 新建模式 → 复制整个项目

```bash
TARGET_DIR="$REPO_ROOT/{项目目录名}"

# 新建模式：复制整个源目录
cp -r "{源目录}/." "$TARGET_DIR/"

# 清理 git 元数据
rm -rf "$TARGET_DIR/.git"

# .changed-files.json 如果存在，新建模式下无意义，删除
rm -f "$TARGET_DIR/.changed-files.json"
```

跳到 **Step 5**。

### Step 4 (Update): 更新模式 → 只复制变更文件

更新模式下，源目录是 dg-translate-tech-docs 增量模式的输出：
- 变更文件：新的中文翻译
- 未变更文件：英文原文（不能覆盖中文版！）
- `.source-version.json`：新版本信息
- `.changed-files.json`：本次变更的文件清单

```bash
# 读取变更清单
CHANGED_FILES=$(cat "{源目录}/.changed-files.json" | jq -r '.files[]')

# 只复制清单中的文件
for rel_path in $CHANGED_FILES; do
  mkdir -p "$TARGET_DIR/$(dirname "$rel_path")"
  cp "{源目录}/$rel_path" "$TARGET_DIR/$rel_path"
done

# 复制 .source-version.json（新版本）
cp "{源目录}/.source-version.json" "$TARGET_DIR/.source-version.json"

# 不复制 .changed-files.json（中间产物，搬运完成无意义）
```

**如果 `.changed-files.json` 不存在**：警告用户「未检测到变更清单，将全量复制（可能覆盖未翻译文件）。建议用 dg-translate-tech-docs 增量模式重新生成」。询问用户确认后，走新建模式的 cp -r 逻辑。

跳到 **Step 5**。

### Step 5: Adjust Deployment Config

按框架修改部署相关配置。

#### MkDocs

```bash
# 通常无需改 base，但清理 site_url、edit_uri（避免指向原项目部署）
# 编辑 $TARGET_DIR/mkdocs.yml：
#   - 删除 site_url 或改为 dg-docs-cn 的对应地址
#   - 删除 edit_uri（如果用户不想保留"编辑此页"链接）
```

详见框架适配器指引（`dg-translate-tech-docs` 的 references）。

**更新模式下**：base 配置通常无需再改（首次搬运时已配过）；只检查 mkdocs.yml 的 `nav` 是否需要重新翻译（如果变更文件包含 mkdocs.yml 本身）。

#### VitePress

**新建模式必须改 base**：

```typescript
// 编辑 $TARGET_DIR/.vitepress/config.{ts,js}
base: '/dg-docs-cn/{项目目录名}/'
```

**更新模式下**：base 已在首次搬运时配置好，无需改。

#### mdBook

mdBook 默认用相对路径构建，**通常无需改 `book.toml`**。

**新建模式可选优化**（让 GitHub Pages 子路径更稳）：

```toml
# 编辑 $TARGET_DIR/book.toml（或 $TARGET_DIR/docs/book.toml，看 detect 结果）
[output.html]
site-url = "/dg-docs-cn/{项目目录名}/"
```

**更新模式下**：site-url 已在首次搬运时配置好，无需改。

**注意**：mdBook 默认 `[book] language = "en"`。搬运到中文站后，建议改为 `language = "zh-cn"`（影响 HTML lang 属性、mdbook-toc 等本地化行为）：

```toml
[book]
language = "zh-cn"
```

### Step 6: Create or Update .project.json

#### 新建模式：创建

读 `{源目录}/.source-version.json`（如果存在），合并到 `.project.json`：

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

字段说明详见 [references/project-json-schema.md](references/project-json-schema.md)。

**版本字段来源**：从 `.source-version.json` 映射：
- `.source-version.json` → `.project.json`
- `branch` → `original_branch`
- `commit` → `original_commit`
- `commit_short` → `original_commit_short`
- `commit_date` → `original_commit_date`
- `captured_at` → `translated_at`（取日期部分）

#### 更新模式：增量更新字段

只更新版本相关字段，其他字段（title/description 等）保持不动：

```json
{
  "original_branch": "{新 source-version 的 branch}",
  "original_commit": "{新 source-version 的 commit}",
  "original_commit_short": "{新 source-version 的 commit_short}",
  "original_commit_date": "{新 source-version 的 commit_date}",
  "last_updated_at": "{今天日期}",
  "update_count": "{原值 + 1}"
}
```

`name` / `title` / `description` / `original_url` / `original_repo` / `framework` / `translated_at` / `status` 保持不动。

### Step 7: Rebuild site-index Project List

```bash
cd "$REPO_ROOT/site-index"
npm install        # 首次运行需要
npm run build:projects   # 重新生成 .vitepress/projects.json
```

详见 [references/site-index-integration.md](references/site-index-integration.md)。

### Step 8: Local Verify

启动本地预览验证：

**单独验证项目本身：**

```bash
cd "$TARGET_DIR"
# MkDocs:
mkdocs serve    # http://127.0.0.1:8000

# VitePress:
npm install && npm run docs:dev    # http://127.0.0.1:5173

# mdBook（在 book.toml 所在目录，可能是 $TARGET_DIR/ 或 $TARGET_DIR/docs/）:
mdbook serve    # http://127.0.0.1:3000
```

**验证索引页能看到项目：**

```bash
cd "$REPO_ROOT/site-index"
npm run dev     # http://127.0.0.1:5173/
```

### Step 9: Report

#### 新建模式报告

```
✅ 已搬运到 dg-docs-cn（新建模式）

项目: {项目名}
位置: {TARGET_DIR}
框架: {framework}
原文: {original_url}
原文仓库: {original_repo}
基于原文版本: {commit_short} ({commit_date})

本地预览（单项目）:
  cd {TARGET_DIR} && {启动命令}
  访问: {本地URL}

部署后的 URL（push 后）:
  https://dgai5016.github.io/dg-docs-cn/{项目名}/

下一步：
  cd {REPO_ROOT}
  git add .
  git commit -m "feat: 添加 {项目名} 中文文档"
  git push
```

#### 更新模式报告

```
✅ 已更新 dg-docs-cn/{项目名}（更新模式）

本次更新:
  原文版本: {old_short} ({old_date}) → {new_short} ({new_date})
  变更文件数: {N}
    - 新增: {X}
    - 修改: {Y}
    - 删除: {Z}（保留中文版未删）
  重新翻译: {M} 个文件
  失败: {失败清单或"无"}
  累计更新次数: {update_count}

本地预览（验证变更效果）:
  cd {TARGET_DIR} && {启动命令}
  访问: {本地URL}

下一步：
  cd {REPO_ROOT}
  git add .
  git commit -m "chore: 更新 {项目名} 翻译至 {new_short}"
  git push
```

**主动询问**：「要不要现在启动预览，确认变更效果？」

- 同意 → 后台启动服务，用 WebFetch 验证返回 200，告诉用户 URL
- 拒绝 → 仅打印启动命令

## 失败处理

| 失败场景 | 应对 |
|---------|------|
| 源目录无效（无框架配置） | 报错退出，提示先用 `dg-translate-tech-docs` 翻译 |
| 目标目录已存在 + 新建模式 | 询问：切换到更新模式 / 改名 / 取消 |
| `.changed-files.json` 缺失 + 更新模式 | 警告 + 询问：全量复制（风险：覆盖未翻译文件）/ 取消 |
| `.source-version.json` 缺失 | 警告，版本字段留空继续；建议重新生成 |
| VitePress base 修改失败 | 跳过，警告用户手动确认 |
| `npm install` 失败（网络问题） | 跳过，提示重试或换镜像源 |
| 更新模式下原 commit 与新 commit 相同 | 警告「源版本未变，可能不需要更新」，仍允许继续（用户可能想强制重翻） |
