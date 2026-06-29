# 配置 Linter

首先你需要 fork 本仓库。完成后，克隆你的 fork 副本。
命令大致如下：

``` sh
git clone https://github.com/{USERNAME_HERE}/obsidian-linter/
```

## Node 与 NPM

接下来需要安装合适版本的 Node 和 NPM。  
_本插件要求 Node 版本为 `15.x` 或更高。_

### Windows

安装你想要的 [Node](https://nodejs.org/en/download/) 版本。务必将其添加到环境变量的 PATH 中。

### Linux、Mac，以及通过 WSL/WSL2 使用 Windows

推荐使用 [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)，它是一个 node 版本管理器，在切换和安装 node 版本时非常方便，尤其是大多数 Linux 包管理器的标准包中并不包含所需的 node 版本。

## 安装依赖

Node 和 NPM 安装完毕后，我们可以在克隆仓库的根目录中运行 `npm ci`。
这会安装开发本插件所需的依赖。该命令可能需要几分钟才能完成。

完成后，你应该就已经做好为本插件贡献代码的准备了。
