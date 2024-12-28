---
title: mac上django安装
tags:
  - Python
  - django
abbrlink: 34049
date: 2018-06-26 22:37:33
---

#### django安装失败问题记录
- Django是一个开放源代码的Web应用框架，由Python写成。采用了MTV的框架模式，即模型M，模板T和视图V。
- 使用django快速开发后端业务。
- pip3 install django时直接安装会失败，一般原因是网络超时导致，原因...


- https://pypi.doubanio.com/simple/django/ 从这个目录地址可以看到django的版本
- 使用命令行进行安装（pip3目前使用）指定版本时diango==xxxx

```
pip3 install -i https://pypi.douban.com/simple django==1.10.8

```
- 默认最新版本时

```
pip3 install -i https://pypi.douban.com/simple django
```