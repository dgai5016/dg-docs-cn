# JavaScript 执行命令

这种命令允许我们执行 JavaScript 代码。

借助 JavaScript 执行命令，JavaScript 能做的事情基本都能做。下面给出一些示例。

在这种命令里，我们依然可以访问 `tp` 对象以及所有内部变量 / 函数。

JavaScript 执行命令还允许你访问全局命名空间下的变量，比如 `app`、`moment`。

## 异步函数

部分内部函数是异步的。在 JavaScript 执行命令中调用这类函数时，如有必要别忘了加 `await` 关键字。

## 如何从 JavaScript 执行命令中输出内容？

有时候你可能想在 JS 执行命令里输出一些内容。

当我们的模板引擎把所有命令的结果汇总成替换字符串时，会把它存在一个名为 `tR` 的变量里。这个变量保存的就是处理后的文件内容。你可以在 JS 执行命令中访问该变量。

也就是说，想要从 JS 执行命令中输出内容，只需把要输出的内容追加到 `tR` 字符串变量后即可。

例如，命令 `<%* tR += "test" %>` 会输出 `test`。

你也可以直接覆盖 `tR`，从而丢弃模板引擎到该位置为止生成的所有内容。如果你不想在应用模板时插入 frontmatter 或其他信息，这会很有用。

例如，下面的模板：

```
---
type: template
---
This is a person template.

<%* tR = "" -%>
---
type: person
---
# <% tp.file.cursor() %>
```

输出会是：

```
---
type: person
---
# 
```

### 选择器和提示

需要注意，`tp.system.prompt()` 和 `tp.system.suggester()` 都必须配合 `await` 才能把返回值保存到变量。

## 示例

下面是一些使用 JavaScript 执行命令可以做到的事情：

```javascript
<%* if (tp.file.title.startsWith("Hello")) { %>
This is a hello file !
<%* } else { %>
This is a normal file !
<%* } %>
    
<%* if (tp.frontmatter.type === "seedling") { %>
This is a seedling file !
<%* } else { %>
This is a normal file !
<%* } %>
    
<%* if (tp.file.tags.contains("#todo")) { %>
This is a todo file !
<%* } else { %>
This is a finished file !
<%* } %>

<%*
function log(msg) {
	console.log(msg);
}
%>
<%* log("Title: " + tp.file.title) %>
    
<%* tR += tp.file.content.replace(/stuff/, "things"); %>
```
