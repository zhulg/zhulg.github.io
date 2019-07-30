---
title: mac安装redis
date: 2017-07-26 17:52:09
tags: redis
---
###  Mac使用brew安装redis
- 下载redis<br>
 ```
 brew install redis
 ```
- 启动服务<br>
```
brew services start redis
```
- 进入redis<br>
```
redis-cli
```
- 停止服务<br>
```
brew services stop redis
```

<!-- more -->


- 常用配置含义

```
# REDIS (RedisProperties)
# Redis数据库索引（默认为0）
spring.redis.database=0
# Redis服务器地址
spring.redis.host=localhost
# Redis服务器连接端口
spring.redis.port=6379
# Redis服务器连接密码（默认为空）
spring.redis.password=
# 连接池最大连接数（使用负值表示没有限制）
spring.redis.pool.max-active=8
# 连接池最大阻塞等待时间（使用负值表示没有限制）
spring.redis.pool.max-wait=-1
# 连接池中的最大空闲连接
spring.redis.pool.max-idle=8
# 连接池中的最小空闲连接
spring.redis.pool.min-idle=0
# 连接超时时间（毫秒）
spring.redis.timeout=0
```


- Redis是一个使用ANSI C编写的开源、支持网络、基于内存、可选持久性的键值对存储数据库， 是一个高性能的 key-value 数据库。GitHub 地址：https://github.com/antirez/redis 
