---
title: Stellar区块链记录
date: 2018-09-25 15:55:50
tags: [stellar,区块链]
---

## 一，关于Stellar网络相关概述

- **Stellar 是一个基于区块链的分布式开源网络，专为即时支付转账而设计。Stellar 由 Ripple 的联合创始人 Jed McCaleb 创立，旨在以极低的成本提供金融服务， 特别是为那些不属于传统银行业服务范围的人提供服务**

### Stellar相关特点
- 像比特币一样，Stellar的网络是去中心化、分布式账本。
- 比特币是比特币网络的本币，而lumens则是Stellar网络的本币。
- Stellar网络中没有挖矿; 你可以运行Stellar核心验证节点，但验证交易不会被奖励新产生的lumens。
- 比特币使用POW作为其共识模型，而Stellar使用的是Stellar共识协议（SCP）的共识模式。SCP实施的是联邦拜占庭协议（FBA）共识模式。SCP不需要太多算力，理论上每秒交易吞吐量达到1000笔。
- Stellar网络交易确认时间的中值为5秒。虽然lumens是Stellar网络的原生资产，但其网络支持许多不同类型的资产，每个人都可以发行新资产。外部货币（法币或外部区块链）支持的资产由Stellar网络锚系统提供支持。
- Stellar网络内置了去中心化交易市场。
- **锚点作为法定货币进入Stellar网络的进入和退出点，为用户维护法币账户和Stellar钱包。如果用户将资金存入他们的法定货币账户，锚点将向用户的Stellar钱包存入等量的相应Stellar网络资产，反之亦然。大多数锚点是银行和支付公司等金融机构**
- Stellar lumens每年的固定名义通胀率为1％。还有一个收费池，用于发送网络交易的lumens费用。每个星期，由通货膨胀产生的新lumens和从收费池流出的lumens都会分配到Stellar钱包。每个钱包接收的lumens量基于投票系统。每个钱包都可以投票选择另一个钱包来接收lumens; 钱包中的每个lumens都被视为一票。

<!-- more -->

### Stellar运行方式
- 和其他基于区块链的平台一样，Stellar 平台运行在一系列分布式服务器上。它由一个分布式分类账组成，记录网络上发生的每一笔交易。分类账每两到五秒更新一次，也就是网络上交易所需的平均时间。
- Stellar 平台通过 Anchor（锚点）为任何想通过网络发送或接收付款的人发放信用额度。例如，如果你想向某人发送 100 美元， 需要先将钱存入 Anchor。收到这笔钱后，Anchor 会将金额记到你的 Stellar 账户。然后，你帐户里的资金可以发送给任何拥有 Stellar 帐户的人。收款人可以随时兑现 Stellar 账户里的资金


### Stellar的共识协议（SCP）
- Stellar公开的白皮书（DavidMazières教授撰写）里详细介绍了Stellar共识协议（SCP）的工作原理。该白皮书在谷歌学术上列出，并在撰写此博客文章时被引用了39次。该论文长32页，技术性极强，**包含关于联邦拜占庭协议（FBA）共识模型正确性的详细数学证明**， 
- **SCP是建立在联邦拜占庭协议（Federated Byzantine Agreement）之上的成果，是一种新的共识方法**
### Stellar白皮书对FBA的简要介绍：
- 在FBA中，每个参与者都知道其认为重要的其它人。在认定交易完成之前，它等待绝大多数其他人就此交易达成一致。反过来，那些重要的参与者不同意交易，直到他们认为重要的参与者同意为止，等等。最终，足够的网络接受一项交易，让攻击者无法将其回滚。只有这样参与者才认为交易已经结束。FBA共识可以确保金融网络的完整性。其去中心化控制可以刺激有机增长。
- SCP有两个关键属性，使得Stellar网络成为强大的资产转移系统。首先，它对算力的要求极低，特别是与比特币的POW相比。其次，它具有超高的交易吞吐量，理论上可以达到每秒1000次交易。

### lumens意义
- 如果Stellar网络的关键功能是自定义资产的传输和交换，为什么需要本地货币（lumens）
- 首先，lumens在网络中起到反垃圾攻击的作用。每笔交易都有lumens费用，这使网络垃圾攻击非常昂贵。此外，其网络中的所有账户要求余额不低于20lumens。其次，lumens为Stellar的内置的去中心化交易平台增加了流动性，为低成交量货币交易对提供交易桥梁。

### 为什么要选择Stellar

- Stellar有可以运行的产品
- Stellar在SCP上有着令人印象非常深刻的白皮书。如上所述，该论文在谷歌学术上列出，在撰写本文时已经被引用了39次。这一技术实力也体现在该团队的产品——Stellar网络中。该网络功能齐全，所有核心组件都可以正常运行并记录在案。
- Stellar Core是充当网络骨干的软件。Stellar Core节点通过SCP验证交易来保持网络运行。节点还允许所有者在网络中发布新资产或向网络提交交易。任何人都可以下载Stellar Core并开始运行节点。Horizon是连接到Stellar Core节点的服务器应用程序，允许应用程序通过RESTful HTTP API接口与Stellar网络进行交互，这对任何有能力的Web开发人员来说都应该是熟悉的。任何人都可以下载并运行Horizon服务器。
- 网络的锚点（记住锚点是Stellar网络的法币网关）也得到充分开发并有据可查。网桥服务器能够发送和接收符合规定的支付。每次发送或接收付款时，服务器都会通过合规服务器实现合规性，即桥服务器使用Stellar合规协议进行通信。Stellar网络也有自己的类似DNS的系统，通过可读地址映射到账户ID。该映射存储在联合服务器中。为了让网桥服务器根据人类可读地址确定账户ID，它必须通过Stellar联盟协议与联合服务器通信。

## 二，Stellar网络组件
![](https://www.stellar.org/wp-content/uploads/2016/06/Stellar-Ecosystem-v031.png)

- 整个网络其实由两个组件构成,一个用于与Stellar网络交互的API服务Horizon;另一个是网络的骨干,也就是Stellar Core.
- 网络中的所有的Horizon服务都会链接到Stellar core 上,由它通过共识算法负责交易的验证和处理工作,当我们谈到Stellar网络时,往往说的都是Stellar Core的集合,我们可以将Stellar core 理解为Bitcoin 中的节点,网络中相互连接的全部节点构成整个网络,而Horizon 就是用于与节点对话的HTTP服务了.
- Horizon实例是Stellar网络的开放接口访问平台，对外部应用提供访问Stellar网络的各种API，同时，当前对外提供提供JS、Go、Java、Ruby、Python和C#等版本的SDK，方便各类应用的快速接入
- Stellar网络中的节点种类和功能,有全节点，同步节点，归档节点，建议采用三种节点的模式进行StellarCore实例的部署，当然，也可以将三种功能进行灵活配置，形成其他的部署模式。


## 账号模型和生成
- Stellar采用账户（Account）模型组织链上信息，所有信息都关联到账户。
-  每个Stellar帐户都有一个公钥和一个秘密种子。 Stellar使用公钥加密来确保每个事务都是安全的。公钥通常可以安全共享 - 其他人需要它来识别您的帐户并验证您是否授权了交易。但是，种子是私人信息，证明您拥有自己的帐户。你永远不应该与任何人分享种子。
-  秘钥种子实际上是用于为您的帐户生成公钥和私钥的单个秘密数据。为方便起见，Stellar的工具使用种子而不是私钥：要完全访问帐户，您只需提供种子而不是公钥和私钥。
- go语言生成公钥和种子秘钥。

```
package main

import (
    "log"

    "github.com/stellar/go/keypair"
)

func main() {
    pair, err := keypair.Random()
    if err != nil {
        log.Fatal(err)
    }

    log.Println(pair.Seed())
    // SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7 （种子秘钥）
    log.Println(pair.Address())
    // GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB （公钥）
}

```

- 现在您已拥有种子和公钥，您可以创建一个帐户。为了防止人们制造大量不必要的账户，每个账户的最小余额必须为1 lumens（lumens是Stellar网络的内置货币）。但是，由于您还没有任何lumens，因此您无法支付帐户费用。在现实世界中，您通常会支付销售流明的交易所以创建新帐户。然而，在Stellar的测试网络中，您可以向我们友好的机器人Friendbot请求，为您创建一个帐户。要创建测试帐户，请向Friendbot发送您创建的公钥。它将使用该公钥作为帐户ID创建和资助新帐户

```
package main

import (
    "net/http"
    "io/ioutil"
    "log"
    "fmt"
)

func main() {
    // pair is the pair that was generated from previous example, or create a pair based on 
    // existing keys.
    address := pair.Address()
    resp, err := http.Get("https://friendbot.stellar.org/?addr=" + address)
    if err != nil {
        log.Fatal(err)
    }

    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Println(string(body))
}

```
- 获取帐户的详细信息并检查其余额。账户可以带有多个余额 - 每种类型的货币对应一种余额,go语言代码。

```
package main

import (
    "fmt"
    "log"

    "github.com/stellar/go/clients/horizon"
)

func main() {
    account, err := horizon.DefaultTestNetClient.LoadAccount(pair.Address())
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println("Balances for account:", pair.Address())

    for _, balance := range account.Balances {
        log.Println(balance)
    }
}
```

## 发送和接受
- 发送资产功能是给某个地址发送资产，接收功能是知道那个账号发送了资产。（代码表示参考文档发送和接收部分，暂不整理记录）

## 锚点（接入Stellar网络的银行）
- 锚点是人们信任持有存款并向Stellar网络发放信用额度的实体。 Stellar网络中的所有货币交易（lumens除外）均以锚点发行的信用形式出现，因此锚点充当现有货币与Stellar网络之间的桥梁。大多数人都是银行，储蓄机构，农民合作社，中央银行和汇款公司等组织。
- **作为Anchor,一般需要维护最少两个账户:**

```
- 1，An issuing account：仅用于发行和销毁资产的发行帐户。
- 2，A base account：用于与其他Stellar帐户进行交易的基本帐户。它持有发行账户发行的资产余额
```

### Customer Accounts(客户账户)
- 一般有2种方法对应用户的账号
- 一种是给锚点（接入的中央银行）里每个用户建立一个恒星账户。
- 另外一种是一个锚点只有一个账号，通过 federation(联合地址) 和 memo 来定位到具体的银行内部的用户。（一般采用这种方法）


### 建立锚点，基础架构需要满足

```
付款。
收到付款后，监控Stellar帐户并更新客户帐户。
查找并响应联合地址请求。
遵守反洗钱（AML）规定。
```
- Stellar提供预构建的联合服务器（ federation server）和法规遵从性服务器（regulatory compliance server ），专为您安装和集成现有基础架构而设计。桥接服务器（ bridge server ）协调它们并简化与Stellar网络的交互。本指南演示了如何将它们与您的基础架构集成，但您也可以编写自己的自定义版本。

### 付款
![](https://www.stellar.org/developers/guides/anchor/assets/anchor-send-payment-compliance.png)

```
客户使用Anchor提供的客户端或者网页发出一笔付款;
Anchor的内部服务通过桥接服务(Bridge)发出一笔付款;
桥接服务决定是否需要进行合规检查并将交易的相关信息发给合规服务;
合规服务通过查找联合抵制决定收款的账户ID;
合规服务调用Anchor 的接口获取客户的相关信息并发送给付款组织的合规服务;
如果通过了相关组织的合规验证,那么桥接服务就会创建并签发一笔交易,发送到Stellar 网络中;
当交易被网络确认时,桥接服务收到消息最终更新客户的账户余额;

```

### 收款
![](https://www.stellar.org/developers/guides/anchor/assets/anchor-receive-payment-compliance.png)

```
发送者通过查找Stellar 账户ID根据客户的联合抵制发送一笔付款;

发送者将付款信息与付款方的账户信息发送给收款方的合规服务;
合规服务联系三个不同的服务;
1.一个用于判断发送者是否允许的支付客户的制裁回调(Sanction Callback);
2.如果发送者想要得到客户的信息,需要由回调来决定是否提供当前的客户信息;
3.如果决定提供客户信息,通过回调的方式进行提供;
发送方将交易发送到Stellar网络中;
桥接服务监控Stellar网络中的这笔交易并确认是否是3.1中已经同意的付款;
桥接服务通知我们的服务当前交易已经确定,可更新用户的账户余额.

```





## 三，恒星里主要概念
### 账户
- 账户是Stellar中的核心数据结构,它是被存储在账本中的公钥标记的,账户中其他的数据结构都是属于某一个账户的,我们其中最熟悉的交易Transaction也是由账户创建的,每一笔交易都需要由当前账户的私钥签名
- 账户的构成结构

```
struct AccountEntry {
    AccountID accountID;//是当前账户的唯一标识符,在默认情况下都是账户对应的私钥;
    int64 balance; //当前账户持有的XLM余额
    SequenceNumber seqNum;//最新交易的序列号
    uint32 numSubEntries; //当前账户包含的条目数,例如:信任线,订单,数据等;
    AccountID* inflationDest; //标识当前账户接受通货膨胀的目标地址
    uint32 flags; //标示
    string32 homeDomain; 
    Thresholds thresholds;
    Signer signers<20>; //签名
};
```
- **每一个 Stellar 账户还都对应着唯一的 AccountEntry 以及多个 TrustLineEntry、OfferEntry 和 DataEntry**
- TrustLineEntry 为例，信任线（TrustLine）其实就是 Stellar 中的某个账户接受另一个账户发行的资产，可以理解为一个关系表，其中存储着信任的 asset 以及资产的余额。

```
struct TrustLineEntry {
    AccountID accountID;
    Asset asset;
    int64 balance;
    int64 limit;
    uint32 flags;
};
```
- Stellar 中的 DataEntry 可以保存一些与账户相关的数据


### 交易
- 交易实体的结构
```
struct Transaction {
    AccountID sourceAccount;//也就是发出交易的源地址，该交易必须被发出交易的源地址签名
    uint32 fee;
    SequenceNumber seqNum;
    TimeBounds* timeBounds;
    Memo memo;
    Operation operations<100>;//就是一个操作的数组，其中包含了这一次交易需要执行的全部操作
};
```
- 每一个 Transaction 都是由一组 Operation 构成的，可用的 Operation 包括 CreateAccount、Payment、PathPayment、ManageOffer 等等，以发出付款为例，我们可以向指定的账户发送特定数量的某资产。	这些 Operation 组成的交易就类似一个数据库中的事务，所有的操作要么执行成功，要么执行失败，Stellar 会保证一个交易的原子性

### 资产
- 除原生的资产 Lumens外，所有的资产都由发行人和资产类型组成。
- 持有 Stellar 中的资产时，其实是持有特定发行人的信誉，我们相信资产的发行人能够将 Stellar 中的资产兑换成货币、昂贵金属以及其他在网络中不存在的资源。但是当我们想要持有某一个发行人的发行的资产时，需要创建一个信任线（TrustLine），这些数据会存储在 Stellar 的账本中，也就是上面提到的 TrustLineEntry

```
struct TrustLineEntry {
    AccountID accountID;
    Asset asset;
    int64 balance;
    int64 limit;
    uint32 flags;
};

```

- 当用户想要持有或者交易某一种资产时，它会创建一个等待发行人审批的信任线，发行人授权该信任线之后，用户才可以接受或者发出资产；
- 当发行人想要冻结用户访问资产的权限时，也可以随时取消用户的授权，在这之后用户就无法再发送或者接受该资产了


## Stellar相关操作
- https://www.stellar.org/laboratory 恒星实验室，学习恒星操作账号创建转账等
- https://www.youtube.com/watch?v=OLBf6YVAjuE 使用laboratory进行发币流程
- https://www.stellar.org/blog/tokens-on-stellar/（官方）