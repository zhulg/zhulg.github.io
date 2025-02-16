---
title: 从0到1，用Rust轻松制作电子书
tags: 技术成长
categories: Rust
abbrlink: 4f00c682
date: 2024-12-26 12:57:17
---


在之前的文章《[经济下行的时候，这些行业可能会更好](http://mp.weixin.qq.com/s?__biz=MzIzNDA3MzA3MQ==&mid=2464356238&idx=1&sn=d22e9c4604c35adb11c714ff8754f45b&chksm=ffec490ec89bc018245032ac8b6cd2b5168f0d28e019123707e542836e6bb744b425891256cd&scene=21#wechat_redirect)》中，我简单提到过用 Rust 做电子书，有收到读者朋友的私信，问怎么做电子书。今天正好有空，就来快速为大家做一个详细的介绍。  


制作电子书其实用途广泛，不仅可以用于技术文档、用户手册、教程等，还可以应用于文学创作。如果你有想法写小说或者做知识付费，电子书也是一个不错的切入点。特别是知识付费领域，通过小范围试水电子书，收集读者反馈，进一步打磨内容，最后也可以出版成书。

好了，有点扯远了，我们重点先说下怎么用Rust做电子书。

## 1. 环境准备

我们准备用Rust来创建电子书，首先，需要安装有Rust的环境，Rust环境安装也比较简单打开官方地址，复制安装命令安装即可。

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

其次，需要对Markdown语法了解，如果不了解的可以看下，强烈推荐所有人来学。很多精美的排版和插图都可以通过md语法来实现，现在更有md的编辑器，稍微了解配合编辑器就能如虎添翼了。

如果有不熟悉markdown可以到这个网站来学习了解下，https://www.markdownguide.org/ ，也可以其他中文网站了解。


## 2. 安装使用

**介绍下我们做电子书的主角mdBook，一款由rust实现的开源软件**，可以进行文档生成，搜索，语法高亮，生产的电子书可以支持在PC、和移动设备打开使用。

通过cargo来安装

```
cargo install mdbook
```

安装成功，可以进行创建

```
mdbook init my-first-book
```

创建过程中可以起名字，创建完成后到该文件目录下

```
cd my-first-book
mdbook serve --open
```

打开地址http://localhost:3000/ ，可以看到创建的电子书模板已经打开了，尽管内容还是空的，但电子书的结构已经有了，左边导航，右边文章内容，以及搜索框。



剩下就是我们写电子书的内容了。

## 3. 写电子书内容

在创建的电子书工程下，会看到src文件目录、book.toml配置文件、book目录，我们先关注电子书的内容src目录

```
├── SUMMARY.md
└── chapter_1.md
```

SUMMARY.md 里打开可以看到就是左侧的导航配置，比如对应的章节配置在这个文件里，chapter_1.md就是对应的章节内容

```
# Summary
- [Chapter 1](./chapter_1.md)
```

可以对chapter_1.md进行内容写作，就可以形成对应的电子书的内容了。

比如这个我复制了个内容，修改了章节命名，然后重新刷新即可看到内容。


## 4. 部署

电子书制作完后，编译后会发现在book的目录下会有编译好的文件，可以通过GitHub Pages上这样完全可以免费，也可以支持远程别人打开和阅读。
