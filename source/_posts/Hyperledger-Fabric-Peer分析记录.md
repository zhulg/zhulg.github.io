---
title: Hyperledger-Fabric-Peer分析记录
tags: 区块链
categories: 区块链
toc: true
abbrlink: 46484
date: 2018-08-31 14:39:56
---

## Fabric Peer分析


- peer节点负责fabric中的交易背书和提交，每个peer里包含一个账本
- peer节点之间通过Grpc进行通信，peer的常用角色类型为：

```
- Endorser（背书者）：负责对来自客户端的交易提案进行检查和背书。
- Committer（提交者）：负责检查交易请求，执行交易并维护区块链和账本结构。
```
- peer代码目录


```
peer
├── chaincode 
├── channel
├── clilogging //peer clilogging命令及子命令实现
├── common
├── gossip //gossip最终一致性算法相关代码
├── main.go //peer命令入口
├── main_test.go
├── mocks
├── node
├── testdata
└── version

```
## Peer启动分析
- 待完成