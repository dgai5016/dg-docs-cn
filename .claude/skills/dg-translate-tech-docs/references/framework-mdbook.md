# mdBook 适配器

适用于 [mdBook](https://rust-lang.github.io/mdBook/) 框架的文档翻译指引。mdBook 是 Rust 生态的静态文档系统，配置文件 `book.toml`，文档源在 `src/` 目录，导航通过 `src/SUMMARY.md` 定义。

## 检测信号

满足以下任一即判定为 mdBook：

- 输出目录根有 `book.toml`
- 输出目录的父目录有 `book.toml`（少数项目把 docs 单独提出去时）

## 标准目录结构

```
{输出目录}/
├── book.toml             # 配置文件（含 [book] 元信息、[preprocessor.*]、[output.*])
├── documentation.toml    # 项目专属数据（可选，被 preprocessor 引用）
└── src/                  # 文档源码根（book.toml 的 src = "src"）
    ├── SUMMARY.md        # ★ mdBook 的导航树（必填，决定侧边栏）
    ├── introduction.md
    ├── syntax.md
    ├── commands/
    │   └── ...
    └── ...
```

> **变体**：book.toml 的 `[book] src` 字段可以指向其他目录（如 `src = "docs"`）。读 `book.toml` 确认实际源目录，不要硬编码 `src/`。

## 翻译范围

`{src_dir}/**/*.md` —— 所有 markdown 文件（含 `SUMMARY.md`）。

**排除**：
- `book.toml` 本身（仅翻译 `[book] title`，详见下文）
- `theme/` 下的 `.hbs` Handlebars 模板（不翻译，保留原样）
- `theme/` 下的 CSS/JS/字体/图片（不翻译）
- `assets/` / `img/` 等二进制资源

## SUMMARY.md 翻译

mdBook 的导航完全由 `src/SUMMARY.md` 决定：左侧边栏、页面顺序、嵌套层级都从这里来。**SUMMARY.md 必须翻译标题文字，链接路径不动。**

### 原始示例

```markdown
# Summary

- [Introduction](./introduction.md)
    - [Installation](./installation.md)
    - [Terminology](./terminology.md)
- [Commands](./commands/overview.md)
    - [Dynamic Commands](./commands/dynamic-command.md)
```

### 翻译后

```markdown
# Summary

- [简介](./introduction.md)
    - [安装](./installation.md)
    - [术语](./terminology.md)
- [命令](./commands/overview.md)
    - [动态命令](./commands/dynamic-command.md)
```

**注意**：
- 链接的 `[文字]` 翻译，`(路径)` 原样保留
- 缩进（用 4 空格表示嵌套）保持不变
- 顶级 `# Summary` 标题：mdBook 默认不渲染它（只用作解析），但翻译成 `# 目录` 或保留 `# Summary` 都不影响

### 处理方法

直接用 Read + Edit 编辑 `SUMMARY.md`，不要改链接路径。

## book.toml 翻译规则

只翻译 `[book]` 段的 `title` 字段。其他全部保留。

### 应翻译的字段

| 字段 | 翻译策略 |
|------|---------|
| `[book] title` | 描述性短语翻译；品牌名（如 `Templater`）保留 |

### 不应翻译的字段

| 字段 | 原因 |
|------|------|
| `[book] authors` | 作者署名 |
| `[book] language` | 语言代码（`en` → `zh-cn` 由搬运/部署阶段处理，不在本 skill 范围）|
| `[book] src` | 文档目录路径 |
| `[book] multilingual` | 多语言开关 |
| `[preprocessor.*]` | 预处理器配置（如 `mdbook-tera`、`mdbook-toc`）|
| `[output.*]` | 输出格式配置（html/redirect 等）|

## 预处理器（preprocessor）注意事项

mdBook 项目可能用预处理器在构建时动态生成内容，常见的：

| 预处理器 | 作用 | 对翻译的影响 |
|---------|------|-------------|
| `mdbook-toc` | 从 markdown 标题自动生成页内目录 | 不影响——目录从翻译后的标题生成 |
| `mdbook-tera` | 用 Tera 模板注入外部数据（如 `documentation.toml`） | 翻译 md 文件时**保留 `{{ }}` 模板标签不动**，只翻译周围文字 |
| 自定义预处理器 | 项目特有 | 不确定时不翻译该段，作为失败项报告 |

**Tera 模板示例**（ Templater 项目里的真实片段）：

```markdown
{{ tp.config.functions.template_file.name }}
```

翻译时只动外层文字，标签内 `tp.config.functions...` 这类标识符**绝对不动**。

## site title 翻译判断

- 描述性短语（如 "User Guide"）→ 翻译
- 品牌/产品名（如 `Templater`、`mdBook`）→ 保留原文
- 不确定时询问用户

## 启动预览

```bash
# 依赖（仅首次需要）—— pin 版本，避免 0.5.x 兼容性问题，详见下方「版本兼容性」
cargo install mdbook --version 0.4.52 --locked
cargo install mdbook-toc --version 0.14.2 --locked
cargo install mdbook-tera --version 0.6.0 --locked   # 仅当 book.toml 用了 tera 时

# 启动（在 book.toml 所在目录）
cd {输出目录}
mdbook serve

# 访问
# http://127.0.0.1:3000
```

> **替代方案**：若没装 Rust 工具链，从 https://github.com/rust-lang/mdBook/releases 下载预编译二进制；预处理器同理从对应 GitHub Releases 下载。

### 版本兼容性（重要）

crates.io 上 `mdbook` 最新版是 0.5.x（2025 年发布），但 0.5 大重构了 preprocessor 的 IPC 协议，**mdbook-toc / mdbook-tera 等生态包目前都不兼容 0.5.x**。运行时症状：

- `unknown field multilingual` → book.toml 用了 0.4 字段，0.5 不识别
- `Unable to parse the input` → preprocessor 与 mdbook 版本不匹配
- `invalid type: null, expected any valid TOML value` → mdbook 0.5 + 旧版 preprocessor 的 JSON 协议错位

**解决**：pin 到 `mdbook 0.4.52` + `mdbook-toc 0.14.2`（或更早的 0.4 系列）+ `mdbook-tera 0.6.0`。0.4.52 是 0.4 系列最新稳定版。

如果原项目 book.toml 用了 0.5 才有的字段，反过来：升级 preprocessor 或编辑 book.toml 适配 0.5。

## 构建产物（部署时用）

```bash
mdbook build              # 产物在 book/ 目录（[output.html] 默认）
```

部署到子路径时（如 GitHub Pages 的 `/dg-docs-cn/{项目名}/`），mdBook 默认用相对路径，**通常无需改 `book.toml`**。若发现资源 404，可在 `[output.html]` 段加 `site-url = "/dg-docs-cn/{项目名}/"`。

## 常见陷阱

| 陷阱 | 应对 |
|------|------|
| `SUMMARY.md` 没列出的 md 文件不会被构建 | 翻译前检查 SUMMARY 是否覆盖所有 md；新增 md 必须同步加进 SUMMARY |
| mdBook 用 `<br/>` 等 HTML 标签时遵循 CommonMark | 翻译时保留 HTML 标签结构 |
| `documentation.toml` 等数据文件被 preprocessor 引用 | **不翻译**——这些是结构化数据，由 preprocessor 在构建时拼装到 md 中。若需要本地化其中的 description 等字段，单独处理（属扩展工作）|
| 项目自带 `theme/` 目录覆盖默认主题 | `.hbs` 模板里的英文文字若必须翻译，作为失败项报告给用户（不在本 skill 范围）|
| `mdbook serve` 端口被占（3000） | 用 `mdbook serve -p 3001` 换端口 |
