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

- Object.wait()和Thread. sleep()的关键的区别在于

```
 wait()是用于线程间通信的，而sleep()是用于短时间暂停当前线程
 wait，释放cpu资源，也释放锁资源 ，sleep释放cpu资源，不释放锁资源
 wait用于锁机制， wait，notify,notifyall 都是Object对象的方法，是一起使用的，用于锁机制
 sleep是线程的方法,  这就是为啥sleep不释放锁，wait释放锁的原因
```


- Thread.sleep(long) 和Thread.yield() 区别
```
sleep()会让当前线程休眠进入阻塞状态并释放CPU。 方法会给其他线程运行的机会，而不考虑其他线程的优先级，因此会给较低线程一个运行的机会,如果有同步锁则sleep不会释放锁即其他线程无法获得同步锁  可通过调用interrupt()方法来唤醒休眠线程
yield()让出CPU调度 。方法只会给相同优先级者更高优先级的线程一个运行的机会。调用yield方法只是一个建议，告诉线程调度器我的工作已经做的差不多了，可以让别的相同优先级的线程使用CPU了，没有任何机制保证采纳。
```

- join：一种特殊的wait， thread.join()，用于保持线程的执行顺序。当前运行线程调用另一个线程的join方法，当前线程进入阻塞状态直到另一个线程运行结束等待该线程终止。 注意该方法也需要捕捉异常。

##Java 线程声明周期
![](https://raw.githubusercontent.com/zhulg/allpic/master/thread-life-cycle.png)

- **NEW :** A thread that has not yet started is in this state.
- **RUNNABLE:** A thread executing in the Java virtual machine is in this state.
- **BLOCKED:** A thread that is blocked waiting for a monitor lock is in this state.
- **WAITING:** A thread that is waiting indefinitely for another thread to perform a particular action is in this state. 比如：ThreadA调用了Object.wait()方法，此时ThreadA状态为WAITING。ThreadA会等待其他的线程调用 Object.notify()或Object.notifyAll才会被唤醒，继续执行后面的逻辑
- **TIMED_WAITING:** A thread that is waiting for another thread to perform an action for up to a specified waiting time is in this state.  线程正在等待其他线程的操作，直到超过指定的超时时间,线程在调用以下方法是会将状态改变为TIMED_WAITING状态:
```
Thread.sleep
Object.wait with timeout
Thread.join with timeout
LockSupport.parkNanos
LockSupport.parkUntil
```
- **TERMINATED:**  A thread that has exited is in this state.