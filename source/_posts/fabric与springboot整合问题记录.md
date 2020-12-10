---
title: fabric与springboot整合问题记录
date: 2018-04-19 16:43:29
tags: 区块链
categories: 区块链
toc: true
---

- 目前在做基于fabric的区块链项目，在整合springboot时遇到坑记录
- 在fabric网络启动后，springboot工程去连接时出现错误。
- Channel mychannel sendDeliver failed on orderer orderer.example.com. Reason: INTERNAL: Connection closed with unknown cause

<!-- more -->

```
io.grpc.StatusRuntimeException: INTERNAL: Connection closed with unknown cause
	at io.grpc.Status.asRuntimeException(Status.java:526)
	at io.grpc.stub.ClientCalls$StreamObserverToCallListenerAdapter.onClose(ClientCalls.java:380)
	at io.grpc.internal.ClientCallImpl.closeObserver(ClientCallImpl.java:419)
	at io.grpc.internal.ClientCallImpl.access$100(ClientCallImpl.java:60)
	at io.grpc.internal.ClientCallImpl$ClientStreamListenerImpl.close(ClientCallImpl.java:493)
	at io.grpc.internal.ClientCallImpl$ClientStreamListenerImpl.access$500(ClientCallImpl.java:422)
	at io.grpc.internal.ClientCallImpl$ClientStreamListenerImpl$1StreamClosed.runInContext(ClientCallImpl.java:525)
	at io.grpc.internal.ContextRunnable.run(ContextRunnable.java:37)
	at io.grpc.internal.SerializingExecutor.run(SerializingExecutor.java:102)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
	at java.lang.Thread.run(Thread.java:748)
ERROR OrdererClient - Channel mychannel sendDeliver failed on orderer orderer.example.com. Reason: INTERNAL: Connection closed with unknown cause
org.hyperledger.fabric.sdk.exception.TransactionException: Channel mychannel sendDeliver failed on orderer orderer.example.com. Reason: INTERNAL: Connection closed with unknown cause
	at org.hyperledger.fabric.sdk.OrdererClient.sendDeliver(OrdererClient.java:295)
	at org.hyperledger.fabric.sdk.Orderer.sendDeliver(Orderer.java:172)
	at org.hyperledger.fabric.sdk.Channel.seekBlock(Channel.java:1198)
	at org.hyperledger.fabric.sdk.Channel.getLatestBlock(Channel.java:1274)
	at org.hyperledger.fabric.sdk.Channel.getLastConfigIndex(Channel.java:1097)
	at org.hyperledger.fabric.sdk.Channel.getConfigurationBlock(Channel.java:1028)
	at org.hyperledger.fabric.sdk.Channel.parseConfigBlock(Channel.java:949)
	at org.hyperledger.fabric.sdk.Channel.initialize(Channel.java:676)
	at com.example.fabric.HFJavaSDKBasicExample.getChannel(HFJavaSDKBasicExample.java:196)
	at com.example.fabric.HFJavaSDKBasicExample.main(HFJavaSDKBasicExample.java:63)
Caused by: io.grpc.StatusRuntimeException: INTERNAL: Connection closed with unknown cause

```
- 这个错误原因居然是springboot版本导致。。。。目前fabric使用1.0.6（最新为1.1）
- **解决方法把springboot下降到2.0.0以下版本，注意是以下，1.5.9都可以。使用2.0.0以上目前会造成fabric网络出现必现问题，链接未知原因被拒，底层java代码不兼容。**

#### hyperledger fabric技术交流群

- 到期或者失效，发邮件(lg.json@gmail.com)给我你微信，拉你进群。

![](https://raw.githubusercontent.com/zhulg/allpic/master/weixin.png)