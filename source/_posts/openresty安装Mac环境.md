---
title: openresty安装Mac环境
date: 2017-12-12 09:38:52
tags: openresty
---

### openresty概述

- OpenResty® 是一个基于 Nginx 与 Lua 的高性能 Web 平台，其内部集成了大量精良的 Lua 库、第三方模块以及大多数的依赖项。用于方便地搭建能够处理超高并发、扩展性极高的动态 Web 应用、Web 服务和动态网关。

- OpenResty® 通过汇聚各种设计精良的 Nginx 模块（主要由 OpenResty 团队自主开发），从而将 Nginx 有效地变成一个强大的通用 Web 应用平台。这样，Web 开发人员和系统工程师可以使用 Lua 脚本语言调动 Nginx 支持的各种 C 以及 Lua 模块，快速构造出足以胜任 10K 乃至 1000K 以上单机并发连接的高性能 Web 应用系统。

### mac环境安装

 - brew install openresty/brew/openresty
 
 
 <!-- more -->
 
 - 安装成功后把nginx配置到环境变量(如果之前安装过nginx,干脆给卸载了，用brew uninstall）

 ```
  export PATH=/usr/local/opt/openresty/nginx/sbin:$PATH
 ```
 - 配置成功就可以任意环境使用（记得生效下）
- 启动nginx，使用sudo nginx 相对于启动了openresty.
- 访问localhost:80 看到openstry介绍
![](https://raw.githubusercontent.com/zhulg/allpic/master/openresty_index.png)

- 命令行 sudo nginx -V 查看相关文件位置

- 环境变量配置进去后就可以通过这些命令操作openresty

```
启动:nginx
停止:nginx -s stop   停止nginx也停止了openresty
重启:nginx -s reload
检验nginx配置是否正确: nginx -t

```

### 使用例子

- 为了测试使用创建另一个目录，不使用openresty里的配置文件。启动时也启动的是该配置文件。
- mkdir ~/openresty-test ~/openresty-test/logs/ ~/openresty-test/conf/
- 在conf文件下创建nginx.conf文件

```
worker_processes  1;
error_log logs/error.log;
events {
    worker_connections 1024;
}
http {
    server {
        listen 8085;
        location / {
            default_type text/html;
            content_by_lua '
                ngx.say("<p>hello, world</p>")
            ';
        }
    }
}
```

- nginx -p `pwd`/ -c conf/nginx.conf  (需要先停止之前启动的nginx,如果启动过。然后执行)
- 启动后访问 http://localhost:8085 

