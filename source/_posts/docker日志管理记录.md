---
title: docker日志管理记录
tags:
  - docker
abbrlink: 43715
date: 2018-08-30 14:42:12
---

## docker日志清理

- 容器日志一般存放在/var/lib/docker/containers/container_id/下面

- **查看产生日志大小**

<!-- more -->

```
#!/bin/sh

echo "======== docker containers logs file size ========"  
 
logs=$(find /app/install/docker/lib/docker/containers/ -name *-json.log)
 
for log in $logs
        do
                ls -lh $log                
        done
```

- **清理日志脚本**

```
#!/bin/sh
echo "==================== start clean docker containers logs =========================="
 
logs=$(find /app/install/docker/lib/docker/containers/ -name *-json.log)
 
for log in $logs
        do
                echo "clean logs : $log"
                cat /dev/null > $log
        done
 
 
echo "==================== end clean docker containers logs   =========================="
```

## 通过设置容器的日志大小解决
- 在/etc/docker/daemon.json, 增加配置项**

```
 "log-driver":"json-file",
  "log-opts": {"max-size":"500m", "max-file":"3"}
```
- max-size=500m，意味着一个容器日志大小上限是500M， 
- max-file=3，意味着一个容器有三个日志，分别是id+.json、id+1.json、id+2.json。