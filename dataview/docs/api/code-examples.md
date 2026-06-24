# 代码块示例

## 按分组展示书籍

按体裁对书籍进行分组，然后借助 Dataview 渲染 API 的简单用法，为每个分组生成一张按评分排序的表格：

```js
for (let group of dv.pages("#book").groupBy(p => p.genre)) {
	dv.header(3, group.key);
	dv.table(["Name", "Time Read", "Rating"],
		group.rows
			.sort(k => k.rating, 'desc')
			.map(k => [k.file.link, k["time-read"], k.rating]))
}
```

![Grouped Books Example](../assets/grouped-book-example.png)

## 查找所有直接与间接链接的页面

使用一个简单的集合 + 栈实现的深度优先搜索，找出所有链接到当前笔记（或你指定笔记）的页面：

```js
let page = dv.current().file.path;
let pages = new Set();

let stack = [page];
while (stack.length > 0) {
	let elem = stack.pop();
	let meta = dv.page(elem);
	if (!meta) continue;

	for (let inlink of meta.file.inlinks.concat(meta.file.outlinks).array()) {
		console.log(inlink);
		if (pages.has(inlink.path)) continue;
		pages.add(inlink.path);
		stack.push(inlink.path);
	}
}

// Data is now the file metadata for every page that directly OR indirectly links to the current page.
let data = dv.array(Array.from(pages)).map(p => dv.page(p));
```
