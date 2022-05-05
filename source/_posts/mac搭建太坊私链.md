---
title: mac搭建以太坊私链
tags: 区块链
categories: 区块链
toc: true
abbrlink: 9685
date: 2018-06-11 22:24:51
---

- 搭建以太坊私链，需要安装geth
- 创建自己的私链存储目录，并创建个datadir目录。

#### 1，添加传世区块配置文件 
- cd 到自己私链目录下，vim genesis.json ，与datadir同级位置
<!-- more -->

```
{  
     "config": {
       "chainId": 1000,
       "homesteadBlock": 0,
       "eip155Block": 0,
       "eip158Block": 0
                },
     "nonce": "0x0000000000000061",
     "timestamp": "0x0",
     "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000", 
     "gasLimit": "0x8000000",   
     "difficulty": "0x100",    
     "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
     "coinbase": "0x3333333333333333333333333333333333333333",
     "extraData": "0x00000000",
     "alloc": {}
}
```
- 相关参数说明（网上搜索，注意extraData格式不对会报错）

```
chainId: 以太坊主网chainId为0，私链自己修改为一个任意Id。
mixhash: 与nonce配合用于挖矿，由上一个区块的一部分生成的hash。注意和nonce的设置需要满足以太坊的黄皮书, 4.3.4. Block Header Validity, (44)章节所描述的条件。
nonce: nonce就是一个64位随机数，用于挖矿，注意他和mixhash的设置需要满足以太坊的黄皮书,4.3.4. Block Header Validity, (44)章节所描述的条件。
difficulty: 设置当前区块的难度，如果难度过大，cpu挖矿就很难，这里设置较小难度
alloc: 用来预置账号以及账号的以太币数量，因为私有链挖矿比较容易，所以我们不需要预置有币的账号，需要的时候自己创建即可以。
coinbase: 矿工的账号，随便填
timestamp: 设置创世块的时间戳
parentHash: 上一个区块的hash值，因为是创世块，所以这个值是0
extraData: 附加信息，随便填，可以填你的个性信息(需要二进制)
gasLimit: 值设置对GAS的消耗总量限制，用来限制区块能包含的交易信息总和，因为我们是私有链，所以填最大
```

#### 2，初始化以太坊节点
```
$ geth --datadir datadir init  genesis.json
```
#### 3，启动私链的以太坊节点

```
$ geth --datadir  datadir --networkid 1000 console
```

#### 4，进入后主要操作，可以尝试以下命令观察输出

```
admin
eth
personal
miner
```
- 查看和添加账户

```
> eth.accounts
[]
> personal.newAccount("12345678")
"0x23f740f09cbafa5376bc985f055f356d629cf2ad"
> eth.accounts
["0x23f740f09cbafa5376bc985f055f356d629cf2ad"]
```

#### 5，退出 exit

#### 6，查看刚才目录下生成的文件

```
private_net/
├── datadir
│   ├── geth
│   │   ├── LOCK
│   │   ├── chaindata
│   │   │   ├── 000002.ldb
│   │   │   ├── 000003.log
│   │   │   ├── CURRENT
│   │   │   ├── LOCK
│   │   │   ├── LOG
│   │   │   └── MANIFEST-000004
│   │   ├── lightchaindata
│   │   │   ├── 000001.log
│   │   │   ├── CURRENT
│   │   │   ├── LOCK
│   │   │   ├── LOG
│   │   │   └── MANIFEST-000000
│   │   ├── nodekey
│   │   ├── nodes
│   │   │   ├── 000001.log
│   │   │   ├── CURRENT
│   │   │   ├── LOCK
│   │   │   ├── LOG
│   │   │   └── MANIFEST-000000
│   │   └── transactions.rlp
│   ├── history
│   └── keystore
│       └── UTC--2018-06-11T14-17-50.790843570Z--23f740f09cbafa5376bc985f055f356d629cf2ad
└── genesis.json

```





