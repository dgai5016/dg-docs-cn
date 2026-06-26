# 常见问题

本页汇总了 Dataview 查询和表达式语言相关的常见问题。

### 如何使用与关键字（如 "from"、"where"）同名的字段？

Dataview 提供了一个特殊的「伪」字段 `row`，你可以通过索引它来获取那些与 Dataview 关键字冲突的字段：

```javascript
row.from /* 等同于 "from" */
row.where /* 等同于 "where" */
```


### 如何访问名称中带有空格的字段？

有两种方式：

1. 使用 Dataview 规范化后的字段名——只需将名称转换为小写，并把空格替换为连字符（"-"）。例如 `Field With Space In It` 会变为 `field-with-space-in-it`。
2. 使用隐式 `row` 字段：
    ```javascript
    row["Field With Space In It"]
    ```

### 有可供学习的资源清单吗？

有的！请参阅 [资源](../resources/resources-and-support.md) 页面。

### 可以保存查询结果以便复用吗？

你可以通过 [dv.view](../api/code-reference.md#dvviewpath-input) 函数编写可复用的 JavaScript 查询。在 DQL 中，除了可以将查询写在模板里并通过模板复用（既可以使用[核心插件 Templates](https://help.obsidian.md/Plugins/Templates)，也可以使用广受欢迎的社区插件 [Templater](https://obsidian.md/plugins?id=templater-obsidian)）之外，你还可以**通过 [内联 DQL](../queries/dql-js-inline.md#inline-dql) 将计算结果保存到元数据字段中**，例如：

```markdown
start:: 07h00m
end:: 18h00m
pause:: 01h30m
duration:: `= this.end - this.start - this.pause`
```

随后你就可以在 TABLE 中列出该值（本例中为 9h 30m），无需重复计算：

~~~markdown
```dataview
TABLE start, end, duration
WHERE duration
```
~~~

结果如下

| File (1)	| start| 	end| 	duration|
| ---- | ----- | ------ |  ----- |
| Example | 7 hours	| 18 hours| 	9 hours, 30 minutes |

**但是把内联 DQL 存入字段存在一个限制**：虽然结果中显示的是计算后的值，但**元数据字段里实际保存的仍然是你的内联 DQL 计算表达式**。该值在字面上就是 `= this.end - this.start - this.pause`。这意味着你无法像下面这样根据内联查询的结果进行筛选：

~~~markdown
```dataview
TABLE start, end, duration
WHERE duration > dur("10h")
```
~~~

这条查询依然会返回 Example 页面，即使结果并不满足 `WHERE` 条件——因为你比较的值是 `= this.end - this.start - this.pause`，并不是一个时长（duration）。

### 如何隐藏 TABLE 查询的结果计数？

从 Dataview 0.5.52 起，你可以通过设置隐藏 TABLE 和 TASK 查询的结果计数。进入 Dataview 的设置 -> Display result count 即可。

### 如何为我的查询自定义样式？

你可以使用 [CSS 片段](https://help.obsidian.md/Extending+Obsidian/CSS+snippets)在 Obsidian 中统一定义自定义样式。例如，如果你将 `cssclasses: myTable` 定义为一个属性，并启用下面的片段，就可以为 Dataview 表格设置背景色。类似地，若要针对 `TASK` 或 `LIST` 查询外层的 `<ul>` 元素，可以分别使用 `ul.contains-task-list` 或 `ul.list-view-ul`。

```css
.myTable dataview.table {
    background-color: green
}
```

一般情况下，同一个页面上的某个具体表格并不会被赋予唯一的 ID，因此上述针对样式的设定会作用于所有声明了该 `cssclasses` 的笔记，以及这些笔记中的**所有**表格。目前你无法通过普通查询精确地针对某一个表格设置样式，但如果你使用 JavaScript，可以通过如下方式直接在你的查询结果上添加 `clsname` 类名：

```js
dv.container.className += ' clsname'
```

不过，借助标签你也可以使用一个小技巧来定位 Obsidian 中的任意表格，如下例所示——它会作用于任何包含该标签的表格，无论该表格是手工创建还是由 Dataview 生成。要使下面的片段生效，请在表格输出的任意位置加上 `#myId` 标签。

```css
[href="#myId"] {
    display: none; /* 在表格视图中隐藏该标签 */
}

table:has([href="#myId"]) {
   /* 按你的喜好为表格设置样式 */
  background-color: #262626;
  & tr:nth-child(even) td:first-child{
    background-color: #3f3f3f;
  }
}
```

这段样式会让整张表格呈现灰色背景，并让每个偶数行的第一个单元格呈现另一种灰度。**声明**：我们并非样式大师，这里仅作为示例，展示为表格不同部分编写样式所需的语法。

此外，在 [Style dataview table columns](https://s-blu.github.io/obsidian_dataview_example_vault/20%20Dataview%20Queries/Style%20dataview%20table%20columns/) 一文中，@s-blu 描述了另一种技巧，使用 `<span>` 来为表格单元格（以及列）的不同部分设置样式。
