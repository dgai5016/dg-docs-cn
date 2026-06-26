# 基于 Dataview 进行开发

Dataview 提供了一套面向插件的高层 API，并附带 TypeScript 类型定义和一组工具库；要安装它，只需执行：

```bash
npm install -D obsidian-dataview
```

要核对所安装的版本是否正确，可运行 `npm list obsidian-dataview`。如果未能显示最新版本（当前最新为 0.5.64），你可以执行：

```bash
npm install obsidian-dataview@0.5.64
```

**注意**：如果本地系统尚未安装 [Git](http://git-scm.com/)，需要先安装 Git。安装 Git 后可能需要重启设备才能完成安装，之后才能正常安装 Dataview API。

##### 获取 Dataview API

你可以使用 `getAPI()` 函数来获取 Dataview 插件 API；它会返回一个 `DataviewApi` 对象，提供多种实用功能，包括渲染 dataview、检查 Dataview 版本、挂钩 Dataview 事件生命周期，以及查询 Dataview 元数据。

```ts
import { getAPI } from "obsidian-dataview";

const api = getAPI();
```

如需查看完整的 API 定义，可参考
[index.ts](https://github.com/blacksmithgu/obsidian-dataview/blob/master/src/index.ts) 或插件 API 定义文件 [plugin-api.ts](https://github.com/blacksmithgu/obsidian-dataview/blob/master/src/api/plugin-api.ts)。

##### 绑定 Dataview 事件

你可以绑定 Dataview 元数据事件，这些事件会在所有文件更新和变动时触发：


```ts
plugin.registerEvent(plugin.app.metadataCache.on("dataview:index-ready", () => {
    ...
});

plugin.registerEvent(plugin.app.metadataCache.on("dataview:metadata-change",
    (type, file, oldPath?) => { ... }));
```

关于 MetadataCache 上所有可挂钩的事件，请查阅 [index.ts](https://github.com/blacksmithgu/obsidian-dataview/blob/master/src/index.ts)。

##### 值工具

你可以通过 `Values` 访问各种类型工具，用于检查对象的类型并进行比较：

~~~ts
import { getAPI, Values } from "obsidian-dataview";

const field = getAPI(plugin.app)?.page('sample.md').field;
if (!field) return;

if (Values.isHtml(field)) // 做点什么
else if (Values.isLink(field)) // 做点什么
// ...
~~~
