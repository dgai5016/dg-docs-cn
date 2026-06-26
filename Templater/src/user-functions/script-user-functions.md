# 用户脚本函数

这类用户函数允许你从 JavaScript 文件中调用函数并获取其输出。

要使用用户脚本函数，你需要在 Templater 设置中指定一个脚本文件夹，且该文件夹必须能从 vault 中访问。

## 定义用户脚本函数

假设你在 Templater 设置中把 `Scripts` 文件夹指定为脚本文件夹。

Templater 会加载 `Scripts` 文件夹下所有的 JavaScript（`.js`）脚本。

接着你可以创建一个名为 `Scripts/my_script.js`（必须带 `.js` 扩展名）的脚本。你可能需要在 Obsidian 之外创建该文件，因为 Obsidian 只能创建 markdown 文件。

然后你就可以像调用用户函数一样调用脚本。**函数名对应脚本文件名**。

脚本需要遵循 [CommonJS 模块规范](https://flaviocopes.com/commonjs/)，导出单个函数，或导出一个所有属性都是函数的对象。

```javascript
module.exports = function (msg) {
    return `Message from my script: ${msg}`;
};
```

在本示例中，完整的命令调用如下：

```javascript
<% tp.user.my_script("Hello World!") %>
```

会输出 `Message from my script: Hello World!`。

你也可以导出一个包含多个函数的对象。注意，对象的每个属性都必须是函数。

```javascript
function formatAsCallout(text, type = "note") {
  const blockQuoteLines = text.split("\n").map((line) => `> ${line}`);
  return `> [!${type}]\n${blockQuoteLines.join("\n")}`;
}

module.exports = {
  note: (text) => formatAsCallout(text, "note"),
  tip: (text) => formatAsCallout(text, "tip"),
  warning: (text) => formatAsCallout(text, "warning"),
};

```

在本示例中，完整的命令调用如下：

```javascript
<% tp.user.my_script.note("Line 1\nLine2") %>
```

会输出：

```md
> [!note]
> Line 1
> Line2
```

## 全局命名空间

在用户脚本函数中，你依然可以访问 `app`、`moment` 等全局命名空间下的变量。

但无法访问模板引擎作用域内的变量，比如 `tp` 或 `tR`。如果想用，必须把它们作为参数传给你的函数。


## 函数参数

你可以根据函数的定义传入任意多个参数。

例如，你可以把 `tp` 对象传给函数，从而在脚本中使用 Templater 的所有[内部变量 / 函数](../internal-variables-functions/overview.md)：`<% tp.user.<user_function_name>(tp) %>`

## 用户脚本文档

可选地，你可以在方法文件的 **顶部** 使用 [TSDoc 标准](https://tsdoc.org/) 为脚本编写说明。如果提供了文档，用户脚本会获得类似智能提示（intellisense）的体验，效果与其他 Templater 函数一致。

### 带文档的用户脚本示例

```javascript
/**
 * This does something cool
 */
function doSomething() {
    console.log('Something was done')
}

module.exports = doSomething;
```
