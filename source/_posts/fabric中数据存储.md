---
title: fabric中数据存储
date: 2018-04-10 15:49:17
tags: 区块链
categories: 区块链
toc: true
---
### fabric中默认存储库levelDb

#### 存储设计
- 要达到数据不可篡改首先从数据结构上来看是一个链式存储，也是区块链之所以称之为区块链的原因。
- 每个存储单元包含上一存储单元的hash值以及自身存储的交易数据块，可以从表象来看就像把所有数据块连接在一起，称之为“区块链”，形成链状可追述的交易记录。
- 这种链状结构的数据称之为账本数据，保存着所有交易的记录，有普通文件保存，还有一个“世界状态”，其实质为Key-Value数据库，维护着交易数据的最终状态，便于查询等操作运算，并且每个数据都有其对应的版本号。

<!-- more -->

#### 存储实现
- Hyperledger fabric(HLF)的存储系统和比特币一样，也是由普通的文件和 kv 的数据库 **（levelDB/couchDB）组成**
- Hyperledger fabric中，每个 channel 对应一个账本目录，在账本目录中由 blockfile_000000、blockfile_000001 命名格式的文件名组成。为了快速检索区块数据每个文件的大小是64M。每个区块的数据（区块头和区块里的所有交易）都会序列成字节码的形式写入 blockfile 文件中。
- 进入peer节点内可以查看到
![](https://raw.githubusercontent.com/zhulg/allpic/master/fabric_leveldb.png)

- 在序列化的过程中，程序以 append 方式打开 blockfile 文件，然后将区块大小和和区块数据写入至 blockfile 文件中。
以下是区块数据写入的具体描述：

```
1.写入区块头数据，依次写入的数据为区块高度、交易哈希和前一个区块哈希；

2. 写入交易数据，依次写入的数据为区块包含交易总量和每笔交易详细数据；

3. 写入区块的Metadata 数据，依次写入的数据为 Metadata 数据总量和每个 Metadata 项的数据详细信息。
```

- 在写入数据的过程中会以 kv 的形式保存区块和交易在 blockfile 文件中的索引信息，以方便 HLF 的快速查询。

- HLF 区块索引信息格式在 kv 数据库中存储的最终的 LevelKey 值有前缀标志和区块 hash 组成，而 LevelValue 的值由区块高度，区块 hash，本地文件信息(文件名，文件偏移等信息)，每个交易在文件中的偏移列表和区块的 MetaData 组成， HLF 按照特定的编码方式将上述的信息拼接成 db 数据库中的 value 。

- HLF交易索引信息格式在kv数据库中存储最终的LevelKey值由channel_name，chaincode_name和chaincode中的key值组合而成：

```
LevelKey = channel_name+chaincode_name+key(具体规则有待考证)
```
而 LevelValue 的值由BlockNum 区块号，TxNum 交易在区块中的编号组成， HLF 通过将区块号和交易编号按照特定的方式编码，然后与 chaincode 中的 value 相互拼接最终生成 db 数据库中的 value 。

#### hyperledger fabric技术交流群

- 到期或者失效，发邮件(lg.json@gmail.com)给我你微信，拉你进群。

![](https://raw.githubusercontent.com/zhulg/allpic/master/weixin.png)