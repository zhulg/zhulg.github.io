---
title: Android进程间通信总结
date: 2020-11-12 18:47:51
tags: Android
categories: Android
toc: true
---

- Android进程间通用常见方式:

```
 Bundle：四大组件间通信, 通过intent放入Bundle数据 intent.putExtras(bundle)，但是只能单向的而且是常用基本数据。
 File：文件共享 ，但是涉及多线程读写问题
ContentProvider：应用间数据共享（基于 Binder）
AIDL：Binder机制（基于 Binder）
Messager：基于AIDL、Handler实现 （基于 Binder）
Socket：建立C/S通信模型
```

- 这里面有个类Binder， **他是AIDL、Messager的基础，是实现跨进程通信的核心**

## Binder常见的使用地方
- binder用在绑定服务的地方，从官网的文档里可以看到，常用的3个方式。https://developer.android.com/guide/components/bound-services#Binder
- **本应用内与service交互获取数据**：过扩展 Binder 类并从 onBind() 返回该类的实例来创建接口。收到 Binder 后，客户端可利用其直接访问 Binder 实现或 Service 中可用的公共方法。
- **跨进程的交互使用Messenger**（底层只是对Binder的简单包装），使用 Messenger 为服务提供接口。借助此方法，您无需使用 AIDL 便可执行进程间通信 (IPC)，封装的单线程AIDL。
- **跨进程AIDL**：Messenger 会在单个线程中创建包含所有客户端请求的队列，以便服务一次接收一个请求。不过，如果想让服务同时处理多个请求，则可直接使用 AIDL
