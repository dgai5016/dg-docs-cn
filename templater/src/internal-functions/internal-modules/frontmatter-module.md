# Frontmatter 模块

{{ tp.frontmatter.description }}

<!-- toc -->

## 文档

### `tp.frontmatter.<frontmatter_variable_name>` 

获取文件的 frontmatter 变量值。

如果你的 frontmatter 变量名包含空格，可以使用方括号语法来引用：

````
<% tp.frontmatter["variable name with spaces"] %>
````

## 示例

假设你有如下文件：

````
---
alias: myfile
note type: seedling
---

file content
````

那么可以使用下面的模板：

````
File's metadata alias: <% tp.frontmatter.alias %>
Note's type: <% tp.frontmatter["note type"] %>
````

对于 frontmatter 中的列表，可以使用 JavaScript 数组的原型方法来控制数据的显示方式。

```
---
categories:
  - book
  - movie
---
```

```
<% tp.frontmatter.categories.map(prop => `  - "${prop}"`).join("\n") %>
```