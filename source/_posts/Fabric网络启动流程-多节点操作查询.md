---
title: Fabric网络启动流程-多节点操作查询
date: 2018-03-23 18:29:29
tags: [fabric,区块链]
---


- 基于fabric-samples/first-network下手动网络启动相关文件生成和配置。
- [待上篇分析继续](https://zhulg.github.io/2018/03/13/fabric%E7%BD%91%E7%BB%9C%E5%90%AF%E5%8A%A8%E6%B5%81%E7%A8%8B-%E5%88%86%E6%AD%A5%E5%88%86%E6%9E%90/#more)

#### 在其他节点上进行操作
- 上篇分析中使用的是单个几点peer0.org1.example.com:7051上进行的操作。
- 在这个网络中有2个组织，4个节点，在cli的配置里可以看到如下默认的配置，对应peer0.org1.example.com:7051

<!-- more -->

```
peer.org1.example.com:7051
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ADDRESS=peer0.org1.example.com:7051
CORE_PEER_LOCALMSPID=Org1MSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt

```
- 在创建完通道后，需要在其他几点上部署链码前，需要设置cli的环境，对应成新的节点。并把该peer添加到channel里
- 例如：添加 peer1.org1.example.com:7051 节点

```
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
CORE_PEER_ADDRESS=peer1.org1.example.com:7051
CORE_PEER_LOCALMSPID="Org1MSP"
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer1.org1.example.com/tls/ca.crt

```
- 需要设置上述环境在cli bash里，并添加peer到channel( peer channel join -b xxx.block)

#### 在新节点初始化chaincode

```
peer chaincode install -n mycc -v 1.0 -p github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02

```

#### 在节点上实例化chaincode

- 链码实例化一次

```
peer chaincode instantiate -o orderer.example.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C $CHANNEL_NAME -n mycc -v 1.0 -c '{"Args":["init","a", "100", "b","200"]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

```

#### 切换节点进行查询和执行
- 在cli bash里操作调用和查询，发现数据在不同节点是一致的。

 ![](https://raw.githubusercontent.com/zhulg/allpic/master/fabric_network2.png)

