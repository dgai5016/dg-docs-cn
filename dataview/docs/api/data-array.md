# Data Array

Dataview 中结果列表的通用表示形式是 `DataArray`，它是一种 JavaScript 数组的[代理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)版本，并扩展了更多功能。Data Array 与普通数组一样支持索引和迭代（通过 `for` 和 `for ... of` 循环），同时还内置了许多数据操作算子，如 `sort`、`groupBy`、`distinct`、`where` 等，让表格化数据的操作更加便捷。

## 创建

大多数能够返回多个结果的 Dataview API（例如 `dv.pages()`）都会返回 Data Array。你也可以使用 `dv.array(<array>)` 将一个普通的 JavaScript 数组显式转换为 Dataview 的 Data Array。如果想把 Data Array 转回普通数组，可以使用 `DataArray#array()`。

## 索引与字段提取（Swizzling）

Data Array 与普通数组一样支持常规索引（例如 `array[0]`），但更重要的是，它还支持查询语言风格的"字段提取"（swizzling）：如果你用某个字段名去索引一个 Data Array（例如 `array.field`），它会自动将数组中的每个元素映射到对应的 `field` 字段；如果 `field` 本身也是一个数组，则会自动展平。

例如，`dv.pages().file.name` 会返回一个 Data Array，包含 vault 中所有的文件名；
`dv.pages("#books").genres` 会返回一个展平后的列表，包含你所有书籍中的所有体裁（genres）。

## 原始接口

下面提供了 Data Array 实现的完整接口供参考：

```ts
/** 将数组元素映射为某个值的函数。 */
export type ArrayFunc<T, O> = (elem: T, index: number, arr: T[]) => O;

/** 比较两个类型的函数。 */
export type ArrayComparator<T> = (a: T, b: T) => number;

/**
 * 一种代理接口，允许对基于数组的数据进行操作。Data Array 上的所有函数都会产生一个新数组
 * （即数组是不可变的）。
 */
export interface DataArray<T> {
    /** 数组中元素的总数。 */
    length: number;

    /** 将 Data Array 筛选为仅包含满足给定谓词的元素。 */
    where(predicate: ArrayFunc<T, boolean>): DataArray<T>;
    /** 'where' 的别名，提供给习惯数组语义的人使用。 */
    filter(predicate: ArrayFunc<T, boolean>): DataArray<T>;

    /** 对 Data Array 中的每个元素应用一个函数来进行映射。 */
    map<U>(f: ArrayFunc<T, U>): DataArray<U>;
    /** 对 Data Array 中的每个元素应用一个函数来进行映射，然后将结果展平以产生一个新数组。 */
    flatMap<U>(f: ArrayFunc<T, U[]>): DataArray<U>;
    /** 就地修改数组中的每个值，返回同一个数组以便继续链式调用。 */
    mutate(f: ArrayFunc<T, any>): DataArray<any>;

    /** 将数组中条目的总数限制为给定值。 */
    limit(count: number): DataArray<T>;
    /**
     * 对数组进行切片。如果 `start` 为 undefined，则视为 0；如果 `end` 为 undefined，
     * 则视为数组末尾。
     */
    slice(start?: number, end?: number): DataArray<T>;
    /** 将本 Data Array 中的值与另一个可迭代对象 / Data Array / 数组中的值拼接在一起。 */
    concat(other: Iterable<T>): DataArray<T>;

    /** 返回给定元素首次出现的索引（可指定从何处开始搜索） */
    indexOf(element: T, fromIndex?: number): number;
    /** 返回满足给定谓词的第一个元素。 */
    find(pred: ArrayFunc<T, boolean>): T | undefined;
    /** 返回满足给定谓词的第一个元素的索引。如果未找到则返回 -1。 */
    findIndex(pred: ArrayFunc<T, boolean>, fromIndex?: number): number;
    /** 如果数组中包含给定元素则返回 true，否则返回 false。 */
    includes(element: T): boolean;

    /**
     * 将数组中的每个元素转换为字符串，并使用给定的分隔符（默认为 ', '）拼接起来，
     * 返回拼接后的字符串。
     */
    join(sep?: string): string;

    /**
     * 返回按给定键排序后的数组；可以提供一个可选的比较器，
     * 该比较器将替代默认的 dataview 比较器用于比较键。
     */
    sort<U>(key: ArrayFunc<T, U>, direction?: "asc" | "desc", comparator?: ArrayComparator<U>): DataArray<T>;

    /**
     * 返回按给定键分组后的数组；结果数组中的对象形式为
     * { key: <键值>, rows: DataArray }。
     */
    groupBy<U>(key: ArrayFunc<T, U>, comparator?: ArrayComparator<U>): DataArray<{ key: U; rows: DataArray<T> }>;

    /**
     * 返回去重后的条目。如果提供了键，则只返回键互不相同的行。
     */
    distinct<U>(key?: ArrayFunc<T, U>, comparator?: ArrayComparator<U>): DataArray<T>;

    /** 如果谓词对所有值都为 true，则返回 true。 */
    every(f: ArrayFunc<T, boolean>): boolean;
    /** 如果谓词对至少一个值为 true，则返回 true。 */
    some(f: ArrayFunc<T, boolean>): boolean;
    /** 如果谓词对所有值都为 FALSE，则返回 true。 */
    none(f: ArrayFunc<T, boolean>): boolean;

    /** 返回 Data Array 中的第一个元素。如果数组为空则返回 undefined。 */
    first(): T;
    /** 返回 Data Array 中的最后一个元素。如果数组为空则返回 undefined。 */
    last(): T;

    /** 将 Data Array 中的每个元素映射到给定的键，然后进行展平。*/
    to(key: string): DataArray<any>;
    /**
     * 递归地展开给定的键，将基于该键的树形结构展平为一个扁平的数组。适合用于处理
     * 诸如带有 'subtasks' 的任务这类层级化数据。
     */
    expand(key: string): DataArray<any>;

    /** 对数组中的每个元素执行一个 lambda。 */
    forEach(f: ArrayFunc<T, void>): void;

    /** 计算数组中元素的总和。 */
    sum(): number;

    /** 计算数组中元素的平均值。 */
    avg(): number;

    /** 计算数组中元素的最小值。 */
    min(): number;

    /** 计算数组中元素的最大值。 */
    max(): number;

    /** 将其转换为普通的 JavaScript 数组。 */
    array(): T[];

    /** 允许直接对数组进行迭代。 */
    [Symbol.iterator](): Iterator<T>;

    /** 将索引映射到值。 */
    [index: number]: any;
    /** 字段的自动展平。等价于隐式调用 `array.to("field")` */
    [field: string]: any;
}
```
