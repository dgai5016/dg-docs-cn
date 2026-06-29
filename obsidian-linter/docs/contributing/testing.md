# 测试

在尝试运行测试之前，请确保已按照[配置指南](getting-setup.md)所述将 Linter 配置为本地可用。

对 Linter 的测试分为两类：可以针对仓库内逻辑运行的单元测试，以及集成测试（一般用于与 Obsidian 的交互、验证 UI 元素的外观，以及确保插件仍可正常加载）。

## 单元测试

单元测试是确保 Linter 内部规则及其他逻辑按预期工作的好办法，尤其是在代码重构、逻辑改动和 bug 修复之后。它有助于确保改动后逻辑仍然像改动之前一样工作。

!!! warning "单元测试的可靠性"
    单元测试的可靠程度取决于测试本身的质量。如果测试写得很差、几乎不覆盖相关规则或逻辑的功能，单元测试可能会给出"代码工作正常"的错误印象。

### Linter 中的单元测试长什么样？

Linter 中的单元测试大致可分为两类：规则示例和测试套件。

#### 规则示例

这些示例就出现在规则自身的定义中。更多内容请参见[添加规则](adding-a-rule.md#rule-examples)下的"规则示例"一节。

#### 测试套件

这些是位于 `__tests__` 目录下的测试。它们自身又可分为两类：通用规则测试套件和专用测试套件。

##### 通用规则测试套件

顾名思义，这类测试套件遵循通用格式，且每个套件对应一条具体规则。例如，[capitalize-headings.test.ts](https://github.com/platers/obsidian-linter/blob/master/__tests__/capitalize-headings.test.ts) 就是一个通用规则测试套件，因为它只包含针对 [Capitalize Headings](../settings/heading-rules.md#capitalize-headings) 的测试。

这些规则测试套件遵循同一种格式：

``` TypeScript
import CapitalizeHeadings from '../src/rules/capitalize-headings';
import dedent from 'ts-dedent';
import {ruleTest} from './common';

ruleTest({
  RuleBuilderClass: CapitalizeHeadings,
  testCases: [
    {
      testName: 'Ignores not words',
      before: dedent`
        # h1
        ## a c++ lan
        ## this is a sentence.
        ## I can't do this
        ## comma, comma, comma
        ## 1.1 the Header
        ## état
        ## this état
      `,
      after: dedent`
        # H1
        ## A c++ Lan
        ## This is a Sentence.
        ## I Can't Do This
        ## Comma, Comma, Comma
        ## 1.1 The Header
        ## État
        ## This État
      `,
      options: {
        style: 'Title Case',
      },
    },
    ...
    { // accounts for https://github.com/platers/obsidian-linter/issues/601
      testName: `Make sure that if the 1st word has a number in it, it will still be considered to be a word and have its first letter capitalized`,
      before: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### lab07 bread maker
      `,
      after: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### Lab07 bread maker
      `,
      options: {
        style: 'First letter',
        ignoreCasedWords: true,
      },
    },
  ],
});
```

文件以 import 开头，包括 [规则选项](adding-a-rule.md#rule-options)、所需的任何类型导入，以及 `ruleTest` 方法，该方法本质上是把要运行的测试按一个数组组织起来：

``` TypeScript
import CapitalizeHeadings from '../src/rules/capitalize-headings';
import dedent from 'ts-dedent';
import {ruleTest} from './common';
```

接下来是传入 `ruleTest` 的测试列表：

``` TypeScript
ruleTest({
  RuleBuilderClass: CapitalizeHeadings,
  testCases: [
    {
      testName: 'Ignores not words',
      before: dedent`
        # h1
        ## a c++ lan
        ## this is a sentence.
        ## I can't do this
        ## comma, comma, comma
        ## 1.1 the Header
        ## état
        ## this état
      `,
      after: dedent`
        # H1
        ## A c++ Lan
        ## This is a Sentence.
        ## I Can't Do This
        ## Comma, Comma, Comma
        ## 1.1 The Header
        ## État
        ## This État
      `,
      options: {
        style: 'Title Case',
      },
    },
    ...
    { // accounts for https://github.com/platers/obsidian-linter/issues/601
      testName: `Make sure that if the 1st word has a number in it, it will still be considered to be a word and have its first letter capitalized`,
      before: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### lab07 bread maker
      `,
      after: dedent`
        # EC2 instance
        ## EC2 lab05 load balancer
        ### Lab07 bread maker
      `,
      options: {
        style: 'First letter',
        ignoreCasedWords: true,
      },
    },
  ],
});
```

`rulesTest` 期望 `RuleBuilderClass` 为该规则的选项类引用，然后是 `testCases`——该规则的测试用例列表。这些测试用例与[规则示例](adding-a-rule.md#rule-examples)几乎相同，只不过它们使用 `testName` 而不是 `description`。

##### 专用测试套件

这类测试套件通常针对某个不是规则的具体函数量身定制，主要用来确保某些函数仍然按预期工作。一个专用测试套件的示例是 [get-all-custom-ignore-sections-in-text.test.ts](https://github.com/platers/obsidian-linter/blob/master/__tests__/get-all-custom-ignore-sections-in-text.test.ts)。这类测试的逻辑尽量遵循与通用规则测试套件类似的组织方式，但会针对所测试的具体函数的需要做调整：

``` TypeScript
import {getAllCustomIgnoreSectionsInText} from '../src/utils/mdast';
import dedent from 'ts-dedent';

type customIgnoresInTextTestCase = {
  name: string,
  text: string,
  expectedCustomIgnoresInText: number,
  expectedPositions: {startIndex:number, endIndex: number}[]
};

const getCustomIgnoreSectionsInTextTestCases: customIgnoresInTextTestCase[] = [
  {
    name: 'when no custom ignore start indicator is present, no positions are returned',
    text: dedent`
      Here is some text
      Here is some more text
    `,
    expectedCustomIgnoresInText: 0,
    expectedPositions: [],
  },
  {
    name: 'when no custom ignore start indicator is present, no positions are returned even if custom ignore end indicator is present',
    text: dedent`
      Here is some text
      <!-- linter-enable -->
      Here is some more text
    `,
    expectedCustomIgnoresInText: 0,
    expectedPositions: [],
  },
  {
    name: 'a simple example of a start and end custom ignore indicator results in the proper start and end positions for the ignore section',
    text: dedent`
      Here is some text
      <!-- linter-disable -->
      This content will be ignored
      So any format put here gets to stay as is
      <!-- linter-enable -->
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 135}],
  },
  {
    name: 'when a custom ignore start indicator is not followed by a custom ignore end indicator in the text, the end is considered to be the end of the text',
    text: dedent`
      Here is some text
      <!-- linter-disable -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 18, endIndex: 129}],
  },
  {
    name: 'when a custom ignore start indicator shows up midline, it ignores the part in question',
    text: dedent`
      Here is some text<!-- linter-disable -->here is some ignored text<!-- linter-enable -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 17, endIndex: 87}],
  },
  {
    name: 'when a custom ignore start indicator does not follow the exact syntax, it is counted as existing when it is a single-line comment',
    text: dedent`
      Here is some text<!-- linter-disable-->here is some ignored text<!-------------         linter-enable ------>
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
    `,
    expectedCustomIgnoresInText: 1,
    expectedPositions: [{startIndex: 17, endIndex: 109}],
  },
  {
    name: 'multiple matches can be returned',
    text: dedent`
      Here is some text<!-- linter-disable -->here is some ignored text<!-- linter-enable -->
      This content will be ignored
      So any format put here gets to stay as is
      More text here...
      ${''}
      <!-- linter-disable -->
      We want to ignore the following as we want to preserve its format
        -> level 1
          -> level 1.3
        -> level 2
      Finish
    `,
    expectedCustomIgnoresInText: 2,
    expectedPositions: [{startIndex: 17, endIndex: 87}, {startIndex: 178, endIndex: 316}],
  },
];

describe('Get All Custom Ignore Sections in Text', () => {
  for (const testCase of getCustomIgnoreSectionsInTextTestCases) {
    it(testCase.name, () => {
      const customIgnorePositions = getAllCustomIgnoreSectionsInText(testCase.text);

      expect(customIgnorePositions.length).toEqual(testCase.expectedCustomIgnoresInText);
      expect(customIgnorePositions).toEqual(testCase.expectedPositions);
    });
  }
});
```

这些测试通常以导入待测函数开头，其后是测试用例的格式定义：

``` TypeScript
import {getAllCustomIgnoreSectionsInText} from '../src/utils/mdast';
import dedent from 'ts-dedent';

type customIgnoresInTextTestCase = {
  name: string,
  text: string,
  expectedCustomIgnoresInText: number,
  expectedPositions: {startIndex:number, endIndex: number}[]
};
```

接着是测试用例本身，以及测试用例的运行：

``` TypeScript
describe('Get All Custom Ignore Sections in Text', () => {
  for (const testCase of getCustomIgnoreSectionsInTextTestCases) {
    it(testCase.name, () => {
      const customIgnorePositions = getAllCustomIgnoreSectionsInText(testCase.text);

      expect(customIgnorePositions.length).toEqual(testCase.expectedCustomIgnoresInText);
      expect(customIgnorePositions).toEqual(testCase.expectedPositions);
    });
  }
});
```

如果条件允许，专用测试套件应尽量采用这种格式。也存在一些情况，测试用例之间差异过大、为测试用例定义一个类型并不现实，这时就会采用单个独立测试，例如 [rules-runner.test.ts](https://github.com/platers/obsidian-linter/blob/master/__tests__/rules-runner.test.ts) 那样。

### 是否应当添加测试？

你可能会想：到底要不要为 Linter 添加测试。如果你做了下列任何一件事，就应当添加单元测试：

| 场景 | 应包含的测试 |
| --------- | ---------------- |
| 添加一条新规则 | 规则上的若干示例，覆盖一般使用场景<br/><br/>在新规则对应的测试套件中加入单元测试，覆盖那些会让示例过长、或属于边界情况的场景 |
| 为规则添加一个新选项 | 在规则上添加一或多个示例，覆盖新选项的一般场景<br/><br/>在该规则对应的测试套件中加入单元测试，覆盖那些会让示例过长、或属于边界情况的场景 |
| 重构代码 | 这可能需要一个专门为重构后代码设计的新测试套件（例如 [get-all-tables-in-text.test.ts](https://github.com/platers/obsidian-linter/blob/master/__tests__/get-all-tables-in-text.test.ts)），或者，如果重构改变了可能的边界情况，就需要在使用了被重构逻辑的现有测试套件中加入新的单元测试 |
| 修复 bug | 当一个 bug 仅影响单条规则，并且能在该规则的测试套件中通过构造用例来复现时，请将该用例添加进去，并加上一条引用上报该问题的 issue 的注释* |

*下面是通用规则测试套件中 bug 修复单元测试的一个示例：

``` TypeScript
{ // accounts for https://github.com/platers/obsidian-linter/issues/412
  testName: 'H1s become H2s and all other headers are shifted accordingly when an H1 starts a file',
  before: dedent`
    # H1
    ### H3
    #### H4
    # H1
    #### H4
    ###### H6
  `,
  after: dedent`
    ## H1
    ### H3
    #### H4
    ## H1
    ### H4
    #### H6
  `,
  options: {
    startAtH2: true,
  },
},
```

### 添加测试

测试加在哪里取决于你要添加哪种测试。如果是示例，应放在它所属的那条具体规则里。如果是为了修 bug、测试边界情况、测试非规则函数，或是规模较大的测试，那么加到现有或新建的测试套件中最为合适。

添加示例用例时，请遵循[规则示例](adding-a-rule.md#rule-examples)中描述的格式。添加测试套件用例时，请遵循上文[测试套件](#test-suites)中描述的格式，并确保任何新建的测试套件在文件名中都用连字符分隔单词。

测试添加好后，你需要运行测试，参见[运行测试](#running-tests)。

### 运行测试


测试由 jest 运行，运行方式取决于你是要运行全部测试，还是运行一或多个测试套件。

#### 全部测试

可以通过 `npm run test` 或 `npm run compile` 运行。输出会告诉你有多少测试通过；如果有失败的，会通过期望值与实际值的可视化对比来说明失败原因。

!!! note "进阶测试"
    当进阶测试失败时，由于它使用正则匹配，其输出会更难读。建议借助普通测试输出中期望值与实际值的对比来判断测试出了什么问题。

#### 指定测试套件

如果你知道想运行的测试套件，可以使用 `npm run test-suite TEST_SUITE_HERE` 仅运行所需的测试套件。测试套件名是 `__tests` 下文件名去掉 `.test.ts` 后缀。你只需提供文件名的一部分即可，因为它会匹配以 `TEST_SUITE_HERE` 的值开头的测试套件名。

例如，`npm run test-suite format-yaml-arrays` 会运行格式化 YAML 数组的测试套件，因为这是唯一以 `format-yaml-arrays` 开头的测试套件。而 `npm run test-suite header` 会运行所有以 `header` 单词开头的测试套件。

!!! note
    针对某条或某些规则运行测试套件时，并不会运行这些规则的示例，因为所有示例都打包在示例测试套件中，可通过 `npm run test-suite examples` 来运行。

## 集成测试

集成测试留给那些不容易用单元测试覆盖的内容。进行这类测试时，你需要将本地的 Linter 副本加载到 Obsidian 中，然后开启所需规则来运行 Linter。

### 什么时候应做集成测试？

当一条规则被改为在 [rules-runner.ts](https://github.com/platers/obsidian-linter/blob/master/src/rules-runner.ts) 中作为"在常规规则之前运行"或"在常规规则之后运行"的一部分时。

当发生 UI 改动时。例如措辞变更，或显示元素（如 CSS、HTML 改动）发生变化。

当问题由多条规则对文件内容做出修改共同引发时。出现这种情况时，我目前所发现的、可靠的验证问题是否已解决的方式只有通过集成测试。
