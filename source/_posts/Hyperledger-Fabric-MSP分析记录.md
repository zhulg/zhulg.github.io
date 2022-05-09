---
title: Hyperledger-Fabric-MSP分析记录
tags: 区块链
categories: 区块链
toc: true
abbrlink: 7421
date: 2018-08-30 11:31:28
---

## fabric MSP功能及源码分析


- MSP是Membership Service Provider的缩写，直译为成员关系服务提供者。
- MSP作用就是负责区块链网络中对身份的管理和验证，在区块链网络中实现权限管理，包括下发、吊销及验证功能。
- MSP是一个提供抽象化成员操作框架的组件,CA是MSP的具体实现。



## msp常见结构

- 以下是一个MSP结构中常见的组成部分：

```
· 一组信任的根证书，是整个组织证书信任的基础，根证书可以签发中间层证书；
· MSP的管理员的身份证书，管理员可以对MSP中证书进行管理；
· 组织单元（Organizational Unit）列表（可选）；
· 一组信任的中间证书，中间证书由根证书签发（可选）； 
· 证书撤销列表，代表被吊销的证书名单（可选）。

```

- **图片来自官网**

![](https://hyperledger-fabric.readthedocs.io/en/release-1.2/_images/membership.diagram.5.png)

```
Root CAs | 根证书列表
此文件夹包含，由此MSP代表的组织信任的Root CA，自签名X.509证书列表。此MSP文件夹中必须至少有一个Root CA X.509证书。这是最重要的文件夹，因为它标识了所有其它证书。

Intermediate CAs | 中间证书列表
此文件夹包含此组织信任的Intermediate CA的X.509证书列表。每个证书都必须由MSP中的一个Root CA签署，或者由 Intermediate CA 签署。

Intermediate CA可以表示组织的不同细分或组织本身（例如，如果商业CA用于组织的身份管理）。在前一种情况下，可以使用CA层次结构中，较低的其他Intermediate CA来表示组织细分。请注意，可能有一个没有任何中间CA的功能网络，在这种情况下，此文件夹将为空。
与Root CA文件夹一样，此文件夹定义了中间证书。只有拥有了这些证书，才能被系统视为组织成员的CA。

Organizational Units (OUs) | 组织单元列表
可选的

Administrators | 管理员身份证书
该文件夹包含一个身份列表，用于定义具有该组织管理员角色的参与者。对于标准MSP类型，此列表中应该有一个或多个X.509证书。

Revoked Certificates | 撤销证书列表
可选的

KeyStore for Private Key | 私钥库
该文件夹为peer 或 orderer节点（或客户端的local MSP）的local MSP定义，并包含节点的signing key（签名密钥）。 此密钥用于签署数据，作为认可阶段的一部分。
该文件夹对Local MSP是必须的，并且必须包含一个私钥。 很明显，访问这个文件夹，只能由，对此peer有管理权限的用户。
Channel MSP的配置不包括此部分，因为Channel MSP旨在提供纯粹的身份验证功能，而不是签署能力。

TLS Root CA | TLS根证书列表
此文件夹包含，此组织为TLS通信所信任的Root CA的自签名X.509证书列表。 TLS通信的一个例子是，peer需要连接到orderer以便它可以接收ledger更新。
MSP TLS信息涉及网络内的节点，即对peers 和 the orderers，此文件夹中必须至少有一个TLS Root CA X.509证书。


TLS Intermediate CA | TLS中间证书
此文件夹包含由此MSP代表的，组织信任的用于TLS通信的Intermediate CA证书列表。当商业CA用于组织的TLS证书时，此文件夹特别有用。 它是可选的。
Fabric中MSP相关实现代码都在msp目录下，目前采用了bccspmsp结构来代表一个成员身份结构，并且采用了MSPConfig（主要是其成员FabricMSPConfig）结构来代表跟该实体相关的证书信息。

MSP中各实体资源的证书必须被证书信任树上的叶子节点签名。中间层签名的证书会被认为是非法实体证书。
```
 
 
## MSP实践操作
- MSP在Fabric中的作用是对用户进行管理，实践的基本步骤：

```
第一，生成MSP相关的证书和签名。
第二，在Peer，Orderer,Channel等组件的配置文件设置关于msp的相关信息
（即：通过crypto-config.yaml，然后配置到configtx.yaml，配置到相关peer,order）
```

- **实际操作中**

```
1. 编写crypto-config.yaml配置文件指定网络的拓扑结构和组织结构。
2. cryptogen-生成秘钥和证书文件。
快速地根据配置自动批量生成所需要的密钥和证书文件。
3. 编写依赖配置文件configtx.yaml。
该文件包含网络的定义，并给出了网络组件的每个网络实体的加密材料的存储位置。
4. configtxgen-生成通道配置。
在这个过程中，会生成系统channel的创世纪块。该创世纪块（genesis block）中包含所有MSP的验证元素。MSP验证元素有MSP身份标识（MSP identifier），root CAs，intermediate CAs，admin CAs，OU List，CRLs。

```

### 用cryptogen工具来生成的MSP需要用到的证书和相关文件。

- 主要包括各种证书和相关的签名。

```
org1.example.com/
├── ca     # 存放组织Org1的根证书和对应的私钥文件，默认采用EC算法，证书为自签名。组织内的实体将基于该根证书作为证书根。
│   ├── ca.org1.example.com-cert.pem
│   └── dfb841b77804d726eea25231ae5e89a31901ca0538688a6d764731148f0bdc5b_sk
├── msp    # 存放代表该组织的身份信息。
│   ├── admincerts         # 组织管理员的身份验证证书，被根证书签名。
│   │   └── Admin@org1.example.com-cert.pem
│   ├── cacerts # 组织的根证书，同ca目录下文件。
│   │   └── ca.org1.example.com-cert.pem
│   └── tlscacerts          # 用于TLS的CA证书，自签名。
│       └── tlsca.org1.example.com-cert.pem
├── peers   # 存放属于该组织的所有Peer节点
│   ├── peer0.org1.example.com    # 第一个peer的信息，包括其msp证书和tls证书两类。
│   │   ├── msp # msp相关证书   
│   │   │   ├── admincerts  # 组织管理员的身份验证证书。Peer将基于这些证书来认证交易签署者是否为管理员身份。
│   │   │   │   └── Admin@org1.example.com-cert.pem
│   │   │   ├── cacerts     # 存放组织的根证书
│   │   │   │   └── ca.org1.example.com-cert.pem
│   │   │   ├── keystore    # 本节点的身份私钥，用来签名
│   │   │   │   └── 59be216646c0fb18c015c58d27bf40c3845907849b1f0671562041b8fd6e0da2_sk
│   │   │   ├── signcerts   # 验证本节点签名的证书，被组织根证书签名 
│   │   │   │   └── peer0.org1.example.com-cert.pem
│   │   │   └── tlscacerts  # TLS连接用到身份证书，即组织TLS证书
│   │   │       └── tlsca.org1.example.com-cert.pem
│   │   └── tls # tls相关证书
│   │       ├── ca.crt      # 组织的根证书
│   │       ├── server.crt  # 验证本节点签名的证书，被组织根证书签名
│   │       └── server.key  # 本节点的身份私钥，用来签名
│   └── peer1.org1.example.com    # 第二个peer的信息，结构类似。（此处省略。）
│       ├── msp
│       │   ├── admincerts
│       │   │   └── Admin@org1.example.com-cert.pem
│       │   ├── cacerts
│       │   │   └── ca.org1.example.com-cert.pem
│       │   ├── keystore
│       │   │   └── 82aa3f8f9178b0a83a14fdb1a4e1f944e63b72de8df1baeea36dddf1fe110800_sk
│       │   ├── signcerts
│       │   │   └── peer1.org1.example.com-cert.pem
│       │   └── tlscacerts
│       │       └── tlsca.org1.example.com-cert.pem
│       └── tls
│           ├── ca.crt
│           ├── server.crt
│           └── server.key
├── tlsca    # 存放tls相关的证书和私钥。
│   ├── 00e4666e5f56804274aadb07e2192db2f005a05f2f8fcfd8a1433bdb8ee6e3cf_sk
│   └── tlsca.org1.example.com-cert.pem
└── users    # 存放属于该组织的用户的实体
    ├── Admin@org1.example.com    # 管理员用户的信息，其中包括msp证书和tls证书两类。
    │   ├── msp # msp相关证书
    │   │   ├── admincerts     # 组织根证书作为管理员身份验证证书 
    │   │   │   └── Admin@org1.example.com-cert.pem
    │   │   ├── cacerts        # 存放组织的根证书
    │   │   │   └── ca.org1.example.com-cert.pem
    │   │   ├── keystore       # 本用户的身份私钥，用来签名
    │   │   │   └── fa719a7d19e7b04baebbe4fa3c659a91961a084f5e7b1020670be6adc6713aa7_sk
    │   │   ├── signcerts      # 管理员用户的身份验证证书，被组织根证书签名。要被某个Peer认可，则必须放到该Peer的msp/admincerts目录下
    │   │   │   └── Admin@org1.example.com-cert.pem
    │   │   └── tlscacerts     # TLS连接用的身份证书，即组织TLS证书
    │   │       └── tlsca.org1.example.com-cert.pem
    │   └── tls # 存放tls相关的证书和私钥。
    │       ├── ca.crt       # 组织的根证书
    │       ├── server.crt   # 管理员的用户身份验证证书，被组织根证书签名
    │       └── server.key   # 管理员用户的身份私钥，被组织根证书签名。
    └── User1@org1.example.com    # 第一个用户的信息，包括msp证书和tls证书两类
        ├── msp # msp证书相关信息
        │   ├── admincerts   # 组织根证书作为管理者身份验证证书。
        │   │   └── User1@org1.example.com-cert.pem
        │   ├── cacerts      # 存放组织的根证书
        │   │   └── ca.org1.example.com-cert.pem
        │   ├── keystore     # 本用户的身份私钥，用来签名
        │   │   └── 97f2b74ee080b9bf417a4060bfb737ce08bf33d0287cb3eef9b5be9707e3c3ed_sk
        │   ├── signcerts    # 验证本用户签名的身份证书，被组织根证书签名
        │   │   └── User1@org1.example.com-cert.pem
        │   └── tlscacerts   # TLS连接用的身份证书，被组织根证书签名。
        │       └── tlsca.org1.example.com-cert.pem
        └── tls # 组织的根证书
            ├── ca.crt       # 组织的根证书
            ├── server.crt   # 验证用户签名的身份证书，被根组织证书签名
            └── server.key   # 用户的身份私钥用来签名。
```


## msp的作用域分类

- MSP出现在区块链网络中的两个地方：Channel配置（Channel MSP），以及本地（local MSP）。因此，MSP可以分为：local 和 channel MSPs

- **localMSP**
localMSP，是为节点（peer 或 orderer）和用户（使用CLI或使用SDK的客户端应用程序的管理员）定义的。每个节点和用户都必须定义一个localMSP，以便在加入区块链的时候，进行权限验证。

- **channelMSP（globalMSP)**
channel MSP在channel层面定义管理和参与权。参与Channel的每个组织，都必须为其定义MSP。Channel上的Peers 和 orderers将在Channel MSP上共享数据，并且此后将能够正确认证Channel参与者。这意味着如果一个组织希望加入该Channel，那么需要在Channel配置中，加入一个包含该组织成员的信任链的MSP。否则来自该组织身份的交易将被拒绝。

## MSP功能分类

- Network MSP
通过定义参与者组织MSPs，来定义网络中的成员。同时定义这些成员中哪些成员，有权执行管理任务（例如，创建Channel）
- Channel MSP
Channel提供了一组特定的组织之间的私人通信，这些组织又对其进行管理控制。在该Channel的MSP上下文中的Channel policies定义谁能够参与Channel上的某些操作，例如添加组织或实例化chaincodes。
- Peer MSP
此Local MSP在每个peer的文件系统上定义，并且每个peer都有一个MSP实例。从概念上讲，它执行的功能与Channel MSP完全相同，限制条件是它仅用于定义它的peer上。
- Orderer MSP
与peer MSP一样，orderer local MSP也在节点的文件系统上定义，并且仅用于该节点。与peer 节点相似，orderer也由单个组织拥有，因此只有一个MSP来列出其信任的参与者或节点。


## msp与组织的对应关系

**1，组织与MSP之间建立映射关系**
- 建议实际的组织和MSP之间建立一一对应关系。当然也可以选择其他类型的映射关系

- 一个组织对应多个MSP的情况
这种情况是一个组织有多个部门，从方便管理的角度或者隐私保护的角度而言，每个部门都要设置不同的MSP。每个Peer节点只设置一个MSP，同一组织内不同MSP的Peer节点之间不能互相认证，这样相同组织的不同部门之间不会同步数据，数据不能共享。

- 多个组织对应一个MSP
这种情况是同一个联盟的不同组织之间采用相同的成员管理架构，数据会在不同组织之间同步。在Peer节点之间的Gossip通信中，数据是在相同通道配置了相同MSP的Peer节点之间同步的。如果多个组织对应一个MSP，则数据就不会限制在组织内部，会跨组织进行同步。这种情况我觉得很有应用场景。比如，C9联盟可以在同一个MSP管理下，既能够确保信任的基础，又能够实现数据的共享。
其实这是由MSP定义的粒度问题，一个MSP可以和一个组织对应，也可以和多个组织对应，还可以和一个组织内部的多个部门对应，根据MSP配置好Peer节点后，数据同步就限制在了MSP定义的范围内。


**2，一个组织内部实现不同的权限控制**

-  给组织内的所有部门定义一个MSP
给Peer节点配置MSP的时候，包含相同的可信根CA证书列表、中间CA证书、管理员证书，不同的Peer节点设置不同的所属部门。节点所属的部门是利用证书和部门之间映射的OrganizationalUnitIdentifiers定义的，它包含在MSP目录下配置文件“config.yaml”中。按照基于部门验证的方法来定义交易背书策略和通道管理策略，这样就可以实现不同的权限控制了。
这种方法会有一个问题
数据实际还是会在不同的Peer节点之间同步。因为Peer节点在识别组织身份类型OrgIdentityType的时候获取的是MSP标识，它会认为通道内相同MSP的节点都是可以分发数据的。

- 给组织内的每个部门单独定义MSP
给Peer节点配置MSP的时候，不同部门配置的可信中间CA证书、管理员证书可以是不同的，不同部门成员的证书路径也是不同的。这种方式解决了所有部门定义在一个MSP中的问题，但是会带来管理上的复杂度。

## MSP相关核心源码

- MSP源码部分位于fabric下的msp目录

```
msp
├── cache
│   ├── cache.go
│   └── cache_test.go
├── cert.go //证书相关结构体及方法。
├── cert_test.go
├── configbuilder.go//提供读取证书文件并将其组装成MSP等接口所需的数据结构，以及转换配置结构体（FactoryOpts->MSPConfig）等工具函数
├── configbuilder_test.go
├── factory.go
├── factory_test.go
├── idemixmsp.go
├── idemixmsp_test.go
├── identities.go//实现Identity、SigningIdentity接口
├── mgmt
│   ├── deserializer.go//MSPPrincipalGetter接口及其实现
│   ├── deserializer_test.go
│   ├── mgmt.go//msp相关管理方法实现
│   ├── mgmt_test.go
│   ├── peermsp_test.go
│   ├── principal.go
│   ├── principal_test.go
│   └── testtools
├── mocks
│   └── mocks.go
├── msp.go //定义接口MSP、MSPManager、Identity、SigningIdentity等
├── msp_test.go
├── mspimpl.go
├── mspimplsetup.go
├── mspimplvalidate.go
├── mspmgrimpl.go //实现MSP接口，即bccspmsp
├── mspwithintermediatecas_test.go
├── nodeous_test.go
├── ouconfig_test.go
├── revocation_test.go
├── testdata//省略
└── tls_test.go
```
## 分析
- 有时间在总结