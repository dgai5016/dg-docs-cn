# 内部函数

[Templater](https://github.com/SilentVoid13/Templater) 提供的各种内部变量和函数按 **模块（module）** 分类存放。现有的 **内部模块** 有：

- [App 模块](./internal-modules/app-module.md)：`tp.app`
- [Config 模块](./internal-modules/config-module.md)：`tp.config`
- [Date 模块](./internal-modules/date-module.md)：`tp.date`
- [File 模块](./internal-modules/file-module.md)：`tp.file`
- [Frontmatter 模块](./internal-modules/frontmatter-module.md)：`tp.frontmatter`
- [Hooks 模块](./internal-modules/hooks-module.md)：`tp.hooks`
- [Obsidian 模块](./internal-modules/obsidian-module.md)：`tp.obsidian`
- [System 模块](./internal-modules/system-module.md)：`tp.system`
- [Web 模块](./internal-modules/web-module.md)：`tp.web`

如果你已经理解了[对象层级](../syntax.md#objects-hierarchy)，就会知道典型的内部函数调用长这样：` <% tp.<module_name>.<internal_function_name %>`

## 贡献代码

欢迎大家通过添加新的内部函数来参与本插件的开发。更多信息请见[这里](./contribute.md)。
