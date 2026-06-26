---
name: dg-docs-cn
description: Main entry point of the dg-docs-cn pipeline. User-facing orchestrator that coordinates three sub-skills - dg-docs-cn-prepare (decides what to translate), dg-docs-cn-translate (translates), and dg-docs-cn-publish (lands into dg-docs-cn repo). Detects new vs update mode automatically. Use when user provides a GitHub repo URL and says "翻译并搬运", "翻译并发布", "更新 X 翻译", "把这个项目加到中文文档合集", or invokes /dg-docs-cn. Bound to dg-docs-cn repo layout.
version: 2.0.0
---

# dg-docs-cn (主入口 / 编排)

一条龙：GitHub 英文文档仓库 → 决策 → 翻译 → 落地到 dg-docs-cn → 配置好部署 → 启动预览。

**本 skill 只编排，不亲自做技术工作**——所有 diff、翻译、配置都委托给三个 sub-skill。

### 流水线

```
用户 ─► dg-docs-cn (本 skill)
            │
            ├─► dg-docs-cn-prepare
            │     判断要翻什么 + 输出 work order JSON
            │
            ├─► dg-docs-cn-translate
            │     翻译 markdown + nav（全量或按 work order 的 file_list）
            │
            └─► dg-docs-cn-publish
                  搬运 + 改 base URL + 生成/更新 .meta.json + 重建索引
```

| 阶段 | Sub-skill | 唯一不可替代的能力 |
|------|-----------|------------------|
| 1. 决策 | `dg-docs-cn-prepare` | 跨 commit diff（`git ls-remote` + `git diff OLD..NEW`）|
| 2. 翻译 | `dg-docs-cn-translate` | 翻译 markdown + nav，输出 `.changed-files.json` |
| 3. 落地 | `dg-docs-cn-publish` | 改 VitePress base、生成 `.meta.json`、重建索引 |

**自动判别两种模式**（由 prepare 决定，本 skill 只读结果）：

| 模式 | 触发条件 | 工作流 |
|------|---------|--------|
| 新建模式 | `dg-docs-cn/{slug}/.meta.json` 不存在 | 完整翻译 + 首次搬运 |
| 更新模式 | `dg-docs-cn/{slug}/.meta.json` 已存在 | 检测原文 commit 变化 → diff 文件 → 只翻译变更部分 → 合并 |

## User Input Tools

When this skill prompts the user, follow this tool-selection rule (priority order):

1. **Prefer built-in user-input tools** exposed by the current agent runtime — e.g., `AskUserQuestion`, `request_user_input`, `clarify`, `ask_user`, or any equivalent.
2. **Fallback**: if no such tool exists, emit a numbered plain-text message and ask the user to reply with the chosen number/answer for each question.
3. **Batching**: if the tool supports multiple questions per call, combine all applicable questions into a single call; if only single-question, ask them one at a time in priority order.

## Step 0: Parse Intent

从用户消息解析：

- **必需**：GitHub 仓库 URL（`github.com/{owner}/{repo}` 或 `https://github.com/{owner}/{repo}.git`）
- **可选**：translation_mode（默认 `normal`）、clone_scope（默认 `docs-only`）

如果用户没给 GitHub URL → 报错退出。

**`project_slug` 推导**（严格规则，**不接受用户覆盖**）：

```bash
SLUG=$(echo "$GITHUB_URL" | sed -E 's|.*github\.com[/:][^/]+/([^/]+?)(\.git)?/?$|\1|')
```

例：
- `github.com/foo/bar-baz` → slug = `bar-baz`
- `https://github.com/blacksmithgu/obsidian-dataview.git` → slug = `obsidian-dataview`

**为什么强制 = repo 名**：目录名/URL slug/repo 名三者一致，无歧义；消除"用户随便起名导致找不到"的风险。

## Step 1: 调 dg-docs-cn-prepare

传递：GitHub URL、project_slug、translation_mode、clone_scope。

```bash
# 在会话内调用 dg-docs-cn-prepare
# prepare 会输出 work order JSON 到会话 + /tmp/dg-prepare-{slug}/work-order.json
```

接收：work order JSON。从 work order 读关键字段决定后续：

| work order 字段 | 本 skill 的动作 |
|----------------|---------------|
| `mode: "new"` | 继续 Step 2（调 translate 全量翻译）|
| `mode: "update"` | 继续 Step 2（调 translate 增量翻译，**额外传 --extend-from**）|
| `mode: "noop"` | 跳到 Step 4，报告「原文无更新」并退出 |
| `mode: "legacy"` | 询问用户：当作新建重翻（覆盖）/手动补版本/取消 |
| `mode: "bad_object"` | 询问用户：全量重翻 / 取消 |
| `mode: "error"` | 报错退出，按 `reason` 提示（URL 错 / 网络）|
| `large_churn: true` | 警告 + 询问：切新建模式 / 继续增量 |

**work order 文件路径**（备 fallback 用）：

```bash
WORK_ORDER_FILE="/tmp/dg-prepare-$SLUG/work-order.json"
```

## Step 2: 调 dg-docs-cn-translate

传递：

| 参数 | 来源 |
|------|------|
| work order（会话内）| 来自 prepare |
| `--work-order-file "$WORK_ORDER_FILE"` | 防 fallback |
| `--extend-from "dg-docs-cn/$SLUG/.baoyu-skills/"` | **仅 update 模式**才传；让 translate 复用旧术语表 |

```bash
# 在会话内调用 dg-docs-cn-translate
# translate 会输出翻译目录路径（默认 /tmp/dg-translate-{repo}/）
```

接收：翻译目录路径。

**commit 核对**：translate 完成后，它会报告本次基于的 upstream commit。若与 work order 的 `new_commit` 不一致（说明 upstream 在 prepare 与 translate 之间又推进），警告用户但允许继续。

## Step 3: 调 dg-docs-cn-publish

传递：

| 参数 | 来源 |
|------|------|
| 翻译目录 | 来自 Step 2 |
| work order（会话内）| 来自 prepare |
| `--work-order-file "$WORK_ORDER_FILE"` | 防 fallback |

```bash
# 在会话内调用 dg-docs-cn-publish
# publish 会输出落地完成的报告（含预览命令、commit 命令）
```

接收：publish 的报告。本 skill 不重做 publish 的工作，只是把它的报告整合进 Step 4 的汇总。

## Step 4: 汇总报告

把三个 sub-skill 的产出汇总成一份用户视角的报告。

### 新建模式

```
🎉 新建完成

【决策】
  模式: new
  项目目录: dg-docs-cn/$SLUG/

【翻译】
  源仓库: {owner}/{repo}
  SSG: {ssg}
  翻译文件数: {N}
  失败文件: {失败清单或"无"}
  基于原文版本: {new_commit_short} ({new_commit_date})

【落地】
  目标目录: dg-docs-cn/$SLUG/
  base URL 已配置（若 VitePress）
  .meta.json 已创建
  索引页项目列表已重建

【预览】
  单项目: cd dg-docs-cn/$SLUG && {启动命令}
  索引页: cd site-index && npm run dev

【部署】
  git add . && git commit -m "feat: 添加 $SLUG 中文文档" && git push
```

### 更新模式

```
🔄 更新完成

【决策】
  模式: update
  项目目录: dg-docs-cn/$SLUG/
  原文版本: {old_commit_short} ({old_commit_date}) → {new_commit_short} ({new_commit_date})

【翻译】
  重新翻译: {M} 个文件
  失败: {失败清单或"无"}

【落地】
  变更文件已合并到 dg-docs-cn/$SLUG/
  .meta.json 已更新版本字段（update_count: {N} → {N+1}）
  索引页已重建

【预览】
  cd dg-docs-cn/$SLUG && {启动命令}
  建议重点验证: {本次变更的关键文件清单}

【部署】
  git add . && git commit -m "chore: 更新 $SLUG 至 {new_commit_short}" && git push
```

### Noop 模式

```
✅ 原文无更新

项目: $SLUG
当前版本: {old_commit_short} ({old_commit_date})
upstream HEAD: 相同

如需强制重翻，删除 dg-docs-cn/$SLUG/.meta.json 后重跑（会进入新建模式）。
```

## Step 5: 临时目录清理

所有 sub-skill 完成后，**统一询问用户**是否清理临时目录：

```
临时目录清理:
  /tmp/dg-prepare-$SLUG/         (prepare 的 clone + work-order.json)
  /tmp/dg-translate-{repo}/       (translate 的 clone + 输出)

是否删除？
  [1] 全部删除（推荐）
  [2] 保留（如需手动检查翻译产物）
```

**为什么归本 skill 管**：sub-skill 不知道整个流水线是否还会被重试（比如 publish 失败要重跑），不能擅自清理。只有本 skill（知道流水线真的结束了）才能问。

## 异常路由

prepare / translate / publish 的异常上抛到本 skill 决策。

| 异常 | 本 skill 的应对 |
|------|---------------|
| prepare 报 `mode: "error"` | 按 `reason` 报错退出（URL 错 → 提示用户检查 / 网络 → 提示重试）|
| prepare 报 `mode: "legacy"` | 询问用户：当作新建重翻（覆盖）/ 手动补版本 / 取消 |
| prepare 报 `mode: "bad_object"` | 警告「原 commit 已不在仓库（被 rebase）」。询问：全量重翻译 / 取消 |
| prepare 报 `large_churn: true` | 警告「检测到大范围目录变化（>50% 文件）」。询问：切新建模式 / 继续增量 |
| prepare 检测到重命名（R） | 警告「N 个文件重命名，自动翻译会漏，建议手动处理」后继续 |
| translate 报 SSG 不支持 | 退出（理论上首次翻译时已检测过，更新不会变）|
| translate 部分文件失败 | 不阻塞 publish，publish 后单独重试失败文件 |
| **translate 成功但 publish 失败** | **保留 translate 输出目录**（`/tmp/dg-translate-{repo}/`），询问「翻译产物还在 `{path}`，要重试 publish 吗？」。同意 → 用相同参数重调 publish；拒绝 → 退出，不删翻译产物（用户可手动抢救）|
| `.changed-files.json` 缺失 + 更新模式 | publish 会询问用户：全量复制（风险：覆盖未翻译文件）/ 取消 |
| `npm install` 失败（索引页）| 跳过预览，不影响功能 |

**为什么不自动重试**：避免失败循环。让用户知情后决定。

## 不做的事

- ❌ **不亲自做 diff / 翻译 / 落地**——全部委托给 sub-skill
- ❌ **不自动 push**——让用户先本地预览确认
- ❌ **不绕过任何 sub-skill 的失败**——尊重每个 skill 的职责边界
- ❌ **不用 git log 列中间 commit message**——用户只关心文件变更，不关心 commit message
- ❌ **不自动删除原文已删除的文件**——保留中文版，用户决定
- ❌ **不擅自清理 sub-skill 的临时目录**——除了 Step 5 统一问过用户之后
- ❌ **不接受用户自定义 project_slug**——严格 = URL 中的 repo 名
