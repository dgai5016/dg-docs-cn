# 重构代码

在尝试重构代码或创建概念验证（proof of concept）之前，请确保已按照[配置指南](getting-setup.md)所述将 Linter 配置为本地可用。

## 创建一个 issue

当计划重构大段代码时，请先在仓库中[创建一个 issue](https://github.com/platers/obsidian-linter/issues/new?assignees=&labels=code%20cleanup)，再创建 pull request，这样在动工或要求提交[概念验证](#proof-of-concept)之前，可以先评估所建议的重构方案。这有助于节省所有相关人员的时间。

## 概念验证

对于代码重构或代码清理，可能会要求提供概念验证，它应当是即将进行的重构的一个小示例。它应以 draft pull request 的形式创建。

这类 pull request 应能展示建议的改动思路，而不必花时间把所有代码都改完。它有助于展示建议改动的优点和弱点。

## 代码改动

一旦概念验证（如果被要求）或重构方案获批，就可以创建一个包含建议改动的 [pull request](open-a-pr.md)，或如果 draft pull request 已存在，则将其转换为正式的 pull request。
