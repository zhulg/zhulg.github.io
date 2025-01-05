---
title: nrm管理源
tags: 
 - npm
 - JS
categories: 前端
toc: true
abbrlink: 26211
date: 2021-03-04 10:49:05
---


### 关于npm源
-  在国内使用这个源是不稳定的，一般用淘宝npm源: https://registry.npm.taobao.org/
在终端输入: 

```
npm config set registry https://registry.npm.taobao.org/
```

- 查看
```
npm config list
```

- **为方便管理和切换这些源 ，可以按照nrm nrm 是一个 npm 源管理器, 可以管理并快速地在切换NPM源**


- ### nrm安装:

```
npm install -g nrm
```


### 使用nrm

- 查看： nrm ls

```
  npm -------- https://registry.npmjs.org/
  yarn ------- https://registry.yarnpkg.com/
  cnpm ------- http://r.cnpmjs.org/
* taobao ----- https://registry.npm.taobao.org/
  nj --------- https://registry.nodejitsu.com/
  npmMirror -- https://skimdb.npmjs.com/registry/
  edunpm ----- http://registry.enpmjs.org/
```

- 切换
```
nrm use taobao //切换到taobao
```
- 添加新源

```
nrm add  <registry> <url> [home]
```

- 删除源

```
nrm del <registry>
```