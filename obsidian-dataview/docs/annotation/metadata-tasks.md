# 任务和列表上的元数据

与页面一样，你也可以在列表项和任务级别添加**字段**，将其作为上下文绑定到某个具体任务上。为此你需要使用[内联字段语法](add-metadata.md#inline-fields)：

```markdown
- [ ] Hello, this is some [metadata:: value]!
- [X] I finished this on [completion:: 2021-08-15].
```

任务和列表项在数据层面是同质的，因此你所有项目符号所拥有的信息在这里也都同样适用。

## 字段简写

[Tasks](https://publish.obsidian.md/tasks/Introduction) 插件引入了一种不同的[基于 Emoji 的标记方式](https://publish.obsidian.md/tasks/Reference/Task+Formats/Tasks+Emoji+Format)，用于配置任务相关的各种日期。在 Dataview 的语境中，这种标记法被称为「字段简写（Field Shorthands）」。当前版本的 Dataview 仅支持下文所示的日期简写，不支持优先级和循环（recurrence）相关的简写。

=== "示例"


=== "示例"
    - [ ] Due this Saturday 🗓️2021-08-29
    - [x] Completed last Saturday ✅2021-08-22
    - [ ] I made this on ➕1990-06-14
    - [ ] Task I can start this weekend 🛫2021-08-29
    - [x] Task I finished ahead of schedule ⏳2021-08-29 ✅2021-08-22

这种 Emoji 简写有两个特点：其一，它省略了内联字段语法（无需写成 `[🗓️:: YYYY-MM-DD]`）；其二，在数据层面它会被映射为一个**文本**字段名：

| 字段名 | 简写语法 |
| ---------- | ----------------- |
| due | `🗓️YYYY-MM-DD` |
| completion |  `✅YYYY-MM-DD` |
| created | `➕YYYY-MM-DD` |
| start | `🛫YYYY-MM-DD` |
| scheduled | `⏳YYYY-MM-DD` |

也就是说，如果你想要查询所有在 2021-08-22 完成的任务，可以这样写：

~~~markdown
```dataview
TASK
WHERE completion = date("2021-08-22")
```
~~~

这会同时列出两种写法的任务——无论是 Emoji 简写还是文本标注：

```markdown
- [x] Completed last Saturday ✅2021-08-22
- [x] Some Done Task [completion:: 2021-08-22]
```

## 隐式字段

与页面类似，Dataview 会为每个任务或列表项自动添加若干隐式字段：

!!! info "字段的继承"
    任务会*继承其父页面的所有字段*——因此如果你的页面中存在 `rating` 字段，那么在 `TASK` 查询中你也可以在任务上访问到它。


| 字段名 | 数据类型 | 说明 |
| ---------- | --------- | ----------- |
| `status` |  文本 | 该任务的完成状态，由 `[ ]` 括号中的字符决定。一般用空格 `" "` 表示未完成任务，用 `"x"` 表示已完成任务，但同时也支持使用其他任务状态的插件。 |
| `checked` |  布尔值  | 该任务的状态是否**非空**，即其 `[ ]` 括号中是否含有某个 `status` 字符（不一定是 `"x"`），而不是空格。 |
| `completed` |  布尔值  | 该*具体*任务是否已完成；此处不考虑任何子任务是否完成。仅当任务被标记为 `"x"` 时才被明确视为「已完成」。如果你使用了自定义状态（例如 `[-]`），那么 `checked` 为 true，而 `completed` 为 false。 |
| `fullyCompleted` |  布尔值  | 该任务及其**所有**子任务是否全部完成。 |
| `text` |  文本  | 该任务的纯文本内容，包括任何元数据字段标注。 |
| `visual` | 文本 | 由 Dataview 渲染出的该任务文本。在 DataviewJS 中可以覆盖此字段，从而渲染出与常规任务文本不同的内容，同时仍允许任务被勾选（因为 Dataview 的校验逻辑通常会将文本与文件中的原始文本进行比对）。 |
| `line` |  数字  | 该任务所在文件中的行号。 |
| `lineCount` |  数字  | 该任务占用的 Markdown 行数。 |
| `path` |  文本  | 该任务所在文件的完整路径，等同于[页面](./metadata-pages.md)的 `file.path`。 |
| `section` | 链接 |  指向该任务所属段落的链接。 |
| `tags` | 列表  | 任务文本中包含的所有标签。 |
| `outlinks` | 列表 |  该任务中定义的所有链接。 |
| `link` | 链接  |  指向该任务附近最近一个可链接块的链接；便于构造指向该任务的链接。 |
| `children` | 列表  | 该任务的任何子任务或子列表。 |
| `task` | 布尔值  | 若为 true，则这是一个任务；否则是一个普通的列表项。 |
| `annotated` | 布尔值  | 如果任务文本中包含任何元数据字段则为 true，否则为 false。 |
| `parent` | 数字 |  该任务上方那个任务的行号（如果存在）；若该任务为顶级任务则为 null。 |
| `blockId` | 文本 | 该任务 / 列表项的块 ID（若通过 `^blockId` 语法定义）；否则为 null。 |

如果使用了[简写语法](#字段简写)，还可能出现以下附加属性：

- `completion`：任务完成的日期。
- `due`：任务的截止日期（如果有）。
- `created`：任务的创建日期。
- `start`：任务可以开始的日期。
- `scheduled`：任务计划进行的日期。

### 在查询中访问隐式字段

如果你使用的是 [TASK](../queries/query-types.md#task) 查询，那么任务本身就是顶层信息，可以直接使用而无需任何前缀：

~~~markdown
```dataview
TASK
WHERE !fullyCompleted
```
~~~

对于其他类型的查询，你需要先访问隐式字段 `file.lists` 或 `file.tasks`，才能进一步检查这些列表项专属的隐式字段：

~~~markdown
```dataview
LIST
WHERE any(file.tasks, (t) => !t.fullyCompleted)
```
~~~

这会返回所有内部含有未完成任务的文件链接。由于我们在页面层级上拿到的是一个任务列表，因此需要使用[列表函数](../reference/functions.md)来逐个检查每个元素。
