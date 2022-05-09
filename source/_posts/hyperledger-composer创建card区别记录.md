---
title: hyperledger composer创建card区别记录
tags: 区块链
categories: 区块链
toc: true
abbrlink: 29329
date: 2018-05-17 20:01:18
---


- 启动网络并创建了networkadmin.card(默认的connection.json?)
composer network start --networkName tutorial-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card


- 创建PeerAdmin@fabric-network.card
composer card create -p connection.json -u PeerAdmin -c Admin@org1.example.com-cert.pem -k 114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk -r PeerAdmin -r ChannelAdmin