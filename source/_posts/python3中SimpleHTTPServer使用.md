---
title: 使用python快速搭建静态服务器
tags:
  - Python
abbrlink: 25502
date: 2019-01-11 19:55:55
---

- python3 中使用 SimpleHTTPServer,由于在python3中，因为已经将BaseHTTPServer.py, SimpleHTTPServer.py, CGIHTTPServer.py 模块合并为了server模块，所以启动服务器的代码也有所改变

```
python3 -m http.server 8000

```

- python2之前都是 python -m SimpleHTTPServer 8000启动