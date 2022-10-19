---
title: Android集成Rust使用
tags: Rust
categories: Rust
toc: true
abbrlink: fc64e719
date: 2022-10-19 22:47:19
---

# Andorid调用Rust

- 目前rust在移动端上的应用，一般作为应用sdk的提供，供各端使用，目前飞书底层使用Rust编写通用组件。
-  末尾附带该使用Rust工程源码，供初学者集成原理学习使用（有疑问可邮件我）
   
## 一，开发环境：

- 确保rust开发环境，推荐官方文档, 安装即可
- Android相关开发环境，需要NDK的下载安装
- 环境变量的配置，为命令行使用提供全局环境

### 开发工具：
- 1. 如果对android studio比较熟悉，可安装rust插件 **（若文中图片无法显示，请科学上网查看：[推荐工具](https://order.yizhihongxing.network/aff.php?aff=12299)）**

<div align=center width=100%>
  <img width=80% src="https://github.com/zhulg/allpic/blob/master/vs_rust.png?raw=true">
</div>
安装完毕，对Rust Toolchain 位置进行配置确认，否则可能对rs文件无法识别，就无法愉快使用studio编写rust

-  2. **VScode: 推荐使用编写rust代码。**

## 二，创建Android工程:

- 与普通Android工程创建一样，创建Empty Activity
- 先编译通过该空工程

## 三，添加rust lib库：

- 进入到刚创建的AndroidIntegratingRust工程下

### 使用rust Cargo创建 lib库：

```rust
Cargo new rust_lib --lib
```

- 创建成功后会有rust_lib库，结构如下：

```
├── app
│   ├── build
│   ├── build.gradle
│   ├── libs
│   ├── proguard-rules.pro
│   └── src
├── build
│   └── kotlin
├── build.gradle
├── gradle
│   └── wrapper
├── gradle.properties
├── gradlew
├── gradlew.bat
├── local.properties
├── rust_lib //位置在这
│   ├── Cargo.lock
│   ├── Cargo.toml
│   ├── src
│   └── target
└── settings.gradle
```

### 编辑Cargo.toml

- 输入目前需要的jni库依赖, [https://crates.io/](https://crates.io/)地址下确认版本, create-type 填写cdylib 动态链接库

```rust

[lib]
name = "rust_lib"
crate-type = ["cdylib"]

[dependencies]
jni = "0.20.0"  

```

### 配置要编译so的linker及target

 - **这个在rust_lib下创建.cargo目录，添加config.toml配置文件**
 - 填入linker对应的ndk地址：

```rust
[target.aarch64-linux-android]
linker = "/Users/android-sdk-macosx/ndk-bundle/toolchains/llvm/prebuilt/darwin-x86_64/bin/aarch64-linux-android21-clang++"

[target.armv7-linux-androideabi]
linker = "/Users/android-sdk-macosx/ndk-bundle/toolchains/llvm/prebuilt/darwin-x86_64/bin/armv7a-linux-androideabi21-clang++"
```

 ps: 这是我的mac上ndk所在位置，参考Android官方ndk文档。
 
 - 准备编译rust代码为so的环境已经准备完

## 四，开始编写Android和Rust代码：