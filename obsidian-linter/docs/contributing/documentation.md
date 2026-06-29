# Linter 文档

Linter 的文档被拆分为几种不同的类别：手工编写的、模板生成的，以及自动生成的。

## 手工编写的文档

手工编写的文档是位于 `docs/docs` 目录下、非自动生成的文档。这些文件被创建并加入到 `mkdocs` 配置中，以便与 Linter 的其余文档一起托管。手工编写文档的示例包括本页面，以及 "Contributing"（贡献）标题下的所有其他页面。

## 自动生成的文档

本插件的许多文档都是自动生成的。具体是哪些文件、何时应更新，请参见[文档模板](#documentation-templates)一节。

如果你想更新 README 或规则文档中规则列表的信息（例如所属分区、示例、描述或选项），请更新位于 `src/rules/` 中对应规则文件里的规则信息。

要修改规则信息的展示方式，请更新 [docs.ts](https://github.com/platers/obsidian-linter/blob/master/src/docs.ts) 中 `generateDocs` 方法里的逻辑。

## 关于规则和规则类型的额外说明

有时候需要澄清某条规则如何运作、为何如此运作，或针对特定规则类型给出一些通用注意事项。

### 关于规则的额外说明

针对规则的额外说明文件位于 `docs/additional-info/rules/` 下。文件名与它们要补充说明的规则别名相同。这些文件中添加的信息通常用于帮助说明某条规则的工作方式或其局限性，也可用于警告用户不要同时使用某些特定规则。

### 关于规则类型的额外说明

针对规则类型的额外说明文件位于 `docs/additional-info/rule-types/` 下。文件名与规则类型的小写形式相同。这些文件中的信息通常包含局限性以及需要注意的事项。

## 文档模板

目前有 2 个用于生成文档的模板文件：

1. [readme_template.md](https://github.com/platers/obsidian-linter/blob/master/docs/templates/readme_template.md)
  - 此模板用于生成 [README](https://github.com/platers/obsidian-linter/blob/master/README.md) 文件，针对非规则文档链接及其对应章节的改动应在此模板中更新。
2. [contributing_template.md](https://github.com/platers/obsidian-linter/blob/master/docs/templates/contributing_template.md)
  - 此模板用于生成 [CONTRIBUTING.md](https://github.com/platers/obsidian-linter/blob/master/CONTRIBUTING.md]) 文件，针对非文档站内容、而是贡献指南相关内容的改动应在此模板中更新。

你也可以查看 [docs.ts](https://github.com/platers/obsidian-linter/blob/master/src/docs.ts) 来修改生成文件的方式。

## 生成文档

在尝试生成文档之前，请确保已按照[配置指南](getting-setup.md)所述将 Linter 配置为本地可用。

完成后，如果要更新文档，可以在需要同时编译代码时运行 `npm run compile`，或仅运行 `npm run docs`，后者只生成文档。

!!! note "看不到文档的变化?"
    如果你运行了 `npm run docs`，但任何生成文件都没有变化，请尝试运行 `npm run build`，然后再试一次。可能是因为改动还没有被构建。
