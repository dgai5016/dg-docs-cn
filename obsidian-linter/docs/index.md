# 概览

Linter 是一个 [Obsidian.md](https://obsidian.md/) 插件，旨在帮助你让笔记保持更统一的格式。
它允许用户指定要使用的规则和设置，从而尽可能让笔记保持一致。

这包括但不限于影响以下内容的规则：

- YAML frontmatter
- Markdown 标题
- GitHub 风格的脚注
- 常规 Markdown 内容
- 空格
- 在应用内粘贴内容

## 工作原理

Linter 在对文件运行时，会遵循以下基本步骤：

``` mermaid
graph TD
    start[User initiates linting of file or files] --> run-linter-rules
    run-linter-rules[If file is not ignored, run Linter rules and Custom Commands*] --> handle-error
    handle-error{Did an error happen?} -- No --> update-file
    handle-error -- Yes --> log-error
    log-error[Display error and log to dev console] --> done
    update-file[Update file contents**] --> done
    done[Done]
```

!!! Note
    *目前自定义命令仅在 lint 单个文件时运行。

    **这里做了简化：实际上文件在运行完 Linter 规则之后、运行自定义命令之前就会被更新（前提是未发生错误）。

### 1. 用户对一个或多个文件发起 lint

用户可以通过多种方式启动 Linter。操作的范围可以从单个文件，到一个文件夹及其子文件夹，再到整个仓库。这些操作可以通过多种方式触发，详见[运行规则](usage/running-rules.md)。

### 2. 如果文件未被忽略，则运行 Linter 规则和自定义命令

Linter 会检查它要 lint 的文件是否位于被忽略的文件夹中（详见[这里](usage/disabling-rules.md#ignoring-a-folder)）。如果是，则跳过该文件。如果文件未被忽略，则会从 YAML frontmatter 中读取已禁用的规则（详见[这里](usage/disabling-rules.md#yaml-frontmatter)）。

收集到被禁用的规则列表后，规则会按以下顺序运行：

1. 需要在其他规则之前运行的规则
2. 常规规则
3. 自定义正则表达式替换
4. 需要在大多数其他规则之后运行的规则

每条规则运行后会执行一次错误检查，如果发生任何错误，则停止对该文件的 lint。如果运行 Linter 规则期间未发生错误，则文件会被更新，以便为运行自定义命令做好准备，因为自定义命令要求对文件的修改已经写入。

假设 Linter 仅在 lint 单个文件，那么自定义命令会依次运行。每条自定义命令运行后，如果发生错误，lint 将停止。

### 3. 处理任何错误

如果运行 Linter 规则或自定义命令期间发生了任何错误，界面会显示一条通知，并在开发控制台中记录日志。否则，一切就绪。
