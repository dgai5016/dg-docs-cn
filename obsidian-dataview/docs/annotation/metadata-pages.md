# 页面上的元数据

为一个 Markdown 页面（笔记）添加字段共有三种方式——通过 Frontmatter、内联字段（Inline Field）以及隐式字段（Implicit Field）。前两种方式的详细介绍请参阅[「如何添加元数据」](./add-metadata.md)。

## 隐式字段

Dataview 会自动为每个页面补充大量元数据。这些隐式自动添加的字段统一收纳在 `file` 字段之下，具体包括：

| 字段名 | 数据类型 | 说明 |
| --------------------- | --------- | ----------- |
| `file.name` | 文本 | 文件名，即 Obsidian 侧边栏中显示的名称。 |
| `file.folder` | 文本 | 该文件所属文件夹的路径。 |
| `file.path` | 文本 | 文件的完整路径，包含文件名。 |
| `file.ext` | 文本 | 文件的扩展名，通常为 `md`。 |
| `file.link` | 链接 | 指向该文件的链接。 |
| `file.size` | 数字 | 文件大小（单位：字节）。 |
| `file.ctime` | 带时间的日期 | 文件的创建时间。 |
| `file.cday` | 日期 | 文件的创建日期。 |
| `file.mtime` | 带时间的日期 | 文件的最后修改时间。 |
| `file.mday` | 日期 | 文件的最后修改日期。 |
| `file.tags` | 列表 | 笔记中所有去重后的标签列表。子标签会按层级展开，因此 `#Tag/1/A` 会被存为 `[#Tag, #Tag/1, #Tag/1/A]`。 |
| `file.etags` | 列表 | 笔记中所有显式标签的列表；与 `file.tags` 不同，它不会展开子标签，例如 `[#Tag/1/A]`。 |
| `file.inlinks` | 列表 | 指向该文件的所有入链列表，即所有包含指向该文件链接的文件。 |
| `file.outlinks` | 列表 | 该文件的所有出链列表，即该文件中包含的所有链接。 |
| `file.aliases` | 列表 | 通过 [YAML frontmatter](https://help.obsidian.md/How+to/Add+aliases+to+note) 定义的笔记别名列表。 |
| `file.tasks` | 列表 | 该文件中所有任务的列表（即 `| [ ] some task` 形式的条目）。 |
| `file.lists` | 列表 | 文件中所有列表元素的列表（包括任务）；这些元素实际上等同于任务，可以在任务视图中渲染。 |
| `file.frontmatter` | 列表 | 以 `key \| value` 文本形式存放的 frontmatter 原始值；主要用于检查 frontmatter 原始值或动态列出 frontmatter 的键名。 |
| `file.day` | 日期 | 仅当文件名中包含日期（形如 `yyyy-mm-dd` 或 `yyyymmdd`），或存在 `Date` 字段/内联字段时才可用。 |
| `file.starred` | 布尔值 | 该文件是否通过 Obsidian 核心插件「书签」（Bookmarks）被加上了书签。 |

## 示例页面

下面是一个简短的 Markdown 页面示例，同时包含了用户可自定义的两种添加元数据的方式：

```markdown
---
genre: "action"
reviewed: false
---
# Movie X
#movies

**Thoughts**:: It was decent.
**Rating**:: 6

[mood:: okay] | [length:: 2 hours]
```

除了你在此处看到的值之外，该页面还拥有上表列出的全部字段。

### 示例查询

例如，你可以用下面的查询语句检索上述部分信息：

~~~yaml
```dataview
TABLE file.ctime, length, rating, reviewed
FROM #movies
```
~~~
