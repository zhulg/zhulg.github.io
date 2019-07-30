---
title: springcloud consul mac安装
date: 2017-08-23 16:50:22
tags: springcloud
---
### Spring cloud Consul安装
- Consul 是 HashiCorp 公司推出的开源工具，用于实现分布式系统的服务发现与配置
- 它包含多个组件，但是作为一个整体，在微服务架构中为我们的基础设施提供服务发现和服务配置的工具
- 与其他分布式服务注册与发现的方案，Consul的方案更“一站式”，内置了服务注册与发现框 架、分布一致性协议实现、健康检查、Key/Value存储、多数据中心方案，不再需要依赖其他工具（比如ZooKeeper等）

### Mac下安装使用
- 下载

```
brew install consul
```
- 启动

```
consul agent -dev
```
- 启动后可以配合springboot工程进行注册
![](https://raw.githubusercontent.com/zhulg/allpic/master/consulstart.png)

- 启动后：
![启动](https://raw.githubusercontent.com/zhulg/allpic/master/springcloudConsul1.png)

- 注册服务提供client端：(启动自己springboot工程client端)
![](https://raw.githubusercontent.com/zhulg/allpic/master/springcloudConsulClient.png)

- 服务消费端:（启动自己springboot工程consumer端）
![](https://raw.githubusercontent.com/zhulg/allpic/master/springcloudConsulConsumer.png)