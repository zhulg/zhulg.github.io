---
title: springboot整合Apache Shiro
tags: springboot
categories: springboot
toc: true
abbrlink: 37485
date: 2017-10-24 19:44:59
---

### Shiro的记录
- 在Java领域一般有Spring Security、Apache Shiro等安全框架，但是由于Spring Security过于庞大和复杂，大多数公司会选择Apache Shiro来使用。
- Apache Shiro是一个功能强大、灵活的，开源的安全框架。它可以干净利落地处理身份验证、授权、企业会话管理和加密。
- Apache Shiro是一个全面的、蕴含丰富功能的安全框架。
Authentication（认证）, Authorization（授权）, Session Management（会话管理）, Cryptography（加密）被 Shiro 框架的开发团队称之为应用安全的四大基石。那么就让我们来看看它们吧：




```
Authentication（认证）：用户身份识别，通常被称为用户“登录”
Authorization（授权）：访问控制。比如某个用户是否具有某个操作的使用权限。
Session Management（会话管理）：特定于用户的会话管理,甚至在非web 或 EJB 应用程序。
Cryptography（加密）：在对数据源使用加密算法加密的同时
```

- Shiro 配置要配置的是ShiroConfig类，Apache Shiro 核心通过 Filter 来实现，就好像SpringMvc 通过DispachServlet 来主控制一样。
既然是使用 Filter 一般也就能猜到，是通过URL规则来进行过滤和权限校验，所以我们需要定义一系列关于URL的规则和访问权限。
- http://www.cnblogs.com/ityouknow/p/7089177.html参考记录

