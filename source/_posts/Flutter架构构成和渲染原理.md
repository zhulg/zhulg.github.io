---
title: Flutter架构构成和渲染原理
tags: flutter
categories: App
toc: true
abbrlink: c8a78489
date: 2022-05-13 17:04:58
---

## 一.Flutter架构构成
- Flutter的架构是一个可扩展的分层系统设计，上层组件各自依赖下层组件，层级不可越级访问，各个层级模块可替换

- **Flutter从分层构成看主要分为3个层级：**

```
Dart Framework
C++ Engine
Platform Embedder
```

- 从官网的架构图片层级分析：（科学上网可见图片）


<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/flutter_arch.png">
</div>

### *1. Platform Embedder：(平台嵌入层)*
- **平台层潜入层作用:**是把 Flutter 代码打包嵌入到具体的实现平台, 来呈现所有 Flutter 内容的原生系统应用, 它充当着宿主操作系统（android/ios/macOS/..）和 Flutter 之间的粘合剂的角色。
- 提供flutter的运行入口，初始化 Flutter 引擎，管理flutter应用生命周期
- 并对上层提供最基础的能力(渲染画布、插件系统、交互管理、消息循环等)


### ***2. C/C++ Engine:***

- 它的主要职责是光栅化合成上屏幕用于显示绘制内容（当需要绘制新一帧的内容时，将负责对需要合成的场景进行栅格化）
- 提供了 Flutter 核心 API 的底层实现，包括图形（通过 Skia）、文本布局、文件及网络 IO、辅助功能支持、插件架构和 Dart 运行环境及编译环境的工具链。
- 引擎将底层 C++ 代码包装成 Dart 代码，通过 dart:ui 暴露给 Flutter 框架层，而dart:ui 包是 Flutter App 的构建基础

### ***3. Dart Framework:***

- 提供了以 Dart 语言编写的现代响应式框架，对渲染逻辑做了统一封装，屏蔽了底层实现，对底层 C++ Engine 提供双向通信能力
- **开发者只需要通过该层使用widget控件构建 App 视图即可**
-  Dart Framework 包括丰富的平台，布局和基础库。从上层到下层，依次有：

```
Material 和 Cupertino 分别实现了 android Material 和 iOS 设计规范。
widget 层是一种组合的抽象,widgets 层让可以自由组合你需要复用的各种控件类
渲染层 用于提供操作布局的抽象，负责控件布局摆放及更新
基础的 foundational 类及一些基层之上的构建块服务， animation、 painting 和 gestures，它们可以提供上层常用的抽象。
```


## Flutter核心组件
### 1.Widget (应用开发者直接使用)
- Widget是Flutter的核心部分, Flutter的口号 Everything’s a widget,是构建应用的基础块
- Widgets 通过布局组合形成一种层次结构关系。每个 Widget 都嵌套在其父级的内部，并可以通过父级接收上下文
- Widget 不只表示UI 控件，还表示一些功能性的组件Navigator、GestureDetector 组件

### 2. Element （实例化的 Widget 对象）
- 在构建的阶段，Flutter 会将代码中描述的 widgets 转换成对应的 Element 树，每一个 Widget 都有一个对应的 Element。**每一个 Element 代表了树状层级结构中特定位置的 widget 实例。**
-  目前有两种 Element 的基本类型：

```
ComponentElement : Element 的宿主 
RenderObjectElement :参与布局或绘制阶段的 Element。
```

- **在代码阶段的widget层级在生成绘制后会多一些层级（源码和官网演示看查看到）**，这里面多一些的层级往往就是参与布局和绘制RenderObjectElement

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/element-tree.png">
</div>



- 注：ColoredBox 、RawImage、RichText 为绘制时产生的新增widget层级（科学上网可见图片）

### 3.RenderObject（树形）
-  用于应用界面的布局和绘制，保存了元素的大小，布局等信息
-  **在构建阶段，Flutter 会为 Element 树中的每个 RenderObjectElement 创建或更新其对应的一个从 RenderObject 继承的对象**。
-  **当应用运行时 Flutter 使用 RenderObject 的数据绘制应用界面，最终形成一个 Render Tree**。(图片需要科学上网)

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/flutter-renderTree.png">
</div>

- 大部分的 Flutter widget 是由一个继承了 RenderBox 的子类的对象渲染的，真正负责干活（layout、paint）
- 所有 RenderObject 的根节点是 RenderView，代表了渲染树的总体输出。当平台需要渲染新的一帧内容时（例如一个 vsync 信号或者一个纹理的更新完成），会调用一次 compositeFrame() 方法，它是 RenderView 的一部分。该方法会创建一个 SceneBuilder 来触发当前画面的更新。当画面更新完毕，RenderView 会将合成的画面传递给 dart:ui 中的 Window.render() 方法，控制 GPU 进行渲染。


### 三者直接关系：

```
Widget 是应用界面的声明的控件，为开发者直接使用的控件
Element 链接 Widget 和 RenderObject，管理界面的更新和修改。
RenderObject 保存具体的布局信息，负责绘制 UI, 为实际渲染
```

-  **Widget重新创建，Element 树和 RenderObject 树并不会完全重新创建**，如果 newWidget 与oldWidget 的 runtimeType 和 key 相等时，更新已经存在的 Element 对象，不然就选择重新创建新的 Element。



## 二.Flutter渲染原理
- 从Flutter的核心控件大概已经初步了解到了渲染的相关流程，核心控件到绘制的情况。
-  **一般计算机绘图原理：**屏幕显示器一般以60Hz的固定频率刷新，每一帧图像绘制完成后，会继续绘制下一帧，这时显示器就会发出一个Vsync信号，按60Hz计算，屏幕每秒会发出60次这样的信号。CPU计算好显示内容提交给GPU，GPU渲染好传递给显示器显示。flutter 渲染原理相同。渲染过程会使用上边介绍的核心流程控件。

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/flutter-render.png">
</div>

- Flutter 的渲染流水线也包括两个线程，**UI 线程和 GPU 线程，UI 线程主要负责的是根据 UI 界面的描述生成 UI 界面的绘制指令，建立过程中生成 Render，往下布局、绘制大小等工作，完成以后会生成一个 Layer Tree，到了 GPU 线程之后会调用 Skia 做渲染**





