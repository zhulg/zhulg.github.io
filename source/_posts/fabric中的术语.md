---
title: fabric中的术语
tags: 区块链
categories: 区块链
toc: true
abbrlink: 50907
date: 2018-03-05 16:30:36
---

- Auditability（审计性）：在一定权限和许可下，可以对链上的交易进行审计和检查。
- Block（区块）：代表一批得到确认的交易信息的整体，准备被共识加入到区块链中。
- Blockchain（区块链）：由多个区块链接而成的链表结构，除了初始区块，每个区块头部都包括前继区块内容的 hash 值。
- Chaincode（链码）：区块链上的应用代码，扩展自“智能合约”概念，支持 golang、nodejs 等语言，多为图灵完备。
- Channel（通道）：Fabric 网络上的私有隔离。通道中的 chaincode 和交易只有加入该通道的节点可见。同一个节点可以加入多个通道，并为每个通道内容维护一个账本。
- Committer（提交节点）：1.0 架构中一种 peer 节点角色，负责对 orderer 排序后的交易进行检查，选择合法的交易执行并写入存储。


- Commitment（提交）：提交节点完成对排序后交易的验证，将交易内容写到区块，并更新世界观的过程。
- Confidentiality（保密）：只有交易相关方可以看到交易内容，其它人未经授权则无法看到。
- Endorser（推荐节点或背书节点）：1.0 架构中一种 peer 节点角色，负责检验某个交易是否合法，是否愿意为之背书、签名。
- Endorsement：背书过程。按照 chaincode 部署时候的 endorsement 策略，相关 peer 对交易提案进行模拟和检查，决策是否为之背书。如果交易提案获得了足够多的背书，则可以构造正式交易进行进一步的共识。
- Invoke（调用）：一种交易类型，对 chaincode 中的某个方法进行调用，一般需要包括调用方法和调用参数。
- Ledger（账本）：包括区块链结构（带有所有的交易信息）和当前的世界观（world state）。
- Member（成员）：代表某个具体的实体身份，在网络中有用自己的根证书。节点和应用都必须属于某个成员身份。同一个成员可以在同一个通道中拥有多个 peer 节点，其中一个为 leader 节点，代表成员与排序节点进行交互，并分发排序后的区块给属于同一成员的其它节点。
- MSP（Member Service Provider，成员服务提供者）：抽象的实现成员服务（身份验证，证书管理等）的组件，实现对不同类型的成员服务的可拔插支持。
- Non-validating Peer（非验证节点）：不参与账本维护，仅作为交易代理响应客户端的 REST 请求，并对交易进行一些基本的有效性检查，之后转发给验证节点。
- Orderer（排序节点）：1.0 架构中的共识服务角色，负责排序看到的交易，提供全局确认的顺序。
- Permissioned Ledger（带权限的账本）：网络中所有节点必须是经过许可的，非许可过的节点则无法加入网络。
- Privacy（隐私保护）：交易员可以隐藏交易的身份，其它成员在无特殊权限的情况下，只能对交易进行验证，而无法获知身份信息。
- System Chain（系统链）：由对网络中配置进行变更的配置区块组成，一般可以用来作为组成网络成员们形成的联盟约定。
- Transaction（交易）：执行账本上的某个函数调用或者部署 chaincode。调用的具体函数在 chaincode 中实现。
- Transactor（交易者）：发起交易调用的客户端。
- Validating Peer（验证节点）：维护账本的核心节点，参与一致性维护、对交易的验证和执行。
- World State（世界状态）：即最新的全局账本状态。Fabric 用它来存储历史交易发生后产生的最新的状态，可以用键值或文档数据库实现。
- Anchor（锚点）：一般指作为刚启动时候的初始联络元素或与其它结构的沟通元素。如刚加入一个 channel 的节点，需要通过某个锚点节点来快速获取 channel 内的情况（如其它节点的存在信息）。
