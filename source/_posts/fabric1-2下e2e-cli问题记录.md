---
title: fabric1.2下e2e_cli问题记录
date: 2018-08-02 18:25:18
tags: [fabric,区块链]
---

- 目前升级了fabric 1.2版本，是当前最新release版本。
- 从fabric1.1开始，这个经典的例子改为kafka共识，做为学习。

<!-- more -->

#### 升级后常规验证

- 运行e2e_cli后发现日志有如下错误：Failed evaluating policy on signed data during check policy on channel 

````
Error: error endorsing query: rpc error: code = Unknown desc = Failed evaluating policy on signed data during check policy on channel [mychannel] with policy [/Channel/Application/Writers]: [Failed to reach implicit threshold of 1 sub-policies, required 1 remaining] - proposal response: <nil>

===================== Query successful on peer1.org3 on channel 'mychannel' ===================== 

===================== All GOOD, End-2-End execution completed ===================== 


 _____   _   _   ____            _____   ____    _____ 
| ____| | \ | | |  _ \          | ____| |___ \  | ____|
|  _|   |  \| | | | | |  _____  |  _|     __) | |  _|  
| |___  | |\  | | |_| | |_____| | |___   / __/  | |___ 
|_____| |_| \_| |____/          |_____| |_____| |_____|

```

- 看起来运行成功了,查找了下发现是个bug.
- 这个bug地址是 https://jira.hyperledger.org/browse/FAB-11196
- 可以根据这个修改，在运行就OK了。
- 修改 e2e_cli下的configtx.yaml，在Org3处进行添加Org3MSP.member，如下。

```
Policies:
Readers:
Type: Signature
Rule: "OR('Org3MSP.admin', 'Org3MSP.peer', 'Org3MSP.client', 'Org3MSP.member')"
Writers:
Type: Signature
Rule: "OR('Org3MSP.admin', 'Org3MSP.client', 'Org3MSP.member')"
Admins:
Type: Signature
Rule: "OR('Org3MSP.admin')"

```
- 新的代码作者已经提交了，可以用以上暂规避处理。