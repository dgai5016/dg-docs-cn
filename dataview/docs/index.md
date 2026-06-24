# 概览

Dataview 是一个为个人知识库打造的实时索引与查询引擎。你可以为笔记[**添加元数据**](annotation/add-metadata.md)，然后用 [**Dataview 查询语言**](queries/structure.md)对它们进行**查询**，实现列表、筛选、排序或分组。Dataview 会让查询结果始终保持最新，让数据聚合变得轻而易举。

你可以这样做：

- 在每日笔记中记录睡眠数据，自动生成每周睡眠时间表。
- 自动收集笔记中的书籍链接，并按评分排序展示。
- 自动汇总与今日日期相关的页面，显示在每日笔记中。
- 查找没有标签的笔记以便后续跟进，或者为带有特定标签的页面生成美观的视图。
- 创建动态视图，展示笔记中记录的即将到来的生日或活动。

以及其他更多用法。

!!! hint "Dataview 提供了一种快捷的方式，让你能够对 Vault 中已索引的数据进行搜索、展示和操作！"

Dataview 高度通用且性能出色，即便面对数十万条带注释的笔记也能游刃有余。

如果内置的[查询语言](queries/structure.md)无法满足你的需求，你还可以直接在笔记中通过 [Dataview API](api/intro.md) 运行任意 JavaScript 代码，自行构建所需的任何工具。

!!! info "Dataview 用于展示，而非编辑"
    Dataview 的定位是数据的展示与计算。它不会去修改你的笔记或元数据，始终让它们保持原样（……除非你通过 Dataview 勾选了一项[任务 Task](queries/query-types.md#task)。）

## 如何使用 Dataview

Dataview 由两大核心模块构成：**数据索引**和**数据查询**。

!!! info "更多细节请参阅相关文档页面"
    接下来的章节会给你一个总体概览，告诉你 Dataview 能做什么、怎么做。具体的每个部分请务必访问相关链接页面了解更多细节。

### 数据索引

Dataview 处理的是 Markdown 文件中的元数据。它无法读取你 Vault 中的所有内容，只能读取特定的数据。笔记中的部分内容（例如标签和列表条目，包括任务）会[自动被 Dataview 识别](annotation/add-metadata.md#implicit-fields)。其余的数据你可以通过**字段**来添加，既可以放在文件顶部用 [YAML Frontmatter](annotation/add-metadata.md#frontmatter) 的方式，也可以写在正文中间，使用[内联字段 Inline Fields](annotation/add-metadata.md#inline-fields)，语法是 `[key:: value]`。Dataview 会对这些数据进行_索引_，从而让它们可被查询。

!!! hint "Dataview 会索引[特定信息](annotation/add-metadata.md#implicit-fields)（如标签、列表条目）以及你通过字段添加的数据。只有被索引的数据才能出现在 Dataview 查询结果中！"

举例来说，一个文件可能会是这样的：

```markdown
---
author: "Edgar Allan Poe"
published: 1845
tags: poems
---

# The Raven

Once upon a midnight dreary, while I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore—
```

也可能是这样：

```markdown
#poems

# The Raven

From [author:: Edgar Allan Poe], written in (published:: 1845)

Once upon a midnight dreary, while I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore—
```

就索引到的元数据（也就是你能查询到的数据）而言，这两种写法完全等价，差别仅在于标注方式。至于如何[标注元数据](annotation/add-metadata.md)，完全取决于你个人的偏好。借助上面这个文件，你就可以使用 `author` 这个**元数据字段**，以及 Dataview 自动提供的[隐式字段](annotation/metadata-pages.md)（例如标签、笔记标题）。

!!! attention "数据需要被索引"
    在上面的例子中，诗歌本身_并不_在 Dataview 可查询的范围内：它只是一个段落，既不是元数据字段，也不是 Dataview 会自动索引的内容。它不属于 Dataview 的索引，因此你无法查询到它。

### 数据查询

你可以通过**查询**来访问**已索引的数据**。

编写查询共有**三种方式**：使用 [Dataview 查询语言](queries/dql-js-inline.md#dataview-query-language-dql)、[内联语句 inline statement](queries/dql-js-inline.md#inline-dql)，或者最灵活但也最复杂的方式——[JavaScript 查询](queries/dql-js-inline.md#dataview-js)。

**Dataview 查询语言**（**DQL**）为你提供了一套功能丰富且强大的工具集，可以对数据进行查询、展示和操作。[**内联查询**](queries/dql-js-inline.md#inline-dql)则允许你在笔记的任意位置展示某一个已索引的值，也可以用来做计算。掌握了 **DQL**，在处理数据的旅途中，你可能根本不需要任何 JavaScript 就能搞定一切。

一个 DQL 查询由以下几个部分组成：

- 有且仅有一个[**查询类型 Query Type**](queries/query-types.md)，决定查询输出的形式
- 可选的一个[**FROM 语句**](queries/data-commands.md#from)，用来指定要查看的某个标签、文件夹（或其他[数据源](reference/sources.md)）
- 可选的多个[**其他数据命令 Data Command**](queries/data-commands.md)，用于对输出结果进行筛选、分组和排序

例如，一个查询可以是这样的：

~~~markdown
```dataview
LIST
```
~~~

它会列出你 Vault 中的所有文件。

!!! info "除查询类型外，其他部分都是可选的"
    一个合法的 DQL 查询只需要查询类型即可（如果是 [CALENDAR](queries/query-types.md#calendar)，还需要一个日期字段）。

一个更受限的查询可能是这样的：

~~~markdown
```dataview
LIST
FROM #poems
WHERE author = "Edgar Allan Poe"
```
~~~

它会列出你 Vault 中所有带有 `#poems` 标签、并且拥有一个名为 `author`、值为 `Edgar Allan Poe` 的[字段](annotation/add-metadata.md)的文件。这个查询能找到我们上面的示例页面。

`LIST` 只是你能使用的四种[查询类型](queries/query-types.md)之一。例如用 `TABLE`，我们可以在输出中加入更多信息：

~~~markdown
```dataview
TABLE author, published, file.inlinks AS "Mentions"
FROM #poems
```
~~~

这会给出这样的结果：

| File (3) |	author |	published	| Mentions |
| -------- | ------- | ---------- | -------- |
| The Bells |	Edgar Allan Poe |	1849 |  |	
| The New Colossus |	Emma Lazarus | 1883	| - [[Favorite Poems]] |	
| The Raven |	Edgar Allan Poe |	1845 | - [[Favorite Poems]] |	

不过 Dataview 的能力不止于此。你还可以借助[**函数**](reference/functions.md)对数据进行**操作**。需要注意的是，这些操作仅在查询内部进行——你文件中的**数据始终保持不变**。

~~~markdown
```dataview
TABLE author, date(now).year - published AS "Age in Yrs", length(file.inlinks) AS "Counts of Mentions"
FROM #poems
```
~~~

会返回：

| File (3) |	author |	Age in Yrs	| Count of Mentions |
| -------- | ------- | ---------- | -------- |
| The Bells	|  Edgar Allan Poe |	173 | 0 |
| The New Colossus	| Emma Lazarus |	139 |	1 |
| The Raven |	Edgar Allan Poe |	177 | 1 |	

!!! info "在[这里](resources/examples.md)查看更多示例。"

如你所见，Dataview 不仅能让你快速地聚合数据并保持最新，还能通过运算为你的数据集带来全新的视角。翻阅文档，可以发现更多与数据互动的方式。

祝你探索 Vault 新玩法愉快！

## 资源与帮助

这份文档并不是你数据之旅上唯一的帮手。请查看[资源与支持](./resources/resources-and-support.md)，里面有大量有用的页面和视频。
