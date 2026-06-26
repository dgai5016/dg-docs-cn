# 命令

## 命令类型

[Templater](https://github.com/SilentVoid13/Templater) 定义了 2 种起始标签，对应 2 种 **命令**：

- `<%`：插值命令。会输出其中表达式的执行结果。
- `<%*`：[JavaScript 执行命令](./execution-command.md)。会执行其中的 JavaScript 代码，默认不输出任何内容。

命令的结束标签始终相同：`%>`

## 命令工具

除了不同类型的命令外，你还可以使用命令工具。命令工具同样声明在命令的起始标签里，所有工具都适用于所有命令类型。可用的命令工具有：

- [空白控制](./whitespace-control.md)
- [动态命令](./dynamic-command.md)

