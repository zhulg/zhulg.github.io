---
title: MVC/MVP/MVVM/MVI架构模式
tags:
  - App
  - 架构
categories:
  - 技术成长
toc: true
abbrlink: 9541
date: 2022-02-13 10:51:41
---

## 1.MVC:

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/mvc.png" >
</div>

1. View 层接受输入，并送到指令到 Controller层
2. Controller 处理业务逻辑后，对 Model 改变状态，有时也直接更新View
3. Model 更新数据发送到 View，View层更新界面

## 2.MVP:

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/mvp.png" >
</div>

1. View 与 Model 不再进行通信
2. View 与 Model 通过Presenter层通信降低耦合
3. View层负责界面展示，Presenter层处理逻辑业务代码会变厚

## 3.MVVM：

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/mvvm.png" >
</div>

1. View 与 Model 保持不直接通信，与MVP思想大致相同
2. 通过绑定思想建立View层和ViewModel映射，实现界面和数据自动同步
3. ViewModel层多包含处理的业务逻辑，并与Model层通信

## 4.MVI:

- MVI 是 **Model-View-Intent** 的缩写，它也是一种响应式 + 流式处理思想的架构（数据模型驱动界面）。

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/mvi.png" >
</div>

1. 把用户操作，形成以`Intent`的形式，通知`Model`里对应的状态方法
2. `Model`基于`Intent`更新`State`，保证状态逻辑的一致性
3. `View`接收到`State`变化刷新界面层

### Android架构中MVI与MVVM分层变动：

- MVVM 代码分层的 View 和 ViewModel 在 MVI 中统一称为 UI Layer，而 Model 层在 MVI 中变成了 Data Layer。
- MVI 概念中的 Model 作为状态模型，在 UI Layer 的 ViewModel 和 Data Layer 的 Repository 中分别体现为 UI State 和 Data Flow

*MVI优点:*

- 通**过数据模型驱动界面，**应用会更便于测试、更稳定可靠
- **强调数据单向流动**，容易对状态变化进行跟踪和回溯

*MVI缺点:*

- 所有的操作都会转换成State，所以当复杂页面的State容易膨胀