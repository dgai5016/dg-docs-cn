<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# 粘贴规则

## 限制

- 本插件仅支持标准的粘贴快捷键（`cmd/ctrl + v`），不支持 vim 中的 `p` 操作符。（不过在普通模式或插入模式下使用 `cmd/ctrl + v` 粘贴是有效的。）
- 为了避免与 [Auto Link Title](https://obsidian.md/plugins?id=obsidian-auto-link-title) 或 [Paste URL into Selection](https://obsidian.md/plugins?id=url-into-selection) 等插件冲突，当剪贴板中检测到 URL 时，不会触发本规则。
- 在移动端，要粘贴 URL 并应用粘贴规则，请执行「长按 -> 粘贴」操作将其粘贴到文档中。
- 在多光标多行粘贴时，光标会停留在粘贴值之后的位置，而不是移动到粘贴值的末尾。


## Add blockquote indentation on paste

Alias: `add-blockquote-indentation-on-paste`

粘贴时如果光标位于引用块/标注（callout）行内，则除第一行外的所有行都会被添加引用块标记






### Examples

<details><summary>当当前行为 `Part 1 of the sentence` 时，粘贴到普通文本中的行不会被加上引用块标记</summary>

Before:

`````` markdown
was much less likely to succeed, but they tried it anyway.
Part 2 was much more interesting.
``````

After:

`````` markdown
was much less likely to succeed, but they tried it anyway.
Part 2 was much more interesting.
``````
</details>
<details><summary>当当前行为 `> > ` 时，粘贴到引用块中的行会被加上引用块标记</summary>

Before:

`````` markdown

This content is being added to a blockquote
Note that the second line is indented and the surrounding blank lines were trimmed

``````

After:

`````` markdown
This content is being added to a blockquote
> > Note that the second line is indented and the surrounding blank lines were trimmed
``````
</details>

## Prevent double checklist marker on Paste

Alias: `prevent-double-checklist-indicator-on-paste`

如果光标所在行已包含任务列表标记，则从要粘贴的文本中去除开头的任务列表标记






### Examples

<details><summary>当当前行不包含任务列表标记时，粘贴的行保持不变：`Regular text here`</summary>

Before:

`````` markdown
- [ ] Checklist item being pasted
``````

After:

`````` markdown
- [ ] Checklist item being pasted
``````
</details>
<details><summary>当当前行为 `> > ` 时，粘贴到不含任务列表标记的引用块中、且其本身也不含任务列表标记的行保持不变</summary>

Before:

`````` markdown
- [ ] Checklist item contents here
More content here
``````

After:

`````` markdown
- [ ] Checklist item contents here
More content here
``````
</details>
<details><summary>当当前行为 `> - [x] ` 时，粘贴到含任务列表标记的引用块中的行会去掉其任务列表标记</summary>

Before:

`````` markdown
- [ ] Checklist item contents here
More content here
``````

After:

`````` markdown
Checklist item contents here
More content here
``````
</details>
<details><summary>当当前行为 `- [ ] ` 时，带任务列表标记的粘贴行会去掉其任务列表标记</summary>

Before:

`````` markdown
- [x] Checklist item 1
- [ ] Checklist item 2
``````

After:

`````` markdown
Checklist item 1
- [ ] Checklist item 2
``````
</details>
<details><summary>当当前行为 `- [!] ` 时，作为任务列表标记粘贴的行会去掉其任务列表标记</summary>

Before:

`````` markdown
- [x] Checklist item 1
- [ ] Checklist item 2
``````

After:

`````` markdown
Checklist item 1
- [ ] Checklist item 2
``````
</details>
<details><summary>当粘贴一个任务列表、且所选文本以任务列表开头时，粘贴的文本仍应以任务列表开头</summary>

Before:

`````` markdown
- [x] Checklist item 1
- [ ] Checklist item 2
``````

After:

`````` markdown
- [x] Checklist item 1
- [ ] Checklist item 2
``````
</details>

## Prevent double list item marker on paste

Alias: `prevent-double-list-item-indicator-on-paste`

如果光标所在行已包含列表标记，则从要粘贴的文本中去除开头的列表标记






### Examples

<details><summary>当当前行不包含列表标记时，粘贴的行保持不变：`Regular text here`</summary>

Before:

`````` markdown
- List item being pasted
``````

After:

`````` markdown
- List item being pasted
``````
</details>
<details><summary>当当前行为 `> > ` 时，粘贴到不含列表标记的引用块中、且其本身也不含列表标记的行保持不变</summary>

Before:

`````` markdown
* List item contents here
More content here
``````

After:

`````` markdown
* List item contents here
More content here
``````
</details>
<details><summary>当当前行为 `> * ` 时，粘贴到含列表标记的引用块中的行会去掉其列表标记</summary>

Before:

`````` markdown
+ List item contents here
More content here
``````

After:

`````` markdown
List item contents here
More content here
``````
</details>
<details><summary>当当前行为 `+ ` 时，带列表标记的粘贴行会去掉其列表标记</summary>

Before:

`````` markdown
- List item 1
- List item 2
``````

After:

`````` markdown
List item 1
- List item 2
``````
</details>
<details><summary>当粘贴一个列表项、且所选文本以列表项标记开头时，粘贴的文本仍应以列表项标记开头</summary>

Before:

`````` markdown
- List item 1
- List item 2
``````

After:

`````` markdown
- List item 1
- List item 2
``````
</details>

## Proper ellipsis on paste

Alias: `proper-ellipsis-on-paste`

将三个连续的点替换为省略号，即使它们在要粘贴的文本中带有空格






### Examples

<details><summary>即使存在空格，也会将三个连续的点替换为省略号</summary>

Before:

`````` markdown
Lorem (...) Impsum.
Lorem (. ..) Impsum.
Lorem (. . .) Impsum.
``````

After:

`````` markdown
Lorem (…) Impsum.
Lorem (…) Impsum.
Lorem (…) Impsum.
``````
</details>

## Remove hyphens on paste

Alias: `remove-hyphens-on-paste`

从要粘贴的文本中去除连字符






### Examples

<details><summary>去除要粘贴内容中的连字符</summary>

Before:

`````` markdown
Text that was cool but hyper-
tension made it uncool.
``````

After:

`````` markdown
Text that was cool but hypertension made it uncool.
``````
</details>

## Remove leading or trailing whitespace on paste

Alias: `remove-leading-or-trailing-whitespace-on-paste`

去除要粘贴文本的所有前导非制表符空白以及全部尾随空白






### Examples

<details><summary>去除前导空格和换行符</summary>

Before:

`````` markdown


         This text was really indented

``````

After:

`````` markdown
This text was really indented
``````
</details>
<details><summary>保留前导制表符不动</summary>

Before:

`````` markdown


		This text is really indented

``````

After:

`````` markdown
		This text is really indented
``````
</details>

## Remove leftover footnotes from quote on paste

Alias: `remove-leftover-footnotes-from-quote-on-paste`

从要粘贴的文本中去除任何遗留的脚注引用






### Examples

<details><summary>脚注引用被去除</summary>

Before:

`````` markdown
He was sure that he would get off without doing any time, but the cops had other plans.50

_Note that the format for footnote references to remove is a dot or comma followed by any number of digits_
``````

After:

`````` markdown
He was sure that he would get off without doing any time, but the cops had other plans

_Note that the format for footnote references to remove is a dot or comma followed by any number of digits_
``````
</details>
<details><summary>脚注引用的去除不会影响链接</summary>

Before:

`````` markdown
[[Half is .5]]
[Half is .5](HalfIs.5.md)
![](HalfIs.5.jpg)
![[Half is .5.jpg]]
``````

After:

`````` markdown
[[Half is .5]]
[Half is .5](HalfIs.5.md)
![](HalfIs.5.jpg)
![[Half is .5.jpg]]
``````
</details>

## Remove multiple blank lines on paste

Alias: `remove-multiple-blank-lines-on-paste`

将要粘贴的文本中的多个连续空行压缩为一个空行






### Examples

<details><summary>多个空行被压缩为一个</summary>

Before:

`````` markdown
Here is the first line.




Here is some more text.
``````

After:

`````` markdown
Here is the first line.

Here is some more text.
``````
</details>
<details><summary>仅有一个空行的文本保持不变</summary>

Before:

`````` markdown
First line.

Last line.
``````

After:

`````` markdown
First line.

Last line.
``````
</details>
<details><summary>包含制表符或其他空白字符的空行也会被视为空行</summary>

Before:

`````` markdown
First line.
	
 
 	
	 
Last line.
``````

After:

`````` markdown
First line.

Last line.
``````
</details>
