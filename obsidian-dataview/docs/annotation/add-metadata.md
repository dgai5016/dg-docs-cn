# 为页面添加元数据

Dataview 无法查询 vault 中的所有内容。要进行搜索、筛选和显示，这些内容必须先被**索引**。部分内容会被自动索引，比如项目符号或任务列表——也就是所谓的**隐式字段**（更多说明见下文）——而其他数据则需要保存为元数据**字段**才能被 Dataview 访问。

## 什么是"字段"？

元数据字段是一个由**键**（key）和**值**（value）组成的键值对。字段的_值_具有一种数据类型（详见[这里](./types-of-metadata.md)），数据类型决定了该字段在被查询时的行为方式。

你可以为任意数量的**笔记**、**列表项**或**任务**添加字段。

## 如何添加字段？

你可以通过三种方式为**笔记**添加字段。字段的具体表现形式取决于你添加它的方式。

对于**任务或列表项**，你可以使用 YAML Frontmatter 中的信息，但无法将字段直接附加到某个具体的列表项上。如果你只想为某个列表项或任务添加元数据，请使用[内联字段](#inline-fields)。

### Frontmatter

Frontmatter 是一种常见的 Markdown 扩展，允许在页面顶部添加 YAML 元数据。它由 Obsidian 原生支持，详见其[官方文档](https://help.obsidian.md/Advanced+topics/YAML+front+matter)。所有 YAML Frontmatter 字段都会自动作为 Dataview 字段可用。

```yaml
    ---
    alias: "document"
    last-reviewed: 2021-08-17
    thoughts:
      rating: 8
      reviewable: false
    ---
```

这样你的笔记就拥有了名为 `alias`、`last-reviewed` 和 `thoughts` 的元数据字段。它们各自具有不同的**数据类型**：

- `alias` 是[文本](types-of-metadata.md#text)，因为它被 "" 包裹
- `last-reviewed` 是[日期](types-of-metadata.md#date)，因为它遵循 ISO 日期格式
- `thoughts` 是[对象](types-of-metadata.md#object)字段，因为它使用了 YAML Frontmatter 的对象语法

你可以用以下查询来查找这篇笔记：

~~~
```dataview
LIST
WHERE thoughts.rating = 8
```
~~~

### 内联字段（Inline Fields）

如果你希望以一种更自然的方式来标注数据，Dataview 支持"内联"字段，使用 `Key:: Value` 语法，你可以在文件中的任意位置使用它。这让你能够在需要的位置直接写出可查询的数据——例如写在句子的中间。

如果内联字段独占一行、且其前面没有其他内容，你可以这样书写：

```markdown
# Markdown Page

Basic Field:: Some random Value
**Bold Field**:: Nice!
```

`::` 之后的所有内容都会被当作该字段的值，直到换行为止。

!!! hint "注意 `::`"
    请注意，使用内联字段时键和值之间需要使用双冒号 `::`，而 YAML Frontmatter 字段只需要一个冒号即可。

如果你想把元数据嵌入到句子当中，或者在同一行中使用多个字段，可以使用方括号语法，将字段用方括号包裹起来：

```markdown
I would rate this a [rating:: 9]! It was [mood:: acceptable].
```

!!! info "列表项和任务上的字段"
    当你想要为某个列表项（例如一个任务）标注元数据时，必须始终使用方括号语法（因为该字段并不是这一行中唯一的信息）
    ```markdown
    - [ ] Send an mail to David about the deadline [due:: 2022-04-05].
    ```
    带方括号的内联字段是为特定列表项显式添加字段的唯一方式；YAML frontmatter 始终作用于整个页面（但在列表项的上下文中同样可用。）

此外还有一种圆括号语法，它会在阅读模式下渲染时隐藏键：

```markdown
This will not show the (longKeyIDontNeedWhenReading:: key).
```

将渲染为：

```markdown
This will not show the key.
```

你可以在同一个文件中混合使用 YAML Frontmatter 和各种形式的内联字段。你不需要二选一，可以根据自己的工作流灵活组合。

## 字段命名

假设你在同一篇笔记中使用了上面所有的内联字段示例，那么将会有以下元数据可供使用：

| 元数据键 | 规范化后的元数据键 | 值 | 值的数据类型 |
| ----------- | ------------------------|----------- | ----------- |
| `Basic Field` | `basic-field`  | Some random Value | 文本 |
| `Bold Field` | `bold-field`  | Nice! | 文本 |
| `rating` | - | 9 | 数字 |
| `mood` | - | acceptable | 文本 |
| `due` | - | 表示 2022-04-05 的日期对象 | 日期 |
| `longKeyIDontNeedWhenReading` | `longkeyidontneedwhenreading` | key | 文本 |

正如你在表格中所见，如果你在元数据键名中使用了**空格或大写字母**，Dataview 会为你提供一个**规范化版本**的键名。

**带空格的键**无法直接在查询中使用。这里你有两种选择：要么使用规范化后的名称（始终为全小写、并以连字符替代空格），要么使用 **row** 变量语法。更多内容请见[FAQ](../resources/faq.md)。

**带大写字母的键**可以按原样使用。而规范化版本则让你可以不受大小写影响来查询某个键，使用起来更方便：例如，一个文件中将某个字段命名为 `someMetadata`，另一个文件中命名为 `someMetaData`，使用规范化键 `somemetadata` 就可以统一查询这两个字段。

此外，**加粗字段键丢失了它的格式化标记**。虽然用于让它显示为加粗的 `**` 在文件中是键名的一部分，但在索引笔记时它们会被去掉。其他所有内建的格式化（如删除线、斜体）也是如此。这意味着带格式的键只能以无格式的形式被查询。这样你就可以在笔记的具体上下文中对键进行格式化，而不必担心为同一类信息创建出不同的键。

### emoji 和非拉丁字符的使用

为元数据字段命名时，你并不局限于拉丁字符。你可以使用 UTF-8 中的所有字符：

```markdown
Noël:: Un jeu de console
クリスマス:: 家庭用ゲーム機
[🎅:: a console game]
[xmas🎄:: a console game]
```

**将 emoji 用作元数据键**是可行的，但存在一些限制。在字段名中使用 emoji 时，你需要将它们放在方括号中，Dataview 才能正确识别。
另外，请注意在切换操作系统时（例如从 Windows 切换到 Android），同一个 emoji 可能会使用不同的字符编码，这可能导致你在查询时找不到相应的元数据。

!!! info "任务字段简写"
    上述限制的一个例外是任务中的[简写语法](./metadata-tasks.md#field-shorthands)。你可以直接使用简写而无需加方括号。但请注意，这仅适用于已列出的简写——其他所有字段（无论是否含 emoji）都需要使用 `[key:: value]` 语法。

## 隐式字段

即使你没有为笔记显式添加任何元数据，Dataview 也会开箱即用地为你提供大量已索引的数据。隐式字段的一些示例包括：

- 文件创建日期（`file.cday`）
- 文件中的链接（`file.outlinks`）
- 文件中的标签（`file.etags`）
- 文件中的所有列表项（`file.lists` 和 `file.tasks`）

以及其他许多字段。可用的隐式字段会因你查看的是页面还是列表项而有所不同。完整的可用隐式字段列表请见[页面上的元数据](metadata-pages.md)以及[任务和列表上的元数据](metadata-tasks.md)。
