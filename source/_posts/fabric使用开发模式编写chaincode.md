---
title: fabric使用开发模式编写chaincode
date: 2018-03-28 17:40:22
tags: [fabric,区块链,chaincode]
---

#### 在开发者模式下编写调试chaincode

- 在fabric-examples下提供有开发者模式，编译快速对chaincode的编写。
- 进入chaincode-docker-devmode，基于docker方式快速构建一个开发模式的网络。

```
docker-compose -f docker-compose-simple.yaml up
```
<!-- more -->

- 在这个yaml里可以看到关键信息，在peer容器里命令标志用于设置开发者模式 command: peer node start --peer-chaincodedev=true -o orderer:7050

- 网络启动后可以看到

```
CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                                            NAMES
3d089e92ccc5        hyperledger/fabric-ccenv     "/bin/bash -c 'sleep…"   44 minutes ago      Up 44 minutes                                                        chaincode
c6e93a9603f9        hyperledger/fabric-tools     "/bin/bash -c ./scri…"   44 minutes ago      Up 44 minutes                                                        cli
84a87f2f2ab2        hyperledger/fabric-peer      "peer node start --p…"   44 minutes ago      Up 44 minutes       0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp   peer
2d4e748b5041        hyperledger/fabric-orderer   "orderer"                44 minutes ago      Up 44 minutes       0.0.0.0:7050->7050/tcp                           orderer
```

#### 启动网络并运行链码

- 具体信息可以看ymal里的配置，可以看到创建了myc通道，和一个peer,order节点
- 进入chaincode容器 docker exec -it chaincode bash
- 编译（go build）并启动chaincode
```
CORE_PEER_ADDRESS=peer:7051 CORE_CHAINCODE_ID_NAME=mycc:0 ./chaincode_example02
```
#### 实例化链码和查询

```
docker exec -it cli bash
peer chaincode install -n mycc -v 0 -p  chaincodedev/chaincode/chaincode_example02
peer chaincode instantiate -n mycc -v 0 -c '{"Args":["init","a","100","b","200"]}' -o orderer:7050 -C myc
peer chaincode invoke -n mycc -c '{"Args":["invoke","a","b","10"]}' -o orderer:7050 -C myc
peer chaincode query -n mycc -c '{"Args":["query","a"]}' -o orderer -C myc
```