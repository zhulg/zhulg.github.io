---
title: linux当前用户加入docker组
tags: Linux
categories: Linux
toc: true
abbrlink: 55312
date: 2018-08-01 16:57:15
---

- docker的运行在root下，需要sudo方式进行查看 sudo docker ps
- 可以通过将当前普通用户加入到docker组里，不需要在sudo



- 通过ls -alh /var/run/docker.sock 查看到执行需要root权限。
- 把自己加入到docker group里 

```
sudo gpasswd -a ${USER} docker

```

- 重启docker 

```
sudo service docker restart

```

- 切换当前会话到新 group 或者重启 X 会话 必须执行

```
newgrp - docker

```