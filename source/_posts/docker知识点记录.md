---
title: docker知识点记录
tags: docker
abbrlink: 26571
date: 2017-10-21 10:37:39
---

### Docker概念点
 - **镜像（Image）**<br>
可以认为：镜像 = 操作系统 + 运行环境 + 应用程序。譬如，我们可以将 Centos7 操作系统、JVM 和 Java 应用程序做成一个镜像。我们交付的软件不再是 zip 包或者 war 包，而是镜像。Docker 镜像技术实现了应用程序运行环境与主机环境的无关性。
 - **容器（Container）**<br>
容器是镜像的运行态。通过 docker run 命令即可快速的基于镜像创建一个或多个容器。
- **镜像仓库（Registry）**<br>
在项目或者产品的不断迭代过程中，应用的各版本镜像存储在镜像仓库中，类似于代码仓库 for source code 或 Maven 仓库 for Jar file。

### Docker理念和使用

- Docker 的理念为“Build, Ship and Run Any App, Anywhere”，通过容器和镜像的特性让 DevOps 变得容易，但 Docker 的前景，更在于支持分布式、服务化设计，实现一系列可独立开发、独立部署和独立扩展的服务组合，以保证业务的灵活性和稳定性。
- 当前 AWS、微软、阿里云、IBM、Redhat、VMware、华为、Intel 等各大公有云和私有云提供商都不约而同地大力投资 Docker，实际上就是认可了这样的趋势。
- 利用 Docker 搭建微服务架构，就需要了解一些必需的 Docker 知识，比如镜像构建、容器创建、容器编排、集群管理、文件存储、容器网络、容器监控、容器日志。
- **拿一个包含 ABC 组件的微服务系统为例，我们会利用持续集成工具（例如 Jenkins）创建镜像，并将镜像推送到镜像仓库中（例如 Docker Registry，Harbor），再利用编排工具（例如 Docker Compose）创建并启动容器**.
- 容器启动后，ABC 组件就会随着容器一起启动，这时就需要考虑 ABC 组件的数据文件如何持久化存储，分布在不同主机上的组件如何网络通信（Docker 容器默认不能跨主机通信），容器资源使用情况如何监控，容器日志如何查看

<!-- more -->


### Docker安装

- 使用 Homebrew 安装，Homebrew 的 Cask 已经支持 Docker for Mac，因此可以很方便的使用 Homebrew Cask 来进行安装：
brew cask install docker

```
安装后查看：
docker --version
Docker version 1.13.0, build 49bf474
docker-compose --version
docker-compose version 1.10.0, build 4bd6f1a
docker-machine --version
docker-machine version 0.9.0, build 15fd4c7
```


### 使用Docker优势
- 环境依赖隔离
- 计算机资源隔离<br>
Docker 利用 Linux 的名称空间 (Namesaces)、控制组 (Contorl groups)、Union 文件系统和容器格式 (Container format) 实现了资源（例如 CPU、内存、IO 等）的隔离，保证同一台主机上的多个应用不会互相抢占资源。
- 迁移方便
- 版本管理更便捷<br>
之前，对于版本的管理，更多考虑的源代码级的，比如开个 Branch 或打个 Tag。现在，版本是一个包含了运行环境和程序包的镜像。在上线失败的时候，可以很快回滚到之前的版本。
- 编排的支持<br>
**微服务架构下，一个系统包含多个程序包，而多个程序包之间是有依赖关系的。Docker 编排工具可以帮助管理这些依赖关系，从而达到一键创建整个系统的目的**

### 常用命令

|命令|	解释|
|----|-----|
|docker images|	列表本地所有镜像|
|docker search |关键词	在Docker Hub中搜索镜像
|docker pull |镜像名称	下载Docker镜像
|docker rmi |镜像id	删除Docker镜像。加参数-f表示强制删除。
|docker run |镜像名称	启动Docker镜像
|docker ps	|列表所有运行中的Docker容器。该命令参数比较多，-a：列表所有容器；-f：过滤；-q 只列表容器的id。
|docker version	|查看Docker版本信息
|docker info	|查看Docker系统信息，例如：CPU、内存、容器个数等等
|docker kill |容器id	杀死id对应容器
|docker start / stop / restart |容器id	启动、停止、重启指定容器
|docker build -t |标签名称 目录	构建Docker镜像，-t 表示指定一个标签
|docker tag	|为镜像打标签

- docker run 应该是我们最常用的命令了(docker run -d -p 8080:8080 xxxx)

|参数|	解释|
|----|-----|
|-d |	后台运行
|-P	 |  随机端口映射
|-p |	指定端口映射 格式：<br>ip:hostPort:containerPort<br> ip::containerPort <br>hostPort:containerPort<br> containerPort


#### 批量删除Docker中已经停止的容器

```
#显示所有的容器，过滤出Exited状态的容器，取出这些容器的ID，
sudo docker ps -a|grep Exited|awk '{print $1}'
#查询所有的容器，过滤出Exited状态的容器，列出容器ID，删除这些容器
sudo docker rm `docker ps -a|grep Exited|awk '{print $1}'`

```

### Docker部署springcloud项目
- **dockerfile文件的构成,如下dockerfile**

```
FROM frolvlad/alpine-oraclejdk8:slim
VOLUME /tmp
ADD eureka-server-0.0.1-SNAPSHOT.jar app.jar
#RUN bash -c 'touch /app.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]
EXPOSE 8761
```

- docker file编写指令：

```
FROM
    FROM <image>
    FROM <image>:<tag>
    FROM <image> <digest>
```
FROM指令必须指定且需要在Dockerfile其他指令的前面，指定的基础image可以是官方远程仓库中的，也可以位于本地仓库。后续的指令都依赖于该指令指定的image。当在同一个Dockerfile中建立多个镜像时，可以使用多个FROM指令。

- **VOLUME 格式为：VOLUME ["/data"]**<br>
使容器中的一个目录具有持久化存储数据的功能，该目录可以被容器本身使用，也可以共享给其他容器。当容器中的应用有持久化数据的需求时可以在Dockerfile中使用该指令。

- **ADD**<br>
从src目录复制文件到容器的dest。其中src可以是Dockerfile所在目录的相对路径，也可以是一个URL，还可以是一个压缩包

- **ENTRYPOINT**<br>
指定Docker容器启动时执行的命令，可以多次设置，但是只有最后一个有效。
`ENTRYPOINT`: 执行项目 `app.jar` 。为了缩短 Tomcat 启动时间，添加一个系统属性指向 `/dev/urandom` 作为 `Entropy Source`。


- **EXPOSE**<br>
为Docker容器设置对外的端口号。在启动时，可以使用-p选项或者-P选项做映射。



### docker&springboot 构建命令

- mvn package docker:build 构建镜像
- docker run -p 8761: 8761 -t forezp/eureka-server 运行镜像
- 参考例子 http://blog.csdn.net/forezp/article/details/70198649


### docker Compose
- Dockerfile 可以让用户管理一个单独的容器，那么如果我要管理多个容器呢，例如：我需要管理一个Web应用的同时还要加上其后端的数据库服务容器呢？Compose就是这样的一个工具。让我们看下官网对Compose的定义：
- Compose 是一个用于定义和运行多容器的Docker应用的工具。使用Compose，你可以在一个配置文件（yaml格式）中配置你应用的服务，然后使用一个命令，即可创建并启动配置中引用的所有服务

