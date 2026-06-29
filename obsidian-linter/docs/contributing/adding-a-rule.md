# 添加规则

在尝试添加规则之前，请确保已按照[配置指南](getting-setup.md)所述将 Linter 配置为本地可用。

将 Linter 配置为本地可用后，向 Linter 添加一条新规则需要遵循若干步骤，从长远看这些步骤会为你我节省大量时间。

## 1. 创建一个功能请求

请先提交一个 [feature request](https://github.com/platers/obsidian-linter/issues/new?assignees=&labels=rule+suggestion&template=feature_request.md&title=FR%3A+)。这样我们可以先看一下所请求的功能，并确认它确实符合 Linter 的定位。

## 2. 为规则创建新文件

确认新规则符合 Linter 的范围之后，就可以将其添加到仓库中。为此，你需要在仓库的 `src/rules/` 下添加一个新文件。最简单的方式是复制一条现有规则，或复制并重命名 [src/rules_rule-template.ts.txt](https://github.com/platers/obsidian-linter/blob/master/src/rules/_rule-template.ts.txt)。

请尽量遵循现有规则的格式，因为这样代码更易于维护，改动也更容易评审。

## 3. 填写规则的各个组成部分

规则通常包含以下几个组成部分：

- 选项（options）
- 选项构造器或设置（settings）
- 构造函数
- apply 函数或规则逻辑
- 示例
- 规则文本

为了帮助更好地理解这些组成部分、让你对各部分感到熟悉，下面看一个通用示例，并逐部分讲解。

一般而言，一条规则大致如下例所示（它是 [YAML Key Sort](../settings/yaml-rules.md#yaml-key-sort) 的精简版）：

``` TypeScript
import {Options, RuleType} from '../rules';
import RuleBuilder, {BooleanOptionBuilder, DropdownOptionBuilder, ExampleBuilder, OptionBuilderBase, TextAreaOptionBuilder} from './rule-builder';
import dedent from 'ts-dedent';
import {yamlRegex} from '../utils/regex';
import {getYamlSectionValue, loadYAML, removeYamlSection, setYamlSection} from '../utils/yaml';

type YamlSortOrderForOtherKeys = 'None' | 'Ascending Alphabetical' | 'Descending Alphabetical';

class YamlKeySortOptions implements Options {
  priorityKeysAtStartOfYaml?: boolean = true;

  @RuleBuilder.noSettingControl()
    dateModifiedKey?: string;

  @RuleBuilder.noSettingControl()
    currentTimeFormatted?: string;

  @RuleBuilder.noSettingControl()
    yamlTimestampDateModifiedEnabled?: boolean;

  yamlKeyPrioritySortOrder?: string[] = [];
  yamlSortOrderForOtherKeys?: YamlSortOrderForOtherKeys = 'None';
}

@RuleBuilder.register // This decorator allows the rule to automatically be registered as a rule when the plugin loads
export default class YamlKeySort extends RuleBuilder<YamlKeySortOptions> {
  constructor() {
    super({
      nameKey: 'rules.yaml-key-sort.name',
      descriptionKey: 'rules.yaml-key-sort.description',
      type: RuleType.YAML,
      hasSpecialExecutionOrder: true,
    });
  }
  get OptionsClass(): new () => YamlKeySortOptions {
    return YamlKeySortOptions; // always returns the options for the current rule
  }
  apply(text: string, options: YamlKeySortOptions): string {
    // Rule logic goes here...
  }
  getYAMLKeysSorted(yaml: string, keys: string[]): {remainingYaml: string, sortedYamlKeyValues: string} {
    // helper function's logic here...
  }
  get exampleBuilders(): ExampleBuilder<YamlKeySortOptions>[] {
    return [
      new ExampleBuilder({
        description: 'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language`',
        before: dedent`
          ---
          language: Typescript
          type: programming
          tags: computer
          keywords: []
          status: WIP
          date: 02/15/2022
          ---
        `,
        after: dedent`
          ---
          date: 02/15/2022
          type: programming
          language: Typescript
          tags: computer
          keywords: []
          status: WIP
          ---
        `,
        options: { // only needed when using non-default values for rule options
          yamlKeyPrioritySortOrder: [
            'date',
            'type',
            'language',
          ],
          yamlSortOrderForOtherKeys: 'None',
          priorityKeysAtStartOfYaml: true,
        },
      }),
    ];
  }
  get optionBuilders(): OptionBuilderBase<YamlKeySortOptions>[] {
    return [
      new TextAreaOptionBuilder({
        OptionsClass: YamlKeySortOptions,
        nameKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.name',
        descriptionKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.description',
        optionsKey: 'yamlKeyPrioritySortOrder',
      }),
      new BooleanOptionBuilder({
        OptionsClass: YamlKeySortOptions,
        nameKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.name',
        descriptionKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.description',
        optionsKey: 'priorityKeysAtStartOfYaml',
      }),
      new DropdownOptionBuilder<YamlKeySortOptions, YamlSortOrderForOtherKeys>({
        OptionsClass: YamlKeySortOptions,
        nameKey: 'rules.yaml-key-sort.yaml-sort-order-for-other-keys.name',
        descriptionKey: 'rules.yaml-key-sort.yaml-sort-order-for-other-keys.description',
        optionsKey: 'yamlSortOrderForOtherKeys',
        records: [
          {
            value: 'None',
            description: 'No sorting other than what is in the YAML Key Priority Sort Order text area',
          },
          {
            value: 'Ascending Alphabetical',
            description: 'Sorts the keys based on key value from a to z',
          },
          {
            value: 'Descending Alphabetical',
            description: 'Sorts the keys based on key value from z to a',
          },
        ],
      }),
    ];
  }
}
```

下面我们就来看规则的各个组成部分。

### 规则选项

规则选项是传入规则、供规则逻辑使用的选项。它们通常由用户定义，或与当前文件、环境相关，用于帮助决定如何执行规则逻辑。

下面是规则选项在实际使用中的一个示例：

``` TypeScript
class YamlKeySortOptions implements Options {
  priorityKeysAtStartOfYaml?: boolean = true;

  @RuleBuilder.noSettingControl()
    dateModifiedKey?: string;

  @RuleBuilder.noSettingControl()
    currentTimeFormatted?: string;

  @RuleBuilder.noSettingControl()
    yamlTimestampDateModifiedEnabled?: boolean;

  yamlKeyPrioritySortOrder?: string[] = [];
  yamlSortOrderForOtherKeys?: YamlSortOrderForOtherKeys = 'None';
}
```

你可能注意到一些看起来奇怪的地方。首先你可能会发现，有些选项上方带有 `@RuleBuilder.noSettingControl()`，有些则没有。你可能会奇怪为什么会这样。原因是：这些选项中，有的从该特定规则的设置里取值，有的则不是。在不具有规则生成设置的选项上方使用该装饰器，能够让我们测试规则的所有选项是否都有对应的设置、从而被正确赋值。

!!! warning "为 noSettingControl 设置赋值"
    如果你在新增的规则中加入了一个没有设置控件的设置，请务必确保该设置的值在 [rules-runner.ts](https://github.com/platers/obsidian-linter/blob/master/src/rules-runner.ts) 中被赋值。

你可能注意到的第二件事是：选项类中所有规则选项都是可选的（`?:`）。这样做是为了方便单元测试和示例编写，因为你只需设置与当前测试或示例相关的值即可。

你可能注意到的第三件事是：所有常规规则选项都有默认值（` = value;`）。这能确保即便没有提供值，也会使用默认值。这让规则选项在读入设置文件或运行单元测试时更加可靠、更不易出 bug。

#### 空的规则选项

有些规则完全没有任何选项。这些规则仍需要一个选项类才能工作，但类体可以为空，像这样：

``` TypeScript
class YamlKeySortOptions implements Options {}
```

### 规则设置

规则设置与规则选项直接相关。每个规则设置都必须对应规则选项中的一个值。由于每个规则设置都用来为其对应的规则选项值"构建"UI 组件，因此规则设置是通过选项构造器函数来创建的。规则设置的另一项作用是：帮助将 UI 中的设置与配置文件中的设置关联起来。

在上面的示例中，我们看到如下设置：

``` TypeScript
get optionBuilders(): OptionBuilderBase<YamlKeySortOptions>[] {
  return [
    new TextAreaOptionBuilder({
      OptionsClass: YamlKeySortOptions,
      nameKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.name',
      descriptionKey: 'rules.yaml-key-sort.yaml-key-priority-sort-order.description',
      optionsKey: 'yamlKeyPrioritySortOrder',
    }),
    new BooleanOptionBuilder({
      OptionsClass: YamlKeySortOptions,
      nameKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.name',
      descriptionKey: 'rules.yaml-key-sort.priority-keys-at-start-of-yaml.description',
      optionsKey: 'priorityKeysAtStartOfYaml',
    }),
    new DropdownOptionBuilder<YamlKeySortOptions, YamlSortOrderForOtherKeys>({
      OptionsClass: YamlKeySortOptions,
      nameKey: 'rules.yaml-key-sort.yaml-sort-order-for-other-keys.name',
      descriptionKey: 'rules.yaml-key-sort.yaml-sort-order-for-other-keys.description',
      optionsKey: 'yamlSortOrderForOtherKeys',
      records: [
        {
          value: 'None',
          description: 'No sorting other than what is in the YAML Key Priority Sort Order text area',
        },
        {
          value: 'Ascending Alphabetical',
          description: 'Sorts the keys based on key value from a to z',
        },
        {
          value: 'Descending Alphabetical',
          description: 'Sorts the keys based on key value from z to a',
        },
      ],
    }),
  ];
}
```

在上面的示例中可以看到，不同种类的设置之间有一些共同的属性。

| 名称 | 说明 |
| ---- | ----------- |
| `optionsKey` | 当设置页面上该设置的值发生变化时，此设置要更新的属性名字符串 |
| `OptionsClass` | 让选项构造器校验 `optionsKey` 所指定的规则选项的类型，是否符合该选项构造器预期处理的值的类型 |
| `nameKey` | [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts) 中规则设置名称文本所对应的对象属性表示 |
| `descriptionKey` | [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts) 中规则设置描述文本所对应的对象属性表示 |

你可能注意到，设置的键遵循 `rules.rule-alias.setting-name.name` 或 `rules.rule-alias.setting-name.description` 的格式。遵循这种格式有助于让人更容易理解每个值的含义。

`DropdownOptionBuilder` 与其他选项构造器略有不同：它允许用户从一个名为 `records` 的列表中选择一个选项。每条 record 都有一个 value 和一个 description。value 会被存入配置文件，并作为显示文本对应键的标识符的一部分。例如，UI 中文本值为 `None` 的显示文本，是通过从对应语言文件中取回 `enums.None` 对应的文本来确定的（`en.ts` 是所有键的事实来源）。record 的 description 目前仅用于文档和规则检索用途，且仅支持英文。

`DropdownOptionBuilder` 还有另一个特别之处：它不仅要求传入选项类，还要求指定 record 值的类型（一个 enum 或联合类型）。在上面的示例中，`DropdownOptionBuilder<YamlKeySortOptions, YamlSortOrderForOtherKeys>` 要求 record 的 value 必须是 `YamlSortOrderForOtherKeys` 的成员之一，这样它就能在单元测试和规则设置本身中针对不当取值给出警告。这有助于减少随时间推移代码改动所导致的程序性错误。

#### 空的规则设置

有些规则的选项在 UI 中没有任何设置。这种情况下，规则设置可以留空，像这样：

``` TypeScript
get optionBuilders(): OptionBuilderBase<YamlKeySortOptions>[] {
  return [];
}
```

### 规则构造函数

规则构造函数有助于简化若干规则属性的设置，而不必在多处来回传递。

在上面的示例中，构造函数如下所示：

``` TypeScript
constructor() {
  super({
    nameKey: 'rules.yaml-key-sort.name',
    descriptionKey: 'rules.yaml-key-sort.description',
    type: RuleType.YAML,
    hasSpecialExecutionOrder: true,
  });
}
```

以下是可以在规则构造函数中指定的所有属性：

| 名称 | 说明 | 是否必需（Y/N） | 示例值 |
| ---- | ----------- | ----------------- | ------------- |
| `nameKey` | [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts) 中规则名称文本对应的对象属性表示。值应为 `rules.rule-alias.name` 格式。 | Y | `rules.yaml-key-sort.name` |
| `descriptionKey` | [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts) 中规则描述文本对应的对象属性表示。值应为 `rules.rule-alias.description` 格式。 | Y | `rules.yaml-key-sort.description` |
| `type` | 规则类型，它决定该规则出现在设置的哪个分区，以及示例测试是否会带上 YAML frontmatter 一并测试。 | Y | `RuleType.YAML` |
| `hasSpecialExecutionOrder` | 指定该规则是否在 [rules-runner.ts](https://github.com/platers/obsidian-linter/blob/master/src/rules-runner.ts) 中被手动安排在 Linter 规则之前或之后执行。默认值为 `false`。 | N | `true` |
| `ruleIgnoreTypes` | 需要在该规则的全部逻辑中被忽略的忽略类型列表，可在 [ignore-types.ts](https://github.com/platers/obsidian-linter/blob/master/src/utils/ignore-types.ts) 中找到。这在需要忽略代码块或 YAML frontmatter 等内容时很有用。默认为空数组（`[]`）。不要把 `IgnoreTypes.customIgnore` 放进此列表，因为它会自动加到除 `RuleType.PASTE` 之外的所有规则上。 | N | `[IgnoreTypes.code, IgnoreTypes.math, IgnoreTypes.yaml, IgnoreTypes.link, IgnoreTypes.wikiLink, IgnoreTypes.tag],` |

### 规则逻辑

所有规则的逻辑，都在应用 `ruleIgnoreTypes` 指定的类型以及额外追加的 `IgnoreTypes.customIgnore` 之后才执行。一旦文件中这些类型的元素被忽略掉，就可以安全地应用规则逻辑。

规则的逻辑写在 `apply` 函数中。你可以按需在规则类中添加任意多个辅助函数。

在上面的示例中，`apply` 和辅助函数如下所示：

``` TypeScript
apply(text: string, options: YamlKeySortOptions): string {
  // Rule logic goes here...
}
getYAMLKeysSorted(yaml: string, keys: string[]): {remainingYaml: string, sortedYamlKeyValues: string} {
  // helper function's logic here...
}
```

有时候你会发现某个函数或变量在多条规则中都需要。这些函数和变量通常放在 `src/utils/` 下。请尽量复用这些现有文件中的逻辑，以减少我们需要维护的代码量。

#### 在规则逻辑的某一部分忽略类型

有时候，我们只需要在规则逻辑的某一部分忽略文件中某种特定类型的元素。这可以通过来自 [ignore-types.ts](https://github.com/platers/obsidian-linter/blob/master/src/utils/ignore-types.ts) 的 `ignoreListOfTypes` 来实现，它接收一组 `IgnoreTypes` 列表以及一个函数（该函数接收处理后的字符串并返回另一个字符串）。

我们在 [Remove Space Around Characters](https://github.com/platers/obsidian-linter/blob/master/src/rules/remove-space-around-characters.ts) 中就有这样的例子：我们需要确保不会去掉列表标记与全角字符或其他相关字符之间的空白，因此必须在第一次正则替换时忽略列表，然后再仅对列表项文本执行同样的正则替换：

``` TypeScript
const replaceWhitespaceAroundFullwidthCharacters = function(text: string): string {
  return text.replace(fullwidthCharacterWithTextAtStart, '$2').replace(fullwidthCharacterWithTextAtEnd, '$1');
};

let newText = ignoreListOfTypes([IgnoreTypes.list], text, replaceWhitespaceAroundFullwidthCharacters);

newText = updateListItemText(newText, replaceWhitespaceAroundFullwidthCharacters);
```

### 规则示例

规则示例对规则而言非常重要：它们既是用户在规则文档中看到的示例，又同时兼作单元测试——只要规则不是 `YAML` 或 `PASTE` 规则，这些示例就会在简单和进阶场景下被运行。

**每条规则至少要有 1 个示例。规则越复杂，应当展示的示例就越多。**

在上面的示例中，规则示例如下所示：

``` TypeScript
get exampleBuilders(): ExampleBuilder<YamlKeySortOptions>[] {
  return [
    new ExampleBuilder({
      description: 'Sorts YAML keys in order specified by `YAML Key Priority Sort Order` has a sort order of `date type language`',
      before: dedent`
        ---
        language: Typescript
        type: programming
        tags: computer
        keywords: []
        status: WIP
        date: 02/15/2022
        ---
      `,
      after: dedent`
        ---
        date: 02/15/2022
        type: programming
        language: Typescript
        tags: computer
        keywords: []
        status: WIP
        ---
      `,
      options: { // only needed when using non-default values for rule options
        yamlKeyPrioritySortOrder: [
          'date',
          'type',
          'language',
        ],
        yamlSortOrderForOtherKeys: 'None',
        priorityKeysAtStartOfYaml: true,
      },
    }),
  ];
}
```

以下是每个示例的属性：

| 名称 | 说明 | 是否必需（Y/N） |
| ---- | ----------- | ----------------- |
| `description` | 示例的名称和描述，用于说明（如有）哪些选项被设为非默认值，并给出该示例展示内容的概览 | Y |
| `before` | 规则做出修改之前的文件；当规则的类型为 `PASTE` 时，是规则做出修改之前的剪贴板内容 | Y |
| `after` | 规则做出修改之后的文件；当规则的类型为 `PASTE` 时，是规则做出修改之后的剪贴板内容 | Y |
| `options` | 该示例要使用的选项。仅用于明确当前设置了哪些选项，或为了设置非默认值时使用。 | N |


### 规则文本

规则及其设置的显示文本也需要添加。这些内容在前文讨论[规则设置](#rule-settings)和[规则构造函数](#the-rule-constructor)的小节中已经提过。

至少，一条新规则需要在 [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts) 中为新规则的名称和描述各添加一个条目。

假设 `YAML Key Sort` 还不存在，我需要打开 [en.ts](https://github.com/platers/obsidian-linter/blob/master/src/lang/locale/en.ts)。
打开后我需要找到文件中的 `rules` 属性，并按字母顺序或大致字母顺序确定 `YAML Key Sort` 的别名应该放在何处。也就是说，由于 `YAML Key Sort` 的别名是 `yaml-key-sort`，我要么把这些新属性加到以字母 y 开头的规则的最前面，要么加到最后面。一旦确定了 `YAML Key Sort` 要添加到哪里，我们就为规则名称和描述添加如下内容：

```TypeScript
// yaml-key-sort.ts
'yaml-key-sort': {
  'name': 'YAML Key Sort',
  'description': 'Sorts the YAML keys based on the order and priority specified. Note: may remove blank lines as well.',
},
```

然后我需要为每一条规则设置都加上对应的条目，最终规则的文本如下所示：

``` TypeScript
// yaml-key-sort.ts
'yaml-key-sort': {
  'name': 'YAML Key Sort',
  'description': 'Sorts the YAML keys based on the order and priority specified. Note: may remove blank lines as well.',
  'yaml-key-priority-sort-order': {
    'name': 'YAML Key Priority Sort Order',
    'description': 'The order in which to sort keys with one on each line where it sorts in the order found in the list',
  },
  'priority-keys-at-start-of-yaml': {
    'name': 'Priority Keys at Start of YAML',
    'description': 'YAML Key Priority Sort Order is placed at the start of the YAML frontmatter',
  },
  'yaml-sort-order-for-other-keys': {
    'name': 'YAML Sort Order for Other Keys',
    'description': 'The way in which to sort the keys that are not found in the YAML Key Priority Sort Order text area',
  },
},
```

不过我们还没完。之前还添加了下拉项 records，因此我们还需要跳转到文件中的 `enums` 属性，为每个新 record 值的文本各加一条：

``` TypeScript
'enums': {
  ...
  'None': 'None',
  'Ascending Alphabetical': 'Ascending Alphabetical',
  'Descending Alphabetical': 'Descending Alphabetical',
  ...
},
  
```

完成后，可对 Linter 支持的任何其他语言重复同样的改动。无需为其他受支持语言添加这些值，因为如果某种语言中找不到对应键，就会回退到英文文本。对于首次翻译到某种语言，Google 翻译的译文通常是可以接受的。如果有人发现所用语言中的值不正确，可以建议修改措辞。

## 4. 如适用，添加边界情况测试

规则创建好之后，可以考虑按[添加测试](testing.md#adding-tests)中的说明为边界情况添加测试。

## 5. 提交 pull request

测试就绪后，新规则就应当可以接受评审了。那就[提交一个 pull request](open-a-pr.md) 吧。
