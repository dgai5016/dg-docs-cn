# System 模块

{{ tp.system.description }}

<!-- toc -->

## 文档

函数文档使用了一种专门的语法。更多信息请见[这里](../../syntax.md#function-documentation-syntax)。

{%- for key, fn in tp.system.functions %}
### `{{ fn.definition }}` 

{{ fn.description }}

{% if fn.args %}
##### 参数

{% for arg in fn.args %}
- `{{ arg.name }}`: {{ arg.description }}
{% endfor %}
{% endif %}

{% if fn.examples %}
##### 示例

```javascript
{% for example in fn.examples -%}
// {{ example.name}}
{{ example.example }}
{% endfor -%}
```
{% endif %}
{%- endfor %}

## 示例

```javascript
{%- for key, fn in tp.system.functions %}
{% for example in fn.examples -%}
// {{ example.name}}
{{ example.example }}
{% endfor -%}
{%- endfor %}
```