---
title: Fabric工作机制及核心组件总结
date: 2018-08-22 10:57:52
tags: 区块链
categories: 区块链
toc: true
---

- 通过总结来进一步检验对fabric工作机制及底层数据存储和上链过程的认识，加深对fabric的理解和认识。
- 个人总结记录（如错误欢迎指正lg.json@gmail.com)

<!-- more -->

## 一, fabric1.0之后的运行架构

![](https://raw.githubusercontent.com/zhulg/allpic/master/fabric10.png)

- **登记证书（0 Enroll):** 使用fabric SDK向CA获取用户的证书（图上membership 服务，就是上图中的注册登记、身份认证，CA是MSP的实现）
- **发送提案(1 Endrose proposal)：** 拿到正式根据背书策略发送提案到背书节点（背书策略在chaincode实例化时已经指定），到背书节点后会进行证书验证，并模拟计算chaincode里相关代码。
- **返回背书内容（图上没表示出来):** 背书节点会把背书内容返回给客户端,客户端会收集到相关背书节点的背书内容，验证背书节点有效性（有几个背书节点要收到几个节点背书内容）
- **提交交易到order(2 Submit Transaction/ 3 Relay Submit tX):** 提交事务到order里，图上显示是先到peer上，在转播到order,实际是直接到order上,order对交易进行排序，根据出块策略进行出块。
- **传递区块(4 Deliver batch)**将排序后的区块Deliver到leader peer上, 底层通过gossip协议进行同步到各节点，节点再次验证计算结果，与之前计算一致，就写人到Ledger，写完账本通过event通知到客户端。

## 二，fabric交易流程
![](https://hyperledger-fabric.readthedocs.io/en/release-1.2/_images/flow-4.png)

- **交易流程基本上也展示了fabric在运行时的架构，在官网的这个图上可以比较详细看到交易涉及的流程** [参考另一篇笔记](https://zhulg.github.io/2018/04/04/fabric%E4%BA%A4%E6%98%93%E6%B5%81%E7%A8%8B%E6%A6%82%E8%BF%B0/)

## 三，fabric数据存储方式及数据结构

- fabric的数据是一个个数据块组成链式结构，第一个区块为创世区块，后边区块链接上一个区块的hash头部区块
- 每一个区块有区块头和区块体组成，区块体里存储交易的数据。

#### 1,区块构成
![](https://raw.githubusercontent.com/zhulg/allpic/master/fabic_block-structure.png)

- 区块头部分:有当前number,上一个区块hash，当前区块体数据hash。- 区块数据:包含多条交易数据- 区块元数据:包含4种元数据，SIGNATURES、 LAST_CONFIG、ORDERER和TRANSACTIONS_FILTER，前三个是Order service添加进去的，最后一个是Committer添加的。
- [参考更多介绍](https://blockchain-fabric.blogspot.com/2017/04/hyperledger-fabric-v10-block-structure.html) 

#### 2,Fabric账本结构
- fabric的账本存在与每一个peer里，数据存储分为文件存储和数据库（leveldb,couchdb）,文件存储部分用来存储区块数据，写入到BlockFile_xx中
- 先通过一个图看下账本基本结构，进入peer容器里，到/var/hyperledger/production/ledgersData下。(这个使用了couchdb所以下边没有stateLeveldb)

```
root@1658e694975d:/var/hyperledger/production# tree ledgersData/
ledgersData/
|-- chains
|   |-- chains
|   |   `-- gomevisionchannel
|   |       |-- blockfile_000000
|   |       |-- blockfile_000001
|   |       |-- blockfile_000002
|   |       |-- blockfile_000003
|   |       |-- blockfile_000004
|   |       |-- blockfile_000005
|   |       |-- blockfile_000006
|   |       |-- blockfile_000007
|   |       |-- blockfile_000008
|   |       `-- blockfile_000009
|   `-- index
|       |-- 000168.ldb
|       |-- 000237.ldb
|       |-- 000238.ldb
|       |-- 000239.ldb
|       |-- 000240.ldb
|       |-- 000241.ldb
|       |-- 000242.ldb
|       |-- 000243.ldb
|       |-- 000244.ldb
|       |-- 000245.ldb
|       |-- 000246.ldb
|       |-- 000247.ldb
|       |-- 000248.ldb
|       |-- CURRENT
|       |-- LOCK
|       |-- LOG
|       `-- MANIFEST-000263
|-- historyLeveldb
|   |-- 000010.log
|   |-- 000012.ldb
|   |-- CURRENT
|   |-- LOCK
|   |-- LOG
|   `-- MANIFEST-000011
`-- ledgerProvider
    |-- 000002.ldb
    |-- 000005.log
    |-- CURRENT
    |-- LOCK
    |-- LOG
    `-- MANIFEST-000006

```

- chains：chains/chains下包含的mychannel是对应的channel的名称，因为Fabric是有多channel的机制，而channel之间的账本是隔离的，每个channel都有自己的账本空间。
- chains/index下面包含的是levelDB数据库文件，DB中存储的是区块索引部分。（从indexDB中读取Block的位置信息（blockfile的编号、位置偏移量，打开对应的blockfile，位移到指定位置，读取Block数据）
- stateLeveldb：存储的是链码 putstate写入的数据(我这个用的couchdb所以没有出现)
- ledgerProvider：数据库内存储的是当前节点所包含channel的信息。主要是为了Fabric的多channel机制服务的;
- historyLeveldb：数据库内存储的链码写入的key的历史记录的索引地址。


## 四，Fabric数据交易结构

- **数据交易的结构在源码 protos/common/common.pb.go，交易的封装即Envelope结构体**
- **Envelope直译为信封，封装Payload和Signature。Payload为有效负荷，又包括Header和Data,其中Header又包括ChannelHeader，SignatureHeader**

```go
// Envelope wraps a Payload with a signature so that the message may be authenticated
type Envelope struct {
	// A marshaled Payload
	Payload []byte `protobuf:"bytes,1,opt,name=payload,proto3" json:"payload,omitempty"`
	// A signature by the creator specified in the Payload header
	Signature []byte `protobuf:"bytes,2,opt,name=signature,proto3" json:"signature,omitempty"`
}

```

- **Payload结构体：**

```go
type Payload struct {
    Header *Header //Header
    Data []byte //Transaction序列化
}

```

- **Payload里Header结构：**

```go
type Header struct {
	ChannelHeader   []byte `protobuf:"bytes,1,opt,name=channel_header,json=channelHeader,proto3" json:"channel_header,omitempty"`
	SignatureHeader []byte `protobuf:"bytes,2,opt,name=signature_header,json=signatureHeader,proto3" json:"signature_header,omitempty"`
}
```

- 网上一张比较直观交易结构图，交易的数据结构进行了划分。
![](https://raw.githubusercontent.com/zhulg/allpic/master/fabric_tx_struct.png)


- **Transaction相关结构体**


```go
type Transaction struct {
    Actions []*TransactionAction //Payload.Data是个TransactionAction数组，容纳每个交易
}
//代码在protos/peer/transaction.pb.go
```

- s**TransactionAction结构体：**

```go
type TransactionAction struct {
    Header []byte
    Payload []byte
}
//代码在protos/peer/transaction.pb.go
```

- **ChaincodeActionPayload相关结构体**


```go
type ChaincodeActionPayload struct {
    ChaincodeProposalPayload []byte
    Action *ChaincodeEndorsedAction
}
//代码在protos/peer/transaction.pb.go
```

- **ChaincodeEndorsedAction结构体：**

```go
type ChaincodeEndorsedAction struct {
    ProposalResponsePayload []byte //ProposalResponsePayload序列化
    Endorsements []*Endorsement
}
//代码在protos/peer/transaction.pb.go
```

- **ProposalResponsePayload结构体：**

```go
type ProposalResponsePayload struct {
    ProposalHash []byte
    Extension []byte //ChaincodeAction序列化
}
//代码在protos/peer/proposal_response.pb.go
```

- **ChaincodeAction结构体：**

```go
type ChaincodeAction struct {
    Results []byte //TxRwSet序列化
    Events []byte
    Response *Response
    ChaincodeId *ChaincodeID
}
//代码在protos/peer/proposal.pb.go
```

## 五，Fabric的智能合约chaincode

- **Fabric项目中提供了用户链码和系统链码**
- 用户chaincode运行在单独的容器中，提供对上层应用的支持，系统chaincode则嵌入在系统内，提供对系统进行配置、管理的支持。
- 开发过程中通过调用chaincode达到对账本的操作。
- 系统chaincode则维护整改交易过程中的各个环节操作。
- 参考网上一张图用于说明

  ![](https://raw.githubusercontent.com/zhulg/allpic/master/fabric_chaincode.png)
- chaincode有对应的生命周期，install, instantiate,invoke,query,upgrade等操作，声明周期有系统链码LSCC进行管理
- chaincode初始化会把chaincode放到各个peer内部。

#### 用户chaincode生成容器方式与peer交互

- **书写用户链码2个重要的方法**
```
Init：当链码收到实例化（instantiate）或者升级（update）类型的交易时，Init被调用。 
Invoke：当链码收到调用（invoke）或者查询（query）类型的交易时，invoke方法被调用。
```

- **用户链码容器通过Grpc与peer进行通信，链码容器启动后，会向Peer节点进行注册，gRPC地址为/protos.ChaincodeSupport/Register，消息为ChaincodeMessage结构**

```go
type ChaincodeMessage struct {
	Type      ChaincodeMessage_Type       `protobuf:"varint,1,opt,name=type,enum=protos.ChaincodeMessage_Type" json:"type,omitempty"`
	Timestamp *google_protobuf1.Timestamp `protobuf:"bytes,2,opt,name=timestamp" json:"timestamp,omitempty"`
	Payload   []byte                      `protobuf:"bytes,3,opt,name=payload,proto3" json:"payload,omitempty"`
	Txid      string                      `protobuf:"bytes,4,opt,name=txid" json:"txid,omitempty"`
	Proposal  *SignedProposal             `protobuf:"bytes,5,opt,name=proposal" json:"proposal,omitempty"`
	// event emitted by chaincode. Used only with Init or Invoke.
	// This event is then stored (currently)
	// with Block.NonHashData.TransactionResult
	ChaincodeEvent *ChaincodeEvent `protobuf:"bytes,6,opt,name=chaincode_event,json=chaincodeEvent" json:"chaincode_event,omitempty"`
	// channel id
	ChannelId string `protobuf:"bytes,7,opt,name=channel_id,json=channelId" json:"channel_id,omitempty"`
}
```

## Order组件
- 待完成

## MSP

- 待完成