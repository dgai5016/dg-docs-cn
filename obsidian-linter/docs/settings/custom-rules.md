# 自定义规则

## Custom Lint Commands

这些是用户可以指定的特殊 lint 规则。它们是 Obsidian 命令。如果你想创建一个可运行的自定义命令，可以使用 [QuickAdd](https://github.com/chhoumann/quickadd) 插件来添加一段 JavaScript 脚本以修改文件。**这需要一定的 Obsidian API 和 JavaScript 知识。** 要使用自定义用户脚本，请按以下步骤操作：

1. 安装 QuickAdd 插件
2. 进入 QuickAdd 的设置，选择「Manage Macros」
3. 你会看到一个弹窗。在该弹窗中输入宏名称并添加该宏。
4. 添加宏后，配置该宏并加入你的用户脚本（这应该是你 Obsidian 仓库中的一个 JavaScript 文件）。[这里](https://github.com/chhoumann/quickadd/blob/master/docs/docs/Examples/Macro_LogBookToDailyJournal.md) 是 QuickAdd 仓库中的一个示例，附带对代码作用的说明。
5. 完成所有想要的宏修改后，关闭配置宏弹窗和宏管理弹窗。
6. 然后为该 choice 选择 macro 类型，并输入你刚创建的宏名称（你可能会得到建议，也可能需要记住名称并完整输入）。然后点击「Add Choice」。
7. 添加 choice 后，点击闪电图标，这是为 choice 添加命令的选项。
8. 现在你只需要在 Obsidian Linter 的自定义命令设置中搜索这个新创建的命令即可。

下次运行 Linter 时，自定义 lint 命令就会执行。

## Custom Regex Replacements

这些规则在 YAML 时间戳规则之前、但在大多数其他规则之后运行。这些规则允许你指定要查找的正则表达式、与该正则表达式一起使用的标志，以及要替换成的值。**你可以将空白字符指定为查找和替换的值，但请务必小心，因为稍有不慎就可能造成大量不必要的改动。**
如果你对正则表达式比较熟悉，这些规则在将某些标签、单词和格式替换为其他内容时会非常有用。

[这里](https://regexr.com/) 是一个在线正则表达式测试平台。它能提示你正则表达式是否运行缓慢，你还可以用它来测试你想替换的文本是否真的被查找部分和标志所选中。

[这里](https://javascript.info/regexp-introduction#flags) 是对每个标志含义的说明。按需使用即可。默认添加的标志是 `g`（global，全局）和 `m`（multiline，多行）。

!!! danger "正则表达式 lookbehind 可能会破坏 Linter 功能"
    正则表达式 lookbehind 在 iOS 移动端无法工作，使用它们会导致 lint 失败。所以在 iOS 移动端**请勿**使用 lookbehind。
