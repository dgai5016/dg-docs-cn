<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# 标题规则

对 Linter 而言，标题指的是 ATX 风格的标题。它目前 _不_ 支持 Setext 风格的标题（参见[此 issue](https://github.com/platers/obsidian-linter/issues/423)）。


## Capitalize headings

Alias: `capitalize-headings`

标题应使用大写格式

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Style` | 使用的大写样式 | `Title Case`: 按标题大小写规则首字母大写<br/><br/>`ALL CAPS`: 整个标题全部大写<br/><br/>`First letter`: 仅首字母大写 | `Title Case` |
| `Ignore cased words` | 仅对全部小写的单词应用标题大小写样式 | N/A | `true` |
| `Ignore words` | 大写时要忽略的单词列表（逗号分隔） | N/A | `macOS, iOS, iPhone, iPad, JavaScript, TypeScript, AppleScript, I` |
| `Lowercase words` | 要保持小写的单词列表（逗号分隔） | N/A | `a, an, the, aboard, about, abt., above, abreast, absent, across, after, against, along, aloft, alongside, amid, amidst, mid, midst, among, amongst, anti, apropos, around, round, as, aslant, astride, at, atop, ontop, bar, barring, before, B4, behind, below, beneath, neath, beside, besides, between, 'tween, beyond, but, by, chez, circa, c., ca., come, concerning, contra, counting, cum, despite, spite, down, during, effective, ere, except, excepting, excluding, failing, following, for, from, in, including, inside, into, less, like, minus, modulo, mod, near, nearer, nearest, next, notwithstanding, of, o', off, offshore, on, onto, opposite, out, outside, over, o'er, pace, past, pending, per, plus, post, pre, pro, qua, re, regarding, respecting, sans, save, saving, short, since, sub, than, through, thru, throughout, thruout, till, times, to, t', touching, toward, towards, under, underneath, unlike, until, unto, up, upon, versus, vs., v., via, vice, vis-à-vis, wanting, with, w/, w., c̄, within, w/i, without, 'thout, w/o, abroad, adrift, aft, afterward, afterwards, ahead, apart, ashore, aside, away, back, backward, backwards, beforehand, downhill, downstage, downstairs, downstream, downward, downwards, downwind, east, eastward, eastwards, forth, forward, forwards, heavenward, heavenwards, hence, henceforth, here, hereby, herein, hereof, hereto, herewith, home, homeward, homewards, indoors, inward, inwards, leftward, leftwards, north, northeast, northward, northwards, northwest, now, onward, onwards, outdoors, outward, outwards, overboard, overhead, overland, overseas, rightward, rightwards, seaward, seawards, skywards, skyward, south, southeast, southwards, southward, southwest, then, thence, thenceforth, there, thereby, therein, thereof, thereto, therewith, together, underfoot, underground, uphill, upstage, upstairs, upstream, upward, upwards, upwind, west, westward, westwards, when, whence, where, whereby, wherein, whereto, wherewith, although, because, considering, given, granted, if, lest, once, provided, providing, seeing, so, supposing, though, unless, whenever, whereas, wherever, while, whilst, ago, inasmuch, even, whether, whose, whoever, why, how, whatever, what, both, and, or, either, neither, nor, just, rather, such, that, yet, is, it` |
| `Characters to ignore at the start of potential words` | 这些字符可以单独出现在一个或多个字母、单引号和/或连字符之前，并仍然被视为一个单词 | N/A | `'"(‘“-` |
| `Characters to ignore at the end of potential words` | 这些字符可以跟随在一个或多个字母、单引号和/或连字符之后，并仍然被视为一个单词 | N/A | `.?!,:;'")”’0123456789-` |



### Examples

<details><summary>使用 `Title case=true`、`Ignore cased words=false`</summary>

Before:

`````` markdown
# this is a heading 1
## THIS IS A HEADING 2
### a heading 3
``````

After:

`````` markdown
# This is a Heading 1
## This is a Heading 2
### A Heading 3
``````
</details>
<details><summary>使用 `Title Case=true`、`Ignore cased words=true`</summary>

Before:

`````` markdown
# this is a heading 1
## THIS IS A HEADING 2
### a hEaDiNg 3
``````

After:

`````` markdown
# This is a Heading 1
## THIS IS A HEADING 2
### A hEaDiNg 3
``````
</details>
<details><summary>使用 `First letter=true`</summary>

Before:

`````` markdown
# this is a heading 1
## this is a heading 2
``````

After:

`````` markdown
# This is a heading 1
## This is a heading 2
``````
</details>
<details><summary>使用 `ALL CAPS=true`</summary>

Before:

`````` markdown
# this is a heading 1
## this is a heading 2
``````

After:

`````` markdown
# THIS IS A HEADING 1
## THIS IS A HEADING 2
``````
</details>

## File name heading

Alias: `file-name-heading`

如果文件没有 H1 标题，则将文件名作为 H1 标题插入。






### Examples

<details><summary>插入一个 H1 标题</summary>

Before:

`````` markdown
This is a line of text
``````

After:

`````` markdown
# File Name
This is a line of text
``````
</details>
<details><summary>在 YAML frontmatter 之后插入标题</summary>

Before:

`````` markdown
---
title: My Title
---
This is a line of text
``````

After:

`````` markdown
---
title: My Title
---
# File Name
This is a line of text
``````
</details>

## Header increment

Alias: `header-increment`

标题层级每次只应递增一级

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Start header increment at heading level 2` | 将文件中标题层级的最小层级设为 2 级，并将所有标题相应调整，使其从 2 级开始递增。 | N/A | false |



### Examples

<details><summary>标题层级会按需降级</summary>

Before:

`````` markdown
# H1
### H3
### H3
#### H4
###### H6

We skipped a 2nd level heading
``````

After:

`````` markdown
# H1
## H3
## H3
### H4
#### H6

We skipped a 2nd level heading
``````
</details>
<details><summary>在会被降级的区段中，被跳过的标题会导致这些标题失去原本的含义</summary>

Before:

`````` markdown
# H1
### H3

We skip from 1 to 3

###### H6

We skip from 3 to 6 leaving out 4, 5, and 6. Thus headings level 4 and 5 will be treated like H3 above until another H2 or H1 is encountered

##### H5

We skipped 5 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented

## H2

This resets the decrement section so the H6 below is decremented to an H3

###### H6
``````

After:

`````` markdown
# H1
## H3

We skip from 1 to 3

### H6

We skip from 3 to 6 leaving out 4, 5, and 6. Thus headings level 4 and 5 will be treated like H3 above until another H2 or H1 is encountered

## H5

We skipped 5 previously so it will be treated the same as the H3 above since it was the next lowest header that was to be decremented

# H2

This resets the decrement section so the H6 below is decremented to an H3

## H6
``````
</details>
<details><summary>当 `Start header increment at heading level 2 = true` 时，H1 会变成 H2，其余标题也会相应递增</summary>

Before:

`````` markdown
# H1 becomes H2
#### H4 becomes H3
###### H6
## H2
###### H6
# H1
## H2
``````

After:

`````` markdown
## H1 becomes H2
### H4 becomes H3
#### H6
## H2
### H6
## H1
### H2
``````
</details>

## Headings start line

Alias: `headings-start-line`

不以行首开始的标题会被去除其前导空白，以确保它们被识别为标题。






### Examples

<details><summary>去除标题前的空格</summary>

Before:

`````` markdown
   ## Other heading preceded by 2 spaces ##
_Note that if the spacing is enough for the header to be considered to be part of a codeblock it will not be affected by this rule._
``````

After:

`````` markdown
## Other heading preceded by 2 spaces ##
_Note that if the spacing is enough for the header to be considered to be part of a codeblock it will not be affected by this rule._
``````
</details>
<details><summary>标签不受此规则影响</summary>

Before:

`````` markdown
  #test
  # Heading &amp;
``````

After:

`````` markdown
  #test
# Heading &amp;
``````
</details>

## Remove trailing punctuation in heading

Alias: `remove-trailing-punctuation-in-heading`

去除标题末尾的指定标点符号，但会忽略 <a href="https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references">HTML 实体引用</a> 末尾的分号。

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Trailing punctuation` | 要从文件标题末尾去除的标点符号。 | N/A | `.,;:!。，；：！` |



### Examples

<details><summary>去除标题末尾的标点符号</summary>

Before:

`````` markdown
# Heading ends in a period.
## Other heading ends in an exclamation mark! ##
``````

After:

`````` markdown
# Heading ends in a period
## Other heading ends in an exclamation mark ##
``````
</details>
<details><summary>标题末尾的 HTML 实体会被忽略</summary>

Before:

`````` markdown
# Heading 1
## Heading &amp;
``````

After:

`````` markdown
# Heading 1
## Heading &amp;
``````
</details>
<details><summary>当标题末尾标点后跟随空白时也会去除该标点</summary>

Before:

`````` markdown
# Heading 1!  
## Heading 2.	
``````

After:

`````` markdown
# Heading 1  
## Heading 2	
``````
</details>
