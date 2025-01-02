---
title: springcloud-Gateway记录
tags: springcloud
categories: Java
toc: true
abbrlink: 16737
date: 2017-10-17 11:17:35
---
### SpringCloud Gateway相关点

- 在微服务架构中，后端服务往往不直接开放给调用端，而是通过一个API网关根据请求的url，路由到相应的服务。
- 当添加API网关后，在第三方调用端和服务提供方之间就创建了一面墙，这面墙直接与调用方通信进行权限控制，后将请求均衡分发给后台服务端。

#### Spring Cloud Zuul
- springcloud zull 路由是微服务架构的不可或缺的一部分，提供动态路由，监控，弹性，安全等的边缘服务。Zuul是Netflix出品的一个基于JVM路由和服务端的负载均衡器。

### 使用方式
#### 1，简单使用
- **单实例配置：通过一组zuul.routes.\<route>.path与zuul.routes.\<route>.url参数对的方式配置，\<route>是相关的服务名：比如:**

 ```
#这里的配置表示，访问/user/** 直接重定向到http://xxxx/**
zuul.routes.user-service.path=/user-service/**
zuul.routes.user-service.url=http://localhost:8080/
 ```


####2，服务化方式，通过对于的服务名称
- 通过一组zuul.routes.\<route>.path与zuul.routes.\<route>.serviceId参数对的方式配置

```
zuul.routes.user-service.path=/user-service/**
zuul.routes.user-service.serviceId=user-service
```
####3，简洁的配置方式

**zuul.routes.\<serviceId>=\<path>，其中<serviceId>用来指定路由的具体服务名，<path>用来配置匹配的请求表达式。比如下面的例子，它的路由规则等价于上面通过path与serviceId组合使用的配置方式**

```
zuul.routes.user-service=/user-service/**

```

#### 4,默认的配置，网关的默认路由规则

- 如果后端服务多达十几个的时候，每一个都这样配置也挺麻烦的，spring cloud zuul已经帮我们做了默认配置。默认情况下，Zuul会代理所有注册到Eureka Server的微服务，并且Zuul的路由规则如下：http://ZUUL_HOST:ZUUL_PORT/微服务在Eureka上的serviceId/**会被转发到serviceId对应的微服务。

- 在Spring Cloud Netflix中，Zuul巧妙的整合了Eureka来实现面向服务的路由。实际上，我们可以直接将API网关也看做是Eureka服务治理下的一个普通微服务应用。它除了会将自己注册到Eureka服务注册中心上之外，也会从注册中心获取所有服务以及它们的实例清单。所以，在Eureka的帮助下，API网关服务本身就已经维护了系统中所有serviceId与实例地址的映射关系。当有外部请求到达API网关的时候，根据请求的URL路径找到最佳匹配的path规则，API网关就可以知道要将该请求路由到哪个具体的serviceId上去。由于在API网关中已经知道serviceId对应服务实例的地址清单，那么只需要通过Ribbon的负载均衡策略，直接在这些清单中选择一个具体的实例进行转发就能完成路由工作了。

### Zuul的更常用方式：
我们对于Zuul的第一印象通常是这样的：它包含了对请求的路由和过滤两个功能，其中路由功能负责将外部请求转发到具体的微服务实例上，是实现外部访问统一入口的基础；而过滤器功能则负责对请求的处理过程进行干预，是实现请求校验、服务聚合等功能的基础。然而实际上，路由功能在真正运行时，它的路由映射和请求转发都是由几个不同的过滤器完成的。其中，路由映射主要通过pre类型的过滤器完成，它将请求路径与配置的路由规则进行匹配，以找到需要转发的目标地址；而请求转发的部分则是由route类型的过滤器来完成，对pre类型过滤器获得的路由地址进行转发。所以，过滤器可以说是Zuul实现API网关功能最为核心的部件，每一个进入Zuul的HTTP请求都会经过一系列的过滤器处理链得到请求响应并返回给客户端。

#### 过滤器的使用
- 在Spring Cloud Zuul中实现的过滤器必须包含4个基本特征：过滤类型、执行顺序、执行条件、具体操作。这些元素看着似乎非常的熟悉，实际上它就是ZuulFilter接口中定义的四个抽象方法
- 实现方式：

```
1,过滤类实现ZuulFilter接口
2，实现主要的4个方法
 @Override
    public String filterType() {
    }
    @Override
    public int filterOrder() {
    }
    @Override
    public boolean shouldFilter() {
    }
    @Override
    public Object run() {
    }
```
- filterType：该函数需要返回一个字符串来代表过滤器的类型，而这个类型就是在HTTP请求过程中定义的各个阶段。在Zuul中默认定义了四种不同生命周期的过滤器类型，具体如下：

```
pre：可以在请求被路由之前调用。
routing：在路由请求时候被调用。
post：在routing和error过滤器之后被调用。
error：处理请求时发生错误时被调用。
```
- filterOrder：通过int值来定义过滤器的执行顺序，数值越小优先级越高。
- shouldFilter：返回一个boolean类型来判断该过滤器是否要执行。我们可以通过此方法来指定过滤器的有效范围。
- run：过滤器的具体逻辑。在该函数中，我们可以实现自定义的过滤逻辑，来确定是否要拦截当前的请求，不对其进行后续的路由，或是在请求路由返回结果之后，对处理结果做一些加工等。
- **项目中的多个filter类时，根据order的顺序进行执行，数值越小优先级越高。数值可以相同。这些顺序都依赖于filterType的类型。 先类型后顺序**。
![](https://camo.githubusercontent.com/4eb7754152028cdebd5c09d1c6f5acc7683f0094/687474703a2f2f6e6574666c69782e6769746875622e696f2f7a75756c2f696d616765732f7a75756c2d726571756573742d6c6966656379636c652e706e67)



