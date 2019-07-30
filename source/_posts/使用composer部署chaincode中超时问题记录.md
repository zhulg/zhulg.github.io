---
title: 使用composer部署chaincode中超时问题记录
date: 2018-07-05 00:09:48
tags: [fabric,composer]
---

- 使用composer进行部署chaincode，构建chaincode镜像时出现超时问题。
- 错误日志 **Response from attempted peer comms was an error: Error: REQUEST_TIMEOUT**
- 之前遇到过按照网上说法，设置yaml里peer上chaincode的超时时间有300改为1200，有时能解决，最近发现问题根源和有更简单处理方式。
<!-- more -->

- 一般执行composer network start xxx时出现

```
Starting business network definition. This may take a minute...
Error: Error trying to start business network. Error: No valid responses from any peers.
Response from attempted peer comms was an error: Error: REQUEST_TIMEOUT
Command failed
```

#### 最新解决方案

- 之前解决过该问题，多设置超时，这个方案不靠谱。从出错的日志看，其实是npm要下载模块，进行构建image。但是npm这个东西国内。。。
- 所以需要设置npm代理源，看到官网上有给出设置的方法[参见设置npm代理](https://hyperledger.github.io/composer/latest/managing/connector-information)

- 步骤：

```
1，创建文件npmConfig，内容添加 registry=https://registry.npm.taobao.org
2，在文件目录下重新执行 composer network install --card PeerAdmin@hlfv1  --archiveFile my-network@0.1.6.bna -o npmrcFile=npmConfig

```
- 执行完，在进行composer network start就非常快完成创建chaincode镜像和容器启动工作了。（fabric之前记得重启）