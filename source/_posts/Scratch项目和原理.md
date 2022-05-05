---
title: Scratch项目和原理
tags: Scratch
categories: Scratch
top: Scratch
abbrlink: 36765
date: 2020-12-09 14:57:43
---

## 项目构成
- Scratch-gui项目是其官方的开源scratch 3.0的编程网站代码，在上次记录里已经进行了初步编译构建，从其中的配置信息里可以看到相关的依赖库。

```
    "redux": "3.7.2",
    "redux-throttle": "0.1.1",
    "scratch-audio": "0.1.0-prerelease.20200528195344",
    "scratch-blocks": "0.1.0-prerelease.20201205050032",
    "scratch-l10n": "3.10.20201206031447",
    "scratch-storage": "1.3.3",
    "scratch-vm": "0.2.0-prerelease.20201125065300",
    "scratch-paint": "0.2.0-prerelease.20201020103914",
    "scratch-render": "0.1.0-prerelease.20201113223804",
    "scratch-svg-renderer": "0.2.0-prerelease.20201019174008",
    "startaudiocontext": "1.2.1",
    "style-loader": "^0.23.0",
    "text-encoding": "0.7.0",
    "to-style": "1.3.3",
    "wav-encoder": "1.3.0",
    "xhr": "2.5.0"
```

#### 主要依赖库介绍
- 这些模块也都在Scratch的项目组代码里

```
scratch-vm：虚拟机，管理状态并执行业务逻辑
scratch-blocks：代码积木块模块
scratch-l10n：国际化
scratch-paint：绘图拓展
scratch-render：舞台渲染，在舞台区域出现的基于WebGL的处理器
scratch-storage：作品存储加载
scratch-svg-renderer：svg的处理
scratch-audio：使用的声音拓展
```

## 运行原理
- **用scratch-blocks生成语句块---> 用scratch-vm 虚拟机抽象成底层语法---->调用scratch-render 和scratch-paint渲染到界面**

####运行模块的介绍：
- Scratch-blocks: Scratch Blocks是Google Blockly项目的一个分支，该项目提供了用于构建创意计算接口的设计规范和代码库。此代码库与Scratch虚拟机（VM）一起，可以快速设计和开发可视化编程接口。与Blockly不同，Scratch Blocks不使用代码生成器，而是利用Scratch虚拟机创建高度动态的交互式编程环境(官方翻译)
- ![官方介绍图](https://raw.githubusercontent.com/zhulg/allpic/master/scratch5.png)

```
scratch-blocks是scratch-gui依赖的一个基本模块。它的作用是生成gui界面上的blocks。blocks的作用是通过拖曳的方法组成blocks堆块
scratch-gui的blocks的生成文件在scratch-blocks\blocks_vertical里
一个块的定义，对应这背后的js函数
```

- 比如一个右转多少度的块的定义:

```
Blockly.Blocks['motion_turnright'] = {
  /**
 * Block to turn right.
 * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": “右转 %1 %2 度”,
      "args0": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "rotate-right.svg",
          "width": 24,
          "height": 24
        },
        {
          "type": "input_value",
          "name": "DEGREES"
        }
      ],
      "category": Blockly.Categories.motion,//块归属的类，这里是运动类。
      "extensions": ["colours_motion", "shape_statement"]
    });
  }
};
```

- scratch-vm:

```
虚拟机屏蔽底层硬件差异和dom渲染差异 , 使得程序可以跨端移植
react本质上也是虚拟机,虚拟dom屏蔽设备渲染差异( dom只有pc浏览器能识别 , 但虚拟dom是js对象 , 因而在手机上能解析成viewPort),native屏蔽底层硬件差异 ,使得程序可以在Android和ios都可以运行 
```

- 编译和启动:

```
git clone https://github.com/LLK/scratch-vm.git
cd scratch-vm
npm install
```

-  npm start后访问  http://localhost:8073/playground/
- ![](https://raw.githubusercontent.com/zhulg/allpic/master/scratch6.png)



- **sb2/sb3文件**:

```
 Scratch VM能解析的文件类型，sb2为Scratch2.0项目文件，sb3为Scratch3.0项目文件
```

## 参考
- https://github.com/LLK/scratch-gui/wiki/Getting-Started 
