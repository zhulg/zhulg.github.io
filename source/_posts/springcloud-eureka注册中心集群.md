---
title: springcloud eureka注册中心集群
tags: springcloud
categories: springcloud
toc: true
abbrlink: 17105
date: 2017-08-10 16:29:02
---
### Eureka集群注册
- Eureka注册中心提供关键的服务，如果是单点话，遇到故障就是毁灭性的。在一个分布式系统中，服务注册中心是最重要的基础部分，理应随时处于可以提供服务的状态。为了维持其可用性，使用集群是很好的解决方案。
- Eureka通过互相注册的方式来实现高可用的部署。
### 集群注册步骤

1、创建application-peer1.properties，作为peer1服务中心的配置，并将serviceUrl指向peer2

```
spring.application.name=eureka-server
server.port=8000
#在集群注册时会有,否则服务显示unavailable-replicas
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
eureka.instance.hostname=peer1
eureka.client.serviceUrl.defaultZone=http://peer2:8001/eureka/

```

<!-- more -->


2、创建application-peer2.properties，作为peer2服务中心的配置，并将serviceUrl指向peer1

```
spring.application.name=eureka-server
server.port=8001
eureka.client.register-with-eureka=true
eureka.client.fetch-registry=true
eureka.instance.hostname=peer2
eureka.client.serviceUrl.defaultZone=http://peer1:8000/eureka/
```
3、host转换在hosts文件中加入如下配置

```
127.0.0.1 peer1  
127.0.0.1 peer2  
```
4、打包启动,依次执行下面命令

```
mvn clean package
分别以peer1和peeer2 配置信息启动eureka
java -jar eureka-server-1.0.0.jar --spring.profiles.active=peer1
java -jar eureka-server-1.0.0.jar --spring.profiles.active=peer2
```
5,启动 http://localhost:8001/

![eureka](https://raw.githubusercontent.com/zhulg/allpic/master/eureka.png)

6,异常备注，开始折腾了很久，遇到什么权限没有，端口不能访问时。需要把服务彻底关掉，开启服务peer1时可能会有错误，原因服务没起来忽略即可。出去下上图说明已经建立成功。多个集群同理配置。
7，在MAC 环境下网上很多demo端口为1001之类的，在mac上端口会占用失败，继采用8001端口。