---
name: dg-docs-cn-prepare
description: Decides what to translate for the dg-docs-cn pipeline. Detects new vs update mode, runs git diff against upstream, classifies file changes (Added/Modified/Deleted/Renamed), and produces a work order JSON consumed by dg-docs-cn-translate and dg-docs-cn-publish. No side effects on the dg-docs-cn tree. Bound to dg-docs-cn repo layout.
version: 1.0.0
metadata:
  openclaw:
    requires:
      anyBins:
        - git
        - jq
---

# Prepare: 判断要翻什么

dg-docs-cn 流水线的第一阶段，被 `dg-docs-cn` 主入口调用。

**纯决策角色**：只读 dg-docs-cn 现状 + 查询 upstream，**不修改** dg-docs-cn 树、不翻译、不复制文件。输出一份 work order（JSON），交给主入口接力传给 translate 和 publish。

| 项目 | 说明 |
|------|------|
| 读 | `dg-docs-cn/{slug}/.project.json`（若存在）|
| 写 | 仅 `/tmp/dg-prepare-{repo}/` 临时目录（含 work-order.json 备份）|
| 不写 | dg-docs-cn 仓库树（任何文件都不动）|

## User Input Tools

When this skill prompts the user, follow this tool-selection rule (priority order):

1. **Prefer built-in user-input tools** exposed by the current agent runtime — e.g., `AskUserQuestion`, `request_user_input`, `clarify`, `ask_user`, or any equivalent.
2. **Fallback**: if no such tool exists, emit a numbered plain-text message and ask the user to reply with the chosen number/answer for each question.
3. **Batching**: if the tool supports multiple questions per call, combine all applicable questions into a single call; if only single-question, ask them one at a time in priority order.

## Script Directory

Scripts in `scripts/` subdirectory. `{baseDir}` = this SKILL.md's directory path.

| Script | Purpose |
|--------|---------|
| `scripts/detect-framework.sh` | Detect docs framework: prints `mkdocs` / `vitepress` / `mdbook` / `unknown` |

Usage:
```bash
bash {baseDir}/scripts/detect-framework.sh <docs-path>
```

## Workflow

### Step 1: Parse Inputs

从主入口或用户消息解析：
- **必需**：GitHub 仓库 URL（`github.com/{owner}/{repo}` 或 `https://github.com/{owner}/{repo}.git`）
- **可选**：mode hint、translation_mode、clone_scope（主入口可能给）

**`project_slug` 推导（严格规则）**：

```bash
# 从 URL 提取 repo 名作为 slug，不接受用户覆盖
SLUG=$(echo "$GITHUB_URL" | sed -E 's|.*github\.com[/:][^/]+/([^/]+?)(\.git)?/?$|\1|')
```

例：
- `github.com/foo/bar-baz` → slug = `bar-baz`
- `https://github.com/blacksmithgu/obsidian-dataview.git` → slug = `obsidian-dataview`

### Step 2: Detect Mode

```bash
REPO_ROOT=$(git rev-parse --show-toplevel)
PROJECT_JSON="$REPO_ROOT/$SLUG/.project.json"

if [ -f "$PROJECT_JSON" ]; then
  MODE="update"
else
  MODE="new"
fi
```

进入对应分支：[新建模式](#step-3-新建模式) 或 [更新模式](#step-4-更新模式)。

### Step 3: 新建模式

新建模式下**不完整 clone**（节省带宽，translate 阶段会 clone）。只做轻量探测：

```bash
TEMP_PROBE="/tmp/dg-prepare-$SLUG/"
mkdir -p "$TEMP_PROBE"

# 1. 拿 upstream HEAD（不 clone）
NEW_COMMIT=$(git ls-remote "https://github.com/{owner}/{repo}.git" HEAD | awk '{print $1}')
NEW_COMMIT_SHORT=${NEW_COMMIT:0:7}

# 2. 浅克隆（仅框架配置文件）
git clone --depth 1 "https://github.com/{owner}/{repo}.git" "$TEMP_PROBE"

# 3. 检测框架
FRAMEWORK=$(bash {baseDir}/scripts/detect-framework.sh "$TEMP_PROBE")

if [ "$FRAMEWORK" = "unknown" ]; then
  echo "⚠️ 不支持的框架。本流水线仅支持 mkdocs / vitepress / mdbook。" >&2
  exit 1
fi

# 4. 列出所有 md 文件作为 file_list
file_list="all"   # 让 translate 自己 find，避免 prepare 重复列
```

**slug 冲突检查**：若 `$REPO_ROOT/$SLUG/` 已存在但**无** `.project.json` → abort：

```
⚠️ 目录 dg-docs-cn/$SLUG/ 已存在但无 .project.json。
可能是手动建的非翻译项目，或者 .project.json 被误删。
请先清理（删除目录或恢复 .project.json）后重跑。
```

跳到 [Step 5](#step-5-输出-work-order)。

### Step 4: 更新模式

#### 4.1 读现状

```bash
OLD_COMMIT=$(jq -r .original_commit "$PROJECT_JSON")
OLD_COMMIT_SHORT=$(jq -r .original_commit_short "$PROJECT_JSON")
OLD_COMMIT_DATE=$(jq -r .original_commit_date "$PROJECT_JSON")
ORIGINAL_BRANCH=$(jq -r .original_branch "$PROJECT_JSON")
ORIGINAL_REPO=$(jq -r .original_repo "$PROJECT_JSON")
FRAMEWORK=$(jq -r .framework "$PROJECT_JSON")
UPDATE_COUNT=$(jq -r .update_count "$PROJECT_JSON")
```

**异常**：`original_commit` 字段为空（旧项目未记录版本）→ 输出 work order 标 `mode: "legacy"`，让主入口询问用户「重翻译（覆盖）/ 手动补版本 / 取消」。

#### 4.2 查 upstream HEAD

```bash
NEW_COMMIT=$(git ls-remote "$ORIGINAL_REPO" HEAD | awk '{print $1}')
NEW_COMMIT_SHORT=${NEW_COMMIT:0:7}
```

**异常处理**：
- 404（仓库不存在 / URL 错）→ 输出 `mode: "error", reason: "repo_not_found"`
- 超时（网络）→ 输出 `mode: "error", reason: "network"`

#### 4.3 短路：无更新

```bash
if [ "$OLD_COMMIT" = "$NEW_COMMIT" ]; then
  # 输出 noop work order
  WORK_ORDER='{"mode":"noop","project_slug":"'$SLUG'","old_commit_short":"'$OLD_COMMIT_SHORT'","old_commit_date":"'$OLD_COMMIT_DATE'","message":"原文无更新"}'
  echo "$WORK_ORDER" > "$TEMP_PROBE/work-order.json"
  echo "$WORK_ORDER"   # 同时打印到会话
  exit 0
fi
```

#### 4.4 Clone & Diff

```bash
TEMP_DIR="/tmp/dg-prepare-$SLUG/"
git clone "$ORIGINAL_REPO" "$TEMP_DIR"   # 完整 clone（需要历史做 diff）
cd "$TEMP_DIR"

DIFF_OUTPUT=$(git diff --name-status $OLD_COMMIT..$NEW_COMMIT -- docs/)

ADDED=$(echo "$DIFF_OUTPUT" | grep "^A" | awk '{print $2}')
MODIFIED=$(echo "$DIFF_OUTPUT" | grep "^M" | awk '{print $2}')
DELETED=$(echo "$DIFF_OUTPUT" | grep "^D" | awk '{print $2}')
RENAMED=$(echo "$DIFF_OUTPUT" | grep "^R" | awk '{print $2"\t"$3}')
```

**异常**：`git diff` 报 `bad object` → 原 commit 被 force-push 删除，输出 `mode: "bad_object"`，让主入口询问用户「全量重翻 / 取消」。

#### 4.5 算变化率

```bash
TOTAL_MD=$(find docs/ -name "*.md" -type f | wc -l | tr -d ' ')
CHANGED_COUNT=$(echo -e "$ADDED\n$MODIFIED" | grep -c . || true)
LARGE_CHURN=0
if [ "$TOTAL_MD" -gt 0 ] && [ "$CHANGED_COUNT" -gt 0 ]; then
  LARGE_CHURN=$(awk "BEGIN {print ($CHANGED_COUNT / $TOTAL_MD > 0.5) ? 1 : 0}")
fi
```

`LARGE_CHURN=1` 时 work order 标 `large_churn: true`，主入口会警告并询问是否切新建模式。

#### 4.6 询问用户范围

```
🔄 检测到原文更新

项目: $SLUG
原文版本: $OLD_COMMIT_SHORT ($OLD_COMMIT_DATE) → $NEW_COMMIT_SHORT (今天)
累计已更新次数: $UPDATE_COUNT

涉及 docs/ 下文件变更:
  - 新增: $(echo "$ADDED" | grep -c . || echo 0) 个
  - 修改: $(echo "$MODIFIED" | grep -c . || echo 0) 个
  - 删除: $(echo "$DELETED" | grep -c . || echo 0) 个（保留中文版不删）
  - 重命名: $(echo "$RENAMED" | grep -c . || echo 0) 个

具体清单:
  [新增]
  $ADDED
  [修改]
  $MODIFIED
  [删除（保留）]
  $DELETED
  [重命名（手动处理）]
  $RENAMED

如何处理？
  [1] 全部翻译新增+修改（推荐）
  [2] 选择性翻译（手动选择文件）
  [3] 取消
```

#### 4.7 构建 file_list

- 用户选 1（全部）→ `file_list = ADDED + MODIFIED`
- 用户选 2（选择性）→ 用 AskUserQuestion 让用户在 ADDED+MODIFIED 中勾选子集
- 用户选 3 → 退出，清理 `/tmp/dg-prepare-$SLUG/`
- RENAMED → 单独存 `renamed_files`，**不加入 file_list**（路径映射有歧义，由用户手动处理）

跳到 [Step 5](#step-5-输出-work-order)。

### Step 5: 输出 Work Order

```bash
WORK_ORDER_FILE="/tmp/dg-prepare-$SLUG/work-order.json"

# 用 jq 安全构建（避免 shell 转义陷阱）
jq -n \
  --arg mode "$MODE" \
  --arg github_url "$GITHUB_URL" \
  --arg project_slug "$SLUG" \
  --arg framework "$FRAMEWORK" \
  --arg old_commit "$OLD_COMMIT" \
  --arg old_commit_short "$OLD_COMMIT_SHORT" \
  --arg old_commit_date "$OLD_COMMIT_DATE" \
  --arg new_commit "$NEW_COMMIT" \
  --arg new_commit_short "$NEW_COMMIT_SHORT" \
  --arg new_commit_date "$(date +%Y-%m-%d)" \
  --argjson file_list "$(echo "$file_list" | jq -R . | jq -s .)" \
  --argjson deleted_files "$(echo "$DELETED" | jq -R . | jq -s .)" \
  --argjson renamed_files "$(echo "$RENAMED" | jq -R . | jq -s .)" \
  --argjson update_count_before "$UPDATE_COUNT" \
  --argjson large_churn "$LARGE_CHURN" \
  --arg translation_mode "$TRANSLATION_MODE" \
  --arg clone_scope "$CLONE_SCOPE" \
  '{
    mode: $mode,
    github_url: $github_url,
    project_slug: $project_slug,
    framework: $framework,
    old_commit: $old_commit,
    old_commit_short: $old_commit_short,
    old_commit_date: $old_commit_date,
    new_commit: $new_commit,
    new_commit_short: $new_commit_short,
    new_commit_date: $new_commit_date,
    file_list: $file_list,
    deleted_files: $deleted_files,
    renamed_files: $renamed_files,
    update_count_before: $update_count_before,
    large_churn: $large_churn,
    translation_mode: $translation_mode,
    clone_scope: $clone_scope
  }' > "$WORK_ORDER_FILE"

# 同时打印到会话，让主入口和 sub-skill 都能读到
cat "$WORK_ORDER_FILE"
```

**为什么要双写**：会话上下文可能被压缩（context compaction），把 work order 同时落盘成文件，下游 sub-skill 在会话里找不到时可从文件读 fallback（详见 `dg-docs-cn-translate` / `dg-docs-cn-publish` 的"读取 work order"章节）。

### Step 6: Report

```
📋 决策完成

模式: $MODE
项目目录: dg-docs-cn/$SLUG/
框架: $FRAMEWORK
本次翻译范围: $(echo "$file_list" | grep -c . || echo "全部") 个文件

Work order 已写入: $WORK_ORDER_FILE
```

## Work Order Schema

| 字段 | 类型 | 说明 |
|------|------|------|
| `mode` | string | `new` / `update` / `noop` / `legacy` / `bad_object` / `error` |
| `github_url` | string | 原文仓库 URL |
| `project_slug` | string | **严格 = repo 名**（不接受用户覆盖） |
| `framework` | string | `mkdocs` / `vitepress` / `mdbook` |
| `old_commit` / `new_commit` | string | 完整 SHA（update 模式才有 old） |
| `old_commit_short` / `new_commit_short` | string | 7 位短 SHA |
| `old_commit_date` / `new_commit_date` | string | YYYY-MM-DD |
| `file_list` | string[] \| `"all"` | 要翻译的文件相对路径；new 模式为 `"all"` |
| `deleted_files` | string[] | 原文已删除（中文版保留） |
| `renamed_files` | string[] | 重命名（手动处理） |
| `update_count_before` | int | 当前更新次数（publish 阶段 +1） |
| `large_churn` | bool | 变化率 >50% 时为 true |
| `translation_mode` | string | `quick` / `normal` / `refined` |
| `clone_scope` | string | `docs-only` / `full` |

## 异常处理表

| 异常 | 输出 | 主入口应对 |
|------|------|----------|
| `original_commit` 为空 | `mode: "legacy"` | 询问：重翻译（覆盖）/ 手动补版本 / 取消 |
| `git ls-remote` 404 | `mode: "error", reason: "repo_not_found"` | 报错退出，提示检查 URL |
| `git ls-remote` 超时 | `mode: "error", reason: "network"` | 提示检查网络后重试 |
| `git diff` 报 `bad object` | `mode: "bad_object"` | 询问：全量重翻 / 取消 |
| >50% 文件变更 | `large_churn: true`（仍输出 file_list） | 警告 + 询问：切新建模式 / 继续增量 |
| 文件重命名 | `renamed_files` 列出，不入 file_list | 警告「N 个文件重命名，自动翻译会漏，建议手动处理」 |
| slug 冲突（new 模式但目录已存在） | abort | 退出，让用户清理或换 repo |
| 不支持的框架 | exit 1 | 报错退出，提示加 framework 适配器 |

## 不做的事

- ❌ **不写 dg-docs-cn 树**——纯决策，不动用户的代码库
- ❌ **不翻译**——交给 `dg-docs-cn-translate`
- ❌ **不复制文件**——交给 `dg-docs-cn-publish`
- ❌ **不接受用户自定义 slug**——`project_slug` 严格 = URL 中的 repo 名
- ❌ **不自动删除原文已删除的文件**——保留中文版，由用户决定
- ❌ **不写 `.source-version.json`**——那是 translate 的产物
