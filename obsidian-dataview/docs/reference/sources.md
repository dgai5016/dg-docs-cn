# 数据源

Dataview 的**数据源（Source）**用于标识一组文件、任务或其他数据。Dataview 会在内部对数据源进行索引，因此查询速度非常快。数据源最突出的用途是 [FROM 数据命令](../../queries/data-commands.md#from)，同时也被广泛应用于各种 JavaScript API 查询调用中。

## 数据源的类型

Dataview 目前支持**四种数据源类型**。

### 标签

形如 `#tag` 的数据源。它会匹配所有带有该标签的文件、段落或任务。

~~~
```dataview
LIST
FROM #homework
```
~~~

### 文件夹

形如 `"folder"` 的数据源。它会匹配位于该文件夹及其子文件夹中的所有文件、段落或任务。这里需要写完整的 Vault 路径，而不仅仅是文件夹名称。注意：路径末尾不支持斜杠，例如 `"Path/To/Folder/"` 无法生效，但 `"Path/To/Folder"` 是有效的。

~~~
```dataview
TABLE file.ctime, status
FROM "projects/brainstorming"
```
~~~


### 特定文件

你可以通过指定完整路径来选中某个特定文件：`"folder/File"`。

- 如果某个文件与某个文件夹拥有完全相同的路径，Dataview 会优先匹配文件夹。若要强制读取文件，可以加上扩展名：`folder/File.md`。

~~~
```dataview
LIST WITHOUT ID next-in-line
FROM "30 Hobbies/Games/Dashboard"
```
~~~


### 链接

 你既可以选中**指向**某个文件的链接，也可以选中**来自**某个文件的所有链接。
 
- 若要获取所有**指向** `[[note]]` 的页面，使用 `[[note]]`。
- 若要获取所有**来自** `[[note]]` 的页面（即该文件中包含的所有链接所指向的页面），使用 `outgoing([[note]])`。
- 你可以通过 `[[#]]` 或 `[[]]` 隐式引用当前文件，例如 `[[]]` 让你查询所有指向当前文件的文件。

~~~
```dataview
LIST
FROM [[]]
```

```dataview
LIST
FROM outgoing([[Dashboard]])
```
~~~


## 组合数据源

你可以使用 `and` 和 `or` 组合这些过滤条件，从而构造出更复杂的数据源。

- 例如，`#tag and "folder"` 会返回 `folder` 文件夹中且带有 `#tag` 标签的所有页面。
- 查询 `#food and !#fastfood` 只会返回含有 `#food` 但不含 `#fastfood` 的页面。
- `[[Food]] or [[Exercise]]` 会返回所有指向 `[[Food]]` **或** `[[Exercise]]` 的页面。

如果查询较复杂，且分组或优先级至关重要，可以使用括号进行逻辑分组：

- `#tag and ("folder" or #other-tag)`
- `(#tag1 or #tag2) and (#tag3 or #tag4)`

