---
title: k8s核心概念
tags: K8S
abbrlink: 18975
date: 2017-11-03 14:25:50
---

### kubernetes核心概念
- Kubernetes（k8s）是自动化容器操作的开源平台，这些操作包括部署，调度和节点集群间扩展。如果你曾经用过Docker容器技术部署容器，那么可以将Docker看成Kubernetes内部使用的低级别组件。
- Kubernetes可以：

```
自动化容器的部署和复制
随时扩展或收缩容器规模
将容器组织成组，并且提供容器间的负载均衡
很容易地升级应用程序容器的新版本
提供容器弹性，如果容器失效就替换它，等等...
```


### K8s架构图

![](https://raw.githubusercontent.com/jasonGeng88/blog/master/201707/assets/k8s-frame-07.png)

#### Master
- master是集群的控制节点，负责整个集群的管理和控制。master节点可以运行在物理机或虚拟机中，因为它是整个集群的“大脑”，非常重要，所以要保证它的可用性与可靠性。可以把它独占一个物理机，或者放到虚拟机中，用master集群来保证其可靠性。

- k8s master由三个组件(进程)组成：
```
kube-apiserver: 提供http rest接口的服务进程，对k8s里面的所有资源进行增、删、改、查等操作。也是集群控制的入口；
kube-controler-manager: k8s里所有资源对象的自动控制中心，比如各个node节点的状态、pod的状态等；
kube-scheduler: 负责资源调度；
```

#### node
- 除了master，k8s集群中的其他节点是node节点,也是实际的工作点。node节点可以是一台物理机或者虚拟机。node节点是k8s集群中的工作负载节点，master会把一些任务调度到node节点上进行。当某个node出现故障时，master会把这个节点上的任务转移到其他节点上
