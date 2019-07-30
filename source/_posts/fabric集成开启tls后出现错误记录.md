---
title: fabric集成开启tls后出现错误记录
date: 2018-05-01 21:50:59
tags: [fabric,区块链,tls]
---

- 目前在不开启tls时，通过fabric javasdk链接到fabric网络，数据到链一切正常。
- 开启tls后，通过配置修改，并在java代码上进行处理后，目前错误出现\
- Reason: UNAVAILABLE: Channel closed while performing protocol negotiation

<!-- more -->

- 主要错误堆栈，在初始化通道时失败。

```
org.hyperledger.fabric.sdk.exception.TransactionException: Channel gomevisionchannel sendDeliver failed on orderer orderer.gomevision.com. Reason: UNAVAILABLE: Channel closed while performing protocol negotiation
	at org.hyperledger.fabric.sdk.OrdererClient.sendDeliver(OrdererClient.java:295) ~[fabric-sdk-java-1.0.1.jar:na]
	at org.hyperledger.fabric.sdk.Orderer.sendDeliver(Orderer.java:172) [fabric-sdk-java-1.0.1.jar:na]
	at org.hyperledger.fabric.sdk.Channel.seekBlock(Channel.java:1198) [fabric-sdk-java-1.0.1.jar:na]
	at org.hyperledger.fabric.sdk.Channel.getLatestBlock(Channel.java:1274) [fabric-sdk-java-1.0.1.jar:na]
	at org.hyperledger.fabric.sdk.Channel.getLastConfigIndex(Channel.java:1097) [fabric-sdk-java-1.0.1.jar:na]
	at org.hyperledger.fabric.sdk.Channel.getConfigurationBlock(Channel.java:1028) [fabric-sdk-java-1.0.1.jar:na]
	at org.hyperledger.fabric.sdk.Channel.parseConfigBlock(Channel.java:949) [fabric-sdk-java-1.0.1.jar:na]
	at org.hyperledger.fabric.sdk.Channel.initialize(Channel.java:676) [fabric-sdk-java-1.0.1.jar:na]
```
- 目前CA添加tls注册用户登记是正常的,从CA登记的管理员相关秘钥已经返回。
- 错误出现在构建通道，相关的peer和order已经使用了Properties属性。。。
- 错误需要继续定位，先记录下来。

#### 问题解决
- **根据昨天定位思路，查找在peer和order的Properties的属性里发现设置有问题，结合到官方测试例子的的写法**

```
 ordererProperties.setProperty("hostnameOverride", 填写对应orderer或者peer的名字);
```
- **目前fabric的javasdk还不是很好使用，官方只有测试用例，需要从测试用例里梳理使用的代码流程结合到自己的业务里去，还没看到过像样的例子提供。报错信息提示也比较隐晦。。比较坑**

#### hyperledger fabric技术交流群

- 到期或者失效，发邮件(lg.json@gmail.com)给我你微信，拉你进群。

![](https://raw.githubusercontent.com/zhulg/allpic/master/weixin.png)