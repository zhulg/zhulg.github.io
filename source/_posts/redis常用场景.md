---
title: redis常用场景
date: 2017-09-19 14:46:37
tags: redis
---
### Redis的特点
Redis  与其他  key - value  缓存产品有以下三个特点：

```
　　· Redis 支持数据的持久化，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用。
　　· Redis 不仅仅支持简单的 key-value 类型的数据，同时还提供 list ， set ， zset ， hash 等数据结构的存储。
　　· Redis 支持数据的备份，即 master-slave 模式的数据备份。
```

<!-- more -->


#### Redis的优势：

```
　　·  性能极高  – Redis 能读的速度是 110000 次 /s, 写的速度是 81000 次 /s 
　　·  丰富的数据类型  – Redis 支持二进制案例的  Strings, Lists, Hashes, Sets  及  Ordered Sets  数据类型操作。
　　·  原子  – Redis 的所有操作都是原子性的，同时 Redis 还支持对几个操作全并后的原子性执行。
　　·  丰富的特性  – Redis 还支持  publish/subscribe,  通知 , key  过期等等特性。
　　
```
### 常见使用场景:
- 会话缓存（Session Cache)<br>
最常用的一种使用Redis的情景是会话缓存（session cache）。用Redis缓存会话比其他存储（如Memcached）的优势在于：Redis提供持久化。
- 全页缓存（FPC）<br>
除基本的会话token之外，Redis还提供很简便的FPC平台。回到一致性问题，即使重启了Redis实例，因为有磁盘的持久化，用户也不会看到页面加载速度的下降，这是一个极大改进，类似PHP本地FPC
- 队列<br>
Reids在内存存储引擎领域的一大优点是提供 list 和 set 操作，这使得Redis能作为一个很好的消息队列平台来使用。Redis作为队列使用的操作，就类似于本地程序语言（如Python）对 list 的 push/pop 操作
- 排行榜/计数器<br
Redis在内存中对数字进行递增或递减的操作实现的非常好。集合（Set）和有序集合（Sorted Set）也使得我们在执行这些操作的时候变的非常简单，Redis只是正好提供了这两种数据结构
