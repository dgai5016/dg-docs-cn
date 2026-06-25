# 设置

## 通用设置

- `Template folder location`：该文件夹下的文件将作为模板可用。
- `Syntax Highlighting on Desktop`：在桌面端的编辑模式下为 [Templater](https://github.com/SilentVoid13/Templater) 命令添加语法高亮。
- `Syntax Highlighting on Mobile`：在移动端的编辑模式下为 [Templater](https://github.com/SilentVoid13/Templater) 命令添加语法高亮。请谨慎使用：可能会破坏移动端的实时预览。
- `Automatic jump to cursor`：插入模板后自动触发 `tp.file.cursor`。你也可以为 `tp.file.cursor` 单独设置一个快捷键手动触发。

## 模板快捷键

模板快捷键（Template Hotkeys）允许你将某个模板绑定到一个[命令](https://obsidian.md/help/plugins/command-palette)，再在「快捷键（Hotkeys）」设置中为该命令绑定[快捷键](https://obsidian.md/help/hotkeys)。

## 文件创建

- `Trigger Templater on new file creation`：[Templater](https://github.com/SilentVoid13/Templater) 会监听新文件创建事件，一旦匹配到你设置的规则，就会替换新文件内容中的所有命令。这使得 [Templater](https://github.com/SilentVoid13/Templater) 能与「每日笔记（Daily notes）」核心插件、Calendar 插件、Review 插件、Note refactor 插件等协同工作。
  - **警告：** 如果新文件在创建时包含未知或不安全的内容，开启此功能可能带来风险。请确保每个新文件在创建时内容都是安全的。

开启 `Trigger Templater on new file creation` 后，会出现以下设置项：

- `Excluded folders`：在这些文件夹下创建新文件永远不会触发 Templater，与匹配模式无关。
- `Template matching mode`：控制模板与新文件的匹配方式。可选：
  - **None**：不自动应用模板。Templater 仍会监听新文件创建事件，并替换其内容中的所有命令。
  - **Folder templates**：基于文件夹结构匹配模板。
  - **File regex templates**：基于文件路径的正则模式匹配模板。

## 文件夹模板

当 `Template matching mode` 设置为 **Folder templates** 时显示。

你可以指定一个模板，自动应用到所选文件夹及其子文件夹。匹配时最具体（最深）的文件夹优先，因此子文件夹的规则会覆盖父文件夹的规则。

如果需要一条「兜底」规则，可以为根目录 `"/"` 添加一条规则。

## 文件正则模板

当 `Template matching mode` 设置为 **File regex templates** 时显示。

你可以指定一组正则表达式，用来匹配新文件的路径。如果某个正则命中，就会自动应用对应的模板。规则按自上而下的顺序匹配，命中第一条即停止。

如果需要一条「兜底」规则，可以在最后加一条 `".*"`。

可以使用 [Regex101](https://regex101.com/) 等工具验证你的正则表达式。

## 启动模板

开启 `Enable startup templates` 开关后，模板会在 Templater 启动时自动运行。

启动模板（Startup Templates）会在 Templater 启动时执行一次，且不会产生任何输出。例如，可以用来在模板中为 Obsidian 事件注册钩子（hooks）。

## 用户脚本函数

- `User scripts folder`：该文件夹下所有 JavaScript 文件都会作为 CommonJS 模块加载，用于导入自定义的[用户函数](./user-functions/overview.md)。该文件夹必须能从 vault 中访问。更多信息请参阅[文档](./user-functions/script-user-functions.md)。
- `User script intellisense`：控制用户脚本自动补全提示的渲染方式。可选：
  - **关闭智能提示（Turn off intellisense）**
  - **渲染方法描述、参数列表和返回值**（默认）
  - **仅渲染方法描述和参数列表**
  - **仅渲染方法描述和返回值**
  - **仅渲染方法描述**

## 用户系统命令函数

开启 `Enable user system command functions` 开关后，可以使用与系统命令绑定的[用户函数](./user-functions/overview.md)。

**警告：** 执行来源不可信的系统命令存在风险。只运行你理解、且来源可信的系统命令。

开启后会显示以下设置项：

- `Timeout`：系统命令的最大超时时间（秒），默认 5。
- `Shell binary location`：用于执行命令的 shell 可执行文件的完整路径。可选——若不指定，则使用系统默认 shell。所有平台上都可以使用正斜杠（`/`）作为路径分隔符。

更多信息请参阅[文档](./user-functions/system-user-functions.md)。
