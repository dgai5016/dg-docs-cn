# Obsidian 模块

{{ tp.obsidian.description }}

这在编写脚本时尤其有用。

更多信息请参阅 Obsidian API 的[声明文件](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts)。

## 示例

```javascript
// 获取所有文件夹
<%
tp.app.vault.getAllLoadedFiles()
  .filter(x => x instanceof tp.obsidian.TFolder)
  .map(x => x.name)
%>

// 规范化路径
<% tp.obsidian.normalizePath("Path/to/file.md") %>

// HTML 转 markdown
<% tp.obsidian.htmlToMarkdown("\<h1>Heading\</h1>\<p>Paragraph\</p>") %>

// HTTP 请求
<%*
const response = await tp.obsidian.requestUrl("https://jsonplaceholder.typicode.com/todos/1");
tR += response.json.title;
%>
```