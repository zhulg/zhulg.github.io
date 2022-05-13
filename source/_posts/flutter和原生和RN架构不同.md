---
title: flutter和原生和RN架构不同点
tags: Flutter
categories: Flutter
toc: true
abbrlink: 16190
date: 2018-12-14 18:22:08
---

- 原生：![](https://cdn-images-1.medium.com/max/1600/1*DXsvg0ir2nvYOTiUpp9KJw.png)
  
- RN  ![](https://cdn-images-1.medium.com/max/1600/1*8ugYUcmOYnoDx7d99qkEjQ.png)


- flutter: ![](https://cdn-images-1.medium.com/max/1600/1*UpoHX3az39ZqkFwBr_gndA.png)


- RN通过js编译成个平台view
- Flutter自己实现了一台UI框架，然后直接系统更底层渲染系统上画UI。它采用的开发语言不是JS，而Dart。Dart语言可以编译成原生代码，直接跟原生通信。
- 系统的UI框架可以取代，但是系统提供的一些服务是无法取代的。Flutter在跟系统service通信方式，采用的是类似插件式的方式(有点像远程过程调用RPC方式)
- Flutter学习了RN的UI编程方式，引入了状态机，更新UI时只更新最小改变区域。
