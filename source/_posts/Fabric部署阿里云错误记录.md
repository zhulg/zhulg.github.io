---
title: Fabric部署阿里云错误记录
date: 2018-05-14 19:27:57
tags: [fabric,部署]
---

#### Fabric部署在阿里云上错误解决

- 正常执行docker-compose相关yaml，启动fabric容器时出现错误。
- 相关错误信息: runtime stack: runtime.throw(0xf11259, 0x2a)  /opt/go/src/runtime/panic.go:605 +0x95

<!-- more -->

```
atal error: unexpected signal during runtime execution
[signal SIGSEGV: segmentation violation code=0x1 addr=0x63 pc=0x7fb147df1259]

runtime stack:
runtime.throw(0xf11259, 0x2a)
        /opt/go/src/runtime/panic.go:605 +0x95
runtime.sigpanic()
        /opt/go/src/runtime/signal_unix.go:351 +0x2b8

goroutine 38 [syscall, locked to thread]:
runtime.cgocall(0xbf3800, 0xc4203fb5e8, 0xf0fa21)
        /opt/go/src/runtime/cgocall.go:132 +0xe4 fp=0xc4203fb5a8 sp=0xc4203fb568 pc=0x4023b4
net._C2func_getaddrinfo(0x2f0ca00, 0x0, 0xc4203ff050, 0xc42000e298, 0x0, 0x0, 0x0)
        net/_obj/_cgo_gotypes.go:86 +0x5f fp=0xc4203fb5e8 sp=0xc4203fb5a8 pc=0x5f893f
net.cgoLookupIPCNAME.func2(0x2f0ca00, 0x0, 0xc4203ff050, 0xc42000e298, 0xc420423b60, 0x7ffeed519a83, 0x13)
        /opt/go/src/net/cgo_unix.go:151 +0x13f fp=0xc4203fb640 sp=0xc4203fb5e8 pc=0x5ffedf
net.cgoLookupIPCNAME(0x7ffeed519a83, 0x13, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0)
        /opt/go/src/net/cgo_unix.go:151 +0x175 fp=0xc4203fb738 sp=0xc4203fb640 pc=0x5fa195
net.cgoIPLookup(0xc420423c20, 0x7ffeed519a83, 0x13)
        /opt/go/src/net/cgo_unix.go:203 +0x4d fp=0xc4203fb7c8 sp=0xc4203fb738 pc=0x5fa8dd
runtime.goexit()
        /opt/go/src/runtime/asm_amd64.s:2337 +0x1 fp=0xc4203fb7d0 sp=0xc4203fb7c8 pc=0x45e391
created by net.cgoLookupIP
        /opt/go/src/net/cgo_unix.go:213 +0xaf
```

 - 问题原因是：DNS解析出了问题是阿里云主机的DNS部分配置GO语言的DNS解析不支持.
 
#### 问题具体原因
- 可以查看cd到etc/resolv.conf文件查看
- ure Go Resolver不支持的options single-request-reopen导致失败导致走了 CGO Resolver的方式

#### 问题修改
- 需要在使用的docker-compose.yaml里添加环境 GODEBUG=netdns=go，重新启动fabric网络

```
 environment:
    - GODEBUG=netdns=go
```


