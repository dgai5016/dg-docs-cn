<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# 间距规则


## Compact YAML

别名：`compact-yaml`

移除 YAML frontmatter 中开头和结尾的空行。

### 选项

| 名称 | 描述 | List Items | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Inner new lines` | 移除不在 YAML 开头或结尾的换行 | N/A | false |



### 示例

<details><summary>移除 YAML 开头和结尾的空行</summary>

修改前：

`````` markdown
---

date: today

title: unchanged without inner new lines turned on

---
``````

修改后：

`````` markdown
---
date: today

title: unchanged without inner new lines turned on
---
``````
</details>
<details><summary>当 inner new lines 设置为 true 时，移除 YAML 中任意位置的空行</summary>

修改前：

`````` markdown
---

date: today


title: remove inner new lines

---

# Header 1


Body content here.
``````

修改后：

`````` markdown
---
date: today
title: remove inner new lines
---

# Header 1


Body content here.
``````
</details>

## Consecutive blank lines

别名：`consecutive-blank-lines`

最多只能有一个连续空行。





### 示例

<details><summary>移除连续空行</summary>

修改前：

`````` markdown
Some text


Some more text
``````

修改后：

`````` markdown
Some text

Some more text
``````
</details>

## Convert spaces to tabs

别名：`convert-spaces-to-tabs`

将行首空格转换为制表符。

### 选项

| 名称 | 描述 | List Items | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Tabsize` | 将转换为制表符的空格数量 | N/A | `4` |



### 示例

<details><summary>使用 `tabsize = 3` 将空格转换为制表符</summary>

修改前：

`````` markdown
- text with no indention
   - text indented with 3 spaces
- text with no indention
      - text indented with 6 spaces
``````

修改后：

`````` markdown
- text with no indention
	- text indented with 3 spaces
- text with no indention
		- text indented with 6 spaces
``````
</details>
<details><summary>使用 `tabsize = 3` 将空格转换为制表符（在引用块中同样生效）</summary>

修改前：

`````` markdown
> - text with no indention
>    - text indented with 3 spaces
> - text with no indention
>       - text indented with 6 spaces
``````

修改后：

`````` markdown
> - text with no indention
> 	- text indented with 3 spaces
> - text with no indention
> 		- text indented with 6 spaces
``````
</details>

## Empty line around blockquotes

别名：`empty-line-around-blockquotes`

确保引用块周围有空行，除非引用块位于文档开头或结尾。<b>注意：空行要么是引用块嵌套层级少一级，要么是换行符。</b>





### 示例

<details><summary>位于文档开头的引用块前不会添加空行。</summary>

修改前：

`````` markdown
> Quote content here
> quote content continued
# Title here
``````

修改后：

`````` markdown
> Quote content here
> quote content continued

# Title here
``````
</details>
<details><summary>位于文档结尾的引用块后不会添加空行。</summary>

修改前：

`````` markdown
# Heading 1
> Quote content here
> quote content continued
``````

修改后：

`````` markdown
# Heading 1

> Quote content here
> quote content continued
``````
</details>
<details><summary>嵌套的引用块会正确添加空行</summary>

修改前：

`````` markdown
# Make sure that nested blockquotes are accounted for correctly
> Quote content here
> quote content continued
> > Nested Blockquote
> > content continued

**Note that the empty line is either one less blockquote indicator if followed/proceeded by more blockquote content or it is an empty line**

# Doubly nested code block

> > Quote content here
> > quote content continued
``````

修改后：

`````` markdown
# Make sure that nested blockquotes are accounted for correctly

> Quote content here
> quote content continued
>
> > Nested Blockquote
> > content continued

**Note that the empty line is either one less blockquote indicator if followed/proceeded by more blockquote content or it is an empty line**

# Doubly nested code block

> > Quote content here
> > quote content continued
``````
</details>

## Empty line around code fences

别名：`empty-line-around-code-fences`

确保代码围栏周围有空行，除非代码围栏位于文档开头或结尾。





### 示例

<details><summary>位于文档开头的围栏代码块前不会添加空行。</summary>

修改前：

`````` markdown
``` js
var temp = 'text';
// this is a code block
```
Text after code block.
``````

修改后：

`````` markdown
``` js
var temp = 'text';
// this is a code block
```

Text after code block.
``````
</details>
<details><summary>位于文档结尾的围栏代码块后不会添加空行。</summary>

修改前：

`````` markdown
# Heading 1
```
Here is a code block
```
``````

修改后：

`````` markdown
# Heading 1

```
Here is a code block
```
``````
</details>
<details><summary>位于引用块中的围栏代码块会正确添加空行</summary>

修改前：

`````` markdown
# Make sure that code blocks in blockquotes are accounted for correctly
> ```js
> var text = 'this is some text';
> ```
>
> ```js
> var other text = 'this is more text';
> ```

**Note that the blanks blockquote lines added do not have whitespace after them**

# Doubly nested code block

> > ```js
> > var other text = 'this is more text';
> > ```
``````

修改后：

`````` markdown
# Make sure that code blocks in blockquotes are accounted for correctly

> ```js
> var text = 'this is some text';
> ```
>
> ```js
> var other text = 'this is more text';
> ```

**Note that the blanks blockquote lines added do not have whitespace after them**

# Doubly nested code block

> > ```js
> > var other text = 'this is more text';
> > ```
``````
</details>
<details><summary>嵌套的围栏代码块会添加空行</summary>

修改前：

`````` markdown
```markdown
# Header

````JavaScript
var text = 'some string';
````
```
``````

修改后：

`````` markdown
```markdown
# Header

````JavaScript
var text = 'some string';
````

```
``````
</details>

## Empty line around horizontal rules

别名：`empty-line-around-horizontal-rules`

确保水平分割线周围有空行，除非水平分割线位于文档开头或结尾。





### 示例

<details><summary>位于文档开头的水平分割线前不会添加空行。</summary>

修改前：

`````` markdown
***


Content
``````

修改后：

`````` markdown
***

Content
``````
</details>
<details><summary>位于文档结尾的水平分割线后不会添加空行。</summary>

修改前：

`````` markdown
***
Content
***
``````

修改后：

`````` markdown
***

Content

***
``````
</details>
<details><summary>所有类型的水平分割线都受此规则影响</summary>

修改前：

`````` markdown
- Content 1
***
- Content 2
---
- Content 3
___
- Content 4
``````

修改后：

`````` markdown
- Content 1

***

- Content 2

---

- Content 3

___

- Content 4
``````
</details>
<details><summary>YAML frontmatter 不受此规则影响</summary>

修改前：

`````` markdown
---
prop: value
---

Content
``````

修改后：

`````` markdown
---
prop: value
---

Content
``````
</details>
<details><summary>`---` 上方的段落会被视为标题，因此不会被添加空行</summary>

修改前：

`````` markdown
Content
---
``````

修改后：

`````` markdown
Content
---
``````
</details>

## Empty line around math blocks

别名：`empty-line-around-math-blocks`

确保数学公式块周围有空行，使用 <code>Number of dollar signs to indicate a math block</code> 来决定单行数学公式需要多少美元符号表示数学公式块。





### 示例

<details><summary>位于文档开头的数学公式块前不会添加空行。</summary>

修改前：

`````` markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
some more text
``````

修改后：

`````` markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$

some more text
``````
</details>
<details><summary>单行数学公式块会根据 `Number of dollar signs to indicate a math block` 的值更新（此处值为 2）</summary>

修改前：

`````` markdown
$$\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}$$
some more text
``````

修改后：

`````` markdown
$$\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}$$

some more text
``````
</details>
<details><summary>位于文档结尾的数学公式块后不会添加空行。</summary>

修改前：

`````` markdown
Some text
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
``````

修改后：

`````` markdown
Some text

$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
``````
</details>
<details><summary>不在文档开头或结尾的数学公式块会前后各添加空行</summary>

修改前：

`````` markdown
Some text
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
some more text
``````

修改后：

`````` markdown
Some text

$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$

some more text
``````
</details>
<details><summary>位于标注块或引用块中的数学公式块会添加格式正确的空行</summary>

修改前：

`````` markdown
> Math block in blockquote
> $$
> \boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
> $$

More content here

> Math block doubly nested in blockquote
> > $$
> > \boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
> > $$
``````

修改后：

`````` markdown
> Math block in blockquote
>
> $$
> \boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
> $$

More content here

> Math block doubly nested in blockquote
>
> > $$
> > \boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
> > $$
``````
</details>

## Empty line around tables

别名：`empty-line-around-tables`

确保 GitHub 风格的表格周围有空行，除非表格位于文档开头或结尾。





### 示例

<details><summary>位于文档开头的表格前不会添加空行。</summary>

修改前：

`````` markdown
| Column 1 | Column 2 |
|----------|----------|
| foo      | bar      |
| baz      | qux      |
| quux     | quuz     |
More text.
# Heading

**Note that text directly following a table is considered part of a table according to github markdown**
``````

修改后：

`````` markdown
| Column 1 | Column 2 |
|----------|----------|
| foo      | bar      |
| baz      | qux      |
| quux     | quuz     |

More text.
# Heading

**Note that text directly following a table is considered part of a table according to github markdown**
``````
</details>
<details><summary>位于文档结尾的表格后不会添加空行。</summary>

修改前：

`````` markdown
# Heading 1
| Column 1 | Column 2 |
|----------|----------|
| foo      | bar      |
| baz      | qux      |
| quux     | quuz     |
``````

修改后：

`````` markdown
# Heading 1

| Column 1 | Column 2 |
|----------|----------|
| foo      | bar      |
| baz      | qux      |
| quux     | quuz     |
``````
</details>
<details><summary>不在文档开头或结尾的表格会前后各添加空行</summary>

修改前：

`````` markdown
# Table 1
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| foo      | bar      | blob     |
| baz      | qux      | trust    |
| quux     | quuz     | glob     |
# Table 2 without Pipe at Start and End
| Column 1 | Column 2 |
:-: | -----------:
bar | baz
foo | bar
# Header for more content
New paragraph.
``````

修改后：

`````` markdown
# Table 1

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| foo      | bar      | blob     |
| baz      | qux      | trust    |
| quux     | quuz     | glob     |

# Table 2 without Pipe at Start and End

| Column 1 | Column 2 |
:-: | -----------:
bar | baz
foo | bar

# Header for more content
New paragraph.
``````
</details>
<details><summary>位于标注块或引用块中的表格会添加格式正确的空行</summary>

修改前：

`````` markdown
> Table in blockquote
> | Column 1 | Column 2 | Column 3 |
> |----------|----------|----------|
> | foo      | bar      | blob     |
> | baz      | qux      | trust    |
> | quux     | quuz     | glob     |

More content here

> Table doubly nested in blockquote
> > | Column 1 | Column 2 | Column 3 |
> > |----------|----------|----------|
> > | foo      | bar      | blob     |
> > | baz      | qux      | trust    |
> > | quux     | quuz     | glob     |
``````

修改后：

`````` markdown
> Table in blockquote
>
> | Column 1 | Column 2 | Column 3 |
> |----------|----------|----------|
> | foo      | bar      | blob     |
> | baz      | qux      | trust    |
> | quux     | quuz     | glob     |

More content here

> Table doubly nested in blockquote
>
> > | Column 1 | Column 2 | Column 3 |
> > |----------|----------|----------|
> > | foo      | bar      | blob     |
> > | baz      | qux      | trust    |
> > | quux     | quuz     | glob     |
``````
</details>

## Heading blank lines

别名：`heading-blank-lines`

所有标题前后都各有一行空行（除非标题位于文档开头或结尾）。

### 选项

| 名称 | 描述 | List Items | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Bottom` | 确保标题后有一行空行（禁用时不会移除标题后的空行） | N/A | `true` |
| `Empty line between YAML and header` | 保留 YAML frontmatter 与标题之间的空行 | N/A | `true` |

### 补充信息


!!! Warning
    如果启用了 [段落空行规则](#paragraph-blank-lines)，即使 `Bottom` 为 `false`，标题与段落之间仍会添加换行。你可以通过添加一条[自定义正则替换规则](./custom-rules.md#custom-regex-replacement)来覆盖此行为，设置如下：
    
    | regex to find  | flags | regex to replace |
    |:-------------  |:----- |:---------------- |
    | `(^#+\s.*)\n+` | `gm`  | `$1\n`           |


### 示例

<details><summary>标题应当被空行环绕</summary>

修改前：

`````` markdown
# H1
## H2


# H1
line
## H2

``````

修改后：

`````` markdown
# H1

## H2

# H1

line

## H2
``````
</details>
<details><summary>启用 `Bottom=false` 时</summary>

修改前：

`````` markdown
# H1
line
## H2
# H1
line
``````

修改后：

`````` markdown
# H1
line

## H2
# H1
line
``````
</details>
<details><summary>启用 `Empty line between YAML and header=false` 时，会移除 YAML 与标题前后的空行</summary>

修改前：

`````` markdown
---
key: value
---

# Header
Paragraph here...
``````

修改后：

`````` markdown
---
key: value
---
# Header

Paragraph here...
``````
</details>

## Line break at document end

别名：`line-break-at-document-end`

当笔记不为空时，确保文档结尾有且仅有一个换行符。





### 示例

<details><summary>在文档末尾追加一个换行。</summary>

修改前：

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
``````

修改后：

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

``````
</details>
<details><summary>移除文档末尾多余的换行（仅保留一个）。</summary>

修改前：

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.



``````

修改后：

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

``````
</details>
<details><summary>空文件不会添加空行</summary>

修改前：

`````` markdown

``````

修改后：

`````` markdown

``````
</details>

## Move math block indicators to their own line

别名：`move-math-block-indicators-to-their-own-line`

将所有开头和结尾的数学公式块指示符移到各自单独的行，使用 <code>Number of dollar signs to indicate a math block</code> 来决定单行数学公式需要多少美元符号表示数学公式块。





### 示例

<details><summary>当 `Number of dollar signs to indicate a math block` = 2 时，将数学公式块指示符移到单独行</summary>

修改前：

`````` markdown
This is left alone:
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
The following is updated:
$$L = \frac{1}{2} \rho v^2 S C_L$$
``````

修改后：

`````` markdown
This is left alone:
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
The following is updated:
$$
L = \frac{1}{2} \rho v^2 S C_L
$$
``````
</details>
<details><summary>当 `Number of dollar signs to indicate a math block` = 3 且开始指示符与内容起始行在同一行时，将数学公式块指示符移到单独行</summary>

修改前：

`````` markdown
$$$\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$$
``````

修改后：

`````` markdown
$$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$$
``````
</details>
<details><summary>当 `Number of dollar signs to indicate a math block` = 2 且结束指示符与内容结束行在同一行时，将数学公式块指示符移到单独行</summary>

修改前：

`````` markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}$$
``````

修改后：

`````` markdown
$$
\boldsymbol{a}=\begin{bmatrix}a_x \\ a_y\end{bmatrix}
$$
``````
</details>

## Paragraph blank lines

别名：`paragraph-blank-lines`

所有段落前后都应有且仅有一行空行。



### 补充信息


!!! Warning
    请勿与 [连续内容行间双空格](./content-rules.md#two-spaces-between-lines-with-content) 一起使用。两者行为不同，会导致意料之外的结果。

#### 何时会添加空行？

当段落当前行后还有一行内容，且当前行不以 2 个或更多空格、`<br>`、`<br/>` 或 `\` 结尾时。


### 示例

<details><summary>段落应当被空行环绕</summary>

修改前：

`````` markdown
# H1
Newlines are inserted.
A paragraph is a line that starts with a letter.
``````

修改后：

`````` markdown
# H1

Newlines are inserted.

A paragraph is a line that starts with a letter.
``````
</details>
<details><summary>段落可通过在行尾使用 2 个或更多空格、HTML/XML 换行标签或反斜杠（\）来延伸</summary>

修改前：

`````` markdown
# H1
Content  
Paragraph content continued <br>
Paragraph content continued once more <br/>
Paragraph content yet again\
Last line of paragraph
A new paragraph
# H2
``````

修改后：

`````` markdown
# H1

Content  
Paragraph content continued <br>
Paragraph content continued once more <br/>
Paragraph content yet again\
Last line of paragraph

A new paragraph

# H2
``````
</details>

## Remove empty lines between list markers

别名：`remove-empty-lines-between-list-markers-and-checklists`

列表标记之间不应有任何空行。





### 示例

<details><summary>移除有序列表项之间的空行</summary>

修改前：

`````` markdown
1. Item 1

2. Item 2
``````

修改后：

`````` markdown
1. Item 1
2. Item 2
``````
</details>
<details><summary>当列表标记为 '-' 时，移除列表项之间的空行</summary>

修改前：

`````` markdown
- Item 1

	- Subitem 1

- Item 2
``````

修改后：

`````` markdown
- Item 1
	- Subitem 1
- Item 2
``````
</details>
<details><summary>移除任务清单项之间的空行</summary>

修改前：

`````` markdown
- [x] Item 1

	- [!] Subitem 1

- [ ] Item 2
``````

修改后：

`````` markdown
- [x] Item 1
	- [!] Subitem 1
- [ ] Item 2
``````
</details>
<details><summary>当列表标记为 '+' 时，移除列表项之间的空行</summary>

修改前：

`````` markdown
+ Item 1

	+ Subitem 1

+ Item 2
``````

修改后：

`````` markdown
+ Item 1
	+ Subitem 1
+ Item 2
``````
</details>
<details><summary>当列表标记为 '*' 时，移除列表项之间的空行</summary>

修改前：

`````` markdown
* Item 1

	* Subitem 1

* Item 2
``````

修改后：

`````` markdown
* Item 1
	* Subitem 1
* Item 2
``````
</details>
<details><summary>同类型列表（有序列表、特定列表项标记、任务清单）之间的空行会被移除，而不同类型列表项标记之间的空行会被保留</summary>

修改前：

`````` markdown
1. Item 1

2. Item 2

- Item 1

	- Subitem 1

- Item 2

- [x] Item 1

	- [f] Subitem 1

- [ ] Item 2

+ Item 1

	+ Subitem 1

+ Item 2

* Item 1

	* Subitem 1

* Item 2
``````

修改后：

`````` markdown
1. Item 1
2. Item 2

- Item 1
	- Subitem 1
- Item 2

- [x] Item 1
	- [f] Subitem 1
- [ ] Item 2

+ Item 1
	+ Subitem 1
+ Item 2

* Item 1
	* Subitem 1
* Item 2
``````
</details>

## Remove link spacing

别名：`remove-link-spacing`

移除链接文字周围的空格。





### 示例

<details><summary>常规 Markdown 链接文字中的空格</summary>

修改前：

`````` markdown
[ here is link text1 ](link_here)
[ here is link text2](link_here)
[here is link text3 ](link_here)
[here is link text4](link_here)
[	here is link text5	](link_here)
[](link_here)
**Note that image markdown syntax does not get affected even if it is transclusion:**
![	here is link text6 ](link_here)
``````

修改后：

`````` markdown
[here is link text1](link_here)
[here is link text2](link_here)
[here is link text3](link_here)
[here is link text4](link_here)
[here is link text5](link_here)
[](link_here)
**Note that image markdown syntax does not get affected even if it is transclusion:**
![	here is link text6 ](link_here)
``````
</details>
<details><summary>Wiki 链接文字中的空格</summary>

修改前：

`````` markdown
[[link_here| here is link text1 ]]
[[link_here|here is link text2 ]]
[[link_here| here is link text3]]
[[link_here|here is link text4]]
[[link_here|	here is link text5	]]
![[link_here|	here is link text6	]]
[[link_here]]
``````

修改后：

`````` markdown
[[link_here|here is link text1]]
[[link_here|here is link text2]]
[[link_here|here is link text3]]
[[link_here|here is link text4]]
[[link_here|here is link text5]]
![[link_here|here is link text6]]
[[link_here]]
``````
</details>

## Remove space around characters

别名：`remove-space-around-characters`

确保某些字符周围没有空白字符（空格或制表符）。<b>注意：在某些情况下可能导致 Markdown 格式出现问题。</b>

### 选项

| 名称 | 描述 | List Items | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Include fullwidth forms` | 包含<a href="https://en.wikipedia.org/wiki/Halfwidth_and_Fullwidth_Forms_(Unicode_block)">全角形式 Unicode 块</a> | N/A | `true` |
| `Include CJK symbols and punctuation` | 包含<a href="https://en.wikipedia.org/wiki/CJK_Symbols_and_Punctuation">中日韩符号和标点 Unicode 块</a> | N/A | `true` |
| `Include dashes` | 包含 en dash（–）和 em dash（—） | N/A | `true` |
| `Other symbols` | 其他需要包含的符号 | N/A |  |



### 示例

<details><summary>移除全角字符前后的空格和制表符</summary>

修改前：

`````` markdown
Full list of affected characters: ０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
This is a fullwidth period	 。 with text after it.
This is a fullwidth comma	，  with text after it.
This is a fullwidth left parenthesis （ 	with text after it.
This is a fullwidth right parenthesis ）  with text after it.
This is a fullwidth colon ：  with text after it.
This is a fullwidth semicolon ；  with text after it.
  Ｒemoves space at start of line
``````

修改后：

`````` markdown
Full list of affected characters:０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ，．：；！？＂＇｀＾～￣＿＆＠＃％＋－＊＝＜＞（）［］｛｝｟｠｜￤／＼￢＄￡￠￦￥。、「」『』〔〕【】—…–《》〈〉
This is a fullwidth period。with text after it.
This is a fullwidth comma，with text after it.
This is a fullwidth left parenthesis（with text after it.
This is a fullwidth right parenthesis）with text after it.
This is a fullwidth colon：with text after it.
This is a fullwidth semicolon；with text after it.
Ｒemoves space at start of line
``````
</details>
<details><summary>列表中的全角字符不会影响列表的 Markdown 语法</summary>

修改前：

`````` markdown
# List markers should not have the space after them removed if they are followed by a fullwidth character

- ［ contents here］
  -  ［ more contents here］ more text here
+   ［ another item here］
* ［ one last item here］

# Nested in a blockquote

> - ［ contents here］
>   -  ［ more contents here］ more text here
> +  ［ another item here］
> * ［ one last item here］

# Doubly nested in a blockquote

> The following is doubly nested
> > - ［ contents here］
> >   -   ［ more contents here］ more text here
> > +  ［ another item here］
> > * ［ one last item here］
``````

修改后：

`````` markdown
# List markers should not have the space after them removed if they are followed by a fullwidth character

- ［contents here］
  - ［more contents here］more text here
+ ［another item here］
* ［one last item here］

# Nested in a blockquote

> - ［contents here］
>   - ［more contents here］more text here
> + ［another item here］
> * ［one last item here］

# Doubly nested in a blockquote

> The following is doubly nested
> > - ［contents here］
> >   - ［more contents here］more text here
> > + ［another item here］
> > * ［one last item here］
``````
</details>

## Remove space before or after characters

别名：`remove-space-before-or-after-characters`

移除指定字符之前和指定字符之后的空格。<b>注意：在某些情况下可能导致 Markdown 格式出现问题。</b>

### 选项

| 名称 | 描述 | List Items | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Remove space before characters` | 移除指定字符之前的空格。<b>注意：在字符列表中使用 <code>{</code> 或 <code>}</code> 会意外影响文件，因为它们在幕后被用于忽略语法。</b> | N/A | `,!?;:).’”]` |
| `Remove space after characters` | 移除指定字符之后的空格。<b>>注意：在字符列表中使用 <code>{</code> 或 <code>}</code> 会意外影响文件，因为它们在幕后被用于忽略语法。</b> | N/A | `¿¡‘“([` |



### 示例

<details><summary>移除默认符号集前后的空格和制表符</summary>

修改前：

`````` markdown
In the end , the space gets removed	 .
The space before the question mark was removed right ?
The space before the exclamation point gets removed !
A semicolon ; and colon : have spaces removed before them
‘ Text in single quotes ’
“ Text in double quotes ”
[ Text in square braces ]
( Text in parenthesis )
``````

修改后：

`````` markdown
In the end, the space gets removed.
The space before the question mark was removed right?
The space before the exclamation point gets removed!
A semicolon; and colon: have spaces removed before them
‘Text in single quotes’
“Text in double quotes”
[Text in square braces]
(Text in parenthesis)
``````
</details>

## Space after list markers

别名：`space-after-list-markers`

列表标记和复选框后应有单个空格。





### 示例

<details><summary>列表标记与列表项文字之间保留单个空格</summary>

修改前：

`````` markdown
1.   Item 1
2.  Item 2

-   [ ] Item 1
- [x]    Item 2
	-  [ ] Item 3
``````

修改后：

`````` markdown
1. Item 1
2. Item 2

- [ ] Item 1
- [x] Item 2
	- [ ] Item 3
``````
</details>

## Space between Chinese Japanese or Korean and English or numbers

别名：`space-between-chinese-japanese-or-korean-and-english-or-numbers`

确保中日韩文字与英文或数字之间以单个空格分隔。遵循这些<a href="https://github.com/sparanoid/chinese-copywriting-guidelines">指南</a>

### 选项

| 名称 | 描述 | List Items | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `English punctuations and symbols before CJK` | 当在中日韩字符之前出现时，被视为英文的非字母标点和符号列表。<b>注意："*" 始终被视为英文，这对正确处理某些 Markdown 语法是必要的。</b> | N/A | `-+;:'"°%$)]` |
| `English punctuations and symbols after CJK` | 当在中日韩字符之后出现时，被视为英文的非字母标点和符号列表。<b>注意："*" 始终被视为英文，这对正确处理某些 Markdown 语法是必要的。</b> | N/A | `-+'"([¥$` |



### 示例

<details><summary>中文与英文之间的空格</summary>

修改前：

`````` markdown
中文字符串english中文字符串。
``````

修改后：

`````` markdown
中文字符串 english 中文字符串。
``````
</details>
<details><summary>中文与链接之间的空格</summary>

修改前：

`````` markdown
中文字符串[english](http://example.com)中文字符串。
``````

修改后：

`````` markdown
中文字符串 [english](http://example.com) 中文字符串。
``````
</details>
<details><summary>中文与内联代码块之间的空格</summary>

修改前：

`````` markdown
中文字符串`code`中文字符串。
``````

修改后：

`````` markdown
中文字符串 `code` 中文字符串。
``````
</details>
<details><summary>标签中的中英文之间不添加空格</summary>

修改前：

`````` markdown
#标签A #标签2标签
``````

修改后：

`````` markdown
#标签A #标签2标签
``````
</details>
<details><summary>确保斜体与中文字符之间不添加空格，以保留 Markdown 语法</summary>

修改前：

`````` markdown
_这是一个数学公式_
*这是一个数学公式english*

# Handling bold and italics nested in each other is not supported at this time

**_这是一_个数学公式**
*这是一hello__个数学world公式__*
``````

修改后：

`````` markdown
_这是一个数学公式_
*这是一个数学公式 english*

# Handling bold and italics nested in each other is not supported at this time

**_ 这是一 _ 个数学公式**
*这是一 hello__ 个数学 world 公式 __*
``````
</details>
<details><summary>图片和链接会被忽略</summary>

修改前：

`````` markdown
[[这是一个数学公式english]]
![[这是一个数学公式english.jpg]]
[这是一个数学公式english](这是一个数学公式english.md)
![这是一个数学公式english](这是一个数学公式english.jpg)
``````

修改后：

`````` markdown
[[这是一个数学公式english]]
![[这是一个数学公式english.jpg]]
[这是一个数学公式english](这是一个数学公式english.md)
![这是一个数学公式english](这是一个数学公式english.jpg)
``````
</details>
<details><summary>日韩文与英文之间的空格</summary>

修改前：

`````` markdown
日本語englishひらがな
カタカナenglishカタカナ
ﾊﾝｶｸｶﾀｶﾅenglish１２３全角数字
한글english한글
``````

修改后：

`````` markdown
日本語 english ひらがな
カタカナ english カタカナ
ﾊﾝｶｸｶﾀｶﾅ english１２３全角数字
한글 english 한글
``````
</details>

## Trailing spaces

别名：`trailing-spaces`

移除每行末尾多余的空格。

### 选项

| 名称 | 描述 | List Items | 默认值 |
| ---- | ----------- | ---------- | ------------- |
| `Two space linebreak` | 忽略换行前的两个空格（"两空格换行规则"）。 | N/A | false |



### 示例

<details><summary>移除行尾的空格和制表符。</summary>

修改前：

`````` markdown
# H1
Line with trailing spaces and tabs.	        
``````

修改后：

`````` markdown
# H1
Line with trailing spaces and tabs.
``````
</details>
<details><summary>启用 `Two space linebreak = true` 时</summary>

修改前：

`````` markdown
# H1
Line with trailing spaces and tabs.  
``````

修改后：

`````` markdown
# H1
Line with trailing spaces and tabs.  
``````
</details>
