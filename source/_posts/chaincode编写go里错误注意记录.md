---
title: chaincode编写go里错误注意记录
date: 2018-03-21 19:19:57
tags: 区块链
categories: 区块链
toc: true
---

- go里的方法在使用json.Marshal()时需要，结构的定义需要按照大写的方式来定义。

<!-- more-->

```
	var people = People{NAME: params[1], AGE: params[2]}
	peoplebytes, err := json.Marshal(people)
```
- 使用时结构的定义需要大写如下边方式,否则导致json.Marshal()结构为空。

```
type People struct {
	NAME string `json:"name"`
	AGE  string `json:"age"`
}

```