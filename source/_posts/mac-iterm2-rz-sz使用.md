---
title: mac iterm2 rz/sz上传下载文件
tags: linux
abbrlink: 16281
date: 2019-09-24 19:54:55
---

## 问题描述：

- 使用 rz 进行上传时却报错了：

```
rz waiting to receive.**B0100000023be50
使用 sz 下载也是报错：
**B00000000000000

```

## 解决方案：
- 安装 lrzsz :brew install lrzsz
- 配置 iTerm2

安装完成后我们需要在 iTerm2 中使用的话，还需要一些配置

进入到 /usr/local/bin 目录下，下载两个脚本文件

```
cd /usr/local/bin 
sudo wget https://gist.githubusercontent.com/sy-records/1b3010b566af42f57fa6fa38138dd22a/raw/2bfe590665d3b0e6c8223623922474361058920c/iterm2-send-zmodem.sh 
sudo wget https://gist.githubusercontent.com/sy-records/40f4ba22e3fbdeedf58463b067798962/raw/b32d2f7ac3fa54acca81be3664797cebb724690f/iterm2-recv-zmodem.sh
sudo chmod 777 /usr/local/bin/iterm2-* 
```

- 下载好之后我们进行 iTerm2 的配置 点击 iTerm2 的设置界面 Perference -> Profiles -> Default -> Advanced -> Triggers 的 Edit 按钮
-  点击+号，添加对应的参数

```
Regular expression: rz waiting to receive.\*\*B0100
            Action: Run Silent Coprocess
        Parameters: /usr/local/bin/iterm2-send-zmodem.sh
           Instant: checked

Regular expression: \*\*B00000000000000
            Action: Run Silent Coprocess
        Parameters: /usr/local/bin/iterm2-recv-zmodem.sh
           Instant: checked

```
添加配置 
