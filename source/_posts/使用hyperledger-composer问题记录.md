---
title: 使用hyperledger composer问题记录
date: 2018-05-14 17:30:12
tags: [fabric,区块链,composer]
---

#### 使用hyperledger composer 进行构建区块链项目

- 该问题在最后使用 Angular连接rest api时，出现 Invalid Host header

<!-- more -->

```
yo hyperledger-composer:angular
进入生成的工程里，执行npm start

```
- 问题解决参见 [issues](https://github.com/angular/angular-cli/issues/6070#issuecomment-298208974)
- 或者修改以下文件

```
你生成angular项目下面的 
node_modules/webpack-dev-server/lib/Server.js (line 425)
修改为: return true;

```

#### 重新启动
- 错误不在出现，页面构建成功正常显示 