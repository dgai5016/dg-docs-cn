# 术语

要理解 [Templater](https://github.com/SilentVoid13/Templater) 的工作原理，先定义几个术语：

- **模板（template）** 是一个包含 **[命令](./commands/overview.md)** 的文件。
- 一段以起始标签 `<%` 开头、结束标签 `%>` 结尾的文本片段，我们称之为 **[命令](./commands/overview.md)**。
- **函数（function）** 是可在命令中调用并返回一个值（替换字符串）的对象。

你可以使用两类函数：

- [内部函数（Internal Functions）](./internal-functions/overview.md)：插件内置的 **预定义** 函数。例如 `tp.date.now` 是一个返回当前日期的内部函数。
- [用户函数（User Functions）](./user-functions/overview.md)：用户自定义的函数，分为 [系统命令（System Commands）](./user-functions/system-user-functions.md) 和 [用户脚本（User Scripts）](./user-functions/script-user-functions.md) 两类。

### 示例

下面的模板包含 2 条命令，分别调用了 2 个不同的内部函数：

```
Yesterday: <% tp.date.yesterday("YYYY-MM-DD") %>
Tomorrow: <% tp.date.tomorrow("YYYY-MM-DD") %>
```

下一部分我们将介绍编写命令所需的语法。
