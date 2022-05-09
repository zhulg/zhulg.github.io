---
title: fabric分节点部署到不同线上机器
tags: 区块链
categories: 区块链
toc: true
abbrlink: 15189
date: 2018-04-14 14:48:18
---
#### 分机器部署节点
- fabric在真正的应用环境里是不同的节点是部署在不同的机器上的，peer,orderer在不同机器是，根据需要orderer可集群。
- 先尝试把peer,orderer部署到不同的机器上。


#### 线上部署
- 先搭建基本环境，使用例子验证基本环境通过。(基于Linux 3.10.0-514 x86_64)

##### 1，安装go
- 下载 (arch命令查看机子架构x86,amd,arm，下载对应的架构go包)
```
wget https://storage.googleapis.com/golang/go1.10.linux-amd64.tar.gz
sudo tar -xzf go1.10.linux-amd64.tar.gz -C /usr/local 
```
- 配置

```
sudo vim /etc/profile 
并添加下面的内容：
export GOROOT=/usr/local/go
export GOBIN=$GOROOT/bin
export PATH=$PATH:$GOBIN
export GOPATH=$HOME/gopath (可选设置)

```
- 生效 source /etc/profile

##### 2,安装docker

```
wget -qO- https://get.docker.com/ | sh
```

- 如上一步骤有报错 Error: Delta RPMs disabled because /usr/bin/applydeltarpm not installed....可以先通过如下命令查找该包的包名：
```
yum provides '*/applydeltarpm'
然后用如下命令安装即可解决：
yum install deltarpm
```
- 最后还是没安装上
- 其他方式安装
```
yum install docker
启动Docker服务：
service docker start
```
##### 3,安装docker-compose
- **第一种，使用yum安装**
```
需要先安装企业版linux附加包（epel)
 yum -y install epel-release
安装pip
yum -y install python-pip
更新pip
pip install --upgrade pip
安装docker-compose
pip install docker-compose
查看docker-compose版本信息
docker-compose --version
环境正常可以直接安装（pip install docker-compose）
```
- **或者使用下载包安装**

```
sudo curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

```

#### 下载fabric源码

- go get github.com/hyperledger/fabric
- cd /root/gopath/src/github.com/hyperledger/fabric
- 目前使用1.0.6版本，刚发布1.1release.考虑稳定切换到1.0.6
- branch里是没有1.0.6办的，使用指定tag的版本进行切换
```
git tag （可以发现1.0.6版本）
git checkout -b 1.0.6  v1.0.6 （可拉取指定tag）
```
#### 进入源码提供脚本拉取镜像
- fabric/examples/e2e_cli目录下，使用bash download-dockerimages.sh 下载需要的网络镜像。
- 也可以使用本地已经下载好的镜像（原因是下载太特么慢了要几个小时，就用下载好的镜像了）

```
1,save本地镜像1.0.6的到images
docker save $(docker images | grep 1.0.6 | awk {'print $1'} ) -o images
2,上传到目前不机器,用户的根目录
scp images xxxx@10.xxx.xx.xxx:~
3,导入image
docker load -i images
```
#### 运行源码下的例子
- 进入源码里/examples/e2e_cli

```
./network_setup.sh up
```
#### 一个坑记录（mac下没问题是被生存的docker网络刚好是要找的）
-- fabric源码里的例子example下的e2e_cli启动时定义要找的名字与生成的名字会不一致。e2e_cli_default而定义要找的是e2ecli_default
```
Error: Error endorsing chaincode: rpc error: code = Unknown desc = Error starting container: API error (404): {"message":"network chlnetwork not found"}
```
- 运行docker network ls命令，看一眼显示出来的网络里，有没有报错里那个网络，如果没有的话，将你的本地网络改为命令输出里的网络。
- 改动配置文件e2e_cli/base/peer-base.yaml，里面的参数ORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=e2e_cli_default
- **关于docker网络名字，默认使用项目跟目录的项目名字_default,所以


#### hyperledger fabric技术交流群

- 到期或者失效，发邮件(lg.json@gmail.com)给我你微信，拉你进群。

![](https://raw.githubusercontent.com/zhulg/allpic/master/weixin.png)