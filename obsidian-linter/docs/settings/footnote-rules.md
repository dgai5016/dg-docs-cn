<!--- This file was automatically generated. See docs.ts and *_template.md files for the source. -->


# 脚注规则


## Footnote after punctuation

Alias: `footnote-after-punctuation`

确保脚注引用位于标点符号之后，而不是之前.






### Examples

<details><summary>将脚注放到标点之后。</summary>

Before:

`````` markdown
Lorem[^1]. Ipsum[^2], doletes.
``````

After:

`````` markdown
Lorem.[^1] Ipsum,[^2] doletes.
``````
</details>
<details><summary>位于任务开头的脚注不会被移动到标点之后</summary>

Before:

`````` markdown
- [ ] [^1]: This is a footnote and a task.
- [ ] This is a footnote and a task that gets swapped with the punctuation[^2]!
[^2]: This footnote got modified
``````

After:

`````` markdown
- [ ] [^1]: This is a footnote and a task.
- [ ] This is a footnote and a task that gets swapped with the punctuation![^2]
[^2]: This footnote got modified
``````
</details>

## Move footnotes to the bottom

Alias: `move-footnotes-to-the-bottom`

将所有脚注移动到文档底部，并确保它们按照在文件正文中被引用的顺序排序。

### Options

| Name | Description | List Items | Default Value |
| ---- | ----------- | ---------- | ------------- |
| `Include blank line between footnotes` | 启用后，脚注之间会包含一个空行。 | N/A | false |



### Examples

<details><summary>将脚注移动到底部</summary>

Before:

`````` markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

[^1]: first footnote

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
[^2]: second footnote

Maecenas malesuada dignissim purus ac volutpat.
``````

After:

`````` markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
Maecenas malesuada dignissim purus ac volutpat.

[^1]: first footnote
[^2]: second footnote
``````
</details>
<details><summary>将脚注移动到底部，并在脚注之间包含一个空行</summary>

Before:

`````` markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

[^1]: first footnote

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
[^2]: second footnote

Maecenas malesuada dignissim purus ac volutpat.
``````

After:

`````` markdown
Lorem ipsum, consectetur adipiscing elit. [^1] Donec dictum turpis quis ipsum pellentesque.

Quisque lorem est, fringilla sed enim at, sollicitudin lacinia nisi.[^2]
Maecenas malesuada dignissim purus ac volutpat.

[^1]: first footnote

[^2]: second footnote
``````
</details>

## Re-index footnotes

Alias: `re-index-footnotes`

根据文件中脚注引用的顺序，重新索引脚注 key 和脚注。<b>注意：如果一个 key 对应多个脚注，该规则<i>不会</i>生效。</b>.






### Examples

<details><summary>删除了之前的脚注后重新索引脚注</summary>

Before:

`````` markdown
Lorem ipsum at aliquet felis.[^3] Donec dictum turpis quis pellentesque,[^5] et iaculis tortor condimentum.

[^3]: first footnote
[^5]: second footnote
``````

After:

`````` markdown
Lorem ipsum at aliquet felis.[^1] Donec dictum turpis quis pellentesque,[^2] et iaculis tortor condimentum.

[^1]: first footnote
[^2]: second footnote
``````
</details>
<details><summary>在中间插入一个脚注后重新索引脚注</summary>

Before:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^1a] Vestibulum nec blandit felis, vulputate finibus purus.[^2] Praesent quis iaculis diam.

[^1]: first footnote
[^1a]: third footnote, inserted later
[^2]: second footnotes
``````

After:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^2] Vestibulum nec blandit felis, vulputate finibus purus.[^3] Praesent quis iaculis diam.

[^1]: first footnote
[^2]: third footnote, inserted later
[^3]: second footnotes
``````
</details>
<details><summary>重新索引脚注时会保留对同一脚注索引的多个引用</summary>

Before:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^1a] Vestibulum nec blandit felis, vulputate finibus purus.[^2] Praesent quis iaculis diam.[^1]

[^1]: first footnote
[^1a]: third footnote, inserted later
[^2]: second footnotes
``````

After:

`````` markdown
Lorem ipsum dolor sit amet, consectetur adipiscing elit.[^1] Aenean at aliquet felis. Donec dictum turpis quis ipsum pellentesque, et iaculis tortor condimentum.[^2] Vestibulum nec blandit felis, vulputate finibus purus.[^3] Praesent quis iaculis diam.[^1]

[^1]: first footnote
[^2]: third footnote, inserted later
[^3]: second footnotes
``````
</details>
<details><summary>当 key 和脚注相同时，重新索引脚注会将重复脚注合并为 1 个</summary>

Before:

`````` markdown
bla[^1], bla[^1], bla[^2]
[^1]: bla
[^1]: bla
[^2]: bla
``````

After:

`````` markdown
bla[^1], bla[^1], bla[^2]
[^1]: bla
[^2]: bla
``````
</details>
