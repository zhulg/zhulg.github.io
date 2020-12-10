---
title: ios遗忘记录
date: 2019-10-1 22:53:06
tags: ios
categories : ios
toc: true
---


- ios相关快捷键

```
1.运行:command + R 
2.编译:command + B
3.停止:command + .
4.工程导航如图从左到右分别对应 command +1~8.
5.快速查找打开类:command+ shift+ O
6.command + shift + j              快速地在代码库定位文件，打开折叠的文件夹
  command + 1                      打开 工程导航器
  command + shift + f              打开 搜索导航器
  command + shift + 0              打开 文档和参考
  command + shift + o              打开 跳转栏和快速打开搜索输入，快速打开文件
  
7,command+control+ <--            前进或者后退代码

8，control+6                      列出当前类的所有方法

```



-  网上快捷键

```
Cmd + shift + O 快速查找类，通过这个可以快速跳到指定类的源代码中。
Ctrl + 6 列出当前文件中的所有方法，可以输入关键字过滤。
Cmd + Ctrl + Up 在.h 和 .m之间切换
Cmd + Shift + Y切换Console Vie的显示隐藏
Cmd + Ctrl + Left/Right 到上/下一次编辑的位置
Cmd + Opt + J 跳转到文件过滤区
Cmd + Shift + F 在工程中查找
Cmd + R 运行
Cmd + B 编译工程
Cmd + Shift + K 清空编译好的文件
Cmd + . 结束本次调试
Esc 调出代码补全
Cmd + 单击 查看方法实现
Opt + 单击 查看方法文档
Cmd + T 新建Tab栏
Cmd + Shift + [ 在Tab栏之间切换
```


- Property 和Synthesize
```
Property定义：@property 声明用于自动创建property属性变量的getter和setter
Synthesize定义：@Synthesize声明实现了property属性变量的getter和setter。
例子:
在  interface：@property dataType variableName
在  implementation:  synthesiz variableName
```

