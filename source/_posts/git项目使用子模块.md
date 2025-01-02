---
title: git项目使用子模块
tags: git
categories: 技术成长
toc: true
abbrlink: 21930
date: 2020-08-22 20:18:55
---


- 当你在一个Git项目上工作时，你需要在其中使用另外一个Git项目做为子项目。一般做法你可以使用release的版本作为子项目不更新，也可以使用库。当一些场景，比如你要使用别人的样式库，可能会随着更新或做自己的调整，这个时候通过导入包不是很适合了，这个使用你需要使用git的子模块了。
- git 添加子项目工submodules 来解决上述场景。

- **添加子模块:** 在你主工程下依赖子git项目

```
 git submodule add https://github.com/xxx.git  xxx目录下
```

 - **查看子模块:**
 ```
  git submodule
 ```


 - **克隆带有含子模块的仓库** 直接 进行克隆是无法拉取之模块的代码，可加上 --recursive 参数

```
git clone --recursive https://github.com/zhulg/zhulg.github.io.git
```

- 提交子模块

```
先到子模块里提交后，回到主模块里进行提交。主页在子模块里的分之提交时，要看当前分之，否则可能链接失败在github上通过主模块看不到子模块。

```