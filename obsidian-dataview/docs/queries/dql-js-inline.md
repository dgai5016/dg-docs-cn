# DQL、JS 与内联查询

当你[为相关页面添加了有用的数据](../annotation/add-metadata.md)之后，接下来你会想要把它显示出来，或者基于它做一些计算。Dataview
提供了四种不同的方式来实现这一点，它们都是以代码块的形式直接写在 Markdown 中，并且会在 vault 发生变化时实时重新加载。

## Dataview 查询语言（DQL）

[**Dataview 查询语言**](structure.md)（简称 **DQL**）是一种类 SQL 的语言，也是 Dataview 的核心功能。它支持[四种查询类型](./query-types.md)来生成不同的输出，支持[数据命令](./data-commands.md)来细化、重排或分组你的结果，还提供[丰富的函数](../reference/functions.md)，允许你进行大量的运算和调整，从而得到想要的输出。

!!! warning "与 SQL 的差异"
    如果你已经熟悉 SQL，请阅读[与 SQL 的差异](differences-to-sql.md)，以避免将 DQL 与 SQL 混淆。

你可以使用以 `dataview` 作为类型的代码块来创建一个 **DQL** 查询：

~~~
```dataview
TABLE rating AS "Rating", summary AS "Summary" FROM #games
SORT rating DESC
```
~~~

!!! attention "请使用反引号"
    一个合法的代码块需要在起始和结束位置使用反引号（\`），各三个。请不要把反引号与外观相似的撇号 ' 混淆！

关于如何编写 DQL 查询的说明，请见[查询语言参考](structure.md)。如果你更倾向于通过示例来学习，可以查看[查询示例](../resources/examples.md)。

## 内联 DQL（Inline DQL）

内联 DQL 使用内联代码块的格式，而不是代码块，并通过一个可配置的前缀来将此内联代码块标记为 DQL 块。

~~~
`= this.file.name`
~~~

!!! info "更改 DQL 前缀"
    你可以在 Dataview 设置中的 "Codeblock Settings" > "Inline Query Prefix" 下，将 `=` 更改为其他符号（例如 `dv:` 或 `~`）。

内联 DQL 查询会在笔记中的某个位置显示**恰好一个值**。它们可以无缝融入你的笔记内容：

~~~markdown
Today is `= date(today)` - `= [[exams]].deadline - date(today)` until exams!
~~~

例如，它会被渲染为

~~~markdown
Today is November 07, 2022 - 2 months, 5 days until exams!
~~~

**内联 DQL** 查询始终只显示一个值，而不会显示值的列表（或表格）。你可以通过 `this.` 前缀访问**当前页面**的属性，或通过 `[[linkToPage]].` 前缀访问其他页面的属性。

~~~markdown
`= this.file.name`
`= this.file.mtime`
`= this.someMetadataField`
`= [[secondPage]].file.name`
`= [[secondPage]].file.mtime`
`= [[secondPage]].someMetadataField`
~~~

你可以在内联 DQL 查询中使用所有可用的[表达式](../reference/expressions.md)和[字面量](../reference/literals.md)，包括[函数](../reference/functions.md)。但查询类型和数据命令在内联查询中**不可用**。

~~~markdown
Assignment due in `= this.due - date(today)`
Final paper due in `= [[Computer Science Theory]].due - date(today)`

🏃‍♂️ Goal reached? `= choice(this.steps > 10000, "YES!", "**No**, get moving!")`

You have `= length(filter(link(dateformat(date(today), "yyyy-MM-dd")).file.tasks, (t) => !t.completed))` tasks to do. `= choice(date(today).weekday > 5, "Take it easy!", "Time to get work done!")`
~~~

## Dataview JS

Dataview 的 [JavaScript API](../api/intro.md) 让你拥有 JavaScript 的全部能力，并提供了一套 DSL 用于获取 Dataview 数据和执行查询，使你能够创建任意复杂的查询和视图。与查询语言类似，你可以通过以 `dataviewjs` 标注的代码块来创建 Dataview JS 块：

~~~java
```dataviewjs
let pages = dv.pages("#books and -#books/finished").where(b => b.rating >= 7);
for (let group of pages.groupBy(b => b.genre)) {
   dv.header(3, group.key);
   dv.list(group.rows.file.name);
}
```
~~~

在 JS dataview 块内部，你可以通过 `dv` 变量访问完整的 Dataview API。关于你能用它做些什么，请参阅 [API 文档](../api/code-reference.md)或 [API 示例](../api/code-examples.md)。

!!! attention "进阶用法"
    编写 JavaScript 查询是一项进阶技术，需要具备编程和 JS 的相关知识。请注意，JS 查询可以访问你的文件系统，在使用他人编写的 JS 查询时要格外谨慎，尤其是当这些查询并非通过 Obsidian 社区公开分享的时候。

## 内联 Dataview JS

与查询语言类似，你也可以编写 JS 内联查询，从而直接嵌入一个被计算出的 JS 值。你可以通过内联代码块来创建 JS 内联查询：

```
`$= dv.current().file.mtime`
```

在内联 DataviewJS 中，你可以像在 `dataviewjs` 代码块中一样访问 `dv` 变量，并可以进行所有相同的调用。其结果应当是一个可求值为 JavaScript 值的表达式，Dataview 会自动以合适的方式将其渲染出来。

与内联 DQL 查询不同，内联 JS 查询可以使用 Dataview JS 查询所能使用的一切功能，因此可以查询并输出多个页面。

!!! info "更改内联 JS 前缀"
    你可以在 Dataview 设置中的 "Codeblock Settings" > "Javascript Inline Query Prefix" 下，将 `$=` 更改为其他符号（例如 `dvjs:` 或 `$~`）
