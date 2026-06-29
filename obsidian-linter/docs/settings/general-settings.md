# 通用设置

## Default Escape Character

当不存在单引号和双引号时，用于转义 YAML 值的默认字符。

| List Item | Description | Is Default Value |
| --------- | ----------- | ---------------- |
| `"` | 当不存在单引号或双引号时，使用双引号转义 | `true` |
| `'` | 当不存在单引号或双引号时，使用单引号转义 | `false` |


## Yaml aliases section style

YAML aliases 区域的样式

| List Item | Description | Is Default Value |
| --------- | ----------- | ---------------- |
| `multi-line` | ```aliases:\n  - Title``` | `false` |
| `single-line` | ```aliases: [Title]```| `true` |
| `single string comma delimited` | ```aliases: Title, Other Title``` | `false` |
| `single string to single-line` | 当元素为 1 个或更少时，aliases 会格式化为字符串，例如 ```aliases: Title```。如果元素超过 1 个，则会格式化为单行数组。 | `false` |
| `single string to multi-line` | 当元素为 1 个或更少时，aliases 会格式化为字符串，例如 ```aliases: Title```。如果元素超过 1 个，则会格式化为多行数组。| `false` |
