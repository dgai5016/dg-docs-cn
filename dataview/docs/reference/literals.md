# 字面量

Dataview 查询语言的*字面量*（literals）是表示常量值的**表达式**，例如文本（`"Science"`）或数字（`2021`）。它们可以作为[函数](functions.md)的一部分，也可以作为[比较表达式](./expressions.md)的一部分。下面是一些使用了**字面量**的[查询](../queries/structure.md)示例：

~~~

字面量（数字）2022 用于比较
```dataview
LIST
WHERE file.day.year = 2022
```

字面量（文本）"Math" 用于函数调用
```dataview
LIST
WHERE contains(file.name, "Math")
```

字面量（链接）[[Study MOC]] 用作数据源
```dataview
LIST
FROM [[Study MOC]]
```

字面量（日期）date(yesterday) 用于比较
```dataview
TASK
WHERE !completed AND file.day = date(yesterday)
```

字面量（时长）dur(2 days) 用于比较
```dataview
LIST
WHERE end - start > dur(2 days)
```
~~~

!!! summary "字面量"
    字面量是**静态值**，可以作为 Dataview 查询语言（DQL）的一部分使用，例如用于比较操作。

以下是 DQL 中可用字面量的一个较为全面（但并非穷尽）的列表。

### 通用
字面量|说明
-|-
`0`|数字零
`1337`|正数 1337
`-200`|负数 -200
`"The quick brown fox jumps over the lazy dog"`|文本（有时也称作"字符串"）
`[[Science]]`|指向名为 "Science" 文件的链接
`[[]]`|指向当前文件的链接
`[1, 2, 3]`|由数字 1、2、3 组成的列表
`[[1, 2],[3, 4]]`|由列表 [1, 2] 和 [3, 4] 组成的列表
`{ a: 1, b: 2 }`|一个包含键 a 和 b 的对象，其中 a 的值为 1，b 的值为 2。|
`date(2021-07-14)`|一个日期（详见下文）|
`dur(2 days 4 hours)`|一个时长（详见下文）|

!!! attention "作为字段值的字面量"
    字面量只有在查询内部使用时才会按上述方式解析；当它们作为元数据值使用时则不会如此。关于字段可用的值及其数据类型，请参阅[元数据类型](../annotation/types-of-metadata.md)。

### 日期

当你使用 [Date ISO 格式的字段值](../annotation/types-of-metadata.md#date)时，需要将这些字段与日期对象进行比较。Dataview 为常见的使用场景提供了一些简写形式，例如"明天"、"本周开始"等。请注意，`date()` 也是一个[函数](functions.md#dateany)，可以被调用于**文本**以提取日期。

字面量|说明
-|-
`date(2021-11-11)`|一个日期，2021 年 11 月 11 日
`date(2021-09-20T20:17)`|一个日期，2021 年 9 月 20 日 20:17
`date(today)`|表示当前日期的日期
`date(now)`|表示当前日期和时间的日期
`date(tomorrow)`|表示明天日期的日期
`date(yesterday)`|表示昨天日期的日期
`date(sow)`|表示本周开始的日期
`date(eow)`|表示本周结束的日期
`date(som)`|表示本月开始的日期
`date(eom)`|表示本月结束的日期
`date(soy)`|表示本年开始的日期
`date(eoy)`|表示本年结束的日期

### 时长

时长表示一段时间跨度。你可以[直接定义时长](../annotation/types-of-metadata.md#duration)，也可以通过[对日期进行运算](../annotation/types-of-metadata.md#duration)来产生时长，然后将它们用于例如比较等操作。

#### 秒
字面量|说明
-|-
`dur(1 s)`|一秒
`dur(3 s)`|三秒
`dur(1 sec)`|一秒
`dur(3 secs)`|三秒
`dur(1 second)`|一秒
`dur(3 seconds)`|三秒

#### 分钟
字面量|说明
-|-
`dur(1 m)`|一分钟
`dur(3 m)`|三分钟
`dur(1 min)`|一分钟
`dur(3 mins)`|三分钟
`dur(1 minute)`|一分钟
`dur(3 minutes)`|三分钟

#### 小时
字面量|说明
-|-
`dur(1 h)`|一小时
`dur(3 h)`|三小时
`dur(1 hr)`|一小时
`dur(3 hrs)`|三小时
`dur(1 hour)`|一小时
`dur(3 hours)`|三小时

#### 天
字面量|说明
-|-
`dur(1 d)`|一天
`dur(3 d)`|三天
`dur(1 day)`|一天
`dur(3 days)`|三天

#### 周
字面量|说明
-|-
`dur(1 w)`|一周
`dur(3 w)`|三周
`dur(1 wk)`|一周
`dur(3 wks)`|三周
`dur(1 week)`|一周
`dur(3 weeks)`|三周

#### 月
字面量|说明
-|-
`dur(1 mo)`|一个月
`dur(3 mo)`|三个月
`dur(1 month)`|一个月
`dur(3 months)`|三个月

#### 年
字面量|说明
-|-
`dur(1 yr)`|一年
`dur(3 yrs)`|三年
`dur(1 year)`|一年
`dur(3 years)`|三年

#### 组合形式
字面量|说明
-|-
`dur(1 s, 2 m, 3 h)`|三小时两分钟一秒
`dur(1 s 2 m 3 h)`|三小时两分钟一秒
`dur(1s 2m 3h)`|三小时两分钟一秒
`dur(1second 2min 3h)`|三小时两分钟一秒
