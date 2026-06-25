# Date 模块

{{ tp.date.description }}

<!-- toc -->

## 文档

函数文档使用了一种专门的语法。更多信息请见[这里](../../syntax.md#function-documentation-syntax)。

{%- for key, fn in tp.date.functions %}
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

## Moment.js

Templater 让你能访问 `moment` 对象及其全部功能。

更多 moment.js 的信息请见[这里](https://momentjs.com/docs/#/displaying/)。

{% if tp.date.momentjs.examples %}
##### 示例

```javascript
{% for example in tp.date.momentjs.examples -%}
// {{ example.name}}
{{ example.example }}
{% endfor -%}
```
{% endif %}

## 示例

```javascript
{%- for key, fn in tp.date.functions %}
{% for example in fn.examples -%}
// {{ example.name}}
{{ example.example }}
{% endfor -%}
{%- endfor %}
```