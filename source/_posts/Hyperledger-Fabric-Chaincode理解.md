---
title: Hyperledger Fabric Chaincode汇总
date: 2018-03-01 10:43:44
tags: 区块链
categories: 区块链
toc: true
---
#### chaincode是什么
- 是一个类，这个类要实现fabric预先定义的一个接口。
- 它部署在fabric系统的结点上，Chaincode程序是依赖于fabric系统结点的。
- Chaincode可通过应用提交的交易对账本状态初始化并进行管理，是生成Transaction的唯一来源，是外界与Fabric区块链交互的唯一渠道。
- Fabric中，Chaincode就是开发者实现智能合约的方式。（智能合约就是用程序实现合约的内容，并且这个程序是事件驱动、有状态的）。

#### chaincode相关联的几个概念

- Channel:通道，⼦链。同⼀peer可加⼊不同channel。Chaincode的操作基于channel进⾏。同⼀channel上的peer结点同步其上chaincode执⾏的结果。
- Endorser:（模拟）执⾏Chaincode。分离计算任务，减轻consensus节点负担，增加吞吐量。⽀持endorsement policy，更加灵活。
- Orderer: 对chaincode执⾏结果consensus。⽀持solo/ka|a/sBFT不同的ordering策略。
-Committer:将chaincode执⾏结果写进ledger。

<!-- more -->
#### chaincode 编写
- 实现这个Fabric的接口
```
type Chaincode interface {
    // Init is called during Instantiate transaction after the chaincode container
    // has been established for the first time, allowing the chaincode to
    // initialize its internal data
    Init(stub ChaincodeStubInterface) pb.Response

    // Invoke is called to update or query the ledger in a proposal transaction.
    // Updated state variables are not committed to the ledger until the
    // transaction is committed.
    Invoke(stub ChaincodeStubInterface) pb.Response
}
```
- 例如
```
package	main	
import	(	
"errors"	
"fmt"	
"github.com/hyperledger/fabric/core/chaincode/shim"	
)	
type SimpleChaincode struct	{	}
func (t *SimpleChaincode)	Init(stub shim.ChaincodeStubInterface,funcGon string, args []string)([]byte,error)
func	(t	*SimpleChaincode)	Invoke(stub shim.ChaincodeStubInterface,funcGon string,args[]string)([]byte,error)
func main()	{	
err	:= shim.Start(new(SimpleChaincode))	
if	err	!=	nil	{	
	 	fmt.Prinn("Error	starGng	Simple	chaincode:	%s",	err)	
}	
}
```
#### chaincode 生命周期
- chaincode生命周期的命令：package, install, instantiate,upgrade。在未来的版本中会添加stop和start交易的指令，以便能方便地停止与重启chaincode，而不用非要真正卸载它才行。在成功安装与实例化chaincode后，chaincode就处于运行状态，接着就可以用invoke交易指令来处理交易了。一段chaincode可以在安装后的任何时间被更新。

<!-- more -->

#### chaincode操作
- 进入开发者模式进行操作，确保已经下载过fabric-samples的例子代码（官网github上）
- cd chaincode-docker-devmode
- docker-compose-simple.yaml peer容器（ command: peer node start --peer-chaincodedev=true -o orderer:7050）有一个 --peer-chaincodedev标识，在构建peer node的时候传递这个标识，可以不使用Docker容器部署chaincode。
- (启动网络)

```
docker-compose -f docker-compose-simple.yaml up
```
- docker ps 可以看到需要的容器

```
CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                                            NAMES
46c8bcf1c57a        hyperledger/fabric-tools     "/bin/bash -c ./scri…"   4 hours ago         Up 4 hours                                                           cli
c1ade7741693        hyperledger/fabric-ccenv     "/bin/bash -c 'sleep…"   4 hours ago         Up 4 hours                                                           chaincode
01cdf578d4bb        hyperledger/fabric-peer      "peer node start --p…"   4 hours ago         Up 4 hours          0.0.0.0:7051->7051/tcp, 0.0.0.0:7053->7053/tcp   peer
c57803b7d3e9        hyperledger/fabric-orderer   "orderer"                4 hours ago         Up 4 hours          0.0.0.0:7050->7050/tcp                           orderer

```

- 进入chaincode docker
```
docker exec -it chaincode bash
root@c1ade7741693:/opt/gopath/src/chaincode# ls
chaincode_example02  fabcar  marbles02  sacc
root@c1ade7741693:/opt/gopath/src/chaincode# cd sacc
root@c1ade7741693:/opt/gopath/src/chaincode/sacc# ls
sacc  sacc.go
root@c1ade7741693:/opt/gopath/src/chaincode/sacc#
```
- cd sacc

```
go build
```
- 现在运行chaincode：

```
CORE_PEER_ADDRESS=peer:7051 CORE_CHAINCODE_ID_NAME=mycc:0 ./sacc
```
- 另起一个终端

```
docker exec -it cli bash
peer chaincode install -p chaincodedev/chaincode/sacc -n mycc -v 0
peer chaincode instantiate -n mycc -v 0 -c '{"Args":["a","10"]}' -C myc
```
- 以上步骤，会把chaincode初始化到peer节点的文件系统中，位置在peer容器里的var/hyperledger/production/chaincodes下面，instantiate时从这个地方实例化
- '-c‘参数指定的函数名和参数，-v 版本，-C 通道名称 -n 链码名称
- 现在我们执行一次将a的值设为20的调用：
```
peer chaincode invoke -n mycc -c '{"Args":["set", "a", "20"]}' -C myc
```
- 最后查询a的值，我们会看到20。
```
peer chaincode query -n mycc -c '{"Args":["query","a"]}' -C myc
```
#### chaincode 更新
- chaincode的更新过程目前验证是这样的

```
1,需要重新启动下自己的chaincode代码，CORE_PEER_ADDRESS=peer:7051 CORE_CHAINCODE_ID_NAME=mycc:输入新版本号 ./sacc
2,peer chaincode install -p chaincodedev/chaincode/sacc -n mycc -v 新版本号
3,peer chaincode upgrade -n mycc -v 新版本号 -c '{"Args":["a","10"]}' -C myc

```
- 以上比较不理解的是需要从新启动下新版本对应的chaincode才行，否则在更新时会报找不到
```
Error: Error endorsing chaincode: rpc error: code = Unknown desc = Failed to init chaincode(handler not found for chaincode mycc:xxx)
```

