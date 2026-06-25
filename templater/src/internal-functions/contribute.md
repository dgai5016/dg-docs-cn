# 贡献代码

你可以通过开发新的内部变量 / 函数来为 [Templater](https://github.com/SilentVoid13/Templater) 做贡献。

新增一个的流程非常简单。

请注意，只有合适的提交才会被接受；不要提交那些只有你自己会用、过于特定的内部变量 / 函数。

## 目录结构

内部变量 / 函数按模块分类。每个模块在 [src/InternalTemplates](https://github.com/SilentVoid13/Templater/tree/master/src/InternalTemplates) 下都有独立的文件夹。

以 [date 模块](https://github.com/SilentVoid13/Templater/tree/master/src/InternalTemplates/date) 为例。

它包含一个 [InternalModuleDate](https://github.com/SilentVoid13/Templater/blob/master/src/core/functions/internal_functions/date/InternalModuleDate.ts) 文件，所有与日期相关的内部变量和函数都在其中定义和注册：

```typescript
export class InternalModuleDate extends InternalModule {
    name = "date";

    async createStaticTemplates() {
        this.static_templates.set("now", this.generate_now());
        this.static_templates.set("tomorrow", this.generate_tomorrow());
        this.static_templates.set("yesterday", this.generate_yesterday());
    }

    async updateTemplates() {}

    generate_now() {
        return (format: string = "YYYY-MM-DD", offset?: number, reference?: string, reference_format?: string) => {
            if (reference && !window.moment(reference, reference_format).isValid()) {
                throw new Error("Invalid title date format, try specifying one with the argument 'reference'");
            }
            return get_date_string(format, offset, reference, reference_format);
        }
    }

    generate_tomorrow() {
        return (format: string = "YYYY-MM-DD") => {
            return get_date_string(format, 1);
        }
    }

    generate_yesterday() {
        return (format: string = "YYYY-MM-DD") => {
            return get_date_string(format, -1);
        }
    }
}
```

每个模块都继承自 [InternalModule](https://github.com/SilentVoid13/Templater/blob/master/src/core/functions/internal_functions/InternalModule.ts) 抽象类，因此都包含以下属性和方法：

- `this.app` 属性：Obsidian API 的 `App` 对象。
- `this.file` 属性：模板要插入到的目标文件。
- `this.plugin` 属性：Templater 插件对象。
- `this.static_templates` 属性：一个 map，存放所有静态的（name; variable/function）键值对。所谓「静态」变量 / 函数，是指执行时不依赖具体文件。这类变量 / 函数不会在每次插入新模板时都更新，从而减少开销。
- `this.dynamic_templates` 属性：与 `static_templates` 相同，只是存放的是执行时依赖具体文件的变量 / 函数。
- `this.createStaticTemplates()` 方法：注册该模块的所有静态内部变量 / 函数。
- `this.updateTemplates()` 方法：注册该模块的所有动态内部变量 / 函数。

如果需要，你可以在新的内部变量 / 函数中使用这些属性。

## 注册新的内部变量 / 函数

要在某个模块中注册一个新的内部变量 / 函数，需要按以下步骤操作。

**第 1 步：** 在模块内创建一个名为 `generate_<内部变量或函数名>()` 的方法，用于生成你的内部变量 / 函数。也就是说，它要么返回一个 lambda 函数（代表内部函数），要么直接返回你想暴露的内部变量。

所有生成方法按内部变量 / 函数名的字母顺序排列。

请给变量 / 函数起一个语义清晰、能自解释的名字。

**第 2 步：** 根据你的内部变量 / 函数在执行时是否依赖文件，将其注册到 `static_templates` 或 `dynamic_templates` map 中。注册发生在 `createStaticTemplates` 或 `updateTemplates` 中。

注册时调用你之前定义的 `this.generate_<内部变量或函数名>()` 方法：

```typescript
this.static_templates.set(<内部变量或函数名>, this.generate_<内部变量或函数名>());
或者
this.dynamic_templates.set(<内部变量或函数名>, this.generate_<内部变量或函数名>());
```

内部变量 / 函数的注册同样按变量 / 函数名的字母顺序排列。

**第 3 步：** 在 Templater 的[文档](https://github.com/SilentVoid13/Templater/tree/master/docs/docs/internal-variables-functions/internal-modules)中补上你的内部变量 / 函数说明。

完成！感谢你为 [Templater](https://github.com/SilentVoid13/Templater) 贡献代码！

接下来只需在 GitHub 上提交一个 [pull request](https://github.com/SilentVoid13/Templater/pulls)，我会尽量尽快响应。
