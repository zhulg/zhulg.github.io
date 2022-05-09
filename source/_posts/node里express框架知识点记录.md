---
title: node里express框架知识点记录
tags:
  - node
  - composer
  - vscode
abbrlink: 32797
date: 2018-07-05 18:40:54
---

- Express是基于nodejs的web开发框架,使用vscode开发node
- 使用node调用hyperledger composer提供的模块接口,实现自己的composer接口服务。


#### vscode安装express

```
- vs code 安装node express 
- 先安装express插件,vs商店里搜索
- 在进行安装 npm install express-generator -g
- 创建一个应用express myapp
- vs打开这个应用，进入这个工程命令行npm install
- npm start启动应用，访问http://127.0.0.1:3000/

```
- 生成模板工程的结构

```
myapp
├── app.js
├── bin
├── node_modules
├── package.json
├── public
├── routes
└── views
```

#### express主要包含三个核心概念：路由、中间件、模板引擎

```
中间件：在express应用中，一切皆中间件,各种应用逻辑，如cookie解析、会话处理、日志记录、权限校验等，都是通过中间件来完成的。
路由：负责寻址的。
模板引擎：负责视图动态渲染。

```

#### express工作机制

![](http://expressjs.com/images/express-mw.png)

- next：回调方法，当next()被调用时，就进入下一个中间件

#### 常用中间件

```
function login(req, res, next){
    doSomeBusinessLogic(); // 业务逻辑处理，比如权限校验、数据库操作、设置cookie等
    next();  // 如果需要进入下一个中间件进行处理，则调用next();
}

```
- 常用中间件

```
body-parser
compression
serve-static
session
cookie-parser
morgan
```

#### 模板引擎,主要视图渲染模板
- [官网介绍](http://expressjs.com/en/guide/using-template-engines.html)