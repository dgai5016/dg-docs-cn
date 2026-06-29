<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# YAML 规则

这些规则尽力处理 [Obsidian.md](https://obsidian.md/) 中的 YAML 值。关于这些规则，有几点需要牢记：

- 这些规则适用于大多数 YAML 使用场景，但并非完美无缺
- 某些 YAML 格式可能在解析时出现问题，因为目前 YAML 键的值是通过正则表达式而非专门的库来解析的
- 键值中的注释可能导致排序或正确获取键值时出现问题
- 如果你通过 Linter 对 YAML 中的键进行排序或调整顺序，空行可能会被移除


## Add blank line after YAML

Alias: `add-blank-line-after-yaml`

如果 YAML 块不是文件的结尾，或者其后没有至少 1 个空行，则在 YAML 块之后添加一个空行






### 示例

<details><summary>仅包含 YAML 的文件不会在 YAML 之后添加空行</summary>

修改前：

`````` markdown
---
key: value
---
``````

修改后：

`````` markdown
---
key: value
---
``````
</details>
<details><summary>YAML 之后直接跟着内容的文件会添加一个空行</summary>

修改前：

`````` markdown
---
key: value
---
Here is some text
``````

修改后：

`````` markdown
---
key: value
---

Here is some text
``````
</details>
<details><summary>YAML 之后以及内容之前已有空行的文件不会添加空行</summary>

修改前：

`````` markdown
---
key: value
---

Here is some text
``````

修改后：

`````` markdown
---
key: value
---

Here is some text
``````
</details>

## Dedupe YAML array values

Alias: `dedupe-yaml-array-values`

以区分大小写的方式移除数组中的重复值。

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Dedupe YAML aliases section` | 开启移除重复别名。 | N/A | `true` |
| `Dedupe YAML tags section` | 开启移除重复标签。 | N/A | `true` |
| `Dedupe YAML array sections` | 开启移除常规 YAML 数组中的重复值 | N/A | `true` |
| `YAML keys to ignore` | 一个 YAML 键列表，每行一个不带末尾冒号的键，这些键的值不会被移除重复项。 | N/A |  |



### 示例

<details><summary>对标签去重时区分大小写，并会使用你设置的默认标签格式。</summary>

修改前：

`````` markdown
---
tags: [computer, research, computer, Computer]
aliases:
  - Title 1
  - Title2
---
``````

修改后：

`````` markdown
---
tags: [computer, research, Computer]
aliases:
  - Title 1
  - Title2
---
``````
</details>
<details><summary>对别名的去重区分大小写，并会使用你设置的默认别名格式。</summary>

修改前：

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
  - Title 1
  - Title2
  - Title 3
---
``````

修改后：

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
  - Title 3
---
``````
</details>
<details><summary>对 YAML 数组键的去重区分大小写，并尽量保留原始的数组格式。</summary>

修改前：

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
arr1: [val, val1, val, val2, Val]
arr2:
  - Val
  - Val
  - val
  - val2
  - Val2
---
``````

修改后：

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
arr1: [val, val1, val2, Val]
arr2:
  - Val
  - val
  - val2
  - Val2
---
``````
</details>
<details><summary>对常规数组去重时会遵循不需要去重的键列表（本示例中要忽略的键仅为 `arr2`）</summary>

修改前：

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
arr1: [val, val1, val, val2, Val]
arr2:
  - Val
  - Val
  - val
  - val2
  - Val2
---
``````

修改后：

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
arr1: [val, val1, val2, Val]
arr2:
  - Val
  - Val
  - val
  - val2
  - Val2
---
``````
</details>

## Escape YAML special characters

Alias: `escape-yaml-special-characters`

转义 YAML 中后跟空格的冒号（: ）、单引号（'）和双引号（"）。

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Try to escape single line arrays` | 尝试对数组值进行转义，假定数组以 "[" 开头、以 "]" 结尾，且各项由 "," 分隔。 | N/A | false |



### 示例

<details><summary>无需转义的 YAML</summary>

修改前：

`````` markdown
---
key: value
otherKey: []
---
``````

修改后：

`````` markdown
---
key: value
otherKey: []
---
``````
</details>
<details><summary>包含未转义值的 YAML</summary>

修改前：

`````` markdown
---
key: value: with colon in the middle
secondKey: value with ' a single quote present
thirdKey: "already escaped: value"
fourthKey: value with " a double quote present
fifthKey: value with both ' " a double and single quote present is not escaped, but is invalid YAML
sixthKey: colon:between characters is fine
otherKey: []
---
``````

修改后：

`````` markdown
---
key: "value: with colon in the middle"
secondKey: "value with ' a single quote present"
thirdKey: "already escaped: value"
fourthKey: 'value with " a double quote present'
fifthKey: value with both ' " a double and single quote present is not escaped, but is invalid YAML
sixthKey: colon:between characters is fine
otherKey: []
---
``````
</details>
<details><summary>展开列表中包含未转义值的 YAML（`Default escape character = '`）</summary>

修改前：

`````` markdown
---
key:
  - value: with colon in the middle
  - value with ' a single quote present
  - 'already escaped: value'
  - value with " a double quote present
  - value with both ' " a double and single quote present is not escaped, but is invalid YAML
  - colon:between characters is fine
---
``````

修改后：

`````` markdown
---
key:
  - 'value: with colon in the middle'
  - "value with ' a single quote present"
  - 'already escaped: value'
  - 'value with " a double quote present'
  - value with both ' " a double and single quote present is not escaped, but is invalid YAML
  - colon:between characters is fine
---
``````
</details>
<details><summary>包含数组的、含未转义值的 YAML</summary>

修改前：

`````` markdown
---
array: [value: with colon in the middle, value with ' a single quote present, "already escaped: value", value with " a double quote present, value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray: [[value: with colon in the middle, value with ' a single quote present], ["already escaped: value", value with " a double quote present], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray2: [[value: with colon in the middle], value with ' a single quote present]
---

_Note that escaped commas in a YAML array will be treated as a separator._
``````

修改后：

`````` markdown
---
array: ["value: with colon in the middle", "value with ' a single quote present", "already escaped: value", 'value with " a double quote present', value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray: [["value: with colon in the middle", "value with ' a single quote present"], ["already escaped: value", 'value with " a double quote present'], value with both ' " a double and single quote present is not escaped but is invalid YAML, colon:between characters is fine]
nestedArray2: [["value: with colon in the middle"], "value with ' a single quote present"]
---

_Note that escaped commas in a YAML array will be treated as a separator._
``````
</details>

## Force YAML escape

Alias: `force-yaml-escape`

对指定的 YAML 键的值进行转义。

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Force YAML escape on keys` | 对指定的 YAML 键（以换行符分隔）使用 YAML 转义字符进行转义（如果尚未转义）。请勿对 YAML 数组使用。 | N/A |  |



### 示例

<details><summary>无需转义的 YAML</summary>

修改前：

`````` markdown
---
key: value
otherKey: []
---
``````

修改后：

`````` markdown
---
key: value
otherKey: []
---
``````
</details>
<details><summary>当 `Force YAML escape on keys = 'key'\n'title'\n'bool'` 时，强制将尚未转义的 YAML 键用双引号转义</summary>

修改前：

`````` markdown
---
key: 'Already escaped value'
title: This is a title
bool: false
unaffected: value
---

_Note that the force YAML key option should not be used with arrays._
``````

修改后：

`````` markdown
---
key: 'Already escaped value'
title: "This is a title"
bool: "false"
unaffected: value
---

_Note that the force YAML key option should not be used with arrays._
``````
</details>

## Format tags in YAML

Alias: `format-tags-in-yaml`

移除 YAML frontmatter 中标签的井号（#），因为它们会使那里的标签失效






### 示例

<details><summary>格式化 YAML frontmatter 中的标签</summary>

修改前：

`````` markdown
---
tags: #one #two #three #nested/four/five
---
``````

修改后：

`````` markdown
---
tags: one two three nested/four/five
---
``````
</details>
<details><summary>格式化数组中的标签</summary>

修改前：

`````` markdown
---
tags: [#one #two #three]
---
``````

修改后：

`````` markdown
---
tags: [one two three]
---
``````
</details>
<details><summary>当 `tag` 作为标签键时格式化数组中的标签</summary>

修改前：

`````` markdown
---
tag: [#one #two #three]
---
``````

修改后：

`````` markdown
---
tag: [one two three]
---
``````
</details>
<details><summary>格式化列表中的标签</summary>

修改前：

`````` markdown
---
tags:
- #tag1
- #tag2
---
``````

修改后：

`````` markdown
---
tags:
- tag1
- tag2
---
``````
</details>

## Format YAML array

Alias: `format-yaml-array`

允许将常规 YAML 数组格式化为多行或单行；<code>tags</code> 和 <code>aliases</code> 还支持一些 Obsidian 特有的 YAML 格式。<b>注意：单字符串转单行是指当条目数超过 1 个时，从单个字符串条目变为单行数组。单字符串转多行同理，只是变为多行数组。</b>

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Format YAML aliases section` | 开启对 YAML aliases 区段的格式化。请勿与 <code>YAML title alias</code> 规则同时启用，因为它们可能无法良好协作，或者由于选择的格式风格不同而出现意外结果。 | N/A | `true` |
| `Format YAML tags section` | 开启对 YAML tags 区段的格式化。 | N/A | `true` |
| `Default YAML array section style` | 其他 YAML 数组的格式风格，适用于非 <code>tags</code>、非 <code>aliases</code>，且未列入 <code>Force key values to be single-line arrays</code> 和 <code>Force key values to be multi-line arrays</code> 的数组 | `multi-line`: ```key:\n  - value```<br/><br/>`single-line`: ```key: [value]``` | `single-line` |
| `Format YAML array sections` | 开启对常规 YAML 数组的格式化 | N/A | `true` |
| `Force key values to be single-line arrays` | 强制以换行符分隔的键对应的 YAML 数组采用单行格式（留空则禁用此选项） | N/A |  |
| `Force key values to be multi-line arrays` | 强制以换行符分隔的键对应的 YAML 数组采用多行格式（留空则禁用此选项） | N/A |  |



### 示例

<details><summary>将 tags 格式化为以空格分隔的单行数组，aliases 格式化为多行数组，并将键 `test` 格式化为单行数组</summary>

修改前：

`````` markdown
---
tags:
  - computer
  - research
aliases: Title 1, Title2
test: this is a value
---

# Notes:

Nesting YAML arrays may result in unexpected results.

Multi-line arrays will have empty values removed only leaving one if it is completely empty. The same is not true for single-line arrays as that is invalid YAML unless it comes as the last entry in the array.
``````

修改后：

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title2
test: [this is a value]
---

# Notes:

Nesting YAML arrays may result in unexpected results.

Multi-line arrays will have empty values removed only leaving one if it is completely empty. The same is not true for single-line arrays as that is invalid YAML unless it comes as the last entry in the array.
``````
</details>
<details><summary>将 tags 格式化为以空格分隔的单字符串，忽略 aliases，并将常规 YAML 数组格式化为单行数组</summary>

修改前：

`````` markdown
---
aliases: Typescript
types:
  - thought provoking
  - peer reviewed
tags: [computer, science, trajectory]
---
``````

修改后：

`````` markdown
---
aliases: Typescript
types: [thought provoking, peer reviewed]
tags: computer science trajectory
---
``````
</details>
<details><summary>包含字典的数组会被忽略</summary>

修改前：

`````` markdown
---
gists:
  - id: test123
    url: 'some_url'
    filename: file.md
    isPublic: true
---
``````

修改后：

`````` markdown
---
gists:
  - id: test123
    url: 'some_url'
    filename: file.md
    isPublic: true
---
``````
</details>

## Insert YAML attributes

Alias: `insert-yaml-attributes`

将指定的 YAML 属性插入到 YAML frontmatter 中。每个属性单独占一行。

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Text to insert` | 要插入到 YAML frontmatter 中的文本 | N/A | `aliases: 
tags: ` |



### 示例

<details><summary>将静态行插入 YAML frontmatter。Text to insert：`aliases:
tags: doc
animal: dog`</summary>

修改前：

`````` markdown
---
animal: cat
---
``````

修改后：

`````` markdown
---
aliases:
tags: doc
animal: cat
---
``````
</details>

## Move tags to YAML

Alias: `move-tags-to-yaml`

将所有标签移动到文档的 YAML frontmatter 中。

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Body tag operation` | 当标签被移动到 frontmatter 后，如何处理文件正文中未被忽略的标签 | `Nothing`: 不动正文中的标签<br/><br/>`Remove hashtag`: 将标签移到 YAML frontmatter 之后，移除正文标签中的 `#`<br/><br/>`Remove whole tag`: 将标签移到 YAML frontmatter 之后，移除正文中的整个标签。_注意这也会移除标签之前的第一个空格_ | `Nothing` |
| `Tags to ignore` | 这些标签不会被移动到 tags 数组；若启用了 <code>Remove the hashtag from tags in content body</code>，也不会从正文内容中移除。每个标签应单独占一行，且不带 <code>#</code>。<b>请确保不要在标签名中包含井号。</b> | N/A |  |



### 示例

<details><summary>当 `Tags to ignore = 'ignored-tag'` 时，将正文中的标签移动到 YAML</summary>

修改前：

`````` markdown
Text has to do with #test and #markdown

#test content here
```
#ignored
Code block content is ignored
```

This inline code `#ignored content`

#ignored-tag is ignored since it is in the ignored list
``````

修改后：

`````` markdown
---
tags: [test, markdown]
---
Text has to do with #test and #markdown

#test content here
```
#ignored
Code block content is ignored
```

This inline code `#ignored content`

#ignored-tag is ignored since it is in the ignored list
``````
</details>
<details><summary>当 YAML 中已有标签时，移动正文标签到 YAML 会保留已存在的标签，并只添加新标签</summary>

修改前：

`````` markdown
---
tags: [test, tag2]
---
Text has to do with #test and #markdown
``````

修改后：

`````` markdown
---
tags: [test, tag2, markdown]
---
Text has to do with #test and #markdown
``````
</details>
<details><summary>当 `Body tag operation = 'Remove hashtag'` 且 `Tags to ignore = 'yet-another-ignored-tag'` 时，将标签移动到 YAML frontmatter，然后移除正文标签中的井号。</summary>

修改前：

`````` markdown
---
tags: [test, tag2]
---
Text has to do with #test and #markdown

The tag at the end of this line stays as a tag since it is ignored #yet-another-ignored-tag
``````

修改后：

`````` markdown
---
tags: [test, tag2, markdown]
---
Text has to do with test and markdown

The tag at the end of this line stays as a tag since it is ignored #yet-another-ignored-tag
``````
</details>
<details><summary>当 `Body tag operation = 'Remove whole tag'` 时，将标签移动到 YAML frontmatter，然后移除正文中的标签。</summary>

修改前：

`````` markdown
---
tags: [test, tag2]
---
This document will have #tags removed and spacing around tags is left alone except for the space prior to the hashtag #warning
``````

修改后：

`````` markdown
---
tags: [test, tag2, tags, warning]
---
This document will have removed and spacing around tags is left alone except for the space prior to the hashtag
``````
</details>

## Remove YAML keys

Alias: `remove-yaml-keys`

移除指定的 YAML 键。

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `YAML keys to remove` | 要从 YAML frontmatter 中移除的 YAML 键（可带或不带冒号） | N/A |  |



### 示例

<details><summary>移除 `YAML keys to remove` = "status:
keywords
date" 中指定的值</summary>

修改前：

`````` markdown
---
language: Typescript
type: programming
tags: computer
keywords:
  - keyword1
  - keyword2
status: WIP
date: 02/15/2022
---

# Header Context

Text
``````

修改后：

`````` markdown
---
language: Typescript
type: programming
tags: computer
---

# Header Context

Text
``````
</details>

## Sort YAML array values

Alias: `sort-yaml-array-values`

按指定的排序方式对 YAML 数组值进行排序。

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Sort YAML aliases section` | 开启别名排序。 | N/A | `true` |
| `Sort YAML tags section` | 开启标签排序。 | N/A | `true` |
| `Sort YAML array sections` | 开启常规 YAML 数组的值排序 | N/A | `true` |
| `YAML Keys to ignore` | 一个 YAML 键列表，每行一个不带末尾冒号的键，这些键的值不会被排序。 | N/A |  |
| `Sort order` | YAML 数组值的排序方式。 | `Ascending Alphabetical`: 将数组值按 a 到 z 排序<br/><br/>`Descending Alphabetical`: 将数组值按 z 到 a 排序 | `Ascending Alphabetical` |



### 示例

<details><summary>按字母升序对 YAML 数组值进行排序</summary>

修改前：

`````` markdown
---
tags: [computer, research, androids, Computer]
aliases:
  - Title 1
  - Title 2
---
``````

修改后：

`````` markdown
---
tags: [androids, computer, Computer, research]
aliases:
  - Title 1
  - Title 2
---
``````
</details>
<details><summary>按字母降序对 YAML 数组值进行排序</summary>

修改前：

`````` markdown
---
tags: [computer, research, androids, Computer]
aliases:
  - Title 1
  - Title 2
---
``````

修改后：

`````` markdown
---
tags: [research, Computer, computer, androids]
aliases:
  - Title 2
  - Title 1
---
``````
</details>
<details><summary>对 YAML 数组排序时会遵循不需要排序的键列表（本示例中要忽略的键仅为 `arr2`）</summary>

修改前：

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title 2
arr1: [val, val2, val1]
arr2:
  - val
  - val2
  - val1
---
``````

修改后：

`````` markdown
---
tags: [computer, research]
aliases:
  - Title 1
  - Title 2
arr1: [val, val1, val2]
arr2:
  - val
  - val2
  - val1
---
``````
</details>

## YAML key sort

Alias: `yaml-key-sort`

按指定的顺序和优先级对 YAML 键进行排序。<b>注意：可能也会移除空行。仅适用于非嵌套键。</b>

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `YAML key priority sort order` | 键的排序顺序，每行一个，按列表中的顺序进行排序 | N/A |  |
| `Priority keys at start of YAML` | 将 YAML Key Priority Sort Order 放在 YAML frontmatter 的开头 | N/A | `true` |
| `YAML sort order for other keys` | 对未在 YAML Key Priority Sort Order 文本框中出现的键进行排序的方式 | `None`: 除 YAML Key Priority Sort Order 文本框中内容外不做其他排序<br/><br/>`Ascending Alphabetical`: 按键值从 a 到 z 排序<br/><br/>`Descending Alphabetical`: 按键值从 z 到 a 排序 | `None` |



### 示例

<details><summary>按 `YAML key priority sort order` 指定的顺序（排序顺序为 `date type language`）对 YAML 键排序</summary>

修改前：

`````` markdown
---
language: Typescript
type: programming
tags: computer
keywords: []
status: WIP
date: 02/15/2022
---
``````

修改后：

`````` markdown
---
date: 02/15/2022
type: programming
language: Typescript
tags: computer
keywords: []
status: WIP
---
``````
</details>
<details><summary>按 `YAML key priority sort order` 指定的顺序（排序顺序为 `date type language`）对 YAML 键排序，且 `'YAML sort order for other keys' = Ascending Alphabetical`</summary>

修改前：

`````` markdown
---
language: Typescript
type: programming
tags: computer
keywords: []
status: WIP
date: 02/15/2022
---
``````

修改后：

`````` markdown
---
date: 02/15/2022
type: programming
language: Typescript
keywords: []
status: WIP
tags: computer
---
``````
</details>
<details><summary>按 `YAML key priority sort order` 指定的顺序（排序顺序为 `date type language`）对 YAML 键排序，且 `'YAML sort order for other keys' = Descending Alphabetical`</summary>

修改前：

`````` markdown
---
language: Typescript
type: programming
tags: computer
keywords: []
status: WIP
date: 02/15/2022
---
``````

修改后：

`````` markdown
---
date: 02/15/2022
type: programming
language: Typescript
tags: computer
status: WIP
keywords: []
---
``````
</details>
<details><summary>按 `YAML key priority sort order` 指定的顺序（排序顺序为 `date type language`）对 YAML 键排序，且 `'YAML sort order for other keys' = Descending Alphabetical`、`'Priority keys at start of YAML' = false`</summary>

修改前：

`````` markdown
---
language: Typescript
type: programming
tags: computer
keywords: []

status: WIP
date: 02/15/2022
---
Any blank line is attached to the line that follows it
``````

修改后：

`````` markdown
---
tags: computer

status: WIP
keywords: []
date: 02/15/2022
type: programming
language: Typescript
---
Any blank line is attached to the line that follows it
``````
</details>

## YAML timestamp

Alias: `yaml-timestamp`

在 YAML frontmatter 中记录文件最后编辑的日期。日期信息取自文件元数据。

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Date created` | 插入文件创建日期 | N/A | `true` |
| `Date created key` | 用于创建日期的 YAML 键 | N/A | `date created` |
| `Date created source of truth` | 当 frontmatter 中已存在创建日期时，指定从何处获取创建日期的值。 | `file system`: 使用文件系统的创建日期值来设置 frontmatter 中创建日期的值<br/><br/>`frontmatter`: 当 frontmatter 中已存在创建日期时，使用此值作为创建日期的值 | `file system` |
| `Date modified` | 插入文件最后修改的日期 | N/A | `true` |
| `Date modified key` | 用于修改日期的 YAML 键 | N/A | `date modified` |
| `Date modified source of truth` | 当 frontmatter 中已存在修改日期时，指定以何种方式判断修改日期是否应被更新。 | `file system`: 使用文件系统的修改日期值来设置 frontmatter 中修改日期的值<br/><br/>`user or Linter edits`: 当 frontmatter 中已存在修改日期时，除非 Linter 对笔记进行了修改，或用户编辑了笔记且设置 `Update YAML timestamp on file contents update` 设为非 `Never` 的值，否则修改日期保持不变。 | `file system` |
| `Format` | 要使用的 Moment 日期格式（参见 <a href="https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/">Moment 格式选项</a>） | N/A | `dddd, MMMM Do YYYY, h:mm:ss a` |
| `Convert local time to UTC` | 使用与 UTC 等价的时间保存日期，而不是本地时间 | N/A | false |
| `Update YAML timestamp on file contents update` | 当当前活动的笔记被修改时，对该笔记运行 <code>YAML timestamp</code>。如果与当前值的差距超过 5 秒，应会更新修改时间戳。 | `never`: 从不<br/><br/>`after 5 seconds`: 5 秒后<br/><br/>`after 10 seconds`: 10 秒后<br/><br/>`after 15 seconds`: 15 秒后<br/><br/>`after 30 seconds`: 30 秒后<br/><br/>`after 1 minute`: 1 分后 | `never` |

### Additional Info


#### 修改日期值的来源

修改日期_并非_基于文件修改日期元数据。这是因为 Linter 只有在运行时才能访问到最后修改日期。当你频繁修改文件时，这不是问题，也不太明显。
但当文件很少更新时，修改日期可能严重过时。

举例来说，假设修改日期是 2020 年 1 月 22 日，但你在 2021 年 1 月 3 日更新了该文件。YAML frontmatter 中的修改日期会显示为 2020 年 1 月 22 日，尽管它实际上是在 2021 年更新的。如果你没有对文件再次运行 Linter，它可能会留下一个非常误导人的值。因此，修改日期是 Linter 通过除自定义命令以外的任何规则请求更新文件的时间。这应该在文件元数据中值的 5 秒以内。


### 示例

<details><summary>添加一个包含日期的头部。</summary>

修改前：

`````` markdown
# H1
``````

修改后：

`````` markdown
---
date created: Wednesday, January 1st 2020, 12:00:00 am
date modified: Thursday, January 2nd 2020, 12:00:05 am
---
# H1
``````
</details>
<details><summary>dateCreated 选项为 false</summary>

修改前：

`````` markdown
# H1
``````

修改后：

`````` markdown
---
date modified: Thursday, January 2nd 2020, 12:00:05 am
---
# H1
``````
</details>
<details><summary>设置了创建日期键（Date created key）</summary>

修改前：

`````` markdown
# H1
``````

修改后：

`````` markdown
---
created: Wednesday, January 1st 2020, 12:00:00 am
---
# H1
``````
</details>
<details><summary>设置了修改日期键（Date modified key）</summary>

修改前：

`````` markdown
# H1
``````

修改后：

`````` markdown
---
modified: Wednesday, January 1st 2020, 4:00:00 pm
---
# H1
``````
</details>
<details><summary>设置了头部，且转换 UTC 选项为 true</summary>

修改前：

`````` markdown
# H1
``````

修改后：

`````` markdown
---
date created: 2020-01-01T14:00:00+00:00
date modified: 2020-01-02T02:00:05+00:00
---
# H1
``````
</details>
<details><summary>dateCreated 选项为 false，且转换 UTC 选项为 true</summary>

修改前：

`````` markdown
# H1
``````

修改后：

`````` markdown
---
date modified: 2020-01-02T02:00:05+00:00
---
# H1
``````
</details>
<details><summary>设置了创建日期键，且转换 UTC 选项为 true</summary>

修改前：

`````` markdown
# H1
``````

修改后：

`````` markdown
---
created: 2020-01-01T14:00:00+00:00
---
# H1
``````
</details>
<details><summary>设置了修改日期键，且转换 UTC 选项为 true</summary>

修改前：

`````` markdown
# H1
``````

修改后：

`````` markdown
---
modified: 2020-01-02T02:00:05+00:00
---
# H1
``````
</details>

## YAML title

Alias: `yaml-title`

将文件的标题插入到 YAML frontmatter 中。根据所选模式获取标题。

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Title key` | 用于标题的 YAML 键 | N/A | `title` |
| `Mode` | 获取标题的方法 | `first-h1-or-filename-if-h1-missing`: 使用文件中的第一个 H1，如果没有 H1 则使用文件名<br/><br/>`filename`: 使用文件名作为标题<br/><br/>`first-h1`: 使用文件中的第一个 H1 作为标题 | `first-h1-or-filename-if-h1-missing` |



### 示例

<details><summary>当 `mode = 'First H1 or filename if H1 missing'` 时，根据标题添加包含标题的头部。</summary>

修改前：

`````` markdown
# Obsidian
``````

修改后：

`````` markdown
---
title: Obsidian
---
# Obsidian
``````
</details>
<details><summary>当 `mode = 'First H1 or filename if H1 missing'` 时，添加包含标题的头部。</summary>

修改前：

`````` markdown

``````

修改后：

`````` markdown
---
title: Filename
---

``````
</details>
<details><summary>当 `mode = 'First H1 or filename if H1 missing'` 时，确保标题中的 Markdown 链接作为纯文本正确复制到 YAML 中</summary>

修改前：

`````` markdown
# This is a [Heading](test heading.md)
``````

修改后：

`````` markdown
---
title: This is a Heading
---
# This is a [Heading](test heading.md)
``````
</details>
<details><summary>当 `mode = 'First H1'` 且没有 H1 时，标题没有值</summary>

修改前：

`````` markdown
## This is a Heading
``````

修改后：

`````` markdown
---
title: ""
---
## This is a Heading
``````
</details>
<details><summary>当 `mode = 'Filename'` 时，标题使用文件名，忽略所有 H1。注意：本示例中的文件名是 "Filename"。</summary>

修改前：

`````` markdown
# This is a Heading
``````

修改后：

`````` markdown
---
title: Filename
---
# This is a Heading
``````
</details>

## YAML title alias

Alias: `yaml-title-alias`

将文件的标题插入或更新到 YAML frontmatter 的 aliases 区段中。标题取自第一个 H1 或文件名。

### 选项

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Preserve existing aliases section style` | 若启用，<code>YAML aliases section style</code> 设置仅适用于新创建的区段 | N/A | `true` |
| `Keep alias that matches the filename` | 此类别名通常是冗余的 | N/A | false |
| `Use the YAML key specified by <code>Alias helper key</code> to help with filename and heading changes` | 若启用，当第一个 H1 标题发生变化，或当第一个 H1 缺失时文件名发生变化，此键中存储的旧别名将被替换为新值，而不是仅在 aliases 数组中插入新条目 | N/A | `true` |
| `Alias helper key` | 用于帮助记录本规则上次存入 frontmatter 中的文件名或标题的键。 | N/A | `linter-yaml-title-alias` |

### Additional Info


!!! Note
    空的 `Alias Helper Key` 会被视为你使用了 `linter-yaml-title-alias` 作为值。


### 示例

<details><summary>根据标题添加包含标题的头部。</summary>

修改前：

`````` markdown
# Obsidian
``````

修改后：

`````` markdown
---
aliases:
  - Obsidian
linter-yaml-title-alias: Obsidian
---
# Obsidian
``````
</details>
<details><summary>当 YAML 键的使用设置为 false 时，根据标题添加包含标题的头部，但不带 YAML 键。</summary>

修改前：

`````` markdown
# Obsidian
``````

修改后：

`````` markdown
---
aliases:
  - Obsidian
---
# Obsidian
``````
</details>
<details><summary>添加包含标题的头部。</summary>

修改前：

`````` markdown

``````

修改后：

`````` markdown
---
aliases:
  - Filename
linter-yaml-title-alias: Filename
---

``````
</details>
<details><summary>当 YAML 键的使用设置为 false 时，添加包含标题的头部，但不带 YAML 键。</summary>

修改前：

`````` markdown

``````

修改后：

`````` markdown
---
aliases:
  - Filename
---

``````
</details>
<details><summary>当没有标题、且文件名与 `linter-yaml-title-alias` 中列出的旧文件名不同时，将旧文件名替换为新文件名。</summary>

修改前：

`````` markdown
---
aliases:
  - Old Filename
  - Alias 2
linter-yaml-title-alias: Old Filename
---

``````

修改后：

`````` markdown
---
aliases:
  - Filename
  - Alias 2
linter-yaml-title-alias: Filename
---

``````
</details>
<details><summary>确保第一个 H1 中的 Markdown 链接和 wiki 链接的值会被转换为纯文本</summary>

修改前：

`````` markdown
# This is a [Heading](markdown.md)
``````

修改后：

`````` markdown
---
aliases:
  - This is a Heading
linter-yaml-title-alias: This is a Heading
---
# This is a [Heading](markdown.md)
``````
</details>
<details><summary>将 `title` 用作 `Alias helper key` 时，会把别名赋给 `title` 的值。</summary>

修改前：

`````` markdown

``````

修改后：

`````` markdown
---
aliases:
  - Filename
title: Filename
---

``````
</details>
