---
title: mongodb介绍
tags: springboot相关
abbrlink: 49782
date: 2017-08-02 11:12:34
---

#### SQL 和 NoSQL 的区别
- SQL (Structured Query Language) 数据库，指关系型数据库 - 主要代表：SQL Server，Oracle，MySQL(开源)，PostgreSQL(开源)。
- NoSQL（Not Only SQL）泛指非关系型数据库 - 主要代表：MongoDB，Redis，CouchDB。
- 一般将NoSQL数据库分为四大类：键值(Key-Value)存储数据库、列存储数据库、文档型数据库和图形(Graph)数据库
- 今天我们可以通过第三方平台（如：Google,Facebook等）可以很容易的访问和抓取数据。用户的个人信息，社交网络，地理位置，用户生成的数据和用户操作日志已经成倍的增加。我们如果要对这些用户数据进行挖掘，那SQL数据库已经不适合这些应用了, NoSQL数据库的发展也却能很好的处理这些大的数据

<!-- more -->


#### 关系型与非关系型数据库
- 非关系型数据库的优势：

 ```
  性能NOSQL是基于键值对的，可以想象成表中的主键和值的对应关系，而且不需要经过SQL       层的解析，所以性能非常高。
  可扩展性同样也是因为基于键值对，数据之间没有耦合性，所以非常容易水平扩展。
```
- 关系型数据库的优势：

```
 复杂查询可以用SQL语句方便的在一个表以及多个表之间做非常复杂的数据查询。
 事务支持使得对于安全性能很高的数据访问要求得以实现. 
```


####  MongoDB是什么
- MongoDB 是由C++语言编写的，是一个基于分布式文件存储的开源数据库系统。
在高负载的情况下，添加更多的节点，可以保证服务器性能。
MongoDB 旨在为WEB应用提供可扩展的高性能数据存储解决方案。
MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。
- MongoDB是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。他支持的数据结构非常松散，是类似json的bson格式，因此可以存储比较复杂的数据类型。

#### Mac安装mongodb

```
 brew install mongodb
```

```
==> Downloading https://homebrew.bintray.com/bottles/mongodb-3.4.6.sierra.bottle.tar.gz
######################################################################## 100.0%
==> Pouring mongodb-3.4.6.sierra.bottle.tar.gz
==> Using the sandbox
==> Caveats
To have launchd start mongodb now and restart at login:
  brew services start mongodb
Or, if you don't want/need a background service you can just run:
  mongod --config /usr/local/etc/mongod.conf
==> Summary
🍺  /usr/local/Cellar/mongodb/3.4.6: 18 files, 266.9MB \
```
- 按照以上安装成功提示启动
- 连接到mongodb

```
mongo
```