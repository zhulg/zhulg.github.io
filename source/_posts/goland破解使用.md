---
title: goland破解使用
tags: Tools
categories: Tools
toc: true
abbrlink: 50193
date: 2018-02-28 19:01:49
---
- Mac下 goland的使用
- 官网下载 [地址](https://www.jetbrains.com/go/) 目前版本为2017.3.2
- sudo cp /users/xxxx/Downloads/JetbrainsLicense.jar /Library/JetbrainsLicense/ 把下载到jar包放到固定位置，后续使用。
- 去应用程序/Applications中找到对应程序显示包,打开bin下面面的goland.vmoptions
- 追加 -javaagent:/Library/JetbrainsLicense/JetbrainsLicense.jar
- 打开goland 选择认证方式Activaction code，输入下面内容

```
{"licenseId":"1337",
"licenseeName":"替换你的名字（随意）",
"assigneeName":"",
"assigneeEmail":"",
"licenseRestriction":"Unlimited license till end of the century.",
"checkConcurrentUse":false,
"products":[
{"code":"II","paidUpTo":"2099-12-31"},
{"code":"DM","paidUpTo":"2099-12-31"},
{"code":"AC","paidUpTo":"2099-12-31"},
{"code":"RS0","paidUpTo":"2099-12-31"},
{"code":"WS","paidUpTo":"2099-12-31"},
{"code":"DPN","paidUpTo":"2099-12-31"},
{"code":"RC","paidUpTo":"2099-12-31"},
{"code":"PS","paidUpTo":"2099-12-31"},
{"code":"DC","paidUpTo":"2099-12-31"},
{"code":"RM","paidUpTo":"2099-12-31"},
{"code":"CL","paidUpTo":"2099-12-31"},
{"code":"PC","paidUpTo":"2099-12-31"},
{"code":"DB","paidUpTo":"2099-12-31"},
{"code":"GO","paidUpTo":"2099-12-31"},
{"code":"RD","paidUpTo":"2099-12-31"}
],
"hash":"2911276/0",
"gracePeriodDays":7,
"autoProlongated":false}

```
- 确认下，之后可以使用了。
- 附jar包下载:[地址](https://github.com/zhulg/allpic/blob/master/JetbrainsLicense.jar)