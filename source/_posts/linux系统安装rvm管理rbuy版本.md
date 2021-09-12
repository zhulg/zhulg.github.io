---
title: linux系统安装rvm管理rbuy版本
date: 2021-09-12 22:34:48
tags: Ruby
categories: Ruby
toc: true
---

### ruby使用
- ruby是个面向对象的脚本语言，相对比较小众使用，随着python的兴起。但是对应工具类的使用还是占有一席之地，使用也比较广泛很多创业公司也在只用。


### rvm是管理ruby的版本

- rvm类似node的nvm，方便管理对版本的管理和使用切换。由于ruby是不经常使用，**现用现学，快速解决问题，ruby也更简洁符合人类思维**。最近工具类使用了下对后续使用快速搭建环境做个简单的记录，后续能快速恢复知识和使用。

#### 安装rvm
- 1.可能会失败、按指示进行或者重复几次，依赖网络和翻墙情况
```
curl -L get.rvm.io | bash -s stable
```

- 2 . 查看rvm安装情况, 并生效配置其中的配置项  source /usr/local/rvm/scripts/rvm

```
find / -name rvm
```

- 3. 查看版本情况（可能你需要特定的版本安装）

```
rvm list known
```

-  4. 安装版本ruby（从上边选择你期望的版本）

```
rvm install  xxx
```

- 5. 使用版本ruby

```
rvm use  xxx

```
### 其他操作