---
title: Flutter中ScopedModel的作用
tags: flutter
categories: flutter
toc: true
abbrlink: 23620
date: 2018-12-27 20:53:33
---

- Scoped_model是一个dart第三方库，提供将数据模型从父Widget传递到它的后代的功能,它还会在模型更新时重新渲染使用该模型的所有子项.
#### 原理

- Scoped model使用了观察者模式，将数据模型放在父代，后代通过找到父代的model进行数据渲染。
- 数据改变时将数据传回，父代再通知所有用到了该model的子代去更新状态。
<!-- more -->

- Scoped的思想就是把这些共享状态提升到顶层。
```
需要共享的状态需要继承至Model类
使用ScopedModel包在最外层外形成顶层状态
子页面通过ScopedModelDescendant找到顶层装态
```