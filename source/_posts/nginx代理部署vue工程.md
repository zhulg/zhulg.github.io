---
title: nginx代理部署vue工程
tags: nginx
categories: nginx
toc: true
abbrlink: 30090
date: 2018-06-12 18:13:37
---

- docker pull nginx 拉取镜像
- 启动

```
docker container run \
  -d \
  -p 80:80 \
  --rm \
  --name mynginx \
  nginx
```


- 参数说明
```
-d：在后台运行
-p ：容器的80端口映射到80
--rm：容器停止运行后，自动删除容器文件
--name：容器的名字为mynginx
```
- docker ps 可以看到。启动查看
- 挂载自己目录

```
  docker container run \
  -d \
  -p 80:80 \
  --rm \
  --name mynginx \
  --volume "$PWD/html":/usr/share/nginx/html \
  --volume /mnt/install/docker/project/nginx/conf/nginx.conf:/etc/nginx/nginx.conf:rw \
  nginx
```
- 存在的话用-v,不存在创建使用--volume
- 修改配置文件
