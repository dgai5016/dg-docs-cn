# 简介

[Templater](https://github.com/SilentVoid13/Templater) 是一种模板语言，允许你在笔记中插入 **变量** 和 **函数** 的执行结果，还支持运行 JavaScript 代码来操作这些变量和函数。

借助 [Templater](https://github.com/SilentVoid13/Templater)，你可以创建强大的模板来自动化完成各类手工操作。

## 快速示例

下面的模板文件使用了 [Templater](https://github.com/SilentVoid13/Templater) 语法：

```javascript
---
creation date: <% tp.file.creation_date() %>
modification date: <% tp.file.last_modified_date("dddd Do MMMM YYYY HH:mm:ss") %>
---

<< [[<% tp.date.now("YYYY-MM-DD", -1) %>]] | [[<% tp.date.now("YYYY-MM-DD", 1) %>]] >>

# <% tp.file.title %>

<% tp.web.daily_quote() %>
```

 插入后会得到如下结果：

````
---
creation date: 2021-01-07 17:20
modification date: Thursday 7th January 2021 17:20:43
---

<< [[2021-04-08]] | [[2021-04-10]] >>

# Test Test

> Do the best you can until you know better. Then when you know better, do better.
> &mdash; <cite>Maya Angelou</cite>
````
