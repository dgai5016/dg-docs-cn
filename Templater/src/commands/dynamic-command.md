# 动态命令

借助这个命令工具，你可以把一条命令声明为「动态」，意思是该命令会在进入预览模式时才被解析。

要声明动态命令，在命令起始标签后加一个加号 `+`：`<%+`

这样该命令就只会在预览模式下执行。

这对 `tp.file.last_modified_date` 这类内部函数特别有用：

```javascript
Last modified date: <%+ tp.file.last_modified_date() %>
```

**注意**：动态命令存在已知问题，未来大概率不会再维护（详见[这个 issue](https://github.com/SilentVoid13/Templater/issues/913)）。大多数情况下推荐使用 [Dataview](https://github.com/blacksmithgu/obsidian-dataview) 插件作为替代方案。

## 刷新问题

预览模式的一个「副作用」是会把渲染后的笔记放入缓存以加快速度。

也就是说，动态命令只会在你打开笔记时渲染一次，之后不会自动刷新。

如果要刷新，必须关闭该笔记清掉缓存，再重新打开。
