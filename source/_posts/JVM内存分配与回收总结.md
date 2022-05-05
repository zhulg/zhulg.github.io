---
title: JVM内存分配与回收总结
tags: java
categories: Java
toc: true
abbrlink: 44013
date: 2020-09-15 10:05:15
---

- **对象的内存分配主要在堆上分配，主要分配在新生代的 Eden 区上，少数情况下可能直接分配在老年代**
- 堆内存结构通常将堆内存结构按新生代和老年代进行划分，**在 JDK 8 之后取消了永久代。**

![](https://raw.githubusercontent.com/zhulg/allpic/master/duineicun.png)

### 新生代
- 内部包含 Eden 区域，作为对象初始分配的区域；两个 Survivor，也叫 from、to 区域，用来放置从 Minor GC 中生存下来的对象。  如果Eden内存空间不足，就会发生Minor GC

![](https://raw.githubusercontent.com/zhulg/allpic/master/xinshengdai.png)



```
Java 应用不断创建对象，优先分配在 Eden 区域，当空间占用达到一定阈值时，触发 Minor GC。没有被引用的对象被回收，仍然存活的对象被复制到 JVM 选择的 Survivor 区域。如下图，数字 1 表示对象的存活年龄计数在下一次 Minor GC 时，另外一个 Survivor 区域会成为 to 区域， Eden 区域存活的对象和 from 区域对象都会被复制到 to 区域，存活的年龄计会被加 1。
上述过程会发生很多次，直到有对象年龄计数达到阈值，这些对象会被晋升到老年代。

```

- 其中对 Eden 区域再进行划分， Hotspot JVM 还有一个概念叫着 Thread Local Allocation（TLAB），这是 JVM 为每个线程分配的一个私有缓存区域。多线程同时分配内存时，为了避免操作同一地址，可能需要使用加锁机制，进而影响分配速度

### 老年代
- 大对象直接进入老年代

```
大对象是指需要大量连续内存空间的 Java 对象，如很长的字符串或数据。
一个大对象能够存入 Eden 区的概率比较小，发生分配担保的概率比较大，而分配担保需要涉及大量的复制，就会造成效率低下。
虚拟机提供了一个 -XX:PretenureSizeThreshold 参数，令大于这个设置值的对象直接在老年代分配
```

- 长期存活的对象将进入老年代

```
JVM 给每个对象定义了一个对象年龄计数器。当新生代发生一次 Minor GC 后，存活下来的对象年龄 +1，当年龄超过一定值时，就将超过该值的所有对象转移到老年代中去。
使用 -XXMaxTenuringThreshold 设置新生代的最大年龄，只要超过该参数的新生代对象都会被转移到老年代中去。
```

- 动态对象年龄判定

```
如果当前新生代的 Survivor 中，相同年龄所有对象大小的总和大于 Survivor 空间的一半，年龄 >= 该年龄的对象就可以直接进入老年代，无须等到 MaxTenuringThreshold 中要求的年龄。
```

- 空间分配担保

```
新生代中有大量的对象存活，survivor空间不够，当出现大量对象在MinorGC后仍然存活的情况（最极端的情况就是内存回收后新生代中所有对象都存活），就需要老年代进行分配担保，把Survivor无法容纳的对象直接进入老年代.只要老年代的连续空间大于新生代对象的总大小或者历次晋升的平均大小，就进行Minor GC，否则FullGC。

```

