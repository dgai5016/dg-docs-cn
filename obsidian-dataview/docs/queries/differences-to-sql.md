<!--
 * @Author: chinesehamburger 2576226012@qq.com
 * @Date: 2024-12-12 14:24:45
 * @LastEditors: chinesehamburger 2576226012@qq.com
 * @LastEditTime: 2024-12-13 16:40:43
 * @FilePath: \obsidian-dataview\docs\docs\queries\differences-to-sql.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# Dataview 查询语言（DQL）与 SQL

如果你熟悉 SQL，并且有编写 SQL 查询的经验，你可能会想用类似的方式来编写 DQL 查询。然而，DQL 与 SQL 之间存在显著差异。

DQL 查询是**从上到下、逐行执行**的。它更像是一段计算机程序，而不是典型的 SQL 查询。

当某一行被求值时，它会产出一个结果集，然后**把整个集合传递给下一行 DQL**，由下一行对它接收到的集合进行操作。这就是为什么在 DQL 中可以出现多个 WHERE 子句的原因——不过在 DQL 里它不叫「子句 clause」，而叫「数据命令 data command」。DQL 查询中除了第 1 行和第 2 行之外的每一行都是一个「数据命令」。

## DQL 查询的结构剖析

DQL 查询并不以 SELECT 开头，而是以一个决定查询类型的词开头，这个词决定了最终结果在屏幕上如何渲染（表格、列表、任务列表，或日历）。接下来是要展示的字段列表，这其实与你写在 SELECT 语句后面的列清单非常相似。

下一行以 FROM 开头，但 FROM 后面跟的不是表名，而是一个复杂的表达式，类似于 SQL 中的 WHERE 子句。在这里你可以基于多种条件进行筛选，例如文件中的标签、文件名、路径名等。在底层，这条命令就已经产出了一个结果集，它将作为后续各行中「数据命令」进一步处理数据的初始集合。

接下来的行你可以写任意多行。每一行都以一个[数据命令](data-commands.md)开头，并对上一行传来的结果集进行重新塑形。例如：

- WHERE 数据命令只会保留结果集中符合给定条件的那些行。这意味着，除非结果集中的所有数据都符合条件，否则这个命令传给下一行的结果集会比它从上一行接收到的更小。与 SQL 不同，你可以写任意多个 WHERE 命令。
- FLATTEN 数据命令在常见的 SQL 中并不存在，但在 DQL 中你可以用它来降低结果集的层级深度。
- DQL 与 SQL 类似，也有 GROUP BY 命令，但在 DQL 中它可以被多次使用，而这在常见的 SQL 中是不可能的。你甚至可以连续执行多个 SORT 或 GROUP BY 命令。
