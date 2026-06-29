<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# 内容规则


## 自动纠正常见拼写错误

别名：`auto-correct-common-misspellings`

使用常见拼写错误词典将单词自动转换为正确拼写。完整列表请参见 <a href="https://github.com/platers/obsidian-linter/tree/master/src/utils/default-misspellings.md">自动纠正映射表</a>。<b>注意：此列表可作用于多种语言的文本，但无论当前使用何种语言，列表内容都是相同的。</b>

### 选项

| 名称 | 描述 | 列表项 | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Ignore words` | 自动纠正时要忽略的小写单词列表，以逗号分隔 | N/A |  |
| `Skip words with multiple capitals` | 跳过除首字母外还包含其他大写字母的单词。首字母缩写词和其他某些单词可由此受益。但这也可能导致专有名词无法被正确修复。 | N/A | false |
| `Extra auto-correct source files` | 这些文件中包含一个 Markdown 表格，列出原始单词及其纠正后的单词（这些纠正是大小写不敏感的）。<b>注意：所用表格的每一行都应包含起始和结束的 <code>\|</code> 标记。</b> | N/A |  |

### 补充信息


#### 如何使用自定义拼写错误

该规则基于一份默认的常见拼写错误列表来工作。
但在某些情况下，用户可能希望添加自己需要处理的拼写错误列表。
此时，可以将包含自定义拼写错误的文件添加到文件列表中。

##### 格式

包含自定义拼写错误的文件可以包含任意内容。但只有位于双列表格中的内容才会被解析为自定义拼写错误。例如，下表会将 `th` 替换为 `the`，将 `tht` 替换为 `that`：

``` markdown
The following is a table with custom misspellings:
| Replace | With |
| ------- | ---- |
| th | the |
| tht | that |
```

!!! Note
    表格的前两行（表头和分隔行）会被跳过，之后的所有行必须以竖线（`|`）开头和结尾。如果某行不以竖线开头或结尾，或包含超过 2 列，则该行会被跳过。

##### 当前限制

- 自定义替换列表仅在插件首次对文件进行 lint 检查时，或当文件被添加到包含自定义拼写错误的文件列表中时，才会自动加载
    - 可以在「自动纠正常见拼写错误」设置中手动重新解析自定义拼写错误文件
- 无法指定某个单词始终首字母大写
    - 这是由于自动纠正规则的设计方式决定的：它会将替换词的首字母改为与被替换词首字母相同的大小写形式


### 示例

<details><summary>自动纠正普通文本中的拼写错误，但不处理代码块、数学公式块、YAML 和标签</summary>

修改前：

`````` markdown
---
key: absoltely
---

I absoltely hate when my codeblocks get formatted when they should not be.

```
# comments absoltely can be helpful, but they can also be misleading
```

Note that inline code also has the applicable spelling errors ignored: `absoltely` 

$$
Math block absoltely does not get auto-corrected.
$$

The same $ defenately $ applies to inline math.

#defenately stays the same
``````

修改后：

`````` markdown
---
key: absoltely
---

I absolutely hate when my codeblocks get formatted when they should not be.

```
# comments absoltely can be helpful, but they can also be misleading
```

Note that inline code also has the applicable spelling errors ignored: `absoltely` 

$$
Math block absoltely does not get auto-corrected.
$$

The same $ defenately $ applies to inline math.

#defenately stays the same
``````
</details>
<details><summary>自动纠正拼写错误时保留首字母的大小写</summary>

修改前：

`````` markdown
Accodringly we made sure to update logic to make sure it would handle case sensitivity.
``````

修改后：

`````` markdown
Accordingly we made sure to update logic to make sure it would handle case sensitivity.
``````
</details>
<details><summary>链接不应被自动纠正</summary>

修改前：

`````` markdown
http://www.Absoltely.com should not be corrected
``````

修改后：

`````` markdown
http://www.Absoltely.com should not be corrected
``````
</details>
<details><summary>启用 `Skip Words with Multiple Capitals` 时，自动纠正会跳过包含多个大写字母的单词</summary>

修改前：

`````` markdown
HSA here will not be auto-corrected to Has since it has more than one capital letter.
aADD will not be converted to add.
But this also affects javaSrript(what should be JavaScript) and other proper names as well which will not be auto-corrected.
``````

修改后：

`````` markdown
HSA here will not be auto-corrected to Has since it has more than one capital letter.
aADD will not be converted to add.
But this also affects javaSrript(what should be JavaScript) and other proper names as well which will not be auto-corrected.
``````
</details>

## 引用块样式

别名：`blockquote-style`

确保引用块样式的一致性。

### 选项

| 名称 | 描述 | 列表项 | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Style` | 引用块标记所用的样式 | `space`：> 标记后跟一个空格<br/><br/>`no space`：> 标记后不跟空格 | `space` |



### 示例

<details><summary>当样式 = `space` 时，会在缺少空格的引用块标记后添加空格</summary>

修改前：

`````` markdown
>Blockquotes will have a space added if one is not present
> Will be left as is.

> Nested blockquotes are also updated
>>Nesting levels are handled correctly
>> Even when only partially needing updates
> >Updated as well
>>>>>>> Is handled too
> > >>> As well

> <strong>Note that html is not affected in blockquotes</strong>
``````

修改后：

`````` markdown
> Blockquotes will have a space added if one is not present
> Will be left as is.

> Nested blockquotes are also updated
> > Nesting levels are handled correctly
> > Even when only partially needing updates
> > Updated as well
> > > > > > > Is handled too
> > > > > As well

> <strong>Note that html is not affected in blockquotes</strong>
``````
</details>
<details><summary>当样式 = `no space` 时，移除引用块标记后的空格</summary>

修改前：

`````` markdown
>    Multiple spaces are removed
> > Nesting is handled
> > > > >  Especially when multiple levels are involved
> >>> > Even when partially correct already, it is handled
``````

修改后：

`````` markdown
>Multiple spaces are removed
>>Nesting is handled
>>>>>Especially when multiple levels are involved
>>>>>Even when partially correct already, it is handled
``````
</details>

## 转换无序列表标记

别名：`convert-bullet-list-markers`

将常见的无序列表标记符号转换为 Markdown 列表标记。





### 示例

<details><summary>转换 •</summary>

修改前：

`````` markdown
• item 1
• item 2
``````

修改后：

`````` markdown
- item 1
- item 2
``````
</details>
<details><summary>转换 §</summary>

修改前：

`````` markdown
• item 1
  § item 2
  § item 3
``````

修改后：

`````` markdown
- item 1
  - item 2
  - item 3
``````
</details>

## 代码块默认语言

别名：`default-language-for-code-fences`

为未指定语言的代码块添加默认语言。

### 选项

| 名称 | 描述 | 列表项 | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Programming language` | 留空则不进行任何操作。语言标签可参见 <a href="https://prismjs.com/#supported-languages">此处</a>。 | N/A |  |



### 示例

<details><summary>为未指定语言的代码块添加默认语言 `javascript`</summary>

修改前：

`````` markdown
```
var temp = 'text';
// this is a code block
```
``````

修改后：

`````` markdown
```javascript
var temp = 'text';
// this is a code block
```
``````
</details>
<details><summary>如果代码块已指定语言，则不作更改</summary>

修改前：

`````` markdown
```javascript
var temp = 'text';
// this is a code block
```
``````

修改后：

`````` markdown
```javascript
var temp = 'text';
// this is a code block
```
``````
</details>
<details><summary>默认语言为空字符串时不会为代码块添加语言</summary>

修改前：

`````` markdown
```
var temp = 'text';
// this is a code block
```
``````

修改后：

`````` markdown
```
var temp = 'text';
// this is a code block
```
``````
</details>

## 强调样式

别名：`emphasis-style`

确保强调样式的一致性。

### 选项

| 名称 | 描述 | 列表项 | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Style` | 用于表示强调内容的样式 | `consistent`：确保整个文档使用与第一个强调标记相同的样式<br/><br/>`asterisk`：确保使用 * 作为强调标记<br/><br/>`underscore`：确保使用 _ 作为强调标记 | `consistent` |



### 示例

<details><summary>当样式设置为 'underscore' 时，强调标记应使用下划线</summary>

修改前：

`````` markdown
# Emphasis Cases

*Test emphasis*
* Test not emphasized *
This is *emphasized* mid sentence
This is *emphasized* mid sentence with a second *emphasis* on the same line
This is ***bold and emphasized***
This is ***nested bold** and ending emphasized*
This is ***nested emphasis* and ending bold**

**Test bold**

* List Item1 with *emphasized text*
* List Item2
``````

修改后：

`````` markdown
# Emphasis Cases

_Test emphasis_
* Test not emphasized *
This is _emphasized_ mid sentence
This is _emphasized_ mid sentence with a second _emphasis_ on the same line
This is _**bold and emphasized**_
This is _**nested bold** and ending emphasized_
This is **_nested emphasis_ and ending bold**

**Test bold**

* List Item1 with _emphasized text_
* List Item2
``````
</details>
<details><summary>当样式设置为 'asterisk' 时，强调标记应使用星号</summary>

修改前：

`````` markdown
# Emphasis Cases

_Test emphasis_
_ Test not emphasized _
This is _emphasized_ mid sentence
This is _emphasized_ mid sentence with a second _emphasis_ on the same line
This is ___bold and emphasized___
This is ___nested bold__ and ending emphasized_
This is ___nested emphasis_ and ending bold__

__Test bold__
``````

修改后：

`````` markdown
# Emphasis Cases

*Test emphasis*
_ Test not emphasized _
This is *emphasized* mid sentence
This is *emphasized* mid sentence with a second *emphasis* on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is __*nested emphasis* and ending bold__

__Test bold__
``````
</details>
<details><summary>当样式设置为 'consistent' 时，强调标记会根据文件中第一个强调标记保持一致的样式</summary>

修改前：

`````` markdown
# Emphasis First Emphasis Is an Asterisk

*First emphasis*
This is _emphasized_ mid sentence
This is *emphasized* mid sentence with a second _emphasis_ on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is **_nested emphasis_ and ending bold**

__Test bold__
``````

修改后：

`````` markdown
# Emphasis First Emphasis Is an Asterisk

*First emphasis*
This is *emphasized* mid sentence
This is *emphasized* mid sentence with a second *emphasis* on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is ***nested emphasis* and ending bold**

__Test bold__
``````
</details>
<details><summary>当样式设置为 'consistent' 时，强调标记会根据文件中第一个强调标记保持一致的样式</summary>

修改前：

`````` markdown
# Emphasis First Emphasis Is an Underscore

**_First emphasis_**
This is _emphasized_ mid sentence
This is *emphasized* mid sentence with a second _emphasis_ on the same line
This is *__bold and emphasized__*
This is _**nested bold** and ending emphasized_
This is __*nested emphasis* and ending bold__

__Test bold__
``````

修改后：

`````` markdown
# Emphasis First Emphasis Is an Underscore

**_First emphasis_**
This is _emphasized_ mid sentence
This is _emphasized_ mid sentence with a second _emphasis_ on the same line
This is ___bold and emphasized___
This is _**nested bold** and ending emphasized_
This is ___nested emphasis_ and ending bold__

__Test bold__
``````
</details>

## 禁止裸链接

别名：`no-bare-urls`

将裸 URL 用尖括号包裹，除非它们已被反引号、方括号、单引号或双引号包裹。

### 选项

| 名称 | 描述 | 列表项 | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `No bare URIs` | 尝试用尖括号包裹裸 URI，除非它们已被反引号、方括号、单引号或双引号包裹。 | N/A | false |



### 示例

<details><summary>确保链接在单引号(')、双引号(")或反引号(`)之外时被包裹在尖括号中</summary>

修改前：

`````` markdown
https://github.com
braces around url should stay the same: [https://github.com]
backticks around url should stay the same: `https://github.com`
Links mid-sentence should be updated like https://google.com will be.
'https://github.com'
"https://github.com"
<https://github.com>
links should stay the same: [](https://github.com)
https://gitlab.com
``````

修改后：

`````` markdown
<https://github.com>
braces around url should stay the same: [https://github.com]
backticks around url should stay the same: `https://github.com`
Links mid-sentence should be updated like <https://google.com> will be.
'https://github.com'
"https://github.com"
<https://github.com>
links should stay the same: [](https://github.com)
<https://gitlab.com>
``````
</details>
<details><summary>当 URL 不是单引号(')或双引号(")中唯一的内容时，会添加尖括号</summary>

修改前：

`````` markdown
[https://github.com some text here]
backticks around a url should stay the same: `https://github.com some text here`
single quotes around a url should stay the same, but only if the contents of the single quotes is the url: 'https://github.com some text here'
double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "https://github.com some text here"
``````

修改后：

`````` markdown
[<https://github.com> some text here]
backticks around a url should stay the same: `https://github.com some text here`
single quotes around a url should stay the same, but only if the contents of the single quotes is the url: '<https://github.com> some text here'
double quotes around a url should stay the same, but only if the contents of the double quotes is the url: "<https://github.com> some text here"
``````
</details>
<details><summary>URL 起始或结尾处的多个尖括号会被缩减为一个</summary>

修改前：

`````` markdown
<<https://github.com>
<https://google.com>>
<<https://gitlab.com>>
``````

修改后：

`````` markdown
<https://github.com>
<https://google.com>
<https://gitlab.com>
``````
</details>
<details><summary>启用 `No Bare URIs` 时，会用尖括号包裹 URI</summary>

修改前：

`````` markdown
obsidian://show-plugin?id=cycle-in-sidebar
``````

修改后：

`````` markdown
<obsidian://show-plugin?id=cycle-in-sidebar>
``````
</details>

## 有序列表样式

别名：`ordered-list-style`

确保有序列表遵循指定的样式。<b>注意：2 个空格或 1 个制表符被视为一个缩进层级。</b>

### 选项

| 名称 | 描述 | 列表项 | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Number style` | 有序列表标记所用的数字样式 | `ascending`：确保有序列表项编号递增（即 1、2、3 等）<br/><br/>`lazy`：确保有序列表项编号全部相同<br/><br/>`preserve`：保留有序列表项编号原样 | `ascending` |
| `Ordered list marker end style` | 有序列表标记的结束字符 | `.`：确保有序列表项编号以 '.' 结尾（即 `1.`）<br/><br/>`)`：确保有序列表项编号以 ')' 结尾（即 `1)`） | `.` |
| `Preserve starting number` | 是否保留有序列表的起始编号。可用于在有序列表项之间插入其他内容的情况。 | N/A | `undefined` |



### 示例

<details><summary>当 Number style 为 `ascending` 时，有序列表项按升序编号。</summary>

修改前：

`````` markdown
1. Item 1
2. Item 2
4. Item 3

Some text here

1. Item 1
1. Item 2
1. Item 3
``````

修改后：

`````` markdown
1. Item 1
2. Item 2
3. Item 3

Some text here

1. Item 1
2. Item 2
3. Item 3
``````
</details>
<details><summary>当 Number style 为 `ascending` 时，嵌套有序列表项按升序编号。</summary>

修改前：

`````` markdown
1. Item 1
2. Item 2
  1. Subitem 1
  5. Subitem 2
  2. Subitem 3
4. Item 3
``````

修改后：

`````` markdown
1. Item 1
2. Item 2
  1. Subitem 1
  2. Subitem 2
  3. Subitem 3
3. Item 3
``````
</details>
<details><summary>当 Number style 为 `lazy` 时，引用块中的有序列表项被设置为 '1.'。</summary>

修改前：

`````` markdown
> 1. Item 1
> 4. Item 2
> > 1. Subitem 1
> > 5. Subitem 2
> > 2. Subitem 3
``````

修改后：

`````` markdown
> 1. Item 1
> 1. Item 2
> > 1. Subitem 1
> > 1. Subitem 2
> > 1. Subitem 3
``````
</details>
<details><summary>当 Number style 为 `ascending` 时，引用块中的有序列表项按升序编号。</summary>

修改前：

`````` markdown
> 1. Item 1
> 4. Item 2
> > 1. Subitem 1
> > 5. Subitem 2
> > 2. Subitem 3
``````

修改后：

`````` markdown
> 1. Item 1
> 2. Item 2
> > 1. Subitem 1
> > 2. Subitem 2
> > 3. Subitem 3
``````
</details>
<details><summary>当 Number style 为 `lazy` 且 Ordered list indicator end style 为 `)` 时，嵌套有序列表项被设置为 '1)'。</summary>

修改前：

`````` markdown
1. Item 1
2. Item 2
  1. Subitem 1
  5. Subitem 2
  2. Subitem 3
4. Item 3
``````

修改后：

`````` markdown
1) Item 1
1) Item 2
  1) Subitem 1
  1) Subitem 2
  1) Subitem 3
1) Item 3
``````
</details>
<details><summary>当 Number style 为 `ascending` 且启用 `preserveStart` 时，有序列表项使用初始编号按升序编号</summary>

修改前：

`````` markdown
1. Item 1
2. Item 2
4. Item 3

Some text here

4. Item 4
5. Item 5
7. Item 6
``````

修改后：

`````` markdown
1. Item 1
2. Item 2
3. Item 3

Some text here

4. Item 4
5. Item 5
6. Item 6
``````
</details>
<details><summary>当 Number style 为 `ascending` 且启用 `preserveStart` 时，嵌套有序列表项使用初始编号按升序编号</summary>

修改前：

`````` markdown
4. Item 4
2. Item 5
  2. Subitem 2
  5. Subitem 3
  2. Subitem 4
4. Item 6
``````

修改后：

`````` markdown
4. Item 4
5. Item 5
  2. Subitem 2
  3. Subitem 3
  4. Subitem 4
6. Item 6
``````
</details>
<details><summary>当 Number style 为 `lazy` 且启用 `preserveStart` 时，有序列表项被设置为初始编号</summary>

修改前：

`````` markdown
2. Item 2
5. Item 3
4. Item 4
``````

修改后：

`````` markdown
2. Item 2
2. Item 3
2. Item 4
``````
</details>
<details><summary>当 Number style 为 `lazy` 且启用 `preserveStart` 时，嵌套有序列表项被设置为初始编号</summary>

修改前：

`````` markdown
4. Item 4
2. Item 5
  2. Subitem 2
  5. Subitem 3
  2. Subitem 4
4. Item 6
``````

修改后：

`````` markdown
4. Item 4
4. Item 5
  2. Subitem 2
  2. Subitem 3
  2. Subitem 4
4. Item 6
``````
</details>
<details><summary>当 Number style 为 `preserve` 时，有序列表项不作修改</summary>

修改前：

`````` markdown
4. Item 4
2. Item 5
  2. Subitem 2
  5. Subitem 3
  2. Subitem 4
4. Item 6
``````

修改后：

`````` markdown
4. Item 4
2. Item 5
  2. Subitem 2
  5. Subitem 3
  2. Subitem 4
4. Item 6
``````
</details>

## 正确的省略号

别名：`proper-ellipsis`

将三个连续的句点替换为省略号。





### 示例

<details><summary>将三个连续的句点替换为省略号。</summary>

修改前：

`````` markdown
Lorem (...) Impsum.
``````

修改后：

`````` markdown
Lorem (…) Impsum.
``````
</details>

## 引号样式

别名：`quote-style`

将正文内容中的引号更新为指定的单引号和双引号样式。

### 选项

| 名称 | 描述 | 列表项 | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Enable <code>Single quote style</code>` | 指定是否使用所选的单引号样式。 | N/A | `true` |
| `Single quote style` | 要使用的单引号样式。 | `''`：使用 "'" 而非智能单引号<br/><br/>`‘’`：使用 "‘" 和 "’" 而非直单引号 | `''` |
| `Enable <code>Double quote style</code>` | 指定是否使用所选的双引号样式。 | N/A | `true` |
| `Double quote style` | 要使用的双引号样式。 | `""`：使用 '"' 而非智能双引号<br/><br/>`“”`：使用 '“' 和 '”' 而非直双引号 | `""` |



### 示例

<details><summary>当样式设置为 `Straight` 时，文件中的智能引号会被转换为直引号</summary>

修改前：

`````` markdown
# Double Quote Cases
“There are a bunch of different kinds of smart quote indicators”
„More than you would think”
«Including this one for Spanish»
# Single Quote Cases
‘Simple smart quotes get replaced’
‚Another single style smart quote also gets replaced’
‹Even this style of single smart quotes is replaced›
``````

修改后：

`````` markdown
# Double Quote Cases
"There are a bunch of different kinds of smart quote indicators"
"More than you would think"
"Including this one for Spanish"
# Single Quote Cases
'Simple smart quotes get replaced'
'Another single style smart quote also gets replaced'
'Even this style of single smart quotes is replaced'
``````
</details>
<details><summary>当样式设置为 `Smart` 时，文件中的直引号会被转换为智能引号</summary>

修改前：

`````` markdown
"As you can see, these double quotes will be converted to smart quotes"
"Common contractions are handled as well. For example can't is updated to smart quotes."
"Nesting a quote in a quote like so: 'here I am' is handled correctly"
'Single quotes by themselves are handled correctly'
Possessives are handled correctly: Pam's dog is really cool!
Templater commands are ignored: <% tp.date.now("YYYY-MM-DD", 7) %>

Be careful as converting straight quotes to smart quotes requires you to have an even amount of quotes
once possessives and common contractions have been dealt with. If not, it will throw an error.
``````

修改后：

`````` markdown
“As you can see, these double quotes will be converted to smart quotes”
“Common contractions are handled as well. For example can’t is updated to smart quotes.”
“Nesting a quote in a quote like so: ‘here I am’ is handled correctly”
‘Single quotes by themselves are handled correctly’
Possessives are handled correctly: Pam’s dog is really cool!
Templater commands are ignored: <% tp.date.now("YYYY-MM-DD", 7) %>

Be careful as converting straight quotes to smart quotes requires you to have an even amount of quotes
once possessives and common contractions have been dealt with. If not, it will throw an error.
``````
</details>

## 移除连续的列表标记

别名：`remove-consecutive-list-markers`

移除连续的列表标记。在复制粘贴列表项时非常有用。





### 示例

<details><summary>移除连续的列表标记。</summary>

修改前：

`````` markdown
- item 1
- - copypasted item A
- item 2
  - indented item
  - - copypasted item B
``````

修改后：

`````` markdown
- item 1
- copypasted item A
- item 2
  - indented item
  - copypasted item B
``````
</details>

## 移除空列表标记

别名：`remove-empty-list-markers`

移除没有内容的空列表项（即空列表标记）。





### 示例

<details><summary>移除空列表标记。</summary>

修改前：

`````` markdown
- item 1
-
- item 2

* list 2 item 1
    *
* list 2 item 2

+ list 3 item 1
+
+ list 3 item 2
``````

修改后：

`````` markdown
- item 1
- item 2

* list 2 item 1
* list 2 item 2

+ list 3 item 1
+ list 3 item 2
``````
</details>
<details><summary>移除空的有序列表标记。</summary>

修改前：

`````` markdown
1. item 1
2.
3. item 2

1. list 2 item 1
2. list 2 item 2
3. 

_Note that this rule does not make sure that the ordered list is sequential after removal_
``````

修改后：

`````` markdown
1. item 1
3. item 2

1. list 2 item 1
2. list 2 item 2

_Note that this rule does not make sure that the ordered list is sequential after removal_
``````
</details>
<details><summary>移除空的清单标记。</summary>

修改前：

`````` markdown
- [ ]  item 1
- [x]
- [ ] item 2
- [ ]   

_Note that this will affect checked and uncheck checked list items_
``````

修改后：

`````` markdown
- [ ]  item 1
- [ ] item 2

_Note that this will affect checked and uncheck checked list items_
``````
</details>
<details><summary>移除 Callout / 引用块中的空列表、清单和有序列表标记</summary>

修改前：

`````` markdown
> Checklist in blockquote
> - [ ]  item 1
> - [x]
> - [ ] item 2
> - [ ]   

> Ordered List in blockquote
> > 1. item 1
> > 2.
> > 3. item 2
> > 4.  

> Regular lists in blockquote
>
> - item 1
> -
> - item 2
>
> List 2
>
> * item 1
>     *
> * list 2 item 2
>
> List 3
>
> + item 1
> + 
> + item 2
``````

修改后：

`````` markdown
> Checklist in blockquote
> - [ ]  item 1
> - [ ] item 2

> Ordered List in blockquote
> > 1. item 1
> > 3. item 2

> Regular lists in blockquote
>
> - item 1
> - item 2
>
> List 2
>
> * item 1
> * list 2 item 2
>
> List 3
>
> + item 1
> + item 2
``````
</details>

## 移除带连字符的换行

别名：`remove-hyphenated-line-breaks`

移除带连字符的换行（断字）。在粘贴教材文本时非常有用。





### 示例

<details><summary>移除带连字符的换行。</summary>

修改前：

`````` markdown
This text has a linebr‐ eak.
``````

修改后：

`````` markdown
This text has a linebreak.
``````
</details>

## 移除多个空格

别名：`remove-multiple-spaces`

移除两个或更多连续空格。忽略行首和行尾的空格。





### 示例

<details><summary>移除双空格和三空格。</summary>

修改前：

`````` markdown
Lorem ipsum   dolor  sit amet.
``````

修改后：

`````` markdown
Lorem ipsum dolor sit amet.
``````
</details>

## 加粗样式

别名：`strong-style`

确保加粗样式的一致性。

### 选项

| 名称 | 描述 | 列表项 | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Style` | 用于表示加粗内容的样式 | `consistent`：确保整个文档使用与第一个加粗标记相同的样式<br/><br/>`asterisk`：确保使用 ** 作为加粗标记<br/><br/>`underscore`：确保使用 __ 作为加粗标记 | `consistent` |



### 示例

<details><summary>当样式设置为 'underscore' 时，加粗标记应使用下划线</summary>

修改前：

`````` markdown
# Strong/Bold Cases

**Test bold**
** Test not bold **
This is **bold** mid sentence
This is **bold** mid sentence with a second **bold** on the same line
This is ***bold and emphasized***
This is ***nested bold** and ending emphasized*
This is ***nested emphasis* and ending bold**

*Test emphasis*

* List Item1 with **bold text**
* List Item2
``````

修改后：

`````` markdown
# Strong/Bold Cases

__Test bold__
** Test not bold **
This is __bold__ mid sentence
This is __bold__ mid sentence with a second __bold__ on the same line
This is *__bold and emphasized__*
This is *__nested bold__ and ending emphasized*
This is __*nested emphasis* and ending bold__

*Test emphasis*

* List Item1 with __bold text__
* List Item2
``````
</details>
<details><summary>当样式设置为 'asterisk' 时，加粗标记应使用星号</summary>

修改前：

`````` markdown
# Strong/Bold Cases

__Test bold__
__ Test not bold __
This is __bold__ mid sentence
This is __bold__ mid sentence with a second __bold__ on the same line
This is ___bold and emphasized___
This is ___nested bold__ and ending emphasized_
This is ___nested emphasis_ and ending bold__

_Test emphasis_
``````

修改后：

`````` markdown
# Strong/Bold Cases

**Test bold**
__ Test not bold __
This is **bold** mid sentence
This is **bold** mid sentence with a second **bold** on the same line
This is _**bold and emphasized**_
This is _**nested bold** and ending emphasized_
This is **_nested emphasis_ and ending bold**

_Test emphasis_
``````
</details>
<details><summary>当样式设置为 'consistent' 时，加粗标记会根据文件中第一个加粗标记保持一致的样式</summary>

修改前：

`````` markdown
# Strong First Strong Is an Asterisk

**First bold**
This is __bold__ mid sentence
This is __bold__ mid sentence with a second **bold** on the same line
This is ___bold and emphasized___
This is *__nested bold__ and ending emphasized*
This is **_nested emphasis_ and ending bold**

__Test bold__
``````

修改后：

`````` markdown
# Strong First Strong Is an Asterisk

**First bold**
This is **bold** mid sentence
This is **bold** mid sentence with a second **bold** on the same line
This is _**bold and emphasized**_
This is ***nested bold** and ending emphasized*
This is **_nested emphasis_ and ending bold**

**Test bold**
``````
</details>
<details><summary>当样式设置为 'consistent' 时，加粗标记会根据文件中第一个加粗标记保持一致的样式</summary>

修改前：

`````` markdown
# Strong First Strong Is an Underscore

__First bold__
This is **bold** mid sentence
This is **bold** mid sentence with a second __bold__ on the same line
This is **_bold and emphasized_**
This is ***nested bold** and ending emphasized*
This is ___nested emphasis_ and ending bold__

**Test bold**
``````

修改后：

`````` markdown
# Strong First Strong Is an Underscore

__First bold__
This is __bold__ mid sentence
This is __bold__ mid sentence with a second __bold__ on the same line
This is ___bold and emphasized___
This is *__nested bold__ and ending emphasized*
This is ___nested emphasis_ and ending bold__

__Test bold__
``````
</details>

## 内容行之间的换行符

别名：`two-spaces-between-lines-with-content`

确保在段落、引用块和列表项中，对于在下一行继续的行，在其末尾添加指定的换行标记。

### 选项

| 名称 | 描述 | 列表项 | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Line break indicator` | 要使用的换行标记。 | `  `：  <br/><br/>`<br/>`： <br/><br/><br/>`<br>`： <br><br/><br/>`\`： \ | `  ` |

### 补充信息


!!! Warning
    请勿与 [段落空行](./spacing-rules.md#paragraph-blank-lines) 一起使用。它们工作原理不同，会导致意外的结果。


### 示例

<details><summary>当换行标记为 `  ` 时，对于列表、引用块和段落中在下一行继续的行，确保在其末尾添加两个空格</summary>

修改前：

`````` markdown
# Heading 1
First paragraph stays as the first paragraph

- list item 1
- list item 2
Continuation of list item 2
- list item 3

1. Item 1
2. Item 2
Continuation of item 3
3. Item 3

Paragraph for with link [[other file name]].
Continuation *of* the paragraph has `inline code block` __in it__.
Even more continuation

Paragraph lines that end in <br/>
Or lines that end in <br>
Are left swapped
Since they mean the same thing

``` text
Code blocks are ignored
Even with multiple lines
```
Another paragraph here

> Blockquotes are affected
> More content here
Content here

<div>
html content
should be ignored
</div>
Even more content here

``````

修改后：

`````` markdown
# Heading 1
First paragraph stays as the first paragraph

- list item 1
- list item 2  
Continuation of list item 2
- list item 3

1. Item 1
2. Item 2  
Continuation of item 3
3. Item 3

Paragraph for with link [[other file name]].  
Continuation *of* the paragraph has `inline code block` __in it__.  
Even more continuation

Paragraph lines that end in  
Or lines that end in  
Are left swapped  
Since they mean the same thing

``` text
Code blocks are ignored
Even with multiple lines
```
Another paragraph here

> Blockquotes are affected  
> More content here  
Content here

<div>
html content
should be ignored
</div>
Even more content here

``````
</details>

## 无序列表样式

别名：`unordered-list-style`

确保无序列表遵循指定的样式。

### 选项

| 名称 | 描述 | 列表项 | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `List item style` | 无序列表中要使用的列表项样式 | `consistent`：确保无序列表项在文件中使用统一的列表项标记，基于第一个列表项确定<br/><br/>`-`：确保无序列表项使用 `-` 作为标记<br/><br/>`*`：确保无序列表项使用 `*` 作为标记<br/><br/>`+`：确保无序列表项使用 `+` 作为标记 | `consistent` |



### 示例

<details><summary>当 `List item style = 'consistent'` 且 `*` 为第一个无序列表标记时，无序列表的标记会更新为 `*`</summary>

修改前：

`````` markdown
1. ordered item 1
2. ordered item 2

Checklists should be ignored
- [ ] Checklist item 1
- [x] completed item

* Item 1
  - Sublist 1 item 1
  - Sublist 1 item 2
- Item 2
  + Sublist 2 item 1
  + Sublist 2 item 2
+ Item 3
  * Sublist 3 item 1
  * Sublist 3 item 2

``````

修改后：

`````` markdown
1. ordered item 1
2. ordered item 2

Checklists should be ignored
- [ ] Checklist item 1
- [x] completed item

* Item 1
  * Sublist 1 item 1
  * Sublist 1 item 2
* Item 2
  * Sublist 2 item 1
  * Sublist 2 item 2
* Item 3
  * Sublist 3 item 1
  * Sublist 3 item 2

``````
</details>
<details><summary>当 `List item style = '-'` 时，无序列表的标记会更新为 `-`</summary>

修改前：

`````` markdown
- Item 1
  * Sublist 1 item 1
  * Sublist 1 item 2
* Item 2
  + Sublist 2 item 1
  + Sublist 2 item 2
+ Item 3
  - Sublist 3 item 1
  - Sublist 3 item 2

See that the ordered list is ignored, but its sublist is not

1. Item 1
  - Sub item 1
1. Item 2
  * Sub item 2
1. Item 3
  + Sub item 3
``````

修改后：

`````` markdown
- Item 1
  - Sublist 1 item 1
  - Sublist 1 item 2
- Item 2
  - Sublist 2 item 1
  - Sublist 2 item 2
- Item 3
  - Sublist 3 item 1
  - Sublist 3 item 2

See that the ordered list is ignored, but its sublist is not

1. Item 1
  - Sub item 1
1. Item 2
  - Sub item 2
1. Item 3
  - Sub item 3
``````
</details>
<details><summary>当 `List item style = '*'` 时，无序列表的标记会更新为 `*`</summary>

修改前：

`````` markdown
- Item 1
  * Sublist 1 item 1
  * Sublist 1 item 2
* Item 2
  + Sublist 2 item 1
  + Sublist 2 item 2
+ Item 3
  - Sublist 3 item 1
  - Sublist 3 item 2

``````

修改后：

`````` markdown
* Item 1
  * Sublist 1 item 1
  * Sublist 1 item 2
* Item 2
  * Sublist 2 item 1
  * Sublist 2 item 2
* Item 3
  * Sublist 3 item 1
  * Sublist 3 item 2

``````
</details>
<details><summary>当 `List item style = '-'` 时，引用块中的无序列表项标记被设置为 `+`</summary>

修改前：

`````` markdown
> - Item 1
> + Item 2
> > * Subitem 1
> > + Subitem 2
> >   - Sub sub item 1
> > - Subitem 3
``````

修改后：

`````` markdown
> + Item 1
> + Item 2
> > + Subitem 1
> > + Subitem 2
> >   + Sub sub item 1
> > + Subitem 3
``````
</details>
