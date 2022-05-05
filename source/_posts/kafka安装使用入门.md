---
title: kafka
tags: kafka
abbrlink: 13749
date: 2017-12-16 12:03:28
---

###kafka概述
<image src=https://kafka.apache.org/images/logo.png width=300>

#### 关于快速学习方法领悟
- 学习不熟悉的领域和知识，要快速找出技术的原理，核心功能点，能做什么能，用于解决什么问题。
- 暂时忽略技术细节，找出技术主干，根据项目和日后学习循序渐进到细节部分。

#### 一，kafka是什么
- Apache kafka是消息中间件的一种，关于消息中间件摘录一段网上比较好的通俗理解。
- 举个例子，生产者消费者，生产者生产鸡蛋，消费者消费鸡蛋，生产者生产一个鸡蛋，消费者就消费一个鸡蛋，假设消费者消费鸡蛋的时候噎住了（系统宕机了），生产者还在生产鸡蛋，那新生产的鸡蛋就丢失了。再比如生产者很强劲（大交易量的情况），生产者1秒钟生产100个鸡蛋，消费者1秒钟只能吃50个鸡蛋，那要不了一会，消费者就吃不消了（消息堵塞，最终导致系统超时），消费者拒绝再吃了，”鸡蛋“又丢失了，这个时候我们放个篮子在它们中间，生产出来的鸡蛋都放到篮子里，消费者去篮子里拿鸡蛋，这样鸡蛋就不会丢失了，都在篮子里，而这个篮子就是”kafka“。
鸡蛋其实就是“数据流”，系统之间的交互都是通过“数据流”来传输的（就是tcp、http什么的），也称为报文，也叫“消息”。
消息队列满了，其实就是篮子满了，”鸡蛋“ 放不下了，那赶紧多放几个篮子，其实就是kafka的扩容。
各位现在知道kafka是干什么的了吧，它就是那个"篮子"
<!-- more -->

#### 二，kafka和核心功能
- **发布订阅**:消息传递系统，发布和订阅记录流，类似消息队列和企业级的消息系统
- **处理:** 高效实时处理，以流的形式处理记录
- **存储:**数据流安全地在分布式集群中复制存储，以容错的方式存储记录流。

#### 三，kafka相关术语
- **Topic：**Kafka将消息种子(Feed)分门别类， 每一类的消息称之为话题(Topic).
-  **Producer：**发布消息的对象称之为话题生产者(Kafka topic producer)
-  **Consumer：**订阅消息并处理发布的消息的种子的对象称之为话题消费者(consumers)
-  **Broker：**已发布的消息保存在一组服务器中，称之为Kafka集群。集群中的每一个服务器都是一个代理(Broker). 消费者可以订阅一个或多个话题，并从Broker拉数据，从而消费这些已发布的消息（有点上边篮子的意思）

#### 四，Mac安装kafka
- brew install kafka

```
Updating Homebrew...
==> Auto-updated Homebrew!
Updated 1 tap (caskroom/cask).
No changes to formulae.

==> Downloading https://homebrew.bintray.com/bottles/kafka-0.11.0.1.sierra.bottle.1.tar.gz
######################################################################## 100.0%
==> Pouring kafka-0.11.0.1.sierra.bottle.1.tar.gz
==> Caveats
To have launchd start kafka now and restart at login:
  brew services start kafka
Or, if you don't want/need a background service you can just run:
  zookeeper-server-start /usr/local/etc/kafka/zookeeper.properties & kafka-server-start /usr/local/etc/kafka/server.properties
==> Summary
🍺  /usr/local/Cellar/kafka/0.11.0.1: 149 files, 35.5MB

```

- kafka启动依赖zookeeper，需要先启动zookepper

```
/usr/local/Cellar/zookeeper/3.4.10/bin$./zkServer start
ZooKeeper JMX enabled by default
Using config: /usr/local/etc/zookeeper/zoo.cfg
Starting zookeeper ... STARTE
```

#### 五，使用官方例子

- 到这个 /usr/local/Cellar/kafka/0.11.0.1$下
- sudo ./bin/kafka-server-start  ./libexec/config/server.properties
- 创建一个名为“test”的Topic，只有一个分区和一个备份：到/usr/local/Cellar/kafka/0.11.0.1$

```
bin/kafka-topics  --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test
```
- 启动生成者

```
bin/kafka-console-producer --broker-list localhost:9092 --topic test
```

- 输入：

```
  This is a message
  This is another message
  hello world
```
  
- 查看消费

```
 bin/kafka-console-consumer --bootstrap-server localhost:9092 --topic test --from-beginning
 
```

#### 设置多个broker集群方式，参见官网 