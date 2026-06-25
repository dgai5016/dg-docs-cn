# App 模块

{{ tp.app.description }}

这在编写脚本时尤其有用。

更多信息请参阅 Obsidian [开发者文档](https://docs.obsidian.md/Reference/TypeScript+API/App)。

## 示例

```javascript
// 获取所有文件夹
<%
tp.app.vault.getAllLoadedFiles()
  .filter(x => x instanceof tp.obsidian.TFolder)
  .map(x => x.name)
%>

// 更新已有文件的 frontmatter
<%*
const file = tp.file.find_tfile("path/to/file");
await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
  frontmatter["key"] = "value";
});
%>
```