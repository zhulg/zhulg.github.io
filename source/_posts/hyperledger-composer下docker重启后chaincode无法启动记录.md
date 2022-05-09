---
title: hyperledger composer下docker重启后chaincode无法启动记录
tags: 区块链
categories: 区块链
toc: true
abbrlink: 42109
date: 2018-07-02 18:04:02
---


- 背景是磁盘空间因为docker容器日志满，环境是使用composer的区块链网络。
- 正确清理姿势（比如我这个）

```
到 /app/install/docker/lib/docker/containers/ 下面的那个容器文件夹内执行  
cat /dev/null > *-json.log
```
- lsof |grep deleted 查看删除文件是否存在引用（如果直接删的日志，是不会减少空间的，需要删除引用）


- 由于一开始没有正确清理，直接删除了。空间没有恢复。果断重启了docker。。。发现之前的停止的chaincode则无法重启了，其他fabric组件都起来了，只有chaincode容器失败，日志。

```
> gome-sellers-network@0.0.3-deploy.18 start /usr/local/src
> start-network "--peer.address" "peer0.org2.example.com:7052"

running start.js
E0702 04:24:00.911674693      16 ssl_transport_security.cc:1063] Handshake failed with fatal error SSL_ERROR_SSL: error:0D0C5006:asn1 encoding routines:ASN1_item_verify:EVP lib.
[2018-07-02T04:24:00.913] [ERROR] lib/handler.js - Chat stream with peer - on error: "Error: 14 UNAVAILABLE: Connect Failed\n    at Object.exports.createStatusError (/usr/local/src/node_modules/grpc/src/common.js:87:15)\n    at ClientDuplexStream._emitStatusIfDone (/usr/local/src/node_modules/grpc/src/client.js:235:26)\n    at ClientDuplexStream._readsDone (/usr/local/src/node_modules/grpc/src/client.js:201:8)\n    at /usr/local/src/node_modules/grpc/src/client_interceptors.js:679:15"

```

- 又进行了删除操作，把chaincode容器删掉,尝试重新部署chaincode,之前已经有card和管理员并进行初始化了，所以直接用composer的相关命令启动不了网络
发现还是失败，重新install chaincode报已经初始化。下边无法进行了，只有启动了chaincode才能操作。

```
 composer network start -c PeerAdmin@byfn-network-org1 -n gome-sellers-network -V 0.0.3-deploy.18 -o endorsementPolicyFile=/tmp/composer/endorsement-policy.json -A gomeadmin -C gomeadmin/admin-pub.pem -A geliadmin -C geliadmin/admin-pub.pemStarting business network gome-sellers-network at version 0.0.3-deploy.18

Processing these Network Admins: 
        userName: gomeadmin
        userName: geliadmin

✖ Starting business network definition. This may take a minute...
Error: Error trying to start business network. Error: No valid responses from any peers.
Response from attempted peer comms was an error: Error: 2 UNKNOWN: chaincode error (status: 500, message: chaincode exists gome-sellers-network)
Response from attempted peer comms was an error: Error: 2 UNKNOWN: chaincode error (status: 500, message: chaincode exists gome-sellers-network)
Response from attempted peer comms was an error: Error: 2 UNKNOWN: chaincode error (status: 500, message: chaincode exists gome-sellers-network)
Response from attempted peer comms was an error: Error: 2 UNKNOWN: chaincode error (status: 500, message: chaincode exists gome-sellers-network)
Command failed

```
- 在尝试不重新操作已有card和容器，发现都不行，只能重新启动fabric网络，重新生成card导入才行。

#### 问题
- docker重启，chaincode容器就无法再次回到之前状态（其他peer和order,ca都没问题）
- 遇到这情况需要重新部署chaincode才行，使用composer的话还有点麻烦。