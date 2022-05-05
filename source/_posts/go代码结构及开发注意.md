---
title: go代码结构及开发注意
tags: go
categories: go
toc: true
abbrlink: 23918
date: 2018-03-09 15:10:25
---

- Go 代码必须保存在工作区中, 工作区就是一个特定的目录结构, 根目录下有如下3个目录

```
src 目录: 存放 go 源码文件, 按 package 来组织 (一个 package 一个文件夹)
pkg 目录: 存放 package 对象
bin 目录: 存放可执行的命令command
```
<!-- more -->

- 注意配置go的开发环境，GOPATH,GOBIN,ROROOT,其中gopath是指的你的工作区目录,gobin是工作区生成bin目录，用于存放go install后生成的可执行文件,goroot:The root of the go tree
- go文件的包名可执行的为main,作为包使用的使用package xxx, 作为包使用的文件，其中的方法定义，需要第一个字母大写。
- go build,和go install.当作为包使用时，go build不会生成任何文件。当对使用包的文件进行install，才会被加载对应使用包的文件到pkg相应的目录下（xxx.a形式）。
- 如果使用IDE则直接运行，命令行build,install可以看到以上过程。
- 命令行后查看产生的文件如图
![](https://raw.githubusercontent.com/zhulg/allpic/master/gostruct.png)