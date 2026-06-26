# 表达式

Dataview 查询语言中的**表达式（expressions）**指的是任何能够产生一个值的语法构造，包括：

- 所有 [字段](../annotation/add-metadata.md)
- 所有 [字面量](./literals.md)
- 以及计算值，例如 `field - 9` 或 [函数调用](./functions.md)。

简而言之，除了 [查询类型](../queries/query-types.md) 和 [数据命令](../queries/data-commands.md) 之外的内容，都属于表达式。

下面是 DQL 中被视为**表达式**的高层级概览：

```
# Literals
1                   (number)
true/false          (boolean)
"text"              (text)
date(2021-04-18)    (date)
dur(1 day)          (duration)
[[Link]]            (link)
[1, 2, 3]           (list)
{ a: 1, b: 2 }      (object)

# Lambdas
(x1, x2) => ...     (lambda)

# References
field               (directly refer to a field)
simple-field        (refer to fields with spaces/punctuation in them like "Simple Field!")
a.b                 (if a is an object, retrieve field named 'b')
a[expr]             (if a is an object or array, retrieve field with name specified by expression 'expr')
f(a, b, ...)        (call a function called `f` on arguments a, b, ...)

# Arithmetic
a + b               (addition)
a - b               (subtraction)
a * b               (multiplication)
a / b               (division)
a % b               (modulo / remainder of division)

# Comparison
a > b               (check if a is greater than b)
a < b               (check if a is less than b)
a = b               (check if a equals b)
a != b              (check if a does not equal b)
a <= b              (check if a is less than or equal to b)
a >= b              (check if a is greater than or equal to b)

# Strings

a + b               (string concatenation)
a * num             (repeat string <num> times)

# Special Operations
[[Link]].value      (fetch `value` from page `Link`)
```

下面对每种表达式进行更详细的说明。

## 表达式类型

### 作为表达式的字段

最简单的表达式就是直接引用某个字段。如果你有一个名为 "duedate" 的字段，那么你可以直接用名字 `duedate` 来引用它。

~~~
```dataview
TABLE duedate, class, field-with-space
```
~~~

!!! info "包含空格和标点的字段名"
    如果字段名包含空格、标点或其他非字母/数字字符，你可以使用 Dataview 的简化名称来引用它。简化规则是：全部转为小写，并将空格替换为 "-"。例如，`this is a field` 变为 `this-is-a-field`；`Hello!` 变为 `hello`，以此类推。更多信息请参阅 [字段名](../annotation/add-metadata.md#field-names)。

### 字面量

字面量指的是常量值，比如 `1`、`"hello"` 或 `date(som)`（"月初"）。Dataview 支持的每种数据类型都有对应的字面量，详情请参阅 [这里](./literals.md)。

~~~
```dataview
LIST
WHERE file.name = "Scribble"
```
~~~

### 算术运算

你可以使用标准算术运算符来组合字段：加法（`+`）、减法（`-`）、乘法（`*`）和除法（`/`）。例如，`field1 + field2` 是一个计算两个字段之和的表达式。

~~~
```dataview
TABLE start, end, (end - start) - dur(8 h) AS "Overtime" 
FROM #work
```

```dataview
TABLE hrs / 24 AS "days"
FROM "30 Projects"
```
~~~

### 比较运算

你可以使用多种比较运算符对大多数值进行比较：`<`、`>`、`<=`、`>=`、`=`、`!=`。比较的结果是一个布尔值 true 或 false，可用于查询的 `WHERE` 块中。

~~~
```dataview
LIST
FROM "Games"
WHERE price > 10
```

```dataview
TASK
WHERE due <= date(today)
```

```dataview
LIST
FROM #homework
WHERE status != "done"
```
~~~

!!! hint "比较不同类型"
    将不同的[数据类型](../annotation/types-of-metadata.md)相互比较可能会产生预期之外的结果。以第二个示例为例：如果 `due` 未设置（无论在页面还是任务层级均未定义），那么它就是 `null`，而 `null <= date(today)` 会返回 true，于是会把所有没有 due 日期的任务都包含进来。如果不希望出现这种情况，可以加上类型检查，确保你始终在比较相同类型：
    ~~~
    ```dataview
    TASK
    WHERE typeof(due) = "date" AND due <= date(today)
    ```
    ~~~
    多数情况下，通过 `WHERE due AND due <= date(today)` 检查元数据是否存在已经足够，但检查类型是获得可预期结果的更安全做法。

### 列表/对象索引

你可以通过索引运算符 `list[<index>]` 从[列表/数组](../annotation/types-of-metadata.md#list)中取值，其中 `<index>` 可以是任意可计算的表达式。
列表从 0 开始计数，因此第一个元素的索引是 0，第二个是 1，以此类推。
例如 `list("A", "B", "C")[0] = "A"`。

[对象](../annotation/types-of-metadata.md#object)使用类似的写法。
你可以用 `field["nestedfield"]` 来引用对象或其他类似嵌套结构内部的字段。
例如，在下方定义的 YAML 中，我们可以通过 `episode_metadata["previous"]` 引用 `previous`。
```yaml
---
aliases:
  - "ABC"
current_episode: "S01E03"
episode_metadata:
  previous: "S01E02"
  next: "S01E04"
---
```

你也可以使用索引运算符从对象中取值（对象将文本映射到数据值），只是此时索引是字符串/文本而非数字。
你也可以使用简写形式 `object.<name>`，其中 `<name>` 是要取值的名称。
对于上面的 frontmatter 示例，我们也可以用 `episode_metadata.previous` 得到相同的值。

索引表达式同样适用于那些字段名不被查询语言直接支持的对象。
一个典型例子是 `where`，因为它本身是关键字。
如果你的 frontmatter/元数据中包含名为 `where` 的字段，你可以通过 `row` 语法来引用它：`row["where"]`。
更多信息请参阅 [FAQ 中的说明](../resources/faq.md#how-do-i-use-fields-with-the-same-name-as-keywords-like-from-where) 以及 [对应的 issue](https://github.com/blacksmithgu/obsidian-dataview/issues/1164)。

~~~
```dataview
TABLE id, episode_metadata.next, aliases[0]
```
~~~

### 函数调用

Dataview 提供了多种用于处理数据的函数，完整说明见 [函数文档](functions.md)。它们的一般语法是 `function(arg1, arg2, ...)`，例如 `lower(file.name)` 或 `regexmatch("A.+", file.folder)`。

~~~
```dataview
LIST
WHERE contains(file.name, "WIP")
```

```dataview
LIST
WHERE string(file.day.year) = split(this.file.name, "-W")[0]
```
~~~

### Lambda

Lambda 是一种高级字面量，允许你定义一个接收若干输入并产生一个输出的函数。
其一般形式为：

```
(arg1, arg2, arg3, ...) => <expression using args>
```

Lambda 常被用于 `reduce` 和 `map` 等高级运算符中，以实现复杂的数据转换。下面是几个示例：

```
(x) => x.field                  (return field of x, often used for map)
(x, y) => x + y                 (sum x and y)
(x) => 2 * x                    (double x)
(value) => length(value) = 4    (return true if value is length 4)
```

~~~
```dataview
CALENDAR file.day
FLATTEN all(map(file.tasks, (x) => x.completed)) AS "allCompleted"
WHERE !allCompleted
```
~~~

---

## 类型相关的交互与值

大多数 Dataview 类型都与运算符有特殊的交互方式，或者可以通过索引运算符获取额外的字段。这一点对[日期](../annotation/types-of-metadata.md#date)、[持续时间](../annotation/types-of-metadata.md#duration)以及链接都同样成立。更多关于日期和持续时间的内容，请参阅 [元数据类型](../annotation/types-of-metadata.md) 中对应的章节。

### 链接

你可以"穿透"链接进行索引，从而获取对应页面上的值。例如 `[[Assignment Math]].duedate` 会从页面 `Assignment Math` 中获取 `duedate` 的值。

!!! note "表达式中的链接索引"
    如果你定义的链接是一个内联字段或 frontmatter 字段，例如 `Class:: [[Math]]`，而你想获取其 `timetable` 字段，那么应写成 `Class.timetable` 来进行索引。
    如果写成 `[[Class]].timetable`，则会去查找字面名为 `Class` 的页面，而不是 `Math`！
