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
-  末尾附带该使用Rust工程源码，供初学者集成原理学习使用（简单步骤有省略，有疑问可邮件我）
   
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
- 创建Android代码, RustGreetings类， 使用kotlin所以用external声明JNI函数
```
class RustGreetings {
    fun sayHello(to: String): String {
        return greeting(to)
    }

    companion object {
        @JvmStatic external fun greeting(pattern: String): String
    }
}
```

- 在Rust lib库下，编写对应的JNI函数映射，从create.io下可以看到有关JNI的使用，代码如下

```rust
use jni::JNIEnv;

// These objects are what you should use as arguments to your native
// function. They carry extra lifetime information to prevent them escaping
// this context and getting used after being GC'd.
use jni::objects::{JClass, JString};

// This is just a pointer. We'll be returning it from our function. We
// can't return one of the objects with lifetime information because the
// lifetime checker won't let us.
use jni::sys::jstring;

// This keeps Rust from "mangling" the name and making it unique for this
// crate.
#[no_mangle]
pub extern "system" fn Java_com_android_integratingrust_RustGreetings_greeting(
    env: JNIEnv,
    // This is the class that owns our static method. It's not going to be used,
    // but still must be present to match the expected signature of a static
    // native method.
    class: JClass,
    input: JString,
) -> jstring {
    // First, we have to get the string out of Java. Check out the `strings`
    // module for more info on how this works.
    let mut input: String = env
        .get_string(input)
        .expect("Couldn't get java string!")
        .into();

    input = append_string(&input);

    // Then we have to create a new Java string to return. Again, more info
    // in the `strings` module.
    let output = env
        .new_string(format!("Hello, {}!", input))
        .expect("Couldn't create java string!");

    // Finally, extract the raw pointer to return.
    output.into_raw()
}


//============== rust code ===============
fn append_string(value: &str) -> String {
    let mut origin = String::from(value);
    origin.push_str("this is Rust");
    return origin;
}


```

## 五，编译Rust代码为so
-  编译之前确认之前rust环境是可以使用的了，且要看下rustup target 下是否已经有要交叉编译的工具了。
- rustc --print target-list | grep android 可以查看相关android 交叉编译工具,（我们demo之前在配置target时，使用了32和64位的ARM CPU 架构linker）
```
aarch64-linux-android
arm-linux-androideabi
armv7-linux-androideabi
i686-linux-android
thumbv7neon-linux-androideabi
x86_64-linux-android
```
- 如果没有安装，需要安装下对应的, rustup target list可以查看到那些已经安装和rust支持的。

### 执行编译
- 到rust_lib目录下执行编译

```rust
cargo build --target aarch64-linux-android --release

```

- 编译成功到target目录下release下去查看对应的so文件

```
.
├── CACHEDIR.TAG
├── aarch64-linux-android
│   ├── CACHEDIR.TAG
│   └── release
├── armv7-linux-androideabi
│   ├── CACHEDIR.TAG
│   └── release
├── debug
│   ├── build
│   ├── deps
│   ├── examples
│   └── incremental
└── release
    ├── build
    ├── deps
    ├── examples
    └── incremental
```

## 使用rust代码运行工程
- copy 对应的so文件到 Android工程下src/main/libs下
- 在Android工程下build.gradle下记得引用so为jniLibs

```
    sourceSets {
        main {
            jniLibs.srcDirs = ['src/main/libs']
        }
    }
```

- 至此，应该可以直接运行看效果了，**如果有需帮助可以邮件我，或者下载源码**  [地址](https://github.com/zhulg/AndroidIntegratingRust)