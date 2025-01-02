---
title: linux常用配置查看命令
tags: Linux
categories: 技术运维
toc: true
abbrlink: 6996
date: 2018-04-15 18:06:18
---

#### Linux操作系统主要分为两大类：

- RedHat系列：Redhat、Centos、Fedora等
- Debian系列：Debian、Ubuntu等。


#### linux下个系统软件安装辅助工具
- wget （名字是World Wide Web与get的结合）类似于迅雷，是一种下载工具，用于下载网站/批量文件，通过HTTP、HTTPS、FTP三个最常见的TCP/IP协议下载。
- apt-get是ubuntu下的一个软件安装方式，它是基于debain的。
- yum是redhat系列linux操作系统下的软件安装方式
#### 查看Linux系统发行版本

- lsb_release -a

```
LSB Version:    :core-4.1-amd64:core-4.1-noarch:cxx-4.1-amd64:cxx-4.1-noarch:desktop-4.1-amd64:desktop-4.1-noarch:languages-4.1-amd64:languages-4.1-noarch:printing-4.1-amd64:printing-4.1-noarch
Distributor ID: CentOS
Description:    CentOS Linux release 7.3.1611 (Core) 
Release:        7.3.1611
Codename:       Core
```
- 如果没有该命令，使用yum install -y redhat-lsb 进行安装后使用。
#### 查看操作系统版本
- cat /etc/redhat-release
#### 查看Linux内核版本
- uname -a

#### 内存相关信息
- cat /proc/meminfo 全部相关信息
- cat /proc/meminfo | grep MemTotal 只看内存

#### CPU相关信息
- cat /proc/cpuinfo 全部相关信息
- cat /proc/cpuinfo | grep "cpu cores" | uniq  查看cpu核数

#### 查看磁盘空间分区大小
- df -h

#### 查看端口
- lsof -i:端口号

#### 查看系统架构类型
- arch 命令主要用于显示操作系统架构类型

#### 查看分组和用户所属组

- cat /etc/group

### **查看系统架构(通用)**
- echo $(echo "$(uname -s|tr '[:upper:]' '[:lower:]'|sed 's/mingw64_nt.*/windows/')-$(uname -m | sed 's/x86_64/amd64/g')" | awk '{print tolower($0)}')

#### 压缩，解压
- .tar.gz 和 .tgz

```
　　解压：tar zxvf FileName.tar.gz
　　压缩：tar zcvf FileName.tar.gz DirName
```
- .zip

```
解压：unzip FileName.zip
压缩：zip FileName.zip DirName
压缩一个目录使用 -r 参数，-r 递归。例： $ zip -r FileName.zip DirName
```
- .tar

```
 解包：tar xvf FileName.tar
 打包：tar cvf FileName.tar DirName
（注：tar是打包，不是压缩！）
```