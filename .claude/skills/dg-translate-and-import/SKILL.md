---
name: dg-translate-and-import
description: End-to-end orchestrator for translating an English GitHub docs repo into Chinese and publishing it into the dg-docs-cn collection. Automatically detects 新建模式 (first-time translation + import) vs 更新模式 (incremental update of an existing project by diffing original-repo commits). Use when user provides a GitHub repo URL and says "翻译并搬运", "翻译并发布", "更新 dataview 翻译", "把这个项目加到中文文档合集", or invokes /dg-translate-and-import. Not portable — bound to dg-docs-cn repo layout.
version: 1.1.0
---

# Translate & Import (End-to-End Orchestrator)

一条龙：GitHub 英文文档仓库 → 中文翻译 → 搬运到 dg-docs-cn → 配置好部署 → 启动预览。

**自动判别两种模式：**

| 模式 | 触发条件 | 工作流 |
|------|---------|--------|
| 新建模式 | `dg-docs-cn/{项目名}/.project.json` 不存在 | 完整翻译 + 首次搬运 |
| 更新模式 | `dg-docs-cn/{项目名}/.project.json` 已存在 | 检测原文 commit 变化 → diff 文件 → 只翻译变更部分 → 合并 |

由两个 skill 组合而成：

| 阶段 | Skill | 来源 |
|------|-------|------|
| 1. 翻译 | `dg-translate-tech-docs` | dg-skills marketplace（外部通用 skill） |
| 2. 搬运 | `dg-import-docs` | 本仓库 `.claude/skills/`（专属 skill） |

## User Input Tools

When this skill prompts the user, follow this tool-selection rule (priority order):

1. **Prefer built-in user-input tools** exposed by the current agent runtime — e.g., `AskUserQuestion`, `request_user_input`, `clarify`, `ask_user`, or any equivalent.
2. **Fallback**: if no such tool exists, emit a numbered plain-text message and ask the user to reply with the chosen number/answer for each question.
3. **Batching**: if the tool supports multiple questions per call, combine all applicable questions into a single call; if only single-question, ask them one at a time in priority order.

## Step 0: Collect Input & Detect Mode

从用户消息解析：
- **必需**：GitHub 仓库 URL（`github.com/{owner}/{repo}` 或 `https://github.com/{owner}/{repo}.git`）
- **可选**：项目目录名（不提供则默认取 repo 名）

如果用户没给 GitHub URL → 报错退出。

**自动判别模式：**

```bash
PROJECT_JSON="/Users/yefeng/Desktop/dg-docs-cn/{项目目录名}/.project.json"
if [ -f "$PROJECT_JSON" ]; then
  MODE="update"
else
  MODE="new"
fi
```

- 进入 [新建模式](#新建模式-workflow)
- 或进入 [更新模式](#更新模式-workflow)

---

## 新建模式 Workflow

### Step N1: Run Translation

调用 `dg-translate-tech-docs` skill（全量模式，不传 --files）：

```
参数：
  - GitHub 仓库 URL: {用户提供}
  - 输出目录: /tmp/dg-translate-{repo名}/
  - 翻译模式: normal                         # 可询问用户
  - 克隆范围: 仅 docs 目录                   # 默认；若失败再试「整个仓库」
```

等待翻译 skill 完成。它会产生：
- 翻译后的中文 markdown
- 翻译后的 nav 配置
- `.source-version.json`（原文 commit 等版本信息）
- `.changed-files.json`（全量文件清单）
- 报告翻译的文件数和失败清单

### Step N2: Quality Spot-Check

让用户抽查翻译效果（可选）：

```
抽查建议：
  - 首页 (index.md)
  - 一个核心章节
  - 一个 API 参考页

要不要现在打开 {输出目录} 抽查几个文件？
[是] - 我帮你看几个文件，确认翻译质量
[否] - 直接进入搬运阶段
```

### Step N3: Run Import

调用 `dg-import-docs` skill：

```
参数：
  - 源目录: /tmp/dg-translate-{repo名}/
  - 项目目录名: {推断的目录名}
  - 原文仓库 URL: {用户的 GitHub URL}
  - 其他元信息（title、description 等）：从源项目配置读取或询问用户
```

dg-import-docs 自动识别为「新建模式」，做：
- 复制整个项目到 `dg-docs-cn/{项目目录名}/`
- 配置 base URL（VitePress）
- 创建 `.project.json`（含版本字段）
- 重建 site-index

### Step N4: Final Report（新建）

```
🎉 新建完成

【翻译】
  源仓库: {owner}/{repo}
  框架: {framework}
  翻译文件数: {N}
  失败文件: {失败清单或"无"}

【搬运】
  目标目录: dg-docs-cn/{项目目录名}/
  base URL 已配置
  .project.json 已创建（基于原文 {commit_short} / {commit_date}）
  索引页项目列表已重建

【预览】
  单项目: cd dg-docs-cn/{项目目录名} && {启动命令}
  索引页: cd site-index && npm run dev

【部署】
  git add . && git commit -m "feat: 添加 {项目目录名} 中文文档" && git push
```

---

## 更新模式 Workflow

### Step U1: Read Current Version

从现有 `.project.json` 读取版本字段：

```bash
OLD_COMMIT=$(jq -r .original_commit "$PROJECT_JSON")
OLD_COMMIT_SHORT=$(jq -r .original_commit_short "$PROJECT_JSON")
OLD_COMMIT_DATE=$(jq -r .original_commit_date "$PROJECT_JSON")
ORIGINAL_BRANCH=$(jq -r .original_branch "$PROJECT_JSON")
ORIGINAL_REPO=$(jq -r .original_repo "$PROJECT_JSON")
UPDATE_COUNT=$(jq -r .update_count "$PROJECT_JSON")
```

如果 `original_commit` 字段为空（旧项目未记录版本）→ 警告用户并询问：
- 选项 A：当作新建模式重新翻译（覆盖现有）
- 选项 B：手动补版本信息后再来
- 选项 C：跳过版本检查，全量重翻译

### Step U2: Check Remote HEAD

```bash
# 不 clone，只问远端最新 commit
NEW_COMMIT=$(git ls-remote https://github.com/{owner}/{repo}.git HEAD | awk '{print $1}')
NEW_COMMIT_SHORT=${NEW_COMMIT:0:7}
```

### Step U3: Compare Commits

**核心判别：只通过 commit hash 比对**

```
if [ "$OLD_COMMIT" = "$NEW_COMMIT" ]; then
  echo "✅ 原文无更新（仍处于 $OLD_COMMIT_DATE 的 $OLD_COMMIT_SHORT）"
  echo "如需强制重翻，请删除 .project.json 后重跑（会进入新建模式）。"
  exit 0
fi
```

不需要列 `git log` 中间的 commit message（用户不关心）。直接进入文件 diff。

### Step U4: Clone & Diff Files

```bash
# 完整 clone 到临时目录
git clone https://github.com/{owner}/{repo}.git /tmp/dg-update-{repo}/

# diff 出 docs/ 下的变更文件
cd /tmp/dg-update-{repo}/
DIFF_OUTPUT=$(git diff --name-status $OLD_COMMIT..$NEW_COMMIT -- docs/)

# 分类
ADDED=$(echo "$DIFF_OUTPUT" | grep "^A" | awk '{print $2}')
MODIFIED=$(echo "$DIFF_OUTPUT" | grep "^M" | awk '{print $2}')
DELETED=$(echo "$DIFF_OUTPUT" | grep "^D" | awk '{print $2}')
RENAMED=$(echo "$DIFF_OUTPUT" | grep "^R" | awk '{print $2" → "$3}')
```

**异常检测：**

- 如果 `git diff` 失败（`bad object`）→ 原 commit 被 force-push 删除，走 [异常处理](#异常处理)
- 如果 `RENAMED` 非空 → 目录结构变化，警告用户「检测到文件重命名，建议手动处理」

### Step U5: Report & Ask User

```
🔄 检测到原文更新

项目: {项目目录名}
原文版本: $OLD_COMMIT_SHORT ($OLD_COMMIT_DATE) → $NEW_COMMIT_SHORT (今天)
累计已更新次数: $UPDATE_COUNT

涉及 docs/ 下文件变更:
  - 新增: $(echo "$ADDED" | wc -l) 个
  - 修改: $(echo "$MODIFIED" | wc -l) 个
  - 删除: $(echo "$DELETED" | wc -l) 个（保留中文版不删）
  - 重命名: $(echo "$RENAMED" | wc -l) 个

具体清单:
  [新增]
  $ADDED
  [修改]
  $MODIFIED
  [删除（保留）]
  $DELETED

如何处理？
  [1] 全部翻译新增+修改（推荐）
  [2] 选择性翻译（手动选择文件）
  [3] 取消
```

### Step U6: Construct Change List

用户选 1（全部）→ `CHANGE_LIST = $ADDED + $MODIFIED`
用户选 2（选择性）→ 用 AskUserQuestion 让用户勾选
用户选 3 → 退出，清理临时目录

**变更清单写入** `/tmp/dg-update-{repo}/.change-list.txt`（每行一个文件相对路径）。

### Step U7: Run Incremental Translation

调用 `dg-translate-tech-docs` skill（增量模式）：

```
参数：
  - GitHub 仓库 URL: {用户提供}
  - 输出目录: /tmp/dg-translate-update-{repo名}/
  - 翻译模式: normal（同首次）
  - 克隆范围: 仅 docs 目录
  - --files: {CHANGE_LIST}                ← 关键参数，触发增量模式
```

dg-translate-tech-docs 增量模式下：
- 只翻译清单中的文件
- 其他文件保持英文原文（不重要，因为搬运时只复制变更文件）
- 复用现有的 EXTEND.md（如有）
- 输出 `.source-version.json`（新版本）
- 输出 `.changed-files.json`（同 CHANGE_LIST）

### Step U8: Run Import (Update Mode)

调用 `dg-import-docs` skill：

```
参数：
  - 源目录: /tmp/dg-translate-update-{repo名}/
  - 项目目录名: {推断的目录名}（已存在，更新模式）
```

dg-import-docs 自动识别为「更新模式」，做：
- 读 `.changed-files.json`，只复制清单中的文件
- 不动未变更文件（保持现有中文版）
- 删除的文件保留（不删中文版）
- 更新 `.project.json` 的版本字段：original_commit → new_commit、last_updated_at → today、update_count += 1
- 重建 site-index

### Step U9: Final Report（更新）

```
🔄 更新完成

【版本变化】
  {OLD_COMMIT_SHORT} ({OLD_COMMIT_DATE}) → {NEW_COMMIT_SHORT} ({NEW_COMMIT_DATE})
  累计更新次数: {UPDATE_COUNT} → {UPDATE_COUNT+1}

【翻译】
  重新翻译: {M} 个文件
  失败: {失败清单或"无"}

【搬运】
  变更文件已合并到 dg-docs-cn/{项目目录名}/
  .project.json 已更新版本字段
  索引页已重建

【预览】
  cd dg-docs-cn/{项目目录名} && {启动命令}
  建议重点验证: {本次变更的关键文件清单}

【部署】
  git add . && git commit -m "chore: 更新 {项目目录名} 至 {NEW_COMMIT_SHORT}" && git push

【清理】
  临时目录 /tmp/dg-update-{repo}/ 和 /tmp/dg-translate-update-{repo}/ 可删除。
```

---

## 异常处理

| 异常 | 应对 |
|------|------|
| `original_commit` 字段为空（旧项目） | 询问用户：当作新建重翻 / 手动补版本 / 跳过检查全量重翻 |
| `git ls-remote` 失败（网络/仓库不存在） | 报错退出，提示用户检查 URL 和网络 |
| `git diff` 报 `bad object`（原 commit 被 force-push 删除） | 警告：「原 commit $OLD_COMMIT_SHORT 已不在仓库中（可能被 rebase）」。询问：降级为全量重翻译 / 取消 |
| 检测到文件重命名（R） | 警告：「检测到 N 个文件重命名，自动翻译可能漏掉。建议手动处理」。继续但不自动翻译重命名文件 |
| 原 docs 目录结构大变（>50% 文件变更） | 警告：「检测到大范围目录结构变化，建议当作新建项目重做」。询问：继续增量 / 切换新建模式 |
| 翻译 skill 报错（框架不支持） | 退出（理论上首次翻译时已检测过，更新不会变） |
| 翻译部分文件失败 | 不阻塞搬运，搬运后单独重试失败文件 |
| `.changed-files.json` 缺失 | dg-import-docs 会询问：全量复制（风险：覆盖未翻译文件）/ 取消 |
| `npm install` 失败（索引页） | 跳过预览，不影响功能 |

## 不做的事

- ❌ **不自动 push**——让用户先本地预览确认
- ❌ **不删除翻译临时目录**——询问用户决定
- ❌ **不绕过任何 skill 的失败**——尊重每个 skill 的职责边界
- ❌ **不用 git log 列中间 commit message**——用户只关心文件变更，不关心 commit message
- ❌ **不自动删除原文已删除的文件**——保留中文版，用户决定
