# 字段类型

Dataview 中的所有字段都有一个**类型**，它决定了 Dataview 如何渲染、排序以及操作该字段。
关于如何创建字段，请参阅["添加元数据"](add-metadata.md)；关于自动可用的信息，请参阅[页面元数据](./metadata-pages.md)和[任务与列表元数据](./metadata-tasks.md)。

## 为什么类型很重要？

Dataview 提供了大量[函数](../reference/functions.md)，可用于修改你的元数据并编写各种复杂查询。某些函数需要特定的数据类型才能正确工作。这意味着字段的类型决定了你能对这些字段使用哪些函数，以及这些函数的具体行为。此外，根据类型不同，Dataview 渲染出的输出也可能不同。

大多数时候你不需要过分担心字段的类型，但当你想要对数据进行计算或其他高级操作时，了解类型就很重要了。

!!! example "根据类型不同而呈现不同的渲染"
    假设你有如下文件：
    ~~~yaml
    date1:: 2021-02-26T15:15
    date2:: 2021-04-17 18:00

    ```dataview
    TABLE date1, date2
    WHERE file = this.file
    ```
    ~~~

    你会看到如下输出（具体取决于 Dataview 的 Date + Time Format 设置）：

    | File (1) | date1 | date2 |
    | -------- | ----- | ----- |
    | Untitled 2 | 3:15 PM - February 26, 2021 | 2021-04-17 18:00 |

    `date1` 被识别为 **Date**，而 `date2` 对 Dataview 而言只是普通 **Text**，因此 `date1` 的解析方式与 `date2` 不同。详情见下方的 [Date](#date)。

## 可用的字段类型

Dataview 提供多种字段类型，覆盖常见的使用场景。

### Text

默认的兜底类型。如果一个字段没有匹配上更具体的类型，它就是纯文本。

```markdown
Example:: This is some normal text.
```

!!! hint "多行文本"
    多行文本作为字段值只能通过 YAML Frontmatter 和管道符（pipe operator）实现：
    ```yaml
    ---
    poem: |
      Because I could not stop for Death,
      He kindly stopped for me;
      The carriage held but just ourselves
      And Immortality.
    author: "[[Emily Dickinson]]"
    title: "Because I could not stop for Death"
    ---
    ```
    对于内联字段而言，换行就意味着值的结束。

### Number

数字，例如 '6' 和 '3.6'。
```markdown
Example:: 6
Example:: 2.4
Example:: -80
```

在 YAML Frontmatter 中，数字不需要加引号：

```yaml
---
rating: 8
description: "A nice little horror movie"
---
```

### Boolean

布尔值只有两个取值：true 或 false，即编程意义上的布尔类型。

```markdown
Example:: true
Example:: false
```

### Date

符合 ISO8601 格式的文本会被自动转换为日期对象。[ISO8601](https://en.wikipedia.org/wiki/ISO_8601) 遵循 `YYYY-MM[-DDTHH:mm:ss.nnn+ZZ]` 的格式。月份之后的所有部分都是可选的。

```markdown
Example:: 2021-04 
Example:: 2021-04-18
Example:: 2021-04-18T04:19:35.000
Example:: 2021-04-18T04:19:35.000+06:30
```

查询这些日期时，你可以通过以下属性访问日期的某个具体部分：

- field.year
- field.month
- field.weekyear
- field.week
- field.weekday
- field.day
- field.hour
- field.minute
- field.second
- field.millisecond

例如，如果你想知道某个日期所在的月份，可以通过 `datefield.month` 访问：

~~~markdown
birthday:: 2001-06-11

```dataview
LIST birthday
WHERE birthday.month = date(now).month
```
~~~

将返回本月所有的生日。想了解 `date(now)`？请参阅 [字面量](../reference/literals.md#dates)。

!!! info "日期对象的显示"
    Dataview 会以人类可读的格式渲染日期对象，例如 `3:15 PM - February 26, 2021`。你可以在 Dataview 设置的 "General" 下通过 "Date Format" 和 "Date + Time Format" 调整该格式。如果只想在某次查询中调整格式，请使用 [dateformat 函数](../reference/functions.md#dateformatdatedatetime-string)。

### Duration

持续时间是形如 `<time> <unit>` 的文本，例如 `6 hours` 或 `4 minutes`。常见的英文缩写如 `6hrs` 或 `2m` 也可以被识别。你可以在一个字段中指定多个单位，例如 `6hr 4min`，也可使用逗号分隔：`6 hours, 4 minutes`。

```markdown
Example:: 7 hours
Example:: 16days
Example:: 4min
Example:: 6hr7min
Example:: 9 years, 8 months, 4 days, 16 hours, 2 minutes
Example:: 9 yrs 8 min
```

完整的可识别为持续时间的值列表请见 [字面量](../reference/literals.md#durations)。

!!! hint "日期与持续时间的计算"
    Date 和 Duration 类型彼此兼容。这意味着你可以将一个持续时间加到日期上，从而得到一个新的日期：
    ~~~markdown
    departure:: 2022-10-07T15:15
    length of travel:: 1 day, 3 hours

    **Arrival**: `= this.departure + this.length-of-travel`
    ~~~

    而对日期做减法会得到一个持续时间：
    ~~~markdown
    release-date:: 2023-02-14T12:00
      
    `= this.release-date - date(now)` until release!!
    ~~~

    想了解 `date(now)`？请参阅 [字面量](../reference/literals.md#dates)。

### Link

Obsidian 链接，例如 `[[Page]]` 或 `[[Page|Page Display]]`。

```markdown
Example:: [[A Page]]
Example:: [[Some Other Page|Render Text]]
```

!!! info "YAML Frontmatter 中的链接"
    如果你在 frontmatter 中引用链接，需要加上引号，写成 `key: "[[Link]]"`。这是 Obsidian 默认支持的行为。不加引号的链接会导致 YAML frontmatter 无效，从而无法再被解析。
    ```yaml
    ---
    parent: "[[parentPage]]"
    ---
    ```
    请注意，此时它只在 Dataview 中被视为链接，对 Obsidian 而言不再是链接——这意味着它不会出现在出链中、不会显示在图谱视图中、也不会在重命名等操作中被更新。

### List

列表是多值字段。在 YAML 中，它们以普通 YAML 列表的形式定义：
```yaml
---
key3: [one, two, three]
key4:
 - four
 - five
 - six
---
```

在内联字段中，它们是以逗号分隔的值列表：

```markdown
Example1:: 1, 2, 3
Example2:: "yes", "or", "no"
```

请注意，在内联字段中，你需要将**文本值用引号包起来**才能被识别为列表（参见 `Example2`）。`yes, or, no` 会被识别为纯文本。

!!! info "同一文件中重复的元数据键会被合并为列表"
    如果你在同一笔记中两次或多次使用同一个元数据键，Dataview 会收集所有值并返回一个列表。例如
    ~~~markdown
    grocery:: flour
    [...]
    grocery:: soap

    ```dataview
    LIST grocery
    WHERE file = this.file
    ```
    ~~~
    将返回由 `flour` 和 `soap` 组成的**列表**。

!!! hint "数组就是列表"
    在本文档的某些地方你会看到"array（数组）"这个词。Array 是 JavaScript 中列表的称呼——Lists 和 Arrays 是同一回事。一个需要数组作为参数的函数，需要的也就是一个列表作为参数。

### Object

对象是在一个父字段下由多个字段构成的映射。它们只能在 YAML frontmatter 中通过 YAML 的对象语法来定义：
```yaml
---
obj:
  key1: "Val"
  key2: 3
  key3: 
    - "List1"
    - "List2"
    - "List3"
---
```

  在查询中，你可以通过 `obj.key1` 等方式访问这些子值：

~~~markdown
```dataview
TABLE obj.key1, obj.key2, obj.key3
WHERE file = this.file
```
~~~
