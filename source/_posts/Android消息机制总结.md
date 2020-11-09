---
title: Android消息机制总结
date: 2020-11-09 15:12:36
tags: Android
categories: Android
toc: true
---

## 消息机制相关知识点
- Android消息机制涉及相关的知识点，handler 、ThreadLocal 、looper、 MessageQueue、Message、对象池使用
### Handler
- handler在Android里常用在子线程的数据抛给主线程使用，常见操作更新UI。但是它也能实现任意两个线程的数据传递。
- 在子线程上创建Handler时需要Looper.prepare()和Looper.loop() , UI线程也是需要的可以从ActivityThread的main里看到，所以默认系统为主线程已经调用过

```

   class MyThread extends Thread {
       public Handler mHandler;
  
        public void run() {
           Looper.prepare();
          mHandler = new Handler() {
                public void handleMessage(Message msg) {
                    // process incoming messages here
                }
            };
            Looper.loop();
        }
        
```
#### 创建Handler为什么需要 Looper.prepare()和Looper.loop()
- Handle 实例创建的源码

```
  public Handler(@Nullable Callback callback, boolean async) {
     // 核心代码块
        mLooper = Looper.myLooper();
        if (mLooper == null) {
            throw new RuntimeException(
                "Can't create handler inside thread " + Thread.currentThread()
                        + " that has not called Looper.prepare()");
        }
        mQueue = mLooper.mQueue;
        mCallback = callback;
        mAsynchronous = async;
    }

```


- 在使用handler的时候，在handler所创建的线程需要维护一个唯一的Looper对象， 每个线程对应一个Looper，每个线程的Looper通过ThreadLocal来保证，如需了解ThreadLocal，点击查看详细讲解 ,
- Looper对象的内部又维护有唯一的一个MessageQueue，所以一个线程可以有多个handler，但是只能有一个Looper和一个MessageQueue。
- Message在MessageQueue不是通过一个列表来存储的，而是将传入的Message存入到了上一个 Message的next中，在取出的时候通过顶部的Message就能按放入的顺序依次取出Message。
- Looper对象通过loop()方法开启了一个死循环，不断地从looper内的MessageQueue中取出Message，然后通过handler将消息分发传回handler所在的线程。