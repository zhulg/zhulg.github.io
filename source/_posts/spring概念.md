---
title: spring/SpringMVC/SpringBoot/Springcloud概念
date: 2017-07-25 15:35:35
tags: springboot
categories: springboot
toc: true
---

### Spring和SpringMVC是什么关系
- spring是一个IoC容器实现，后来逐步将各种功能模块集成到IoC这个框架下，包括事物、日志、缓存等。以前SSH就是以Spring的IoC容器为核心，衔接Struts和Hibernate来搭建应用。 
- SpringMVC出来了，作为Spring的一个子项目，与Spring的IoC容器配合起来更简便，逐步淘汰Struts。
- SpringMVC基于spring实现，基于DispatcherServle实现分发器，最终把这个框架引导起来，进行其自己的逻辑处理,代替了struts.

<!-- more -->


### SpringBoot
- spring boot是在spring 4.0提倡约定优于配置，其设计目的是用来简化新Spring应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置

### Spring boot与Spring cloud 是什么关系
- Spring Boot就是一个内嵌Web服务器（tomcat/jetty）的可执行程序的框架。你开发的web应用不需要作为war包部署到web服务器中，而是作为一个可执行程序，启动时把Web服务器配置好，加载起来。
-  Spring Boot比较适合微服务部署方式，不再是把一堆应用放到一个Web服务器下，重启Web服务器会影响到其他应用，而是每个应用独立使用一个Web服务器，重启动和更新都很容易。 
-  Spring Cloud是一套微服务开发和治理框架，来自Netflex的OSS，包含了微服务运行的功能，比如远程过程调用，动态服务发现，负载均衡，限流等。(byzhihu)

### spring与springboot与springcloud关系
- spring -> spring booot > spring cloud 
- Spring boot 是 Spring 的一套快速配置脚手架，可以基于spring boot 快速开发单个微服务，
- Spring Cloud是一个基于Spring Boot实现的云应用开发工具；Spring boot专注于快速、方便集成的单个个体，Spring Cloud是关注全局的服务治理框架
- Spring Cloud很大的一部分是基于Spring boot来实现。 Spring boot可以离开Spring Cloud独立使用开发项目，但是Spring Cloud离不开Spring boot，属于依赖的关系。 