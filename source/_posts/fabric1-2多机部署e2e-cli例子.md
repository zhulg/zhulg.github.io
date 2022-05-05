---
title: fabric1.2多机部署e2e_cli例子
tags: 区块链
categories: 区块链
toc: true
abbrlink: 61570
date: 2018-08-09 11:40:27
---

### fabric1.2版本多机器部署e2e_cli

- 在实际的生产环境fabric的多个peer节点跟着组织接入网络，这些机器分布在各个地方，各个机器上。
- 而例子是在一台机器部署演示，故进行生产环境拆分部署验证。（后续进行k8s验证使用）
- 目前准备拆分1.2版本e2e_cli例子，有4个kafka,3个zookeeper,1个order,4个peer,1个cli.
- **个人笔记记录，如需交流邮件（lg.json@gmail.com）**

<!-- more -->

### 一，机器准备：
- 为验证分布式多机器部署，拆分思路：拆分4个peer到(41,42,37,38机器上)，cli与pee0共在41机器上。
- zookeeper有3个，拆分到32，33，34机器上
- kafka有4个，（暂不拆分，与拆分zookeeper同理），orderer和kafka保留在40机器上。

```
10.112.178.40 （order,kafka）

10.112.178.41  (peer0-org1,cli)
10.112.178.42  (peer1-org1)
10.112.178.37  (peer0-org2)
10.112.178.38  (peer1-org2)

10.112.178.32 (zookeeper0)
10.112.178.33 (zookeeper1)
10.112.178.34 (zookeeper2)

```

#### 1，机器环境准备：

- 安装crul **sudo yum install curl**

- 出现错误执行curl更新：

```
curl: (35) Peer reports incompatible or unsupported protocol version.
使用该命令更新： sudo yum update -y nss curl libcurl 

```

- **docker卸载**

```
 sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine \
                  docker-ce
```

- **使用这个脚本快速安装docker**

```
#!/bin/sh
sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine \
                  docker-ce

sudo yum install -y yum-utils device-mapper-persistent-data lvm2
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
sudo yum makecache fast
sudo yum -y install docker-ce
echo "====================begin start docker =========================="
sudo service docker start
echo "==================== end  =========================="

```


- **安装docker composer**

```
sudo curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose --version

```


- **安装go** 
- https://studygolang.com/dl 从golang中文网下载需要的包，1.10.3

```
curl -O https://dl.google.com/go/go1.10.3.linux-amd64.tar.gz  //下载

sudo tar -C /usr/local -xzf go1.10.3.linux-amd64.tar.gz  //解压

```

- **go环境变量**  sudo vim /etc/profile 添加如下，第一个是系统go的地址。后两个是你相关的go的工作目录，和你go的工程生成的bin。

```
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin

```

- **下载fabric1.2镜像和官方例子**(一般是下载不了的，通过访问地址，保存成sh在执行就搞定)

```
curl -sSL http://bit.ly/2ysbOFE | bash -s 1.2.0

```
- **跑个例子验证下环境**
- cd fabric-samples/first-network

```
./byfn.sh  up

```
#### 2， 安装其他机器环境

- 把下载fabric镜像直接考过去，直接下太慢。

```
 docker save $(docker images -q) -o images1.2 （这种方式导入时还需要重新建tag）
 docker save $(docker images |grep hyperledger | awk {'print $1'} ) -o myimages1.2 //这种可以直接导入不需重建tag

```

- scp到其他机器上，进行docker导入

```
docker load - i myimages1.2

```

- 其他环境也同上安装下，使各个机器环境一致，特别是docker。


### 二， 进行peer拆分

- 进入40机器上e2e_cli例子下 ./network_setup.sh up  正常了 ./network_setup.sh down 仅验证环境
- 执行./generateArtifacts.sh mychannel 系统会创建channel-artifacts文件夹，里面包含了mychannel这个通道相关的文件，另外还有一个crypto-config文件夹，里面包含了各个节点的公私钥和证书的信息。
- 在其他机器上源码例子里，先删掉e2e_cli,在使用40机器上e2e_cli(确保40上执行了./generateArtifacts.sh mychannel后)，确保各个机器使用相同的私钥正式。

```
xx替换成41,42,37,38，都用40上的e2e_cli
scp -r e2e_cli/  zhulianggang@10.112.178.XX:/home/zhulianggang/go/src/github.com/hyperledger/fabric/examples/

```
#### 1，41机器上peer0.org1.example.com

- 41机器上e2e_cli下创建docker-compose-peer.yaml,内容如下：
- 41上运行pee0,和cli，注意 extra_hosts: 使用

```

# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

version: '2'

services:

  peer0.org1.example.com:
    container_name: peer0.org1.example.com
    extends:
      file:  base/docker-compose-base.yaml
      service: peer0.org1.example.com
    extra_hosts: 
      - "orderer.example.com:10.112.178.40" 


  cli:
    container_name: cli
    image: hyperledger/fabric-tools
    tty: true
    environment:
      - GOPATH=/opt/gopath
      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
      - CORE_LOGGING_LEVEL=DEBUG
      - CORE_PEER_ID=cli
      - CORE_PEER_ADDRESS=peer0.org1.example.com:7051
      - CORE_PEER_LOCALMSPID=Org1MSP
      - CORE_PEER_LOCALMSPTYPE=bccsp
      - CORE_PEER_TLS_ENABLED=true
      - CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
      - CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
      - CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
      - CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
    # command: /bin/bash -c './scripts/script.sh ${CHANNEL_NAME}; sleep $TIMEOUT'
    volumes:
        - /var/run/:/host/var/run/
        - ../chaincode/go/:/opt/gopath/src/github.com/hyperledger/fabric/examples/chaincode/go
        - ./crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/
        - ./scripts:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/
        - ./channel-artifacts:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts
    depends_on:
      # - orderer.example.com
      - peer0.org1.example.com
      # - peer1.org1.example.com
      # - peer0.org2.example.com
      # - peer1.org2.example.com
    extra_hosts: 
      - "orderer.example.com:10.112.178.40" 
      - "peer0.org1.example.com:10.112.178.41"
      - "peer1.org1.example.com:10.112.178.42"
      - "peer0.org2.example.com:10.112.178.37"
      - "peer1.org2.example.com:10.112.178.38"
      
```

#### 2，42机器上peer1.org1.example.com
- 42机器上创建docker-compose-peer.yaml

```
version: '2'
services:

  peer1.org1.example.com:
    container_name: peer1.org1.example.com
    extends:
      file:  base/docker-compose-base.yaml
      service: peer1.org1.example.com
    extra_hosts: 
      - "orderer.example.com:10.112.178.40"
      
```


#### 3，37机器上peer1.org1.example.com

- 37机器上创建docker-compose-peer.yaml

```
version: '2'
services:

  peer0.org2.example.com:
    container_name: peer0.org2.example.com
    extends:
      file:  base/docker-compose-base.yaml
      service: peer0.org2.example.com
    extra_hosts: 
      - "orderer.example.com:10.112.178.40" 
      
```

#### 4，38机器上peer1.org1.example.com

- 38机器上创建docker-compose-peer.yaml

```
version: '2'
services:

  peer1.org2.example.com:
    container_name: peer1.org2.example.com
    extends:
      file:  base/docker-compose-base.yaml
      service: peer1.org2.example.com
    extra_hosts: 
      - "orderer.example.com:10.112.178.40" 
```

### 三， 进行zookeeper拆分

- 分别在32，33，34上创建zookeeper_0.yaml,zookeeper_1.yaml,zookeeper_2,yaml
- ZOO_SERVERS本机的需要修改0.0.0.0，如果写为ip，则2888:3888只为本机开放，外面机器无法访问。

- **zookeeper_0.yaml内容**

```
version: '2'
services:
  zookeeper0:
    container_name: zookeeper0
    extends:
      file: base/docker-compose-base.yaml
      service: zookeeper
    environment:
      - ZOO_MY_ID=1
      - ZOO_SERVERS=server.1=0.0.0.0:2888:3888 server.2=10.112.178.33:2888:3888 server.3=10.112.178.34:2888:3888
```

- **zookeeper_1.yaml内容**
- 可以使用 extra_hosts对应，也可以直接使用ip如上边zookeeper_0那样使用,但本机器必须0.0.0.0，否则zookepper无法使用

```
version: '2'
services:
 zookeeper1:
    container_name: zookeeper1
    extends:
      file: base/docker-compose-base.yaml
      service: zookeeper
    environment:
      - ZOO_MY_ID=2
      - ZOO_SERVERS=server.1=zookeeper0:2888:3888 server.2=0.0.0.0:2888:3888 server.3=zookeeper2:2888:3888

    extra_hosts:
     - "zookeeper0:10.112.178.32"
     - "zookeeper1:10.112.178.33"
     - "zookeeper2:10.112.178.34"
```
- **zookeeper_2.yaml内容**

```
version: '2'
services:
 zookeeper2:
    container_name: zookeeper2
    extends:
      file: base/docker-compose-base.yaml
      service: zookeeper
    environment:
      - ZOO_MY_ID=3
      - ZOO_SERVERS=server.1=zookeeper0:2888:3888 server.2=zookeeper1:2888:3888 server.3=0.0.0.0:2888:3888

    extra_hosts:
     - "zookeeper0:10.112.178.32"
     - "zookeeper1:10.112.178.33"
     - "zookeeper2:10.112.178.34"
     
```

### 四，对40上docker-peer-cli继续修改

- 这里面去掉了cli,去掉了zookeeper，去掉了zookeeper的依赖。
- kafka上KAFKA_ZOOKEEPER_CONNECT部分可以使用zookeeper，需要进行extra_hosts一块用。也可以直接用ip使用。


```
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
#

version: '2'

services:
#  zookeeper0:
#    container_name: zookeeper0
#    extends:
#      file: base/docker-compose-base.yaml
#      service: zookeeper
#   environment:
#      - ZOO_MY_ID=1
#      - ZOO_SERVERS=server.1=zookeeper0:2888:3888 server.2=zookeeper1:2888:3888 server.3=zookeeper2:2888:388
#  zookeeper1:
#    container_name: zookeeper1
#    extends:
#      file: base/docker-compose-base.yaml
#      service: zookeeper
#    environment:
#      - ZOO_MY_ID=2
#      - ZOO_SERVERS=server.1=zookeeper0:2888:3888 server.2=zookeeper1:2888:3888 server.3=zookeeper2:2888:388
# 
#  zookeeper2:
#    container_name: zookeeper2
#    extends:
#      file: base/docker-compose-base.yaml
#      service: zookeeper
#    environment:
#      - ZOO_MY_ID=3
#      - ZOO_SERVERS=server.1=zookeeper0:2888:3888 server.2=zookeeper1:2888:3888 server.3=zookeeper2:2888:388
#

  kafka0:
    container_name: kafka0
    extends:
      file: base/docker-compose-base.yaml
      service: kafka
    environment:
      - KAFKA_BROKER_ID=0
      - KAFKA_MIN_INSYNC_REPLICAS=2
      - KAFKA_DEFAULT_REPLICATION_FACTOR=3
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper0:2181,zookeeper1:2181,zookeeper2:2181
#    depends_on:
#      - zookeeper0
#      - zookeeper1
#      - zookeeper2
    extra_hosts:
      - "zookeeper0:10.112.178.32"
      - "zookeeper1:10.112.178.33"
      - "zookeeper2:10.112.178.34"

  kafka1:
    container_name: kafka1
    extends:
      file: base/docker-compose-base.yaml
      service: kafka
    environment:
      - KAFKA_BROKER_ID=1
      - KAFKA_MIN_INSYNC_REPLICAS=2
      - KAFKA_DEFAULT_REPLICATION_FACTOR=3
      - KAFKA_ZOOKEEPER_CONNECT=10.112.178.32:2181,10.112.178.33:2181,10.112.178.34:2181
#    depends_on:
#      - zookeeper0
#      - zookeeper1
#      - zookeeper2
    extra_hosts:
      - "zookeeper0:10.112.178.32"
      - "zookeeper1:10.112.178.33"
      - "zookeeper2:10.112.178.34"

  kafka2:
    container_name: kafka2
    extends:
      file: base/docker-compose-base.yaml
      service: kafka
    environment:
      - KAFKA_BROKER_ID=2
      - KAFKA_MIN_INSYNC_REPLICAS=2
      - KAFKA_DEFAULT_REPLICATION_FACTOR=3
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper0:2181,zookeeper1:2181,zookeeper2:2181
#    depends_on:
#      - zookeeper0
#      - zookeeper1
#      - zookeeper2
    extra_hosts:
      - "zookeeper0:10.112.178.32"
      - "zookeeper1:10.112.178.33"
      - "zookeeper2:10.112.178.34"

  kafka3:
    container_name: kafka3
    extends:
      file: base/docker-compose-base.yaml
      service: kafka
    environment:
      - KAFKA_BROKER_ID=3
      - KAFKA_MIN_INSYNC_REPLICAS=2
      - KAFKA_DEFAULT_REPLICATION_FACTOR=3
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper0:2181,zookeeper1:2181,zookeeper2:2181
#    depends_on:
#      - zookeeper0
#      - zookeeper1
#      - zookeeper2
    extra_hosts:
      - "zookeeper0:10.112.178.32"
      - "zookeeper1:10.112.178.33"
      - "zookeeper2:10.112.178.34"

  orderer.example.com:
    extends:
      file:   base/docker-compose-base.yaml
      service: orderer.example.com
    container_name: orderer.example.com
    depends_on:
#      - zookeeper0
#      - zookeeper1
#      - zookeeper2
      - kafka0
      - kafka1
      - kafka2
      - kafka3
    extra_hosts:
      - "zookeeper0:10.112.178.32"
      - "zookeeper1:10.112.178.33"
      - "zookeeper2:10.112.178.34"

  # peer0.org1.example.com:
  #   container_name: peer0.org1.example.com
  #   extends:
  #     file:  base/docker-compose-base.yaml
  #     service: peer0.org1.example.com

  # peer1.org1.example.com:
  #   container_name: peer1.org1.example.com
  #   extends:
  #     file:  base/docker-compose-base.yaml
  #     service: peer1.org1.example.com

  # peer0.org2.example.com:
  #   container_name: peer0.org2.example.com
  #   extends:
  #     file:  base/docker-compose-base.yaml
  #     service: peer0.org2.example.com

  # peer1.org2.example.com:
  #   container_name: peer1.org2.example.com
  #   extends:
  #     file:  base/docker-compose-base.yaml
  #     service: peer1.org2.example.com

  # cli:
  #   container_name: cli
  #   image: hyperledger/fabric-tools
  #   tty: true
  #   environment:
  #     - GOPATH=/opt/gopath
  #     - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock
  #     - CORE_LOGGING_LEVEL=DEBUG
  #     - CORE_PEER_ID=cli
  #     - CORE_PEER_ADDRESS=peer0.org1.example.com:7051
  #     - CORE_PEER_LOCALMSPID=Org1MSP
  #     - CORE_PEER_LOCALMSPTYPE=bccsp
  #     - CORE_PEER_TLS_ENABLED=true
  #     - CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.crt
  #     - CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/server.key
  #     - CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
  #     - CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
  #   working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer
  #   command: /bin/bash -c './scripts/script.sh ${CHANNEL_NAME}; sleep $TIMEOUT'
  #   volumes:
  #       - /var/run/:/host/var/run/
  #       - ../chaincode/go/:/opt/gopath/src/github.com/hyperledger/fabric/examples/chaincode/go
  #       - ./crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/
  #       - ./scripts:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/
  #       - ./channel-artifacts:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts
  #   depends_on:
  #     - orderer.example.com
  #     - peer0.org1.example.com
  #     - peer1.org1.example.com
  #     - peer0.org2.example.com
  #     - peer1.org2.example.com
  
```

### 五，进行启动验证

- 1,启动zookeeper,分别到32-34机器上启动,x为机器上对应的文件（0，1，2）

```
docker-compose -f zookeeper_x.yaml up -d 

```
- 2, 40上启动kafka和order, ./network_setup.sh up  

```
CONTAINER ID        IMAGE                        COMMAND                  CREATED             STATUS              PORTS                               NAMES
bea33ba03d0b        hyperledger/fabric-orderer   "orderer"                15 hours ago        Up 15 hours         0.0.0.0:7050->7050/tcp              orderer.example.com
0bbaf8c2476d        hyperledger/fabric-kafka     "/docker-entrypoint.…"   15 hours ago        Up 15 hours         9093/tcp, 0.0.0.0:33426->9092/tcp   kafka0
820c93d0b0dc        hyperledger/fabric-kafka     "/docker-entrypoint.…"   15 hours ago        Up 15 hours         9093/tcp, 0.0.0.0:33425->9092/tcp   kafka3
44a90d05f3df        hyperledger/fabric-kafka     "/docker-entrypoint.…"   15 hours ago        Up 15 hours         9093/tcp, 0.0.0.0:33424->9092/tcp   kafka1
ae73e577f5d3        hyperledger/fabric-kafka     "/docker-entrypoint.…"   15 hours ago        Up 15 hours         9093/tcp, 0.0.0.0:33423->9092/tcp   kafka2


```

- 3,到41，42，37，38上，运行peer

```
docker-compose -f docker-compose-peer.yaml up -d 

```

- 4,到41机器上通过进入cli docker exec -it cli bash后，验证。

```
./scripts/script.sh mychannel

```


### 常见错误

```
Error: got unexpected status: BAD_REQUEST -- error authorizing update: error validating ReadSet: readset expected key [Group]  /Channel/Application at version 0, but got version 1
!!!!!!!!!!!!!!! Channel creation failed !!!!!!!!!!!!!!!!
```
- 这个错误是执行过,导致script.sh里执行版本不一致 docker rm -f $(docker ps -aq)确保各平台容器一致。


- ，另一个常见问题秘钥和证书不一致，如果重新执行了生成了crypto-config，需要各个机器上一致。
