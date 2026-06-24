# 代码块参考

Dataview JavaScript 代码块通过为代码块指定 `dataviewjs` 语言来创建：

~~~
```dataviewjs
dv.table([], ...)
```
~~~

API 通过隐式提供的 `dv`（或 `dataview`）变量来访问，你可以用它查询信息、渲染 HTML，并配置视图。

异步 API 调用以 `⌛` 标注。

## 查询

查询方法允许你从 Dataview 索引中查询页面元数据；要渲染这些数据，请使用 [渲染部分](#render) 中的方法。

### `dv.current()`

获取脚本当前所在页面的页面信息（通过 `dv.page()`）。

### `dv.pages(source)`

接收单个字符串参数 `source`，其形式与[查询语言的数据源](../reference/sources.md)一致。
返回一个由页面对象组成的 [data array](data-array.md)，页面对象是包含所有页面字段的普通对象。

```js
dv.pages() => all pages in your vault
dv.pages("#books") => all pages with tag 'books'
dv.pages('"folder"') => all pages from folder "folder"
dv.pages("#yes or -#no") => all pages with tag #yes, or which DON'T have tag #no
dv.pages('"folder" or #tag') => all pages with tag #tag, or from folder "folder"
```

注意，文件夹在字符串内需要双重引号（即 `dv.pages("folder")` 不起作用，而 `dv.pages('"folder"')` 起作用）——这是为了与查询语言中数据源的写法保持完全一致。

### `dv.pagePaths(source)`

与 `dv.pages` 类似，但只返回匹配给定数据源的页面路径所组成的 [data array](data-array.md)。

```js
dv.pagePaths("#books") => the paths of pages with tag 'books'
```

### `dv.page(path)`

将一个简单的路径或链接映射为完整的页面对象，其中包含该页面的所有字段。会自动进行链接解析，并在缺少扩展名时自动推断。

```js
dv.page("Index") => The page object for /Index
dv.page("books/The Raisin.md") => The page object for /books/The Raisin.md
```

## 渲染

### `dv.el(element, text)`

将任意文本渲染到指定的 HTML 元素中。
```js
dv.el("b", "This is some bold text");
```

你可以通过 `cls` 指定要添加到元素上的自定义类，通过 `attr` 指定额外的属性：

```js
dv.el("b", "This is some text", { cls: "dataview dataview-class", attr: { alt: "Nice!" } });
```

### `dv.header(level, text)`

用给定文本渲染一个 1 到 6 级的标题。

```js
dv.header(1, "Big!");
dv.header(6, "Tiny");
```

### `dv.paragraph(text)`

将任意文本渲染为一个段落。

```js
dv.paragraph("This is some text");
```

### `dv.span(text)`

将任意文本渲染为一个 span（与段落不同，它上下没有内边距）。

```js
dv.span("This is some text");
```

### `dv.execute(source)`

执行一个任意的 Dataview 查询，并将视图嵌入到当前页面中。

```js
dv.execute("LIST FROM #tag");
dv.execute("TABLE field1, field2 FROM #thing");
```

### `dv.executeJs(source)`

执行一个任意的 DataviewJS 查询，并将视图嵌入到当前页面中。

```js
dv.executeJs("dv.list([1, 2, 3])");
```

### `dv.view(path, input)`

用于自定义视图的复杂函数。它会尝试加载给定路径下的 JavaScript 文件，并将 `dv` 和 `input` 传入让其执行。这样你就可以在多个页面之间复用自定义视图代码。注意这是一个异步函数，因为涉及文件 I/O——请务必 `await` 其结果！


```js
await dv.view("views/custom", { arg1: ..., arg2: ... });
```

如果你想在视图中同时引入自定义 CSS，可以改为传入一个文件夹路径，该文件夹中需包含 `view.js` 和 `view.css`；CSS 会自动被添加到视图中：

```
views/custom
 -> view.js
 -> view.css
```

视图脚本可以访问 `dv` 对象（即 API 对象），以及一个 `input` 对象，后者恰好就是 `dv.view()` 的第二个参数。

请注意，`dv.view()` 无法读取以点号开头的目录，例如 `.views`。错误用法示例：

```js
await dv.view(".views/view1", { arg1: 'a', arg2: 'b' });
```
尝试这样做会抛出如下异常：

```
Dataview: custom view not found for '.views/view1/view.js' or '.views/view1.js'.
```

另外，目录路径始终以 vault 根目录为起点。

#### 示例
在本示例中，我们在 `scripts` 目录下有一个名为 `view1.js` 的自定义脚本文件。

**文件：** `scripts/view1.js`
```js
console.log(`Loading view1`);

function foo(...args) {
  console.log('foo is called with args', ...args);
}
foo(input)
```

我们还有一个位于 `projects` 下的 Obsidian 文档。我们将从该文档中通过 `scripts/view1.js` 路径调用 `dv.view()`。

**文档：** `projects/customViews.md`
```js
await dv.view("scripts/view1", { arg1: 'a', arg2: 'b' }) 
```

执行上述脚本时，将输出如下内容：

```
Loading view1
foo is called with args {arg1: 'a', arg2: 'b'}
```

## Dataviews

### `dv.list(elements)`

渲染一个由元素组成的 dataview 列表；同时接受原生数组和 data array。

```js
dv.list([1, 2, 3]) => list of 1, 2, 3
dv.list(dv.pages().file.name) => list of all file names
dv.list(dv.pages().file.link) => list of all file links
dv.list(dv.pages("#book").where(p => p.rating > 7)) => list of all books with rating greater than 7
```

### `dv.taskList(tasks, groupByFile)`

渲染一个由 `Task` 对象组成的 dataview 列表，这些对象可通过 `page.file.tasks` 获得。默认情况下，该视图会自动按任务所在的源文件进行分组。如果你显式传入 `false` 作为第二个参数，则会将所有任务渲染为一个统一的列表。

```js
// List all tasks from pages marked '#project'
dv.taskList(dv.pages("#project").file.tasks)

// List all *uncompleted* tasks from pages marked #project
dv.taskList(dv.pages("#project").file.tasks
    .where(t => !t.completed))

// List all tasks tagged with '#tag' from pages marked #project
dv.taskList(dv.pages("#project").file.tasks
    .where(t => t.text.includes("#tag")))

// List all tasks from pages marked #project, without grouping.
dv.taskList(dv.pages("#project").file.tasks, false)
```

### `dv.table(headers, elements)`

渲染一个 dataview 表格。`headers` 是一个由列标题组成的数组。`elements` 是一个由行组成的数组。每一行本身又是一个由列组成的数组。在行内，任何作为数组的列都会以项目符号列表的形式渲染。

```js
dv.table(
	["Col1", "Col2", "Col3"],
		[
			["Row1", "Dummy", "Dummy"],
			["Row2", 
				["Bullet1",
				 "Bullet2",
				 "Bullet3"],
			 "Dummy"],
			["Row3", "Dummy", "Dummy"]
		]
	);
```

下面是一个按评分排序、渲染简单书籍信息表格的示例。

```js
dv.table(["File", "Genre", "Time Read", "Rating"], dv.pages("#book")
    .sort(b => b.rating)
    .map(b => [b.file.link, b.genre, b["time-read"], b.rating]))
```

## Markdown Dataviews

这些函数会渲染为纯 Markdown 字符串，你可以根据需要再进行渲染或处理。

### `dv.markdownTable(headers, values)`

等价于 `dv.table()`，使用给定的标题列表和二维元素数组渲染表格，但返回纯 Markdown。

```js
// Render a simple table of book info sorted by rating.
const table = dv.markdownTable(["File", "Genre", "Time Read", "Rating"], dv.pages("#book")
    .sort(b => b.rating)
    .map(b => [b.file.link, b.genre, b["time-read"], b.rating]))

dv.paragraph(table);
```

### `dv.markdownList(values)`

等价于 `dv.list()`，渲染给定元素的列表，但返回纯 Markdown。

```js
const markdown = dv.markdownList([1, 2, 3]);
dv.paragraph(markdown);
```

### `dv.markdownTaskList(tasks)`

等价于 `dv.taskList()`，渲染任务列表，但返回纯 Markdown。

```js
const markdown = dv.markdownTaskList(dv.pages("#project").file.tasks);
dv.paragraph(markdown);
```
 
## Utility

### `dv.array(value)`

将给定值或数组转换为 Dataview 的 [data array](data-array.md)。如果该值本身已经是 data array，则原样返回。

```js
dv.array([1, 2, 3]) => dataview data array [1, 2, 3]
```

### `dv.isArray(value)`

如果给定值是数组或 dataview 数组，则返回 true。

```js
dv.isArray(dv.array([1, 2, 3])) => true
dv.isArray([1, 2, 3]) => true
dv.isArray({ x: 1 }) => false
```

### `dv.fileLink(path, [embed?], [display-name])`

将文本路径转换为 Dataview 的 `Link` 对象；你也可以选择指定该链接是否为嵌入链接，以及它的显示名称。

```js
dv.fileLink("2021-08-08") => link to file named "2021-08-08"
dv.fileLink("book/The Raisin", true) => embed link to "The Raisin"
dv.fileLink("Test", false, "Test File") => link to file "Test" with display name "Test File"
```

### `dv.sectionLink(path, section, [embed?], [display?])`

将文本路径 + 章节名转换为 Dataview 的 `Link` 对象；你也可以选择指定该链接是否为嵌入链接，以及它的显示名称。

```js
dv.sectionLink("Index", "Books") => [[Index#Books]]
dv.sectionLink("Index", "Books", false, "My Books") => [[Index#Books|My Books]]
```

### `dv.blockLink(path, blockId, [embed?], [display?])`

将文本路径 + 块 ID 转换为 Dataview 的 `Link` 对象；你也可以选择指定该链接是否为嵌入链接，以及它的显示名称。

```js
dv.blockLink("Notes", "12gdhjg3") => [[Index#^12gdhjg3]]
```

### `dv.date(text)`

将文本和链接强制转换为 luxon 的 `DateTime`；如果传入的就是 `DateTime`，则原样返回。

```js
dv.date("2021-08-08") => DateTime for August 8th, 2021
dv.date(dv.fileLink("2021-08-07")) => dateTime for August 8th, 2021
```

### `dv.duration(text)`

将文本强制转换为 luxon 的 `Duration`；使用的解析规则与 Dataview 的 duration 类型一致。

```js
dv.duration("8 minutes") => Duration { 8 minutes }
dv.duration("9 hours, 2 minutes, 3 seconds") => Duration { 9 hours, 2 minutes, 3 seconds }
```

### `dv.compare(a, b)`

按照 Dataview 默认的比较规则比较两个任意 JavaScript 值；当你编写自定义比较器并希望回退到默认行为时很有用。当 `a < b` 时返回负值，`a = b` 时返回 0，`a > b` 时返回正值。

```js
dv.compare(1, 2) = -1
dv.compare("yes", "no") = 1
dv.compare({ what: 0 }, { what: 0 }) = 0
```

### `dv.equal(a, b)`

按照 Dataview 默认的比较规则比较两个任意 JavaScript 值，如果相等则返回 true。

```js
dv.equal(1, 2) = false
dv.equal(1, 1) = true
```

### `dv.clone(value)`

深拷贝任意 Dataview 值，包括日期、数组和链接。

```js
dv.clone(1) = 1
dv.clone({ a: 1 }) = { a: 1 }
```

### `dv.parse(value)`

将任意字符串对象解析为复杂的 Dataview 类型
（主要支持链接、日期和持续时间）。

```js
dv.parse("[[A]]") = Link { path: A }
dv.parse("2020-08-14") = DateTime { 2020-08-14 }
dv.parse("9 seconds") = Duration { 9 seconds }
```

## File I/O

这些工具方法都位于 `dv.io` 子 API 中，并且全部是*异步*的（以 ⌛ 标注）。

### ⌛ `dv.io.csv(path, [origin-file])`

从给定路径（链接或字符串）加载 CSV。相对路径会相对于可选的 origin 文件来解析（未提供时默认相对于当前文件）。返回一个 dataview 数组，其中每个元素都是包含 CSV 数据的对象；如果文件不存在，则返回 `undefined`。

```js
await dv.io.csv("hello.csv") => [{ column1: ..., column2: ...}, ...]
```

### ⌛ `dv.io.load(path, [origin-file])`

异步加载给定路径（链接或字符串）的内容。相对路径会相对于可选的 origin 文件来解析（未提供时默认相对于当前文件）。返回文件的字符串内容，若文件不存在则返回 `undefined`。

```js
await dv.io.load("File") => "# File\nThis is an example file..."
```

### `dv.io.normalize(path, [origin-file])`

将相对链接或路径转换为绝对路径。如果提供了 `origin-file`，则解析过程会假定你是从该文件出发解析链接的；如果未提供，则路径相对于当前文件进行解析。

```js
dv.io.normalize("Test") => "dataview/test/Test.md", if inside "dataview/test"
dv.io.normalize("Test", "dataview/test2/Index.md") => "dataview/test2/Test.md", irrespective of the current file
```

## 查询求值

### ⌛ `dv.query(source, [file, settings])`

执行一个 Dataview 查询，并以结构化形式返回结果。
该函数的返回类型会根据所执行的查询类型而变化，但始终是一个带有 `type` 字段（表示返回类型）的对象。这版 `query` 返回的是一个 result 类型——你可能更想要 `tryQuery`，它会在查询执行失败时直接抛出错误。

```javascript
await dv.query("LIST FROM #tag") =>
    { successful: true, value: { type: "list", values: [value1, value2, ...] } }

await dv.query(`TABLE WITHOUT ID file.name, value FROM "path"`) =>
    { successful: true, value: { type: "table", headers: ["file.name", "value"], values: [["A", 1], ["B", 2]] } }

await dv.query("TASK WHERE due") =>
    { successful: true, value: { type: "task", values: [task1, task2, ...] } }
```

`dv.query` 还接受两个可选参数：
1. `file`：用于解析查询的文件路径（在出现对 `this` 的引用时使用）。默认为当前文件。
2. `settings`：执行查询时的设置。这主要属于高级用法（建议直接查看 API 实现来了解所有可用选项）。

### ⌛ `dv.tryQuery(source, [file, settings])`

与 `dv.query` 完全一致，但在短脚本中更为方便，因为执行失败会作为 JavaScript 异常抛出，而不是以 result 类型返回。

### ⌛ `dv.queryMarkdown(source, [file], [settings])`

等价于 `dv.query()`，但返回渲染后的 Markdown。

```js
await dv.queryMarkdown("LIST FROM #tag") =>
    { successful: true, value: { "- [[Page 1]]\n- [[Page 2]]" } }
```

### ⌛ `dv.tryQueryMarkdown(source, [file], [settings])`

与 `dv.queryMarkdown()` 完全一致，但在解析失败时抛出错误。

### `dv.tryEvaluate(expression, [context])`

求值任意 Dataview 表达式（例如 `2 + 2`、`link("text")` 或 `x * 9`）；在解析或求值失败时抛出 `Error`。`this` 是一个始终可用的隐式变量，指向当前文件。

```js
dv.tryEvaluate("2 + 2") => 4
dv.tryEvaluate("x + 2", {x: 3}) => 5
dv.tryEvaluate("length(this.file.tasks)") => number of tasks in the current file
```

### `dv.evaluate(expression, [context])`

求值任意 Dataview 表达式（例如 `2 + 2`、`link("text")` 或 `x * 9`），并返回表示结果的 `Result` 对象。
你可以通过检查 `result.successful` 来拆解这个结果类型（随后再取 `result.value` 或 `result.error`）。如果你想要一个在求值失败时直接抛错的更简单 API，请使用 `dv.tryEvaluate`。

```js
dv.evaluate("2 + 2") => Successful { value: 4 }
dv.evaluate("2 +") => Failure { error: "Failed to parse ... " }
```
