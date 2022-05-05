---
title: 使用hyperledger composer落地项目
tags:
  - 区块链
  - hyperledger composer
  - composer
abbrlink: 59496
date: 2018-05-30 23:17:56
---

#### composer构建和部署
- 关于composer的介绍和使用可参见官方文档。
- 以下关于composer的使用时结合项目，关键步骤记录。是在配置好连接，生成bna文件后的步骤。之前步骤可移步文档学习。
- **以下东西为自己笔记形式，不够详细。如需帮助指导请邮件我（lg.json@gmail.com）**

- 开发基本步骤 ![](https://hyperledger.github.io/composer/latest/assets/img/Angular.svg)

<!-- more -->

#### 生成bna文件之后的步骤

- 部署基于2个组织4个节点（文档里多节点部署）

##### 1, 开始前对docker进行了重启（目的是清除之前docker里的数据，在没有对数据持久进行挂载的时候，重启不会生成新的秘钥使用之前配好的）

```
 /byfn.sh -m restart -s couchdb -a
 rm -fr $HOME/.composer
```

##### 2, 初始化业务网络,申请身份

```
composer network install --card PeerAdmin@byfn-network-org1 --archiveFile gome-sellers-network_0.0.12.bna
composer network install --card PeerAdmin@byfn-network-org2 --archiveFile gome-sellers-network_0.0.12.bna

composer identity request -c PeerAdmin@byfn-network-org1 -u admin -s adminpw -d gomeadmin
composer identity request -c PeerAdmin@byfn-network-org2 -u admin -s adminpw -d geliadmin

```

##### 3, 启动网络

```
composer network start -c PeerAdmin@byfn-network-org1 -n gome-sellers-network -V 0.0.3-deploy.12 -o endorsementPolicyFile=/tmp/composer/endorsement-policy.json -A gomeadmin -C gomeadmin/admin-pub.pem -A geliadmin -C geliadmin/admin-pub.pem
```

##### 4, 添加管理员card(组织1和组织2)

```
composer card create -p /tmp/composer/org1/byfn-network-org1.json -u gomeadmin -n gome-sellers-network -c gomeadmin/admin-pub.pem -k gomeadmin/admin-priv.pem

composer card import -f gomeadmin@gome-sellers-network.card


composer card create -p /tmp/composer/org2/byfn-network-org2.json -u geliadmin -n gome-sellers-network -c geliadmin/admin-pub.pem -k geliadmin/admin-priv.pem

composer card import -f geliadmin@gome-sellers-network.card
```

##### 5,启动API

```
composer-rest-server -c gomeadmin@gome-sellers-network -n never -w true
```

##### 6, 更新bna（测试开发阶段需要修改bna文件情况使用更新。执行一个组织上，在进行数据添加时发现会同步到其他pee容器）

```
composer network install --card PeerAdmin@byfn-network-org1 --archiveFile gome-sellers-network_0.0.12.bna

composer network upgrade -c PeerAdmin@byfn-network-org1 -n gome-sellers-network -V 0.0.3-deploy.12


composer network install --card PeerAdmin@byfn-network-org2 --archiveFile gome-sellers-network_0.0.12.bna

composer network upgrade -c PeerAdmin@byfn-network-org2 -n gome-sellers-network -V 0.0.3-deploy.12

```

##### 7, 添加seller1用户并申请身份信息

```
composer participant add -c gomeadmin@gome-sellers-network -d '{"$class":"com.gomesellers.network.Seller","Id":"1", "Name":"zhulianggang","orgId":"001","orgName":"格力"}'

composer identity issue -c gomeadmin@gome-sellers-network -f seller1.card -u seller1 -a "resource:com.gomesellers.network.Seller#1"

composer card import -f seller1.card
```

##### 8, 使用sell1 提交数据上链

```
composer transaction submit --card seller1@gome-sellers-network -d '{"$class": "org.hyperledger.composer.system.AddAsset","registryType": "Asset","registryId": "com.gomesellers.network.Order", "targetRegistry" : "resource:org.hyperledger.composer.system.AssetRegistry#com.gomesellers.network.Order", "resources": [{"$class": "com.gomesellers.network.Order","orderId":"1", "itemDesc":"MAC","channel":"gome", "itemNum":"10","createTime":"2018-5-30","sellerId":"1","sellerName":"zhulianggang","sellerOrgId":"001","sellerOrgName":"格力","sum":"888","orginOrderId":"1001"}]}'
```

##### 9,添加seller2用户并申请身份

```
composer participant add -c gomeadmin@gome-sellers-network -d '{"$class":"com.gomesellers.network.Seller","Id":"2", "Name":"zhulg","orgId":"001","orgName":"格力"}'

composer identity issue -c gomeadmin@gome-sellers-network -f seller2.card -u seller2 -a "resource:com.gomesellers.network.Seller#2"

composer card import -f seller2.card
```
##### 10, 使用sell2 提交数据上链

```
composer transaction submit --card seller2@gome-sellers-network -d '{"$class": "org.hyperledger.composer.system.AddAsset","registryType": "Asset","registryId": "com.gomesellers.network.Order", "targetRegistry" : "resource:org.hyperledger.composer.system.AssetRegistry#com.gomesellers.network.Order", "resources": [{"$class": "com.gomesellers.network.Order","orderId":"2", "itemDesc":"MAC","channel":"gome", "itemNum":"10","createTime":"2018-5-30","sellerId":"2","sellerName":"zhulg","sellerOrgId":"001","sellerOrgName":"格力","sum":"999","orginOrderId":"1002"}]}'

```

- 不同身份提交数据上链，权限控制
- 本地启动composer playground，可查看不同card
- composer network list -c seller2@gome-sellers-network 业务网络下数据
- 启动的reset api 可以执行同样操作。唯一不同的是reset api 对应身份切换好像没有。只能再生成reset api时命令行指定身份,这样的话对应提交上链就只能用命令行方式 --card 身份提交了。（需要进一步研究下这块）


#### 11,多用户模式解决以上问题
- 最近涉及到多用户模式业务开发，composer里的多用户模式可以完全解决用户身份问题。等空了做个总结记录。