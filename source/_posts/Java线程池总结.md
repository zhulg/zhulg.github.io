---
title: Java线程池总结
date: 2020-09-14 23:22:44
tags: java
categories: Java
toc: true
---

## 一. 线程池主要解决什么问题

```
 一是避免了处理任务时创建销毁线程开销的代价
 二是提供资源限制和管理手段，避免了线程数量膨胀导致的过分调度问题，保证了对内核的充分利用
```

## 二. ThreadPoolExecutor
- Java中的线程池核心实现类是ThreadPoolExecutor , 从类图中可以看到相关结构
![](https://raw.githubusercontent.com/zhulg/allpic/master/exectoruml.png)


- ThreadPoolExecutor实现的顶层**接口是Executor**，顶层接口Executor提供了一种思想：将任务提交和任务执行进行解耦。用户无需关注如何创建线程，如何调度线程来执行任务，用户只需提供Runnable对象，将任务的运行逻辑提交到执行器(Executor)中，由Executor框架完成线程的调配和任务的执行部分。
- **ExecutorService接口**增加了一些能力：（1）扩充执行任务的能力，补充可以为一个或一批异步任务生成Future的方法；（2）提供了管控线程池的方法，比如停止线程池的运行。
- **AbstractExecutorService则是上层的抽象类**，将执行任务的流程串联了起来，保证下层的实现只需关注一个执行任务的方法即可。
- 最下层的实现类ThreadPoolExecutor实现最复杂的运行部分，ThreadPoolExecutor将会一方面维护自身的生命周期，另一方面同时管理线程和任务，使两者良好的结合从而执行并行任务。

### 2-1. ThreadPoolExecutor是如何运行，如何同时维护线程和执行任务
![](https://raw.githubusercontent.com/zhulg/allpic/master/threadpool.png)

## 三 .Executors 
- Executors 目前提供了 5 种不同的线程池创建配置：（待补充）



- 参考： https://tech.meituan.com/2020/04/02/java-pooling-pratice-in-meituan.html 
