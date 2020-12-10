---
title: springcloud架构和技术点
date: 2017-09-29 16:57:19
tags: springcloud
categories: springcloud
toc: true
---
### SpringCloud架构图


![](https://github.com/zhulg/allpic/blob/master/spring-cloud-architecture.png?raw=true)

- 外部或者内部的非Spring Cloud项目都统一通过API网关（Zuul）来访问内部服务.
- 网关接收到请求后，从注册中心（Eureka）获取可用服务
- 由Ribbon进行均衡负载后，分发到后端的具体实例
- 微服务之间通过Feign进行通信处理业务
- Hystrix负责处理服务超时熔断
- Turbine监控服务间的调用和熔断相关指标



### SpringCloud相关技术点

![](https://raw.githubusercontent.com/zhulg/allpic/master/SpringCloudTechs.png)


