# 提交 pull request

在提交 pull request 之前，请先对本仓库执行 lint。

## 对仓库执行 lint

文件在提交 pull request 前应先进行 lint。linter 会确保代码遵循预期的代码风格并按需格式化文件。linter 可以通过 `npm run lint` 或 `npm run compile` 运行。

!!! note "末尾空格与空行的保留"
    文件 linter 会移除末尾的空格和空行。如果它们是必需的，请在一行末尾使用 `${''}`，或单独在一行使用 `${''}` 来保留末尾空格或空行。

    ```JavaScript
    const str = dedent`
      line with essential trailing spaces   ${''}
      ${''}
      previous line is completely blank
    `;
    ```
## 运行单元测试

接下来需要通过 `npm run test` 确保所有测试都通过。如果有任何测试失败，请在提交 pull request 前先修复它们。

## 创建 pull request

所有修改完成、[必要的测试已添加](testing.md#should-you-add-a-test)，且文件 lint 已应用格式化、未发现任何问题后，就可以创建 pull request 了。

创建 pull request 时，请确保：如果它修复了 bug、添加了被请求的功能，或实现了建议的重构，请务必包含 `Fixes #{ISSUE_NUMBER}`。这有助于将此次改动与已创建的 issue 关联起来，也能确保这些 issue 在其修复被合并时关闭。

请在 PR 描述中简要说明该 pull request 的作用，以便评审的开发者了解相关背景。
