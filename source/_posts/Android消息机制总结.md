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

- 从代码里看到获取mLooper时会当未空，需要先进行 Looper.prepare() , 查看Looper里的方法

```
    public static void prepare() {
        prepare(true);
    }

    private static void prepare(boolean quitAllowed) {
        if (sThreadLocal.get() != null) {
            throw new RuntimeException("Only one Looper may be created per thread");
        }
        sThreadLocal.set(new Looper(quitAllowed));
    }

```

- 可以看到prepare的过程会在 Looper里的sThreadLocal创建出来Looper的实例，并进行保存。


```
   private Looper(boolean quitAllowed) {
        mQueue = new MessageQueue(quitAllowed);
        mThread = Thread.currentThread();
    }
```

- 创建Looper的时候可以看到引入了MessageQueue， 并在Looper实例里创建了MessageQueue的实例，用于存储Message

- Looper prepare() 是为了创建出来Looper，并存放在ThreadLocal里，在构建Looper实例时候，也创建出来消息队列MessageQueue。而Looper.loop()则从消息队列里取出来消息，进行执行。

```

    /**
     * Run the message queue in this thread. Be sure to call
     * {@link #quit()} to end the loop.
     */
    public static void loop() {
        final Looper me = myLooper();
        if (me == null) {
            throw new RuntimeException("No Looper; Looper.prepare() wasn't called on this thread.");
        }
        final MessageQueue queue = me.mQueue;

        // Make sure the identity of this thread is that of the local process,
        // and keep track of what that identity token actually is.
        Binder.clearCallingIdentity();
        final long ident = Binder.clearCallingIdentity();

        // Allow overriding a threshold with a system prop. e.g.
        // adb shell 'setprop log.looper.1000.main.slow 1 && stop && start'
        final int thresholdOverride =
                SystemProperties.getInt("log.looper."
                        + Process.myUid() + "."
                        + Thread.currentThread().getName()
                        + ".slow", 0);

        boolean slowDeliveryDetected = false;

        for (;;) {
            Message msg = queue.next(); // might block
            if (msg == null) {
                // No message indicates that the message queue is quitting.
                return;
            }

            // This must be in a local variable, in case a UI event sets the logger
            final Printer logging = me.mLogging;
            if (logging != null) {
                logging.println(">>>>> Dispatching to " + msg.target + " " +
                        msg.callback + ": " + msg.what);
            }
            // Make sure the observer won't change while processing a transaction.
            final Observer observer = sObserver;

            final long traceTag = me.mTraceTag;
            long slowDispatchThresholdMs = me.mSlowDispatchThresholdMs;
            long slowDeliveryThresholdMs = me.mSlowDeliveryThresholdMs;
            if (thresholdOverride > 0) {
                slowDispatchThresholdMs = thresholdOverride;
                slowDeliveryThresholdMs = thresholdOverride;
            }
            final boolean logSlowDelivery = (slowDeliveryThresholdMs > 0) && (msg.when > 0);
            final boolean logSlowDispatch = (slowDispatchThresholdMs > 0);

            final boolean needStartTime = logSlowDelivery || logSlowDispatch;
            final boolean needEndTime = logSlowDispatch;

            if (traceTag != 0 && Trace.isTagEnabled(traceTag)) {
                Trace.traceBegin(traceTag, msg.target.getTraceName(msg));
            }

            final long dispatchStart = needStartTime ? SystemClock.uptimeMillis() : 0;
            final long dispatchEnd;
            Object token = null;
            if (observer != null) {
                token = observer.messageDispatchStarting();
            }
            long origWorkSource = ThreadLocalWorkSource.setUid(msg.workSourceUid);
            try {
                msg.target.dispatchMessage(msg);
                if (observer != null) {
                    observer.messageDispatched(token, msg);
                }
                dispatchEnd = needEndTime ? SystemClock.uptimeMillis() : 0;
            } catch (Exception exception) {
                if (observer != null) {
                    observer.dispatchingThrewException(token, msg, exception);
                }
                throw exception;
            } finally {
                ThreadLocalWorkSource.restore(origWorkSource);
                if (traceTag != 0) {
                    Trace.traceEnd(traceTag);
                }
            }
            if (logSlowDelivery) {
                if (slowDeliveryDetected) {
                    if ((dispatchStart - msg.when) <= 10) {
                        Slog.w(TAG, "Drained");
                        slowDeliveryDetected = false;
                    }
                } else {
                    if (showSlowLog(slowDeliveryThresholdMs, msg.when, dispatchStart, "delivery",
                            msg)) {
                        // Once we write a slow delivery log, suppress until the queue drains.
                        slowDeliveryDetected = true;
                    }
                }
            }
            if (logSlowDispatch) {
                showSlowLog(slowDispatchThresholdMs, dispatchStart, dispatchEnd, "dispatch", msg);
            }

            if (logging != null) {
                logging.println("<<<<< Finished to " + msg.target + " " + msg.callback);
            }

            // Make sure that during the course of dispatching the
            // identity of the thread wasn't corrupted.
            final long newIdent = Binder.clearCallingIdentity();
            if (ident != newIdent) {
                Log.wtf(TAG, "Thread identity changed from 0x"
                        + Long.toHexString(ident) + " to 0x"
                        + Long.toHexString(newIdent) + " while dispatching to "
                        + msg.target.getClass().getName() + " "
                        + msg.callback + " what=" + msg.what);
            }

            msg.recycleUnchecked();
        }
    }
    
```

-  Message在MessageQueue的存储是通过Message.next 来存放的，类似单链表的存储结构。在取出的时候通过 MessageQueue.next()方法取出某个message, message之间也是通过next属性，形成链表存储在MessageQueue里。

### 消息机制总结
- **Handler可以在主线程创建也可以在子线程创建**，主线程创建时已在系统启动时（ActivityThread的main方法里），调用过Looper.prepare和Loop，所以创建完直接使用。但是子线程创建Handler需要先prepare()，创建出来Looper对象，以及消息队列，之后进行Loop()运行起来，从消息队列死循环取消息出来，并进行分发出去进行执行，即到handler里进行dispatchMessage
- 一个线程可以有多个handler，但是只能有一个Looper和一个MessageQueue， 每个线程对应一个Looper，每个线程的Looper通过ThreadLocal来存储保证，Looper对象的内部又维护有唯一的一个MessageQueue
- Handler提供创建消息的方法obtainMessage和 sendMessage的方法，通过Handler持有的mQueue（消息队列引用），放入消息到队列（MessageQueue）。 mQueue = mLooper.mQueue;

### Handler的消息发生
- Handler的obtainMessage方法通过对象复用方式，减少对象的创建, 

```
    /**
     * Return a new Message instance from the global pool. Allows us to
     * avoid allocating new objects in many cases.
     */
    public static Message obtain() {
        synchronized (sPoolSync) {
            if (sPool != null) {
                Message m = sPool;
                sPool = m.next;
                m.next = null;
                m.flags = 0; // clear in-use flag
                sPoolSize--;
                return m;
            }
        }
        return new Message();
    }

```

- 在Message中有一个static Message变量sPool，这个变量是用于缓存Message对象的, 当sPool不为空就取出, 相应个数减一，并通过next 设定下一个对象，重新赋值到sPool 

- sPool中缓存的Message是哪里来回收来的

```
 /**
     * Return a Message instance to the global pool.
     * <p>
     * You MUST NOT touch the Message after calling this function because it has
     * effectively been freed.  It is an error to recycle a message that is currently
     * enqueued or that is in the process of being delivered to a Handler.
     * </p>
     */
    public void recycle() {
        if (isInUse()) {
            if (gCheckRecycle) {
                throw new IllegalStateException("This message cannot be recycled because it "
                        + "is still in use.");
            }
            return;
        }
        recycleUnchecked();
    }

    /**
     * Recycles a Message that may be in-use.
     * Used internally by the MessageQueue and Looper when disposing of queued Messages.
     */
    @UnsupportedAppUsage
    void recycleUnchecked() {
        // Mark the message as in use while it remains in the recycled object pool.
        // Clear out all other details.
        flags = FLAG_IN_USE;
        what = 0;
        arg1 = 0;
        arg2 = 0;
        obj = null;
        replyTo = null;
        sendingUid = UID_NONE;
        workSourceUid = UID_NONE;
        when = 0;
        target = null;
        callback = null;
        data = null;

        synchronized (sPoolSync) {
            if (sPoolSize < MAX_POOL_SIZE) {
                next = sPool;
                sPool = this;
                sPoolSize++;
            }
        }
    }
    
```

- 使用obtain获取Message对象是因为Message内部维护了一个数据缓存池，回收的Message不会被立马销毁，而是放入了缓存池，在获取Message时会先从缓存池中去获取，缓存池为null才会去创建新的Message。


### HandlerThread
- Handler可以在主线程上创建也可以在子线程上创建，HandlerThread 继承自Thread ,本质是一个Thread , 在run方法里创建了Looper和MessageQueue对象，并开启了Looper轮询消息。
- 通过获取HandlerThread的looper对象传递给主线程的Handler对象（构造handler时传入），然后在handleMessage()方法中执行异步任务。Handler虽然是在住线程创建，但是它的handleMessage接收到消息是在HandlerThread线程，达到收到消息，执行异步任务的操作。与以往常用handleMessage里主线程操作不同，因为传入的looper是HandlerThread里构造的，是一个子线程。
- **HandlerThread相当于在子线程上创建的Handler，android做了层封装为提供了现成的使用。可以在handleMessage里处理异步任务**

- 模板用法：

```
//步骤1：创建HandlerThread的实例对象=已经创建了一个新线程
//参数=线程名字，作用是标记该线程
HandlerThread mHandlerThread = new HandlerThread("handlerThread");

//步骤2：启动线程
mHandlerThread.start();

//步骤3：创建工作线程Handler，传入 handlerThread.getLooper() , 实现消息处理的操作，并与其他线程进行通信
Handler mHandler = new Handler( handlerThread.getLooper() ) {
            @Override
            public boolean handleMessage(Message msg) {
              //运行HandlerThread子线程，用于实现自己的消息处理
                return true;
            }
        });

//步骤4：结束线程，即停止线程的消息循环
mHandlerThread.quit();
```

- 使用场景：
- 存在多个耗时的任务需要放到开启子线程依次去处理（串行处理任务）
- HandlerThread是一个子线程，适合处理耗时的任务，其次，Handler分发消息是通过MessageQueue顶部的Message不断的通过Message的next依次取出Message，符合任务的按顺序串行处理的要求，所以使用HandlerThread就能完美的解决
