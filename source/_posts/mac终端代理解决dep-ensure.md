---
title: mac终端代理解决dep ensure
date: 2018-10-08 13:39:07
tags: [go,stellar,区块链]
---

- 使用Stellar go sdk,同步sdk里的依赖dep ensure -v 发现错误，需要挂上代理了。

- dep ensure -v 出现类似错误。

```
The following errors occurred while deducing packages:
   "golang.org/x/net/http2": unable to deduce repository and source type for "golang.org/x/net/http2": unable to read metadata: unable to fetch raw metadata: failed HTTP request to URL "http://golang.org/x/net/http2?go-get=1": Get http://golang.org/x/net/http2?go-get=1: dial tcp xx.xx.xx.xx:80: i/o timeout
 
```
<!-- more -->

- 在当前端口设置,使端口也使用代理。设置前通过curl ip.cn 查看当前ip，设置后在查看，可以看到使用的是Shadowsocks代理的ip。(可在gwlist.js里需要确认系Shadowsocks的端口是否是1080)
- 新版本的ShadowSocks-NG 可以在设置里直接能查看到相关的端口。

```
export http_proxy=socks5://127.0.0.1:1080 
export https_proxy=socks5://127.0.0.1:1080 
export all_proxy=socks5://127.0.0.1:1080 
```
- 以上设置有时还是还是会失败，同步不下来。如果不行在通过http进行尝试，通过http方式可以来取下拉（需要查看ss的http端口是否是1087）

```
export http_proxy=http://127.0.0.1:1087
export https_proxy=https://127.0.0.1:1087 
export all_proxy=https://127.0.0.1:1087
```
- 