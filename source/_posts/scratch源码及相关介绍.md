---
title: Scratch源码及相关介绍
tags: Scratch
categories: Scratch
toc: true
abbrlink: 60112
date: 2020-12-07 15:33:23
---

- 国内图形化编程的应用，大部分都是基于scratch源码来实现的二次开发，主要介绍scratch的源码和模块

## 关于Scratch
- Scratch是麻省理工学院的“终身幼儿园团队”（Lifelong Kindergarten Group）开发的图形化编程工具，主要面对青少年开放。
- 目前已有原始版本（1.4版本）、2.0版本（增加克隆积木，Lego和Makey makey拓展积木）、3.0版本（增加音乐、画笔、视频侦测、文字朗读、翻译等选择性下载扩展积木，并增加micro：bit和Lego mindstorms EV3拓展积木）所有人可以在任意版本中创作自己的程序

### Scratch相关源码
- **全项目分组:** https://github.com/LLK
- **Scratch-www** : https://github.com/LLK/scratch-www   Scratch-www是Scratch社区的独立Web客户端，使用React和Redux构建。
- **ScratchJr:** ScratchJr是一种入门编程语言，可让幼儿（5-7岁）创建自己的互动故事和游戏。
```
https://github.com/LLK/scratchjr
```
- **scratch-gui**:  用于创建和运行Scratch 3.0项目的图形用户界面。
- **Scratch Blocks:** Scratch Blocks是下一代图形编程模块的新开发项目，基于Google与麻省理工学院Scratch团队的合作 - 以Google的Blockly技术为基础，并以Scratch团队为年轻人开发创意学习工具的专业知识为基础。 Scratch Blocks将提供一个框架，用于构建垂直（基于文本）和水平（基于图标）格式的编程块。 
- **scratch-render**:  用于Scratch 3.0的基于WebGL的渲染引擎。


## 环境搭建
#### Scratch-gui项目搭建：
- 目前基于Scratch 3 ，通过H5的方式来来实现的，所以编程拖拽部分的模块是通过H5来实现的，目前scratch包括了PC,和移动端相关的实现，移动端上通过ScratchJr的作为平台，国内头部的这块也用jr来实现了自己相关的APP
- 先搭建PC端的scratch-gui项目：
```
https://github.com/LLK/scratch-gui.git
```

-  到项目目录下进行 npm install （前提相关的node环境已经安装）
-  **（若文中图片无法显示，请科学上网查看：[推荐工具](https://order.yizhihongxing.network/aff.php?aff=12299)）**
-  ![](https://raw.githubusercontent.com/zhulg/allpic/master/scratch2.png)

- 运行项目：npm start  ![](https://raw.githubusercontent.com/zhulg/allpic/master/scratch1.png)

- 可以看到运行起来项目：
- ![](https://raw.githubusercontent.com/zhulg/allpic/master/scratch3.png)

#### scratchjr项目编译：
- 下载scratchjr 源代码
- 项目架构介绍![](https://raw.githubusercontent.com/LLK/scratchjr/develop/doc/scratchjr_architecture.png)
- 需要相关的环境依赖：**需要安装出来SVG相关依赖库和图片合成编辑的命令行工具**

```
Ensure you have node and npm installed.
Run sudo easy_install pysvg to install python svg libraries
Run brew install librsvg to install commandline rsvg-convert
Run brew install imagemagick to install commandline magick
In the top level of the scratchjr repo directory, install npm dependencies for bundling the JavaScript: npm install
```

- 环境依赖安装成功后，就可以进行源码进行相关编译项目，这过程可能会有相关环境安装失败情况出现（自行查找解决）
- ![](https://raw.githubusercontent.com/zhulg/allpic/master/scratch4.png)
- 根据边的架构可以看到相关代码模块的构成部分，**可能运行不起来，需要把google相关的google-services进行移除下。**

#### ios方式打开
- 打开的方式和依赖于Android相同，需要相关的依赖环境与Android依赖相同，之后通过xcode打开ios/ScratchJr.xcworkspace即可




