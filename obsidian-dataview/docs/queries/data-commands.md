# 数据命令

Dataview 查询可以由各种不同的命令组成。命令会按书写的顺序执行，并且你可以重复使用同一种命令（例如多个 `WHERE` 块或多个 `GROUP BY` 块）。

## FROM

`FROM` 语句决定了最初会被收集并传递给其他命令以进一步筛选的页面。你可以从任何[数据源](../reference/sources.md)中进行选择，目前支持按文件夹、按标签、按入链/出链进行选择。

- **标签**：要从某个标签（及其所有子标签）中选择，使用 `FROM #tag`。
- **文件夹**：要从某个文件夹（及其所有子文件夹）中选择，使用 `FROM "folder"`。
- **单个文件**：要从单个文件中选择，使用 `FROM "path/to/file"`。
- **链接**：你可以选择指向某文件的链接，也可以选择某文件中的所有链接。
  - 要获取所有链接到 `[[note]]` 的页面，使用 `FROM [[note]]`。
  - 要获取 `[[note]]` 所链接到的所有页面（即该文件中的所有链接），使用 `FROM outgoing([[note]])`。

你可以使用 `and` 和 `or` 组合这些筛选条件，从而得到更复杂的数据源。

- 例如，`#tag and "folder"` 将返回 `folder` 中且带有 `#tag` 的所有页面。
- `[[Food]] or [[Exercise]]` 会返回链接到 `[[Food]]` 或 `[[Exercise]]` 的所有页面。

你还可以使用 `-` 对数据源进行"取反"，从而获得与数据源不匹配的所有内容：

- `-#tag` 会排除带有该标签的文件。
- `#tag and -"folder"` 只会包含带有 `#tag` 标签且不在 `"folder"` 中的文件。

## WHERE

根据字段对页面进行筛选。只有当子句求值结果为 `true` 的页面才会被输出。

```
WHERE <clause>
```

1. 获取在过去 24 小时内被修改过的所有文件：

    ```sql
    LIST WHERE file.mtime >= date(today) - dur(1 day)
    ```

2. 查找所有未标记为完成且已超过一个月的项目：

    ```sql
    LIST FROM #projects
    WHERE !completed AND file.ctime <= date(today) - dur(1 month)
    ```

## SORT

按一个或多个字段对所有结果进行排序。

```
SORT date [ASCENDING/DESCENDING/ASC/DESC]
```

你还可以指定多个排序字段。排序会先依据第一个字段进行。如果出现并列，则使用第二个字段对并列项进行排序。如果仍然并列，则由第三个字段来决定，依此类推。

```
SORT field1 [ASCENDING/DESCENDING/ASC/DESC], ..., fieldN [ASC/DESC]
```

## GROUP BY

根据某个字段对所有结果进行分组。每个唯一的字段值会对应一行输出，该行具有 2 个属性：一个是所分组所依据的字段对应的值，另一个是 `rows` 数组字段，其中包含所有匹配的页面。

```
GROUP BY field
GROUP BY (computed_field) AS name
```

为了更方便地操作 `rows` 数组，Dataview 支持"字段提取"（field swizzling）。如果你想要获取 `rows` 数组中每个对象的 `test` 字段，那么 `rows.test` 会自动从 `rows` 中的每个对象里取出 `test` 字段，并返回一个新数组。
随后你可以对该结果数组应用诸如 `sum()` 或 `flat()` 等聚合运算。

## FLATTEN

将每行中的数组展开，使数组中的每个元素各产生一条结果行。

```
FLATTEN field
FLATTEN (computed_field) AS name
```

例如，将每篇文献笔记中的 `authors` 字段展开，使每位作者各占一行：

=== "查询"
    ```sql
    TABLE authors FROM #LiteratureNote
    FLATTEN authors
    ```
=== "输出"
    |File|authors|
    |-|-|
    |stegEnvironmentalPsychologyIntroduction2018 SN|Steg, L.|
    |stegEnvironmentalPsychologyIntroduction2018 SN|Van den Berg, A. E.|
    |stegEnvironmentalPsychologyIntroduction2018 SN|De Groot, J. I. M.|
    |Soap Dragons SN|Robert Lamb|
    |Soap Dragons SN|Joe McCormick|
    |smithPainAssaultSelf2007 SN|Jonathan A. Smith|
    |smithPainAssaultSelf2007 SN|Mike Osborn|

这种用法在你想要更方便地使用一个深度嵌套的列表时非常有用。
例如 `file.lists` 或 `file.tasks`。
注意，虽然最终结果略有不同（分组的与非分组的），但下面的查询写起来更简单。
你可以使用 `GROUP BY file.link` 来得到完全相同的结果，但需要按照前面所述使用 `rows.T.text`。

```
table T.text as "Task Text"
from "Scratchpad"
flatten file.tasks as T
where T.text
```

```
table filter(file.tasks.text, (t) => t) as "Task Text"
from "Scratchpad"
where file.tasks.text
```

`FLATTEN` 让操作嵌套列表变得更加容易，因为展开后你可以使用更简单的 where 条件，而不必使用 `map()` 或 `filter()` 这类函数。

## LIMIT

将结果限制为最多 N 个值。

```
LIMIT 5
```

命令会按照书写的顺序进行处理，因此下面的写法会在结果*已经*被限制之后再进行排序：

```
LIMIT 5
SORT date ASCENDING
```
