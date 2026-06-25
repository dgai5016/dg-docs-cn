# 常见问题

## Windows 上 Unicode 字符（emoji 等）显示不正常？

已知 Windows 上的 `cmd.exe` 和 `powershell` 处理 Unicode 字符时存在问题。

你可以参考 https://github.com/SilentVoid13/Templater/issues/15#issuecomment-824067020 寻找解决方案。

另一个（可能是最佳的）方案是使用 [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701)，并在 Templater 设置中将其设为默认 shell。

这里还有一些可能对你有用的解决方案：[https://stackoverflow.com/questions/49476326/displaying-unicode-in-powershell](https://stackoverflow.com/questions/49476326/displaying-unicode-in-powershell)
