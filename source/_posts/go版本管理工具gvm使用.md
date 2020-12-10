---
title: go版本管理工具gvm使用
date: 2018-06-21 12:20:04
tags: go
categories: go
toc: true
---

#### gvm 用于管理go版本
- 官网下安装

```
bash < <(curl -s -S -L https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer)

```

- Installing Go (go1.5以上版本依赖1.4)

```
gvm install go1.4
gvm use go1.4 [--default]
```
<!-- more -->

- gvm下的配置地址需要修改下用github上地址

```
vim ~/.gvm/scripts/install
修改
GO_SOURCE_URL=https://github.com/golang/go

```

- gvm list 查看安装
- gvm use xxx --default切换go版本
- go env 查看环境
- 有时需要对gopath环境需要自己设置，可以在.bashrc里进行设置自己要的地址即可

```
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```
- go env