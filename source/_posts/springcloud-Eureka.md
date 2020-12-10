---
title: springcloud Eureka
date: 2017-08-08 11:08:36
tags: springcloud
categories: springcloud
toc: true
---
### 关于Eureka
- Eureka，是 Spring Cloud Eureka 的简称，是 Spring Cloud Netflix 组件之一。Spring Cloud Netflix 中核心的组件包括了服务治理（Eureka），服务容断（Hystrix），路由（Zuul）和客户端负载均衡（Ribbon）等
- 它提供了完整的Service Registry和Service Discovery实现。也是springcloud体系中最重要最核心的组件之一。
- Eureka由两个组件组成：Eureka服务器和Eureka客户端。Eureka服务器用作服务注册服务器。Eureka客户端是一个java客户端，用来简化与服务器的交互、作为轮询负载均衡器，并提供服务的故障切换支持。Netflix在其生产环境中使用的是另外的客户端，它提供基于流量、资源利用率以及出错状态的加权负载均衡。
- Eureka 架构图

![eureka架构图](https://raw.githubusercontent.com/zhulg/allpic/master/eureka-architecture.png)


- Eureka Server：提供服务注册和发现
- Service Provider：服务提供方，将自身服务注册到Eureka，从而使服务消费方能够找到
- Service Consumer：服务消费方，从Eureka获取注册服务列表，从而能够消费服务
