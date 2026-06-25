# Hooks 模块

{{ tp.hooks.description }}

<!-- toc -->

## 文档

函数文档使用了一种专门的语法。更多信息请见[这里](../../syntax.md#function-documentation-syntax)。


{%- for key, fn in tp.hooks.functions %}
### `{{ fn.definition }}` 

{{ fn.description }}

{% if fn.args %}
##### 参数

{% for arg in fn.args %}
- `{{ arg.name }}`: {{ arg.description }}
{% endfor %}
{% endif %}
{%- endfor %}

## 示例

```javascript
// 在模板执行完成后更新 frontmatter
<%*
tp.hooks.on_all_templates_executed(async () => {
  const file = tp.file.find_tfile(tp.file.path(true));
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["key"] = "value";
  });
});
%>
// 在 Templater 更新文件后，运行另一个修改当前文件的插件命令
<%*
tp.hooks.on_all_templates_executed(() => {
  tp.app.commands.executeCommandById("obsidian-linter:lint-file");
});
-%>
```