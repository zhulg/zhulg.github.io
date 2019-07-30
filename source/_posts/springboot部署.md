---
title: springboot部署
date: 2017-08-15 18:13:47
tags: springboot
---
### Springboot部署阿里云
- 环境准备<br>

 ```
  1,mac下准备ssh shell
  2,准备云服务地址
  3,使用ssh shell 登录服务地址
  4,构建服务端运行环境
  5,部署springboot项目
 
  ```
  
#### 环境安装记录：
 
 - java 环境安装：采用先下载到本地，在scp到远程服务器(直接服务器上下载后无法解压成功，其下载是个html压缩包，不是真实jdk)
 
 ```
 scp jdk-8u144-linux-x64.tar.gz  root@120.76.xxx.xxx:/root/zhulg/jdk/jdk-8u144-linux-x64.tar.gz 
 
 ```
 
 <!-- more -->

后续输入密码

- 解压

```
tar -zxvf jdk-xxxxx
```
- 环境变量配置:系统环境变量 vi /etc/environment 添加以下内容
 
```
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:$JAVA_HOME/bin"
export CLASSPATH=.:$JAVA_HOME/lib:$JAVA_HOME/jre/lib
export JAVA_HOME=/root/jdk/jdk1.8.0_144
```

- 用户环境变量: vi /etc/profile 添加以下内容

```
export JAVA_HOME=/root/sdk/jdk1.8.0_141
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$JAVA_HOME/lib:$JRE_HOME/lib:$CLASSPATH
export PATH=$JAVA_HOME/bin:$JRE_HOME/bin:$PATH
```
- 生效以上配置：source /etc/profile  source /etc/environment
- 查看Java是否安装好：java -version  or java 
- 可以安装其他需要的环境

### springboot demo部署
- 使用sftp放到服务器

![](https://raw.githubusercontent.com/zhulg/allpic/master/springboot_d.png)


- java -jar xxx.jar 启动springboot 

- 要保证关闭shell应用在后台一直能运行

```
1,vim start.sh 添加 java -jar xxx,jar
2,chmod 777 start.sh
3,nohup ./start.sh

```
- 查看和关闭应用

```
查看其对应的进程号 
netstat -anp | grep 80

关闭sid的端口，即关闭应用
kill sid

```
![](https://raw.githubusercontent.com/zhulg/allpic/master/springboot_close.png)

 
