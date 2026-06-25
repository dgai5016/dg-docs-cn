# 语法

[Templater](https://github.com/SilentVoid13/Templater) 使用自定义模板引擎（[rusty_engine](https://github.com/SilentVoid13/rusty_engine)）的语法来声明命令。你可能需要一点时间适应，但一旦理解了基本思路，语法其实并不复杂。

Templater 的所有函数都是 JavaScript 对象，需要通过 **命令** 来调用。

## 命令语法

一条命令 **必须** 同时包含起始标签 `<%` 和结束标签 `%>`。

使用 `tp.date.now` 内部函数的完整命令是：`<% tp.date.now() %>`

## 函数语法

### 对象层级

Templater 的所有函数（无论是内部函数还是用户函数）都挂在 `tp` 对象下。可以说所有函数都是 `tp` 对象的「子级」。要访问一个对象的「子级」，需要使用点号 `.`。

也就是说，Templater 的函数调用总是以 `tp.<something>` 开头。

#### 函数调用

要调用一个函数，需要使用函数调用专用的语法：在函数名后跟上一对圆括号（开括号和闭括号）。

例如，调用 `tp.date.now` 内部函数应使用 `tp.date.now()`。

函数可以有参数和可选参数。参数放在开括号和闭括号之间，如下所示：

```javascript
tp.date.now(arg1_value, arg2_value, arg3_value, ...)
```

所有参数必须按正确顺序传入。

函数的参数有不同的 **类型**。下面列出函数参数可能出现的类型（并非全部）：

- `string`（字符串）类型：值必须放在单引号或双引号里（`"value"` 或 `'value'`）
- `number`（数字）类型：值必须是整数（`15`、`-5` 等）
- `boolean`（布尔）类型：值只能是 `true` 或 `false`（全小写），不能是其他值。

调用函数时必须遵守参数类型，否则无法正常工作。

### 函数文档语法

Templater 内部函数的文档使用如下语法：

```javascript
tp.<my_function>(arg1_name: type, arg2_name?: type, arg3_name: type = <default_value>, arg4_name: type1|type2, ...)
```

其中：

- `arg_name` 表示参数的 **符号** 名称，用于帮助你理解其含义。
- `type` 表示参数的预期类型。调用内部函数时必须遵守类型，否则会抛出错误。

如果参数是可选的，会在名称后加一个问号 `?`，例如 `arg2_name?: type`。

如果参数有默认值，会用等号 `=` 标注，例如 `arg3_name: type = <default_value>`。

如果参数支持多种类型，会用竖线 `|` 分隔，例如 `arg4_name: type1|type2`。

#### 语法警告

请注意，该语法仅用于文档说明，帮助你理解函数期望的参数。

调用函数时，**不要** 写出参数的名称、类型或默认值，只需提供参数的值，详见[这里](./syntax.md#function-invocation)。

##### 示例

以 `tp.date.now` 内部函数的文档为例：

```
tp.date.now(format?: string = "YYYY-MM-DD", offset?: number|string, reference?: string, reference_format?: string)
```

该内部函数有 4 个可选参数：

- 类型为 `string` 的 format，默认值为 `"YYYY-MM-DD"`。
- 类型为 `number` 或 `string` 的 offset。
- 类型为 `string` 的 reference。
- 类型为 `string` 的 reference_format。

也就是说，该内部函数的 **合法调用** 包括：

- `<% tp.date.now() %>`
- `<% tp.date.now("YYYY-MM-DD", 7) %>`
- `<% tp.date.now("YYYY-MM-DD", 7, "2021-04-09", "YYYY-MM-DD") %>`
- `<% tp.date.now("dddd, MMMM Do YYYY", 0, tp.file.title, "YYYY-MM-DD") %>` *假设文件名格式为："YYYY-MM-DD"

反之，**非法调用** 包括：

- `tp.date.now(format: string = "YYYY-MM-DD")`
- `tp.date.now(format: string = "YYYY-MM-DD", offset?: 0)`
