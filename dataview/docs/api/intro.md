# 概览

Dataview 的 JavaScript API 允许你执行任意的 JavaScript 代码，并访问 Dataview 的索引和查询引擎，这对于构建复杂的视图，或者与其他插件进行交互非常有用。该 API 有两种使用形式：面向插件的形式，以及面向用户的形式（也就是「内联 API 使用」）。

## 内联访问

你可以通过如下方式创建一个「DataviewJS」代码块：

~~~
```dataviewjs
dv.pages("#thing")...
```
~~~

在这种代码块中执行的代码可以访问 `dv` 变量，它提供了与代码块相关的全部 Dataview API（例如 `dv.table()`、`dv.pages()` 等等）。更多信息请查阅[代码块 API 参考](code-reference.md)。

## 插件访问

你可以通过 `app.plugins.plugins.dataview.api`（从其他插件或控制台中）访问 Dataview 插件 API；该 API 与代码块形式的参考类似，但由于缺少执行查询时所参照的当前文件，参数会略有不同。更多信息请查阅[插件 API 参考](code-reference.md)。
