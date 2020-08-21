---
title: Java线程状态及关键方法
date: 2020-08-18 09:56:08
categories: Java
tags: Java,线程
toc: true
---

## 先回顾Java里的几个方法
- 先了解下Java跟线程相关的几个方法是sleep、yield、wait、join，为什么会有这么些个方法，这些方法是要解决什么问题？
- 直观区别：
```
Object里的相关的方法：wait()和notify()、notifyAll()  
Thread类的静态方法： Thread.sleep(long) 和Thread.yield()
join()：是由线程对象来调用。
```
<!--more -->
- wait()和sleep()的关键的区别在于，wait()是用于线程间通信的，而sleep()是用于短时间暂停当前线程。 更加明显的一个区别在于，当一个线程调用wait()方法的时候，会释放它锁持有的对象的管程和锁，但是调用sleep()方法的时候，不会释放他所持有的管程
- sleep()方法会给其他线程运行的机会，而不考虑其他线程的优先级，因此会给较低线程一个运行的机会；yield()方法只会给相同优先级或者更高优先级的线程一个运行的机会。
