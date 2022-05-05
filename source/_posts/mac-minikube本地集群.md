---
title: mac minikube本地集群
tags: K8S
abbrlink: 27685
date: 2017-11-08 19:40:16
---

### Minikube 本地集群

- Minikube可以在任意主机上运行单节点的小型集群，这个工具默认安装和配置了一个Linux  VM，Docker和Kubernetes的相关组件，并且提供Dashboard。目前支持在Linux, OS X及Windows上安装
- Minikube是一个本地的kubernetes
- Minitube项目地址：https://github.com/kubernetes/minikube

#### 1,本机环境监测

Minikube要求在BIOS中对VT-x/AMD-v进行了虚拟化，如果已经设置了，则命令执行后会有以下内容输出：

```
$ sysctl -a | grep machdep.cpu.features | grep VMX

machdep.cpu.features: FPU VME DE PSE TSC MSR PAE MCE CX8 APIC SEP MTRR PGE MCA CMOV PAT PSE36 CLFSH DS ACPI MMX FXSR SSE SSE2 SS HTT TM PBE SSE3 PCLMULQDQ DTES64 MON DSCPL VMX EST TM2 SSSE3 FMA CX16 TPR PDCM SSE4.1 SSE4.2 x2APIC MOVBE POPCNT AES PCID XSAVE OSXSAVE SEGLIM64 TSCTMR AVX1.0 RDRAND F16C
```

<!-- more -->


#### 2,安装虚拟机驱动

- 在OS X上支持xhyve driver、VirtualBox、VMware Fusion多种虚拟驱动 

#### 3,安装Minikube
- brew cask install minikube
- minikube version （监测成功）

#### 4,打开虚拟机
#### 5，minikube 启动
```
$minikube start
Starting local Kubernetes v1.8.0 cluster...
Starting VM...
Downloading Minikube ISO
 140.01 MB / 140.01 MB [============================================] 100.00% 0s
Getting VM IP address...
Moving files into cluster...
Downloading localkube binary
 148.56 MB / 148.56 MB [============================================] 100.00% 0s
Setting up certs...
Connecting to cluster...
Setting up kubeconfig...
Starting cluster components...
Kubectl is now configured to use the cluster.
```
#### 6，kubectl get nodes 查看nodes

####7， 部署应用前
- 由于墙的原因，Minitube运行需要了的一些镜像是不能被下载的。故需要先解决下gcr.io的访问
- minikube ssh （登录到虚拟机，下载需要的K8S镜像）
- 一个比较恶心的过程，使用阿里云进行下载需要的镜像
- 查看缺失的镜像，可以exit退出ssh.回到本机 minikube logs 从日志里查看。

```
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kubernetes-dashboard-amd64:v1.7.0
docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/kubernetes-dashboard-amd64:v1.7.0 gcr.io/google_containers/kubernetes-dashboard-amd64:v1.7.0

docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/k8s-dns-sidecar-amd64:1.14.5
docker tag  registry.cn-hangzhou.aliyuncs.com/google_containers/k8s-dns-sidecar-amd64:1.14.5 gcr.io/google_containers/k8s-dns-sidecar-amd64:1.14.5

docker pull registry.cn-hangzhou.aliyuncs.com/outman_google_containers/k8s-dns-dnsmasq-nanny-amd64:1.14.5
docker tag  registry.cn-hangzhou.aliyuncs.com/outman_google_containers/k8s-dns-dnsmasq-nanny-amd64:1.14.5  gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64:1.14.5

docker pull registry.cn-hangzhou.aliyuncs.com/outman_google_containers/k8s-dns-kube-dns-amd64:1.14.5
docker tag registry.cn-hangzhou.aliyuncs.com/outman_google_containers/k8s-dns-kube-dns-amd64:1.14.5 gcr.io/google_containers/k8s-dns-kube-dns-amd64:1.14.5
```
- 以上缺失就继续从log查看pull失败原因，再从阿里云拉起镜像，用tag映射下。
- docker images 可以查看下载的镜像

```
docker images
REPOSITORY                                                                               TAG                 IMAGE ID            CREATED             SIZE
gcr.io/google_containers/k8s-dns-sidecar-amd64                                           1.14.5              fed89e8b4248        6 weeks ago         41.8MB
registry.cn-hangzhou.aliyuncs.com/google_containers/k8s-dns-sidecar-amd64                1.14.5              fed89e8b4248        6 weeks ago         41.8MB
registry.cn-hangzhou.aliyuncs.com/outman_google_containers/k8s-dns-kube-dns-amd64        1.14.5              512cd7425a73        6 weeks ago         49.4MB
gcr.io/google_containers/k8s-dns-kube-dns-amd64                                          1.14.5              512cd7425a73        6 weeks ago         49.4MB
gcr.io/google_containers/k8s-dns-dnsmasq-nanny-amd64                                     1.14.5              459944ce8cc4        6 weeks ago         41.4MB
registry.cn-hangzhou.aliyuncs.com/outman_google_containers/k8s-dns-dnsmasq-nanny-amd64   1.14.5              459944ce8cc4        6 weeks ago         41.4MB
gcr.io/google-containers/kubernetes-dashboard-amd64                                      v1.7.0              284ec2f8ed6c        6 weeks ago         128MB
gcr.io/google_containers/kubernetes-dashboard-amd64                                      v1.7.0              284ec2f8ed6c        6 weeks ago         128MB
registry.cn-hangzhou.aliyuncs.com/google_containers/kubernetes-dashboard-amd64           v1.7.0              284ec2f8ed6c        6 weeks ago         128MB
gcr.io/google-containers/kube-addon-manager                                              v6.4-beta.2         0a951668696f        4 months ago        79.2MB
registry.cn-hangzhou.aliyuncs.com/google_containers/kube-addon-manager                   v6.4-beta.2         0a951668696f        4 months ago        79.2MB
gcr.io/google_containers/echoserver                                                      1.4                 a90209bb39e3        17 months ago       140MB
registry.cn-hangzhou.aliyuncs.com/acs/echoserver                                         1.4                 a90209bb39e3        17 months ago       140MB
gcr.io/google_containers/pause-amd64                                                     3.0                 99e59f495ffa        18 months ago       747kB
registry.cn-hangzhou.aliyuncs.com/google-containers/pause-amd64                          3.0                 99e59f495ffa        18 months ago       747kB
```


### 8,启动一个echoserver pod
```
$ kubectl run hello-minikube --image=gcr.io/google_containers/echoserver:1.4 --port=8080
deployment "hello-minikube" created
```

- 通过NodePort暴露的服务
```
$ kubectl expose deployment hello-minikube --type=NodePort
service "hello-minikube" exposed
```

### 9,查看pods状态
```
kubectl get pods
NAME                              READY     STATUS    RESTARTS   AGE
hello-8649f955b6-c54tx            1/1       Running   0          22h
hello-minikube-5bc754d4cd-zbrh6   1/1       Running   0          9h
```

- mikubectl get pod -o wide --all-namespaces(查看所有命名空间)

```
NAMESPACE     NAME                              READY     STATUS    RESTARTS   AGE       IP               NODE
default       hello-8649f955b6-c54tx            1/1       Running   0          22h       172.17.0.2       minikube
default       hello-minikube-5bc754d4cd-zbrh6   1/1       Running   0          9h        172.17.0.3       minikube
kube-system   kube-addon-manager-minikube       1/1       Running   0          23h       192.168.99.100   minikube
kube-system   kube-dns-6fc954457d-htd94         3/3       Running   5          9h        172.17.0.5       minikube
kube-system   kubernetes-dashboard-tkhjw        1/1       Running   0          9h        172.17.0.4       minikube
```
### 10, curl $(minikube service hello-minikube --url) 测试服务
###11，minikube dashboard(启动观察页)
- Minikube自带了Kubernetes Dashboard。要浏览这个界面，可以使用内置的minikube dashboard命令。

```
$ minikube dashboard
Opening kubernetes dashboard in default browser...
```
![](https://raw.githubusercontent.com/zhulg/allpic/master/k8s.png)

### 12,过程中注意问题记录

- 镜像下载，代理过程翻墙不能解决，最后在虚拟机上通过阿里下载所需要的镜像，通过tag隐射。
- 不正常需要查看kubectl get pods --all-namespaces pods情况
- minikube logs 查看过程中的日志，定位问题
- 最后启动dashboard过程，注意自己是否有代理，否则起不起来
- 常用命令 kubectl get nodes 查看工作节点

### 参考文章
- http://blog.csdn.net/yjk13703623757/article/details/71381361 参考文章
- http://blog.csdn.net/aixiaoyang168/article/details/78331847?locationNum=10&fps=1 (参考文章)

### 13，基本概念和指令

- Kubernetes 集群由两种类型的资源组成：master 和 Nodes。 master是集群的调度节点，nodes则是应用程序实际运行的工作节点。
- 类似于nginx的 master 和 worker。
- 部署应用时需要创建deployment。每个deployment 会根据指定的副本数，创建相应的pod来托管我们的应用实例。
- Pod可以理解为应用实例特定的逻辑主机，表示一个或多个容器组和这些容器的共享资源，包共用卷、唯一的集群IP和容器运行的信息，如端口等。
- Node是kubernetes的工作机器（物理机或虚拟机）。Node由master管理，可以在一个node上部署多个pod。
- 每个node至少需要两种组件，kubelet 和 容器运行时（docker）。
- kubelet是负责master和所有节点间的通信进程，管理机器上运行的pod和容器。容器运行时负责从registry拉取镜像，解包镜像并运行应用实例。

- kubectl 有一系列指令管理实例的运行情况。

```
// 查看deployment
kubectl get deployments
// 删除deployment，会自动删除相应pods
kubectl delete deployment <部署名>
// 查看pods
// 查看当前namespace下的pods
kubectl get pods
// 查看所有pods
kubectl get pods --all-namespaces
// 查看pods的具体信息
kubectl describe pod <pod name>
//特定namespace下的，需要指定namespace
kubectl describe pod <pod name> --namespace=kube-system
// 查看pod日志
kubectl logs pod <pod name>
// 进入pod
kubectl exec -it <pod name> bash
```



