---
title: fabric explorer部署记录
tags: 区块链
categories: 区块链
toc: true
abbrlink: 30329
date: 2018-03-22 15:28:25
---
- Hyperledger Explorer is a simple, powerful, easy-to-use, highly maintainable, open source browser for viewing activity on the underlying blockchain network.
- 通过explorer可以看到fabric的peer,channel,block 等信息
- 官网下载

```
git clone https://github.com/hyperledger/blockchain-explorer.git
cd blockchain-explorer
```

<!-- more -->

- 使用mysql导入表

```
 mysql -u<username> -p < db/fabricexplorer.sql
```
- 启动网络在fabric-samples/first-network下，启动网络。

```
./byfn.sh -m up -c mychannel
```
- cd blockchain-explorer下编辑config.json文件,修改密码对应的路径，修改mysql的密码。
- npm install 在初始化时会失败的，原因在国内你懂得,设置代理，继续执行。

```
npm config set registry="http://r.cnpmjs.org"
```
- 安装完成后，执行./start.sh
- 访问http://localhost:8081/  我在config.sh里端口改为8081，默认8080

![](https://github.com/zhulg/allpic/blob/master/fabric_explorer.png?raw=true)
