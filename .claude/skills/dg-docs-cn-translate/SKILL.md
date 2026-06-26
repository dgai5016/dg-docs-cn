---
name: dg-docs-cn-translate
description: Translator stage of the dg-docs-cn pipeline. Translates an English technical documentation repository from GitHub into Chinese, preserving the original site's framework (MkDocs Material, VitePress, or mdBook). Input comes from a work order produced by dg-docs-cn-prepare; output is a runnable Chinese-localized copy with .source-version.json and .changed-files.json. Can also run standalone with just a GitHub URL. Use when user says "翻译技术文档", "翻译英文文档", "把这个仓库的文档翻译成中文", or invokes /dg-docs-cn-translate.
version: 2.0.0
metadata:
  openclaw:
    requires:
      anyBins:
        - git
---

# Translate (dg-docs-cn pipeline stage 2)

把 GitHub 上的英文技术文档仓库翻译成中文版本，**保留原站点的框架与所有配置**。产物是一份「可运行的中文化原项目」。

**职责边界（重要）：**

- ✅ **做**：翻译 markdown 内容、翻译 nav/sidebar 标题、判断 site_name 是否需要翻译、输出 `.source-version.json` 和 `.changed-files.json`
- ❌ **不做**：修改 base URL、修改 edit_uri/repo_url、创建目标仓库专属元信息、修改 CI/CD 配置、检测框架——这些属于其他阶段

判断标准：「产物是不是一份可运行的中文化原项目？」—— 文档站点能正常启动（mkdocs serve / npm run docs:dev / mdbook serve 不报错），所有 md 文件已翻译为中文，原框架与配置保留完整。

## User Input Tools

When this skill prompts the user, follow this tool-selection rule (priority order):

1. **Prefer built-in user-input tools** exposed by the current agent runtime — e.g., `AskUserQuestion`, `request_user_input`, `clarify`, `ask_user`, or any equivalent.
2. **Fallback**: if no such tool exists, emit a numbered plain-text message and ask the user to reply with the chosen number/answer for each question.
3. **Batching**: if the tool supports multiple questions per call, combine all applicable questions into a single call; if only single-question, ask them one at a time in priority order.

## Reading the Work Order

**作为 dg-docs-cn 流水线一员调用时**，主入口 `dg-docs-cn` 会通过会话上下文传一份 work order JSON（来自 `dg-docs-cn-prepare`）。从 work order 提取：

| 字段 | 用途 |
|------|------|
| `github_url` | 翻译目标仓库 |
| `framework` | 直接信任，加载对应 `references/framework-*.md`（**不再自己检测**）|
| `file_list` | `string[]` → 增量模式翻译这些文件；`"all"` → 全量模式 |
| `translation_mode` | `quick` / `normal` / `refined` |
| `clone_scope` | `docs-only` / `full` |
| `new_commit` | 期望的 upstream HEAD（用于事后核对，避免 upstream 在 prepare 与 translate 之间又推进）|

**Fallback**：若会话内找不到 work order（可能被压缩），从 `--work-order-file` 参数指向的 JSON 文件读：

```bash
WORK_ORDER=$(cat "$WORK_ORDER_FILE")
```

**Standalone 调用**（无 work order）：用户直接给 GitHub URL，本 skill 走全量模式，框架自行检测——但**注意**：`detect-framework.sh` 已搬到 `dg-docs-cn-prepare`，standalone 模式下若需要检测，可临时跑 `find` 启发式判断，或要求用户在调用前先跑 prepare。

## Supported Frameworks

| Framework | Status | Reference |
|-----------|--------|-----------|
| MkDocs Material | ✅ Supported | [references/framework-mkdocs.md](references/framework-mkdocs.md) |
| VitePress | ✅ Supported | [references/framework-vitepress.md](references/framework-vitepress.md) |
| mdBook | ✅ Supported | [references/framework-mdbook.md](references/framework-mdbook.md) |
| Docusaurus / Astro Starlight / Nextra / GitBook / others | ❌ Rejected | Add a new `references/framework-xxx.md` to support |

**框架不在支持列表时**：报错退出，明确告诉用户「先去 `references/` 加 `framework-xxx.md` 适配器，再重新跑」。**不要**让 Claude 现场处理新框架——保证翻译流程的可预期性。

## Workflow

### Step 1: Collect Parameters

**有 work order**：参数全部从 work order 取，**不问用户**：

```bash
GITHUB_URL=$(echo "$WORK_ORDER" | jq -r .github_url)
FRAMEWORK=$(echo "$WORK_ORDER" | jq -r .framework)
FILE_LIST=$(echo "$WORK_ORDER" | jq -r '.file_list')
TRANSLATION_MODE=$(echo "$WORK_ORDER" | jq -r .translation_mode)
CLONE_SCOPE=$(echo "$WORK_ORDER" | jq -r .clone_scope)
OUTPUT_DIR="/tmp/dg-translate-${repo名}/"
```

**无 work order（standalone）**：通过用户输入工具问：

| 问题 | 默认值 | 说明 |
|------|--------|------|
| 输出目录 | `~/Desktop/translated-{repo名}/` | 翻译产物的落地位置 |
| 翻译模式 | `normal` | `quick` / `normal` / `refined`（沿用 baoyu-translate） |
| 是否克隆整个仓库 | `仅 docs 目录` | `仅 docs 目录` / `整个仓库`（少数项目配置文件在 docs 之外） |

同时从用户消息解析出 GitHub 仓库 URL（必须）。如果是 `github.com/owner/repo` 形式，提取 owner/repo。

**调用方可选传入 `--files` 参数**（standalone 模式下用，逗号分隔的相对路径）：
- 提供 → **增量模式**：只翻译清单中的文件
- 未提供 → **全量模式**：翻译所有 md 文件

### Step 2: Clone Source

```bash
# 完整 clone（不浅克隆）—— 为了记录准确的 commit 并支持未来 diff
git clone https://github.com/{owner}/{repo}.git /tmp/dg-translate-{repo}

# 根据参数决定拷贝范围
# 仅 docs：cp -r /tmp/dg-translate-{repo}/docs {输出目录}/
# 整个仓库：cp -r /tmp/dg-translate-{repo}/* {输出目录}/
```

**为什么完整 clone（不用 `--depth 1`）？**
- 翻译时需要记录当前 HEAD 的 commit hash，作为「翻译基于的原文版本」
- 未来原仓库更新后，可以通过 `git ls-remote` + `git diff {old}..{new}` 找出变更文件，做增量翻译
- 完整 clone 让 commit hash 有意义；浅克隆也能拿到 HEAD hash，但本地无法 diff 历史

**commit 核对**（仅 work order 模式）：clone 完成后，检查本地 HEAD 是否等于 work order 的 `new_commit`。不等 → 警告「upstream 在 prepare 之后又推进了，本次翻译基于更新的版本 {actual_short}」。

**注意**：少数项目的文档配置文件（如 `mkdocs.yml`）在仓库根，不在 `docs/` 下。Step 1 选择"整个仓库"即可处理。

**临时 clone 保留**：不要立即删除 `/tmp/dg-translate-{repo}/`，Step 4 会从中读取 commit 信息。整个 skill 结束后再清理（清理归主入口 `dg-docs-cn`，本 skill 不删）。

### Step 3: Apply Glossary from Prior Translation (Incremental Only)

**仅 work order 模式 + update 模式**：

主入口会传 `--extend-from dg-docs-cn/{slug}/.baoyu-skills/`。若提供该参数，先把旧术语表复制到输出目录，让翻译复用：

```bash
if [ -n "$EXTEND_FROM" ] && [ -d "$EXTEND_FROM" ]; then
  mkdir -p "$OUTPUT_DIR/.baoyu-skills/"
  cp -r "$EXTEND_FROM/." "$OUTPUT_DIR/.baoyu-skills/"
fi
```

**为什么由本 skill 复制而不是 main 复制**：复制目标在 scratch 输出目录里，本 skill 自己创建该目录，由它一并管理更自然。main 只负责"告诉我源在哪"。

**new 模式不传 `--extend-from`**——首次翻译时还没有旧术语表，让 Step 4 创建空的。

### Step 4: Translate Markdown Content

**确定要翻译的文件清单：**

- **全量模式**（`file_list = "all"` 或未传 `--files`）：用 `find {输出目录} -name "*.md"` 收集所有 md 文件（按框架适配器指引的范围）
- **增量模式**（`file_list = [...]` 或传了 `--files`）：只处理清单中的文件，其他文件保持不动

对清单中的每个 md 文件，逐个调用 **baoyu-translate**：

```
对每个 md 文件 {file}：
  1. 触发 baoyu-translate，参数：
     - 文件：{file}
     - 目标语言：--to zh-CN
     - 模式：--mode {用户选择的模式}
     - 受众：--audience technical
     - 风格：--style technical
  2. baoyu-translate 会输出到 {file所在的目录}/{file名}-zh-CN/translation.md
  3. 把 translation.md 的内容覆盖回原 {file} 路径
  4. 删除中间产物目录 {file名}-zh-CN/
```

**失败处理**：单个文件翻译失败时跳过，记录到失败清单。所有文件处理完后，把失败清单报告给用户，建议对失败文件单独重试。

**术语一致性**：在输出目录的根创建或维护 `.baoyu-skills/baoyu-translate/EXTEND.md`。**若 Step 3 已经复制了旧 EXTEND.md，必须复用，不要覆盖**（避免术语漂移）。详见 [references/glossary-tip.md](references/glossary-tip.md)。

**增量模式额外输出**：所有翻译完成后，把本次翻译的文件清单（相对路径）写入 `{输出目录}/.changed-files.json`：

```json
{
  "files": [
    "docs/index.md",
    "docs/api/intro.md",
    "docs/queries/structure.md"
  ],
  "generated_at": "2026-06-24T18:30:00Z"
}
```

这个清单的作用：让下游流程（`dg-docs-cn-publish`）能据此只处理变更文件，**避免覆盖未翻译的英文原文**（增量模式下未变更文件仍是英文）。

**全量模式下**：可选输出 `.changed-files.json`（包含全部 md 文件清单）；下游流程检测不到时按全量处理。

### Step 5: Record Source Version

在翻译产物的根目录（`{输出目录}/.source-version.json`）写入原文版本信息：

```json
{
  "repo": "https://github.com/{owner}/{repo}",
  "branch": "{branch}",
  "commit": "{full_sha}",
  "commit_short": "{short_sha}",
  "commit_date": "{YYYY-MM-DD}",
  "commit_message": "{commit_subject}",
  "captured_at": "{ISO 8601 timestamp}"
}
```

**字段获取**（在临时 clone 目录 `/tmp/dg-translate-{repo}/` 中运行）：

```bash
# commit / commit_short / commit_date / commit_message
git -C /tmp/dg-translate-{repo} log -1 --pretty=format:'%H%n%h%n%ad%n%s' --date=short

# branch（默认分支）
git -C /tmp/dg-translate-{repo} remote show origin | grep 'HEAD branch' | sed 's/.*: //'

# captured_at
date -u +"%Y-%m-%dT%H:%M:%SZ"
```

**为什么单独文件？**
- `.source-version.json` 是本 skill 的产物，记录翻译基于的原文版本
- 下游流程（`dg-docs-cn-publish`）读取它，把版本信息合并到 `.project.json` 的 `original_*` 字段
- 本 skill 不需要知道 `.project.json` 的 schema——保持职责单一

**增量模式下**：如果用户传入新的 `--output-dir`（覆盖现有翻译），重写 `.source-version.json`。如果输出目录已存在 `.source-version.json` 且未指定覆盖，警告用户「检测到现有版本 {old_short}，确认要用新版本 {new_short} 替换吗？」

### Step 6: Translate Navigation Config

按框架适配器指引，翻译 nav/sidebar 标题：

- **MkDocs**：编辑 `mkdocs.yml` 的 `nav` 字段，翻译每个标题文字（保留路径值不动）
- **VitePress**：编辑 `.vitepress/config.{ts,js}` 的 `themeConfig.nav` 和 `themeConfig.sidebar` 的 `text` 字段
- **mdBook**：编辑 `src/SUMMARY.md`，翻译每条 `-[标题](路径)` 中的「标题」部分（路径不动）

**判断 site_name 是否翻译**：
- 描述性短语（如 "React Documentation"）→ 翻译
- 品牌/产品名（如 "Dataview"、"VitePress"）→ 保留原文
- 不确定时询问用户

### Step 7: Verify

```bash
# 检查所有 md 都翻译了（用 head 抽查前几行，确认是中文）
find {输出目录} -name "*.md" | head -5 | xargs -I{} sh -c 'echo "=== {} ===" && head -3 {}'
```

### Step 8: Report & Launch Preview

报告内容：
```
✅ 翻译完成

仓库: {owner}/{repo}
框架: {framework}
输出目录: {输出目录}
翻译文件数: {N}
失败文件: {失败清单或"无"}

基于原文版本:
  commit: {commit_short} ({commit_date})
  branch: {branch}
  完整 hash: {commit}
  版本信息已写入: {输出目录}/.source-version.json

启动预览（{framework}）:
{按框架给出的启动命令}

访问: {本地 URL}
```

**启动预览命令**（按框架）：

| 框架 | 依赖安装 | 启动 | URL |
|------|---------|------|-----|
| MkDocs | `pip install mkdocs-material` | `cd {输出目录} && mkdocs serve` | http://127.0.0.1:8000 |
| VitePress | `cd {输出目录} && npm install` | `npm run docs:dev` 或 `npx vitepress dev` | http://127.0.0.1:5173 |
| mdBook | `cargo install mdbook --version 0.4.52 --locked`（详见 framework-mdbook.md） | `cd {输出目录} && mdbook serve` | http://127.0.0.1:3000 |

**主动询问**：「要不要现在就启动预览？」

- 用户**同意** →
  1. 检查依赖是否已装，未装则装
  2. 后台启动服务（`mkdocs serve &` 或 `npm run docs:dev &`）
  3. 等服务起来（最多 30 秒，可用 `curl -s -o /dev/null -w "%{http_code}" {URL}` 探测）
  4. 用 WebFetch 抓首页，确认返回 200 且包含中文内容
  5. 告诉用户浏览器打开 `{URL}` 查看
- 用户**拒绝** → 仅打印启动命令，用户自己执行

## Scope Boundary (Reminder)

下面这些**不要做**——它们属于其他阶段或别的 skill：

- ❌ 修改 `base` URL（VitePress 的 `base` / Docusaurus 的 `baseUrl`）—— `dg-docs-cn-publish` 负责
- ❌ 修改 `edit_uri`、`repo_url`、`site_url` 等部署相关配置 —— `dg-docs-cn-publish` 负责
- ❌ 创建目标仓库专属的元信息文件（`.project.json`）—— `dg-docs-cn-publish` 负责
- ❌ 修改 CI/CD 配置（`.github/workflows/deploy.yml`）—— 仓库级，不动
- ❌ 检测框架 —— `dg-docs-cn-prepare` 负责（standalone 模式例外）
- ❌ 跟踪 upstream 变化 / git diff —— `dg-docs-cn-prepare` 负责

判断标准：「产物是不是一份可运行的中文化原项目？」—— 文档站点能正常启动，所有 md 文件已翻译为中文，原框架与配置保留完整。

## Extension Support

术语表与翻译偏好通过 baoyu-translate 的 EXTEND.md 配置。详见 [references/glossary-tip.md](references/glossary-tip.md)。
