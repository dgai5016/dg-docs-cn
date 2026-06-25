# 用户函数

你可以在 Templater 中定义自己的函数。

用户函数分为两类：

- [用户脚本函数](./script-user-functions.md)
- [系统命令用户函数](./system-user-functions.md)

## 调用用户函数

调用用户函数使用常规的函数调用语法：`tp.user.<user_function_name>()`，其中 `<user_function_name>` 是你定义的函数名。

例如，如果你定义了一个名为 `echo` 的系统命令用户函数，完整的命令调用会是：

```js
<% tp.user.echo() %>
```

## 不支持移动端

目前用户函数在 Obsidian 移动端不可用。
