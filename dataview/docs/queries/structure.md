# 查询的结构

Dataview 提供了[多种方式](dql-js-inline.md)来编写查询，每种方式的语法各不相同。

本页面介绍如何编写 **Dataview 查询语言**（**DQL**）查询。如果你想了解如何编写内联查询，请参阅 [DQL、JS 与内联查询中的内联部分](dql-js-inline.md#inline-dql)。关于 **JavaScript 查询**的更多信息，请参阅 [JavaScript 参考](../api/intro.md)。

**DQL** 是一种类似 SQL 的查询语言，用于对你的数据创建不同的视图或进行计算。它支持：

- 选择输出的**输出格式**（即[查询类型](./query-types.md)）
- **从某个[数据源](../reference/sources.md)**获取页面，例如标签、文件夹或链接
- 通过对字段的简单操作（如比较、存在性检查等）来**筛选页面/数据**
- 对字段进行**变换**以便显示，例如通过计算或拆分多值字段
- 基于字段对结果进行**排序**
- 基于字段对结果进行**分组**
- **限制**结果数量

!!! warning "与 SQL 的差异"
    如果你已经熟悉 SQL，请阅读[与 SQL 的差异](differences-to-sql.md)，以避免将 DQL 与 SQL 混淆。

下面我们来看看如何使用 DQL。

## DQL 查询的通用格式

每个查询都遵循相同的结构，由以下部分组成：

- 恰好一个**查询类型**，根据查询类型的不同可以带有零个、一个或多个[字段](../annotation/add-metadata.md)
- 零个或一个 **FROM** 数据命令，可以带有一个或多个[数据源](../reference/sources.md)
- 零个到多个其他**数据命令**，每个命令可以带有一个或多个[表达式](../reference/expressions.md)和/或其他信息，具体取决于数据命令

从整体来看，一个查询符合以下模式：

~~~
```dataview
<QUERY-TYPE> <fields>
FROM <source>
<DATA-COMMAND> <expression>
<DATA-COMMAND> <expression>
          ...
```
~~~

!!! hint "只有查询类型是必填项。"

下面的章节将更详细地解释这些理论。

## 选择输出格式

查询的输出格式由其**查询类型**决定。共有四种可选：

1. **TABLE**：以表格形式展示结果，每个结果占一行，可以包含一列或多列字段数据。
2. **LIST**：以项目符号列表形式展示匹配查询的页面。可以在每个页面的文件链接旁边输出一个字段。
3. **TASK**：以可交互的任务列表形式展示匹配给定查询的任务。
4. **CALENDAR**：以日历视图展示，每个匹配项通过其在对应日期上的圆点来呈现。

查询类型是**查询中唯一必填的命令**，其他所有部分都是可选的。

!!! attention "示例可能消耗较多内存"
    根据 vault 的规模不同，执行下面的示例可能需要较长时间，在极端情况下甚至会导致 Obsidian 卡死。建议你指定一个 `FROM`，将查询执行范围限制在 vault 文件的特定子集中。详见下一节。

~~~
以项目符号列表形式列出 vault 中的所有页面
```dataview
LIST
```

列出 vault 中所有的任务（无论是否已完成）
```dataview
TASK
```

渲染一个日历视图，其中每个页面以圆点的形式标注在其创建日期上
```dataview
CALENDAR file.cday
```

展示一张包含 vault 中所有页面的表格，显示 due 字段值、文件标签以及多值字段 working-hours 的平均值
```dataview
TABLE due, file.tags AS "tags", average(working-hours)
```
~~~

!!! info "如需了解可用的查询类型及其使用方法，请阅读[这里](./query-types.md)。"

## 选择数据源

除了查询类型之外，你还可以使用多种**数据命令**来帮助你限制、细化、排序或分组查询结果。其中之一就是 **FROM** 语句。`FROM` 接受一个[数据源](../reference/sources.md)或多个[数据源](../reference/sources.md)的组合作为参数，并将查询范围限制为与你的数据源相匹配的页面集合。

它与其他数据命令的行为不同：你可以在查询中添加**零个或一个** `FROM` 数据命令，且必须紧跟在查询类型之后。你不能添加多个 FROM 语句，也不能将它放在其他数据命令之后。

~~~
列出 Books 文件夹及其子文件夹中的所有页面
```dataview
LIST
FROM "Books"
```

列出所有带有标签 #status/open 或 #status/wip 的页面
```dataview
LIST
FROM #status/open OR #status/wip
```

列出所有同时带有标签 #assignment 并且位于文件夹 "30 School"（或其子文件夹）内的页面，或者位于文件夹 "30 School/32 Homeworks" 内并且在 School Dashboard Current To Dos 页面中被链接到的页面
```dataview
LIST
FROM (#assignment AND "30 School") OR ("30 School/32 Homeworks" AND outgoing([[School Dashboard Current To Dos]]))
```

~~~

!!! info "更多关于 `FROM` 的内容请阅读[这里](./data-commands.md#from)。"

## 筛选、排序、分组或限制结果

除了查询类型和上文介绍的 **数据命令** `FROM` 之外，你还可以使用多种其他**数据命令**来帮助你限制、细化、排序或分组查询结果。

除 `FROM` 外的所有数据命令都可以**按任意顺序多次使用**（只要它们位于查询类型和 `FROM` 之后，前提是你使用了 `FROM`）。它们会按照书写的顺序被执行。

可用的命令包括：

1. **FROM**：详见[上文](#choose-your-source)。
2. **WHERE**：根据**位于**笔记内部的信息（即元数据字段）来筛选笔记。
3. **SORT**：根据某个字段和方向对结果进行排序。
4. **GROUP BY**：将多个结果按组归并，每组对应一行结果。
5. **LIMIT**：将查询的结果数量限制为给定的数目。
6. **FLATTEN**：根据某个字段或计算，将一条结果拆分为多条结果。

~~~

列出所有具有 `due` 元数据字段、并且 `due` 在今天之前的页面
```dataview
LIST
WHERE due AND due < date(today)
```

列出 vault 中带有标签 #status/open 的、最近创建的 10 个页面
```dataview
LIST
FROM #status/open
SORT file.ctime DESC
LIMIT 10
```

以可交互任务列表的形式列出 vault 中最久远的 10 个未完成任务，按所在文件分组，并按文件从旧到新排序
```dataview
TASK
WHERE !completed
SORT created ASC
LIMIT 10
GROUP BY file.link
SORT rows.file.ctime ASC
```

~~~

!!! info "如需了解更多可用的[数据命令](./data-commands.md)。"

## 示例

下面是一些示例查询。更多示例请见[这里](../resources/examples.md)。

~~~
```dataview
TASK
```
~~~

~~~
```dataview
TABLE recipe-type AS "type", portions, length
FROM #recipes
```
~~~

~~~
```dataview
LIST
FROM #assignments
WHERE status = "open"
```
~~~

~~~
```dataview
TABLE file.ctime, appointment.type, appointment.time, follow-ups
FROM "30 Protocols/32 Management"
WHERE follow-ups
SORT appointment.time
```
~~~

~~~
```dataview
TABLE L.text AS "My lists"
FROM "dailys"
FLATTEN file.lists AS L
WHERE contains(L.author, "Surname")
```
~~~

~~~
```dataview
LIST rows.c
WHERE typeof(contacts) = "array" AND contains(contacts, [[Mr. L]])
SORT length(contacts)
FLATTEN contacts as c
SORT link(c).age ASC
```
~~~
