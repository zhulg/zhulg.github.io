---
title: iOS集成Rust使用
tags: Rust
categories: Rust
toc: true
abbrlink: e04cad1e
date: 2022-10-23 09:37:06
---

# iOS调用Rust

## 一，开发环境：

- 确保xcode开发环境，推荐官方文档, 安装即可
- rust开发环境
-  xcode及iOS调试设备
-  末尾附带demo工程源码，供初学者集成原理学习使用（简单步骤有省略，有疑问可邮件我）

## 二，添加rust交叉编译
- 同android一样，可以添加支持ios的编译

```rust
rustup target add aarch64-apple-ios x86_64-apple-ios

```

- 初始化 cargo-lipo : 这个create可以编译rs为iOS需要的库

```rust
cargo install cargo-lipo
```

## 三，创建工程
- 这里的rs代码直接 **(参考了mozilla的例子，只为测试验证集成过程）**
- 创建iOS基本工程，并创建rust的库工程，可以创建lib，也可以直接rs工程。 **（一套rust代码，提供多个平台，那一般可以创建lib库，这样rust工程来调试后，统一对外提供lib库代码，由lib库代码编译对应的so,或者.a文件)**

```rust
cargo new Rust_iOS --lib
```

- 这里使用 Rust\_iOS 作为为iOS工程提供的rust 库代码，通过 cargo-lipo 编译出.a的库文件，为ios工程进行调用。

### rust代码添加
- 1. **在lib.rs里添加下边代码**

```rust
use std::ffi::{CStr, CString};
use std::os::raw::c_char;

//#[no_mangle] 告诉编译器不要破坏函数名，确保函数名称被导入到 C 文件
//extern 告诉 Rust 编译器方法将要在 Rust 以外的地方调用，要确保其按照 C 的调用规则编译。
#[no_mangle]
pub extern "C" fn rust_greeting(to: *const c_char) -> *mut c_char {
    let c_str = unsafe { CStr::from_ptr(to) };
    let recipient = match c_str.to_str() {
        Err(_) => "there",
        Ok(string) => string,
    };

    CString::new("Hello ".to_owned() + recipient)
        .unwrap()
        .into_raw()
}

#[no_mangle]
pub extern "C" fn rust_greeting_free(s: *mut c_char) {
    unsafe {
        if s.is_null() {
            return;
        }
        CString::from_raw(s)
    };
}

```

- 2. **greetings.h ：**src下添加一个名为 greetings.h 的新文件，来定义一下 C 接口，iOS调用的Rust函数在这里定义

``` rust
#include <stdint.h>
const char* rust_greeting(const char* to);
void rust_greeting_free(char *);

```

- 3. **Cargo.toml定义编译类型：**
    staticlib 编译会生成 .a 文件（在 Linux 和 MacOS 上），或 .lib 文件（在 Windows 上）。

```
[lib]
name = "greetings"
crate-type = ["staticlib", "cdylib"]
```

- 4. **编译成静态库:**

```rust
cargo lipo --release
```
构建产物位置在 target/下，通用 iOS 库的位置在  /target/universal/release/libRust_iOS.a

## 四，iOS工程引入Rust库：

### 导入 libRust_iOS.a 库:
- 创建demo ios 工程, **导入 libRust_iOS.a 库**（从rust工程找到，直接拖进入工程target下general）
- 链接 libresolv.tbd。 点击 Linked Frameworks 列表底部的 + 并在搜索框中键入 libresolv。 选择 libresolv.tbd

###  bridging header创建：
- 创建之前先把之前定义在rust工程里的.h文件引入过来，这个.h文件是rust代码调用的声明入口(File\Add files to“iOSIntegratingRust” )

- **创建bridging header：** File\New\File..。 从提供的选项中选择 iOS Source Header File 并选择 Next。 将文件命名为 Greetings-Bridging-Header.h 并选择 Create

- 引入greetings.h

```rust
#ifndef Greetings_Bridging_Header_h
#define Greetings_Bridging_Header_h
#import "greetings.h"
#endif

```

### iOS Build Settings:
- **设置Objective-C Bridging Header链接要的.h文件**， 工程 target 里打开 Build Settings 选项卡。 将 Objective-C Bridging Header设置为$(PROJECT_DIR)/Greetings-Bridging-Header.h （要看自己.h所在的位置）
- **设置 Xcode 要链接 Rust 库的路径**，  Build Settings 中 Library Search Paths中设置 $(PROJECT_DIR)/../Rust\_iOS/target/universal/release (要看自己库实际位置)


## 五，iOS代码调用：

- 从刚demo工程里新建一个 swift 文件，命名为 RustGreetings

```c
import Foundation
class RustGreetings {
    func sayHello(to: String) -> String {
        let result = rust_greeting(to)
        let swift_result = String(cString: result!)
        rust_greeting_free(UnsafeMutablePointer(mutating: result))
        return swift_result
    }
}

```

- ViewController.swift里 添加代码验证调用

```c
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        let rustGreetings = RustGreetings()
        print("\(rustGreetings.sayHello(to: "world"))")
    }
```

- 例子只验证rust调用使用的过程 [源码下载](https://github.com/zhulg/iOSUseRust)