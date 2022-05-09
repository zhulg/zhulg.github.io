---
title: springcloud 网关服务记录
tags: springcloud
categories: springcloud
toc: true
abbrlink: 56664
date: 2017-09-07 17:27:16
---

###SpringCloud 网关记录

**1, 注册相关服务到eureka**
![](https://raw.githubusercontent.com/zhulg/allpic/master/api-gateway1.png)

```
当我们这里构建的api-gateway应用启动并注册到eureka之后，服务网关会发现上面我们启动的两个服务eureka-client和eureka-consumer，这时候Zuul就会创建两个路由规则。每个路由规则都包含两部分，一部分是外部请求的匹配规则，另一部分是路由的服务ID。针对当前示例的情况，Zuul会创建下面的两个路由规则：

转发到eureka-client服务的请求规则为：/eureka-client/**
转发到eureka-consumer服务的请求规则为：/eureka-consumer/**

```



**2,通过api-gateway 地址访问，默认已经进行路由**
![](https://github.com/zhulg/allpic/blob/master/api-gateway2.png?raw=true)

**3,在api-gateway里有配置zuul对应的映射路径：**

```
spring:
  application:
    name: api-gateway

server:
  port: 1101

zuul:
  routes:
    api-a:
      path: /api-a/**
      serviceId: eureka-client

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8001/eureka/
```

**4,所以有上边里的zuul里的routers配置，可以通过api-gateway里配置的映射路径进行访问**
![](https://raw.githubusercontent.com/zhulg/allpic/master/api-gateway3.png)