# 示例

这里收录了一小组 Dataview 查询语言的简单用法。

---

显示 games 文件夹中的所有游戏，按评分排序，并附带一些元数据：

=== "查询"
    ```sql
    TABLE
      time-played AS "Time Played",
      length AS "Length",
      rating AS "Rating"
    FROM "games"
    SORT rating DESC
    ```
=== "输出"
    |File|Time Played|Length|Rating|
    |-|-|-|-|
    |[Outer Wilds](#)|November 19th - 21st, 2020|15h|9.5|
    |[Minecraft](#)|All the time.|2000h|9.5|
    |[Pillars of Eternity 2](#)|August - October 2019|100h|9|

---

列出所有 MOBA 或 CRPG 类型的游戏。

=== "查询"
    ``` sql
    LIST FROM #games/mobas OR #games/crpg
    ```
=== "输出"
    - [League of Legends](#)
    - [Pillars of Eternity 2](#)

---

列出未完成项目中的所有任务：

=== "查询"
    ``` sql
    TASK FROM "dataview"
    ```
=== "输出"
    [dataview/Project A](#)

    - [ ] I am a task.
    - [ ] I am another task.

    [dataview/Project A](#)

    - [ ] I could be a task, though who knows.
        - [X] Determine if this is a task.
    - [X] I'm a finished task.

---

列出 `books` 文件夹下的所有文件，按文件最后修改时间排序：

=== "查询"
    ```sql
    TABLE file.mtime AS "Last Modified"
    FROM "books"
    SORT file.mtime DESC
    ```
=== "输出"
    |File|Last Modified|
    |-|-|
    |[Atomic Habits](#)|11:06 PM - August 07, 2021|
    |[Can't Hurt Me](#)|10:58 PM - August 07, 2021|
    |[Deep Work](#)|10:52 PM - August 07, 2021|

---

列出所有文件名中包含日期（形如 `yyyy-mm-dd`）的文件，并按日期排序。

=== "查询"
    ```sql
    LIST file.day WHERE file.day
    SORT file.day DESC
    ```
=== "输出"
    - [2021-08-07](#): August 07, 2021
    - [2020-08-10](#): August 10, 2020
