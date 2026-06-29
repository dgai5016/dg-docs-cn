# 创建发布

要创建一次发布，需要经过以下几个步骤：

首先更新 `package.json` 和 `manifest.json` 中的版本号，然后在 `versions.json` 中添加一条新的版本条目。

`versions.json` 中的版本条目大致如下所示：
```JSON
"{PLUGIN_VERSION}": "{MINIMUM_OBSIDIAN_VERSION}" // i.e. "1.3.4": "0.9.7" 
```
如果你不确定 `{MINIMUM_OBSIDIAN_VERSION}` 该填什么版本，就使用你当前所用的 Obsidian 版本。

版本号更新完毕后，创建一个 pull request 并把改动合并到 master。完成后
前往 [releases 标签页](https://github.com/platers/obsidian-linter/releases/latest) 并选择起草一个新发布。
然后你可以输入新的 tag，它应当就是发布的版本号（例如 `1.3.4`），并让其在该发布创建时一并创建 tag。使用 "Generate release notes" 选项自动填充发布说明。最后在发布该 release 之前，将编译好的 `main.js` 和 `manifest.json` 附加到这次发布中。
