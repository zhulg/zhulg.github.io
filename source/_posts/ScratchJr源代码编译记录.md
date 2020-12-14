---
title: ScratchJr源代码编译记录
date: 2020-12-14 17:26:51
tags: Scratch
categories: Scratch
top: Scratch
---

## ScratchJr编译

- 源码下载后可以根据相应的模块进行编译，由于源代码里包含google相关的统计服务，在国内环境下一版不会使用，国内有自己的统计和上报服务。
- 代码下载：https://github.com/LLK/scratchjr.git

## 环境搭建
- 1.需要安装相应的python svg& librsvg& imagemagick， 需要有brew相关环境

```
Run sudo easy_install pysvg to install python svg libraries
Run brew install librsvg to install commandline rsvg-convert
Run brew install imagemagick to install commandline magick
```

- 2.由于项目依赖nodejs ，需要安装相应的nodejs并在工程下载后进行 npm install 安装相应模块. 在项目跟目录

```
npm install 
```

- 依赖完成后会存在 node_modules 目录下，（ 如果不进行初始化依赖。后边工程将无法运行 scratchjr/node_modules/webpack/bin/webpack.js'）

## ios源码编译
- 进入源码的工程打开ios代码所在的目录, 查看相关Podfile , 由于原工程使用Firebase 需要google相关服务，可以直接拿掉。然后代码里去掉相关代码即可。

```
platform :ios, '8.0'
# add the Firebase pod for Google Analytics
#pod 'Firebase/Analytics'
target 'ScratchJr Free' do
end
target 'ScratchJrTests' do
end
```

- 去掉代码里相关的使用的相关地方:
- ![](https://raw.githubusercontent.com/zhulg/allpic/master/scratch7.png)
-  ![](https://raw.githubusercontent.com/zhulg/allpic/master/scratch8.png)
-  运行相关的工程，在运行务必进行npm install 初始化项目依赖，否则运行可能出现依赖错误导致界面异常。


## Android源码编译
- 进入android的目录打开studio进行编译，相同的直接去掉相关依赖
- 在build.gradle工程和Module的gradle文件里去掉相关依赖

```
  classpath 'com.google.gms:google-services
  apply plugin: 'com.google.gms.google-services'

```

- 注释去掉

```
 processFreeDebugGoogleServices.dependsOn switchToFreeGA
 processFreeReleaseGoogleServices.dependsOn switchToFreeGA

```


- 工程出现错误  bundle-compile.sh    finished with non-zero exit value 1 (这个是执行文件里所依赖的nodejs没有找到执行路径，需要软引用进行下处理) 

```
 sudo ln -s "$(which node)" /usr/local/bin/node
```