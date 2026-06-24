# 函数

Dataview 函数提供了更高级的数据处理方式。你可以**在[数据命令](../queries/data-commands.md)中**（FROM 除外）使用函数来过滤或分组，也可以将函数**作为[附加信息](../queries/query-types.md)**（例如 TABLE 的列，或 LIST 查询的额外输出），从而以全新的视角查看数据。

## 函数的工作方式

函数是[表达式](expressions.md)的另一种形式，凡是能用表达式的地方都能用函数。函数始终会返回一个新值，并遵循如下格式：

```
functionname(parameter1, parameter2)
```

参数本身也是[表达式](expressions.md)，你可以使用字面量、元数据字段，甚至是另一个函数作为参数。本页文档会说明每个参数需要具有哪种[数据类型](../annotation/types-of-metadata.md)。请注意函数括号内的说明：方括号中的参数，例如 `link(path, [display])`，表示是*可选的*，可以省略。每个函数的默认行为请参见各自的说明。

## 对值列表调用函数

大多数函数既可以作用于单个值（如 `number`、`string`、`date` 等），也可以作用于这些值组成的列表。如果将函数作用于列表，那么它会对列表中的每个元素应用该函数，并返回一个列表。例如：

```js
lower("YES") = "yes"
lower(["YES", "NO"]) = ["yes", "no"]

replace("yes", "e", "a") = "yas"
replace(["yes", "ree"], "e", "a") = ["yas", "raa"]
```

这种所谓的"函数向量化（function vectorization）"在下文的函数定义中不再单独说明，它对绝大多数函数都隐式可用。

## 构造器

用于创建值的构造器。

### `object(key1, value1, ...)`

使用给定的键和值创建一个新对象。在调用时，键和值应当交替出现，且键始终应为字符串/文本。

```js
object() => empty object
object("a", 6) => object which maps "a" to 6
object("a", 4, "c", "yes") => object which maps a to 4, and c to "yes"
```

### `list(value1, value2, ...)`

使用给定值创建一个新列表。`array` 可作为 `list` 的别名。

```js
list() => empty list
list(1, 2, 3) => list with 1, 2, and 3
array("a", "b", "c") => list with "a", "b", and "c"
```

### `date(any)`

在可能的情况下，从给定的字符串、日期或链接对象解析出一个日期，否则返回 null。

```js
date("2020-04-18") = <date object representing April 18th, 2020>
date([[2021-04-16]]) = <date object for the given page, referring to file.day>
```

### `date(text, format)`

按照指定格式将文本解析为 luxon 的 `DateTime`。注意本地化格式可能无法正常工作。
使用 [Luxon tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens)。

```js
date("12/31/2022", "MM/dd/yyyy") => DateTime for December 31th, 2022
date("210313", "yyMMdd") => DateTime for March 13th, 2021
date("946778645000", "x") => DateTime for "2000-01-02T03:04:05"
```

### `dur(any)`

从给定的字符串或持续时间解析出一个持续时间，失败时返回 null。

```js
dur(8 minutes) = <8 minutes>
dur("8 minutes, 4 seconds") = <8 minutes, 4 seconds>
dur(dur(8 minutes)) = dur(8 minutes) = <8 minutes>
```

### `number(string)`

从给定字符串中提取出第一个数字并返回。如果字符串中没有数字，则返回 null。

```js
number("18 years") = 18
number(34) = 34
number("hmm") = null
```

### `string(any)`

将任意值转换为"合理"的字符串表示。有时结果不如直接在查询中使用该值美观——它主要用于把日期、持续时间、数字等强制转换为字符串以便进一步处理。

```js
string(18) = "18"
string(dur(8 hours)) = "8 hours"
string(date(2021-08-15)) = "August 15th, 2021"
```

### `link(path, [display])`

根据给定的文件路径或名称构造一个链接对象。如果提供两个参数，第二个参数即为该链接的显示名称。

```js
link("Hello") => link to page named 'Hello'
link("Hello", "Goodbye") => link to page named 'Hello', displays as 'Goodbye'
```

### `embed(link, [embed?])`

将链接对象转换为嵌入式链接；Dataview 视图对嵌入式链接的支持尚不完善，但图片嵌入应当可以正常工作。

```js
embed(link("Hello.png")) => embedded link to the "Hello.png" image, which will render as an actual image.
```

### `elink(url, [display])`

构造一个指向外部 URL（例如 `www.google.com`）的链接。如果提供两个参数，第二个参数即为该链接的显示名称。

```js
elink("www.google.com") => link element to google.com
elink("www.google.com", "Google") => link element to google.com, displays as "Google"
```

### `typeof(any)`

获取任意对象的类型以便检查。可与其他运算符结合使用，根据类型改变行为。

```js
typeof(8) => "number"
typeof("text") => "string"
typeof([1, 2, 3]) => "array"
typeof({ a: 1, b: 2 }) => "object"
typeof(date(2020-01-01)) => "date"
typeof(dur(8 minutes)) => "duration"
```

---

## 数值运算

### `round(number, [digits])`

将数字四舍五入到指定的小数位数。如果未指定第二个参数，则舍入到最接近的整数；否则舍入到指定的小数位数。

```js
round(16.555555) = 17
round(16.555555, 2) = 16.56
```

### `trunc(number)`

截断（"切掉"）数字的小数部分。

```js
trunc(12.937) = 12
trunc(-93.33333) = -93
trunc(-0.837764) = 0
```

### `floor(number)`

始终向下舍入，返回小于或等于给定数字的最大整数。
这意味着负数会变得更"负"。

```js
floor(12.937) = 12
floor(-93.33333) = -94
floor(-0.837764) = -1
```

### `ceil(number)`

始终向上舍入，返回大于或等于给定数字的最小整数。
这意味着负数会变得不那么"负"。

```js
ceil(12.937) = 13
ceil(-93.33333) = -93
ceil(-0.837764) = 0
```

### `min(a, b, ..)`

计算一组参数（或一个数组）中的最小值。

```js
min(1, 2, 3) = 1
min([1, 2, 3]) = 1

min("a", "ab", "abc") = "a"
```

### `max(a, b, ...)`

计算一组参数（或一个数组）中的最大值。

```js
max(1, 2, 3) = 3
max([1, 2, 3]) = 3

max("a", "ab", "abc") = "abc"
```

### `sum(array)`

对数组中的所有数值求和。如果求和的值中存在 null，可通过 `nonnull` 函数将其排除。

```js
sum([1, 2, 3]) = 6
sum([]) = null

sum(nonnull([null, 1, 8])) = 9
```

### `product(array)`

计算一组数字的乘积。如果参与计算的值中存在 null，可通过 `nonnull` 函数将其排除。

```js
product([1,2,3]) = 6
product([]) = null

product(nonnull([null, 1, 2, 4])) = 8
```

### `reduce(array, operand)`

将列表归约为单个值的通用函数，有效的运算符包括 `"+"`、`"-"`、`"*"`、`"/"` 以及布尔运算符 `"&"` 和 `"|"`。注意，使用 `"+"` 和 `"*"` 等同于 `sum()` 和 `product()` 函数，使用 `"&"` 和 `"|"` 则等同于 `all()` 和 `any()`。

```js
reduce([100, 20, 3], "-") = 77
reduce([200, 10, 2], "/") = 10
reduce(values, "*") = Multiplies every element of values, same as product(values)
reduce(values, this.operand) = Applies the local field operand to each of the values
reduce(["⭐", 3], "*") = "⭐⭐⭐", same as "⭐" * 3

reduce([1]), "+") = 1, has the side effect of reducing the list into a single element
```

### `average(array)`

计算数值型数值的平均值。如果参与平均的值中存在 null，可通过 `nonnull` 函数将其排除。

```js
average([1, 2, 3]) = 2
average([]) = null

average(nonnull([null, 1, 2])) = 1.5
```

### `minby(array, function)`

使用给定函数计算数组中的最小值。

```js
minby([1, 2, 3], (k) => k) = 1
minby([1, 2, 3], (k) => 0 - k) => 3

minby(this.file.tasks, (k) => k.due) => (earliest due)
```

### `maxby(array, function)`

使用给定函数计算数组中的最大值。

```js
maxby([1, 2, 3], (k) => k) = 3
maxby([1, 2, 3], (k) => 0 - k) = 1

maxby(this.file.tasks, (k) => k.due) => (latest due)
```

--

## 对象、数组与字符串操作

用于操作容器对象内部值的运算。

### `contains()` 及其相关函数

下面是一些快速示例：

```js
contains("Hello", "Lo") = false
contains("Hello", "lo") = true

icontains("Hello", "Lo") = true
icontains("Hello", "lo") = true

econtains("Hello", "Lo") = false
econtains("Hello", "lo") = true
econtains(["this","is","example"], "ex") = false
econtains(["this","is","example"], "is") = true
```

#### `contains(object|list|string, value)`

检查给定容器类型中是否包含给定的值。该函数会根据第一个参数是对象、列表还是字符串，表现出细微的差异。
本函数区分大小写。

- 对于对象，检查对象是否具有给定名称的键。例如：
    ```
    contains(file, "ctime") = true
    contains(file, "day") = true (if file has a date in its title, false otherwise)
    ```
- 对于列表，检查数组中是否有任何元素等于给定值。例如：
    ```
    contains(list(1, 2, 3), 3) = true
    contains(list(), 1) = false
    ```
- 对于字符串，检查给定值是否是字符串的子串（即包含在其中）。
    ```
    contains("hello", "lo") = true
    contains("yes", "no") = false
    ```

#### `icontains(object|list|string, value)`

`contains()` 的不区分大小写版本。

#### `econtains(object|list|string, value)`

"精确包含（Exact contains）"，检查字符串/列表中是否能找到精确匹配。
本函数区分大小写。

- 对于字符串，其行为与 [`contains()`](#containsobjectliststring-value) 完全相同。
    ```
    econtains("Hello", "Lo") = false
    econtains("Hello", "lo") = true
    ```

- 对于列表，检查列表中是否存在该精确词。
    ```
    econtains(["These", "are", "words"], "word") = false
    econtains(["These", "are", "words"], "words") = true
    ```

- 对于对象，检查对象中是否存在精确的键名。它**不会**进行递归检查。
    ```
    econtains({key:"value", pairs:"here"}, "here") = false
    econtains({key:"value", pairs:"here"}, "key") = true
    econtains({key:"value", recur:{recurkey: "val"}}, "value") = false
    econtains({key:"value", recur:{recurkey: "val"}}, "Recur") = false
    econtains({key:"value", recur:{recurkey: "val"}}, "recurkey") = false
    ```

### `containsword(list|string, value)`

检查 `string` 或 `list` 中是否存在与 `value` 精确匹配的词。
本函数不区分大小写。
针对不同类型的输入，输出也不同，参见示例。

- 对于字符串，检查给定字符串中是否存在该词。
    ```
    containsword("word", "word") = true
    containsword("word", "Word") = true
    containsword("words", "Word") = false
    containsword("Hello there!", "hello") = true
    containsword("Hello there!", "HeLLo") = true
    containsword("Hello there chaps!", "chap") = false
    containsword("Hello there chaps!", "chaps") = true
    ```

- 对于列表，返回一个布尔列表，表示是否找到了该词的不区分大小写精确匹配。
    ```
    containsword(["I have no words.", "words"], "Word") = [false, false]
    containsword(["word", "Words"], "Word") = [true, false]
    containsword(["Word", "Words in word"], "WORD") = [true, true]
    ```

### `extract(object, key1, key2, ...)`

从对象中提取多个字段，构造一个只包含这些字段的新对象。

```
extract(file, "ctime", "mtime") = object("ctime", file.ctime, "mtime", file.mtime)
extract(object("test", 1)) = object()
```

### `sort(list)`

对列表进行排序，返回排序后的新列表。

```
sort(list(3, 2, 1)) = list(1, 2, 3)
sort(list("a", "b", "aa")) = list("a", "aa", "b")
```

### `reverse(list)`

反转列表，返回反转后的新列表。

```
reverse(list(1, 2, 3)) = list(3, 2, 1)
reverse(list("a", "b", "c")) = list("c", "b", "a")
```

### `length(object|array)`

返回对象中字段的数量，或数组中元素的数量。

```
length([]) = 0
length([1, 2, 3]) = 3
length(object("hello", 1, "goodbye", 2)) = 2
```

### `nonnull(array)`

返回一个移除了所有 null 值的新数组。

```
nonnull([]) = []
nonnull([null, false]) = [false]
nonnull([1, 2, 3]) = [1, 2, 3]
```

### `firstvalue(array)`

以单个元素的形式返回数组中第一个非 null 的值。可用于在任务/列表项的子项中挑选第一个已定义的字段，例如 `firstvalue(children.myField)`。

```js
firstvalue([null, 1, 2]) => 1
firstvalue(children.myField) => If children.myField equals [null, null, "myValue", null], it would return "myValue"
```

### `all(array)`

仅当数组中**所有**值都为真时返回 `true`。你也可以向该函数传入多个参数，此时仅当所有参数都为真时才返回 `true`。

```
all([1, 2, 3]) = true
all([true, false]) = false
all(true, false) = false
all(true, true, true) = true
```

你可以传入一个函数作为第二个参数，仅当数组中所有元素都满足该谓词时才返回 true。

```
all([1, 2, 3], (x) => x > 0) = true
all([1, 2, 3], (x) => x > 1) = false
all(["apple", "pie", 3], (x) => typeof(x) = "string") = false
```

### `any(array)`

只要数组中**任意一个**值为真，就返回 `true`。你也可以向该函数传入多个参数，此时只要任意一个参数为真就返回 `true`。

```
any(list(1, 2, 3)) = true
any(list(true, false)) = true
any(list(false, false, false)) = false
any(true, false) = true
any(false, false) = false
```

你可以传入一个函数作为第二个参数，只要数组中任意一个元素满足该谓词就返回 true。

```
any(list(1, 2, 3), (x) => x > 2) = true
any(list(1, 2, 3), (x) => x = 0) = false
```

### `none(array)`

仅当数组中**没有**任何值为真时返回 `true`。

```
none([]) = true
none([false, false]) = true
none([false, true]) = false
none([1, 2, 3]) = false
```

你可以传入一个函数作为第二个参数，仅当数组中没有任何元素满足该谓词时才返回 true。

```
none([1, 2, 3], (x) => x = 0) = true
none([true, true], (x) => x = false) = true
none(["Apple", "Pi", "Banana"], (x) => startswith(x, "A")) = false
```

### `join(array, [delimiter])`

将数组中的元素连接为一个单一字符串（即把它们都渲染到同一行）。如果提供第二个参数，则每个元素会以给定的分隔符隔开。

```
join(list(1, 2, 3)) = "1, 2, 3"
join(list(1, 2, 3), " ") = "1 2 3"
join(6) = "6"
join(list()) = ""
```

### `filter(array, predicate)`

根据谓词对数组中的元素进行过滤，返回由匹配元素组成的新列表。

```js
filter([1, 2, 3], (x) => x >= 2) = [2, 3]
filter(["yes", "no", "yas"], (x) => startswith(x, "y")) = ["yes", "yas"]
```

### `unique(array)`

创建一个仅包含唯一值的新数组。

```js
unique([1, 3, 7, 3, 1]) => [1, 3, 7]
```

### `map(array, func)`

将函数应用到数组中的每个元素，返回映射结果组成的列表。

```js
map([1, 2, 3], (x) => x + 2) = [3, 4, 5]
map(["yes", "no"], (x) => x + "?") = ["yes?", "no?"]
```

### `flat(array, [depth])`

将数组的子层级连接到所需的深度。默认深度为 1 层，但可以连接多层。例如，可用于在执行 `GROUP BY` 后降低 `rows` 列表的数组深度。

```js
flat(list(1, 2, 3, list(4, 5), 6)) => list(1, 2, 3, 4, 5, 6)
flat(list(1, list(21, 22), list(list (311, 312, 313))), 4) => list(1, 21, 22, 311, 312, 313)
flat(rows.file.outlinks)) => All the file outlinks at first level in output
```

### `slice(array, [start, [end]])`

返回数组某一部分的浅拷贝，组成一个新数组对象，选取范围从 `start` 到 `end`（不含 `end`），其中 `start` 和 `end` 表示数组中元素的索引。

```js
slice([1, 2, 3, 4, 5], 3) = [4, 5] => All items from given position, 0 as first
slice(["ant", "bison", "camel", "duck", "elephant"], 0, 2) = ["ant", "bison"] => First two items
slice([1, 2, 3, 4, 5], -2) = [4, 5] => counts from the end, last two items
slice(someArray) => a copy of someArray
```

---

## 字符串操作

### `regextest(pattern, string)`

检查给定正则表达式是否能在字符串中找到匹配（使用 JavaScript 正则引擎）。

```js
regextest("\w+", "hello") = true
regextest(".", "a") = true
regextest("yes|no", "maybe") = false
regextest("what", "what's up dog?") = true
```

### `regexmatch(pattern, string)`

检查给定正则表达式是否匹配**整个**字符串，使用 JavaScript 正则引擎。
它与 `regextest` 的区别在于：regextest 可以只匹配文本的某一部分。

```js
regexmatch("\w+", "hello") = true
regexmatch(".", "a") = true
regexmatch("yes|no", "maybe") = false
regexmatch("what", "what's up dog?") = false
```

### `regexreplace(string, pattern, replacement)`

将 `string` 中所有匹配**正则** `pattern` 的地方替换为 `replacement`。底层使用 JavaScript 的 replace 方法，因此你可以使用 `$1` 之类的特殊字符来引用第一个捕获组，以此类推。

```js
regexreplace("yes", "[ys]", "a") = "aea"
regexreplace("Suite 1000", "\d+", "-") = "Suite -"
```

### `replace(string, pattern, replacement)`

将 `string` 中所有出现 `pattern` 的地方替换为 `replacement`。

```js
replace("what", "wh", "h") = "hat"
replace("The big dog chased the big cat.", "big", "small") = "The small dog chased the small cat."
replace("test", "test", "no") = "no"
```

### `lower(string)`

将字符串转换为全小写。

```js
lower("Test") = "test"
lower("TEST") = "test"
```

### `upper(string)`

将字符串转换为全大写。

```js
upper("Test") = "TEST"
upper("test") = "TEST"
```

### `split(string, delimiter, [limit])`

按给定的分隔符字符串拆分字符串。如果提供第三个参数，则限制拆分的次数。分隔符字符串会被解释为正则表达式。如果分隔符中包含捕获组，匹配到的内容会被拼接到结果数组中，未匹配的捕获则是空字符串。


```js
split("hello world", " ") = list("hello", "world")
split("hello  world", "\s") = list("hello", "world")
split("hello there world", " ", 2) = list("hello", "there")
split("hello there world", "(t?here)") = list("hello ", "there", " world")
split("hello there world", "( )(x)?") = list("hello", " ", "", "there", " ", "", "world")
```

### `startswith(string, prefix)`

检查字符串是否以给定前缀开头。

```js
startswith("yes", "ye") = true
startswith("path/to/something", "path/") = true
startswith("yes", "no") = false
```

### `endswith(string, suffix)`

检查字符串是否以给定后缀结尾。

```js
endswith("yes", "es") = true
endswith("path/to/something", "something") = true
endswith("yes", "ye") = false
```

### `padleft(string, length, [padding])`

通过在左侧添加填充字符，将字符串补齐到所需长度。如果省略填充字符，默认使用空格。

```js
padleft("hello", 7) = "  hello"
padleft("yes", 5, "!") = "!!yes"
```

### `padright(string, length, [padding])`

与 `padleft` 等价，但在右侧填充。

```js
padright("hello", 7) = "hello  "
padright("yes", 5, "!") = "yes!!"
```

### `substring(string, start, [end])`

对字符串进行切片，从 `start` 开始、到 `end` 结束（未指定时则到字符串末尾）。

```js
substring("hello", 0, 2) = "he"
substring("hello", 2, 4) = "ll"
substring("hello", 2) = "llo"
substring("hello", 0) = "hello"
```

### `truncate(string, length, [suffix])`

将字符串截断为最多给定长度（包括 `suffix`，默认为 `...`）。通常用于在表格中截断过长的文本。

```js
truncate("Hello there!", 8) = "Hello..."
truncate("Hello there!", 8, "/") = "Hello t/"
truncate("Hello there!", 10) = "Hello t..."
truncate("Hello there!", 10, "!") = "Hello the!"
truncate("Hello there!", 20) = "Hello there!"
```

## 实用函数

### `default(field, value)`

如果 `field` 为 null，则返回 `value`；否则返回 `field`。适用于用默认值替换 null 值。例如，要展示尚未完成的项目，可以将其默认值设为 `"incomplete"`：

```js
default(dateCompleted, "incomplete")
```

default 对两个参数都做了向量化；如果你需要对列表参数显式地使用 default，请使用 `ldefault`，它与 default 相同但不会向量化。

```js
default(list(1, 2, null), 3) = list(1, 2, 3)
ldefault(list(1, 2, null), 3) = list(1, 2, null)
```

### `display()`

display 函数会将输入转换为字符串表示，同时尽量保留数据类型的显示属性。
这意味着链接和 URL 会被替换为它们的显示值。


```js
display("Hello World") = "Hello World"
display("**Hello** World") = "Hello World"
display("[Hello](https://example.com) [[World]]") = "Hello World"
display(link("path/to/file.md")) = "file"
display(link("path/to/file.md", "displayname")) = "displayname"
display(date("2024-11-18")) = "November 18, 2024"
display(list("Hello", "World")) = "Hello, World"
```

### `choice(bool, left, right)`

一种基础的 if 语句——如果第一个参数为真，则返回 left；否则返回 right。

```js
choice(true, "yes", "no") = "yes"
choice(false, "yes", "no") = "no"
choice(x > 4, y, z) = y if x > 4, else z
```

### `hash(seed, [text], [variant])`

基于 `seed`，以及可选的附加 `text` 或一个 `number` 形式的 variant 来生成哈希。该函数会基于这些参数的组合生成一个固定数值，可用于随机化文件或列表/任务的排序顺序。如果你选择基于某个日期（例如 "2024-03-17"）或其他时间戳（例如 "2024-03-17 19:13"）作为 `seed`，就可以让这种"随机性"相对于该时间戳保持固定。`variant` 是一个数字，在某些情况下需要它来让 `text` 与 `variant` 的组合变得唯一。

```js
hash(dateformat(date(today), "YYYY-MM-DD"), file.name) = ... A unique value for a given date in time
hash(dateformat(date(today), "YYYY-MM-DD"), file.name, position.start.line) = ... A unique "random" value in a TASK query
```

此函数可用于 `SORT` 语句以随机化顺序。如果你使用的是 `TASK` 查询，由于多个任务的文件名可能相同，可以追加一些数字（例如起始行号，如上所示）使其成为唯一组合。如果使用类似 `FLATTEN file.lists as item` 的写法，对应的做法是把 `item.position.start.line` 作为最后一个参数。

### `striptime(date)`

去掉日期的时间部分，仅保留年、月、日。适合在你不在意时间时进行日期比较。

```js
striptime(file.ctime) = file.cday
striptime(file.mtime) = file.mday
```

### `dateformat(date|datetime, string)`

使用格式化字符串对 Dataview 日期进行格式化。使用 [Luxon tokens](https://moment.github.io/luxon/#/formatting?id=table-of-tokens)。

```js
dateformat(file.ctime,"yyyy-MM-dd") = "2022-01-05"
dateformat(file.ctime,"HH:mm:ss") = "12:18:04"
dateformat(date(now),"x") = "1407287224054"
dateformat(file.mtime,"ffff") = "Wednesday, August 6, 2014, 1:07 PM Eastern Daylight Time"
```

**注意：** `dateformat()` 返回的是字符串而不是日期，因此不能将它与 `date()` 的返回值或 `file.day` 这样已经是日期的变量直接比较。要进行此类比较，可以同时对两个参数进行格式化。

### `durationformat(duration, string)`

使用格式化字符串对 Dataview 持续时间进行格式化。
单引号内的内容不会被当作 token 处理，而是按原样输出。参见示例。

可用的 token 如下：

- `S` 表示毫秒
- `s` 表示秒
- `m` 表示分钟
- `h` 表示小时
- `d` 表示天
- `w` 表示周
- `M` 表示月
- `y` 表示年

```js
durationformat(dur("3 days 7 hours 43 seconds"), "ddd'd' hh'h' ss's'") = "003d 07h 43s"
durationformat(dur("365 days 5 hours 49 minutes"), "yyyy ddd hh mm ss") = "0001 000 05 49 00"
durationformat(dur("2000 years"), "M months") = "24000 months"
durationformat(dur("14d"), "s 'seconds'") = "1209600 seconds"
```

### `currencyformat(number, [currency])`

根据你当前的 locale，按照 [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes) 中的 `currency` 代码来呈现数字。

```
number = 123456.789
currencyformat(number, "EUR") =  €123,456.79  in locale: en_US)
currencyformat(number, "EUR") =  123.456,79 € in locale: de_DE)
currencyformat(number, "EUR") =  € 123 456,79 in locale: nb)
```

### `localtime(date)`

将固定时区的日期转换为当前时区的日期。

### `meta(link)`

获取一个包含链接元数据的对象。当你直接在链接上访问某个属性时，得到的是链接指向文件中该属性的值。`meta` 函数使得访问链接自身的属性成为可能。

`meta` 返回的对象上有若干属性：

#### `meta(link).display`

获取链接的显示文本；如果链接没有定义显示文本，则返回 null。

```js
meta([[2021-11-01|Displayed link text]]).display = "Displayed link text"
meta([[2021-11-01]]).display = null
```

#### `meta(link).embed`

根据链接是否为嵌入链接返回 true 或 false。嵌入链接是指以感叹号开头的链接，例如 `![[Some Link]]`。

#### `meta(link).path`

获取链接的路径部分。

```js
meta([[My Project]]).path = "My Project"
meta([[My Project#Next Actions]]).path = "My Project"
meta([[My Project#^9bcbe8]]).path = "My Project"
```

#### `meta(link).subpath`

获取链接的子路径。对于指向文件内标题的链接，子路径就是该标题的文本；对于指向块的链接，子路径就是块 ID。如果上述两种情况都不适用，则子路径为 null。

```js
meta([[My Project#Next Actions]]).subpath = "Next Actions"
meta([[My Project#^9bcbe8]]).subpath = "9bcbe8"
meta([[My Project]]).subpath = null
```

这可用于选取特定标题下的任务。

````
```dataview
task
where meta(section).subpath = "Next Actions"
```
````

#### `meta(link).type`

根据链接是指向整个文件、文件内的标题，还是文件内的块，取值为 "file"、"header" 或 "block"。

```js
meta([[My Project]]).type = "file"
meta([[My Project#Next Actions]]).type = "header"
meta([[My Project#^9bcbe8]]).type = "block"
```
