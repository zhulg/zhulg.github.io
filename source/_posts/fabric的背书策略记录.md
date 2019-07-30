---
title: fabric的背书策略记录
date: 2018-03-20 11:14:22
tags: [fabric,区块链]
---

- 在fabric中，共识过程意味着多个节点对于某一批交易的发生顺序、合法性以及它们对账本状态的更新结构达成一致的观点。满足共识则意味着多个节点可以始终保证相同的状态，对于以同样顺序到达的交易可以进行一致的处理。
- fabric中的共识包括背书、排序和验证三个环节的保障。

<!-- more -->
#### 什么是背书策略
- chaincode在实例化的时候，需要指定背书策略。这里的背书策略就是需要什么节点背书交易才能生效。
- 发起交易的时候，发起端（一般是SDK），需要指定交易发给哪些节点进行背书验证（fabric不会自动发送），而是由sdk发送。发送后等待背书节点的返回，收集到足够的背书后将交易发送给orderer（排序节点或称共识节点）进行排序打包分发。最后，当每个Peer接受到block数据后，会对其中的交易进行验证，如果交易不符合背书策略，就不会在本地生效，所以真正验证背书是在这一步。
- 背书策略用于指示区块链节点交易验证的规则。作为交易验证流程的一部分，当背书节点收到一个交易请求的时候, 该节点会调用 VSCC (验证用途的系统合约程序) 并与执行交易的合约相关联。为了确定交易的有效性，一个交易应该包含来自尽可能多的背书节点的一个或多个背书。VSCC用于判定下面的内容：

```
所有背书是有效的 (即它们是来自预期消息上的有效证书的有效签名)
得到一定数量的背书
背书来自预期的来源（指定背书节点
```
- 背书策略就是用来定义上边的第二和第三点。

#### 背书策略设计

- 背书策略有两个主要组成部分：

```
主体principal
阀门threshold gate
```
- P 标识期望背书的区块链节点

- T 有两个输入参数：整数t（背书数量）和n （背书节点列表），即满足t的条件，并得到n的背书。

例如:

T(2, 'A', 'B', 'C') 请求来自'A'、'B'、'C'的任意2个背书节点的签名
T(1, 'A', T(2, 'B', 'C')) 请求来自A或来自B和C中的一个签名

#### 命令行下的背书策略语法

- 在Fabric CLI中，使用了一种简单的boolean表达式来解释Endorse节点的背书策略。
- Fabric 1.0使用MSP（成员管理服务）来描述主体principal，该MSP用于验证签名者的身份以及签名者在该MSP内所具有的权限。目前，支持两种角色：成员和管理员。 主体Principals的通用表现形式是MSP.ROLE，其中MSP是指MSP 的ID，ROLE是 member 或admin。 一个有效主体的示例是“Org0.admin”（Org0 MSP的任意管理员）或“Org1.member”（Org1 MSP的任意成员）。命令行语法是这样的：

```
EXPR(E[, E...])

其中EXPR可以是AND或OR，代表两个boolean表达式，E是主体或对EXPR的另一个嵌套调用。

```
- 例如：
```
AND('Org1.member', 'Org2.member', 'Org3.member') 请求三个背书节点的签名
OR('Org1.member', 'Org2.member') 请求两个背书节点中的任意一个的签名
OR('Org1.member', AND('Org2.member', 'Org3.member')) 请求来自Org1 MSP成员或来自Org2 MSP成员和来自Org3 MSP成员的任意一个签名
指定智能合约的背书策略
```

#### 部署合约的开发人员可以指定背书策略来验证执行的合约。

- 默认策略需要来自DEFAULT MSP成员的一个签名。如果未在CLI中指定策略，则默认使用此选项。
- 背书策略可以在部署合约时使用-P选项指定，后面跟策略内容。
- 例如：
```
peer chaincode deploy -C testchainid -n mycc -p http://github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02 -c '{"Args":["init","a","100","b","200"]}' -P "AND('Org1.member', 'Org2.member')"
```
执行这条命令将在testchainid这条链上使用背书策略AND('Org1.member', 'Org2.member').部署智能合约mycc