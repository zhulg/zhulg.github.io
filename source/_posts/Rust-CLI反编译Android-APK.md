---
title: Rust CLI反编译Android APK
tags: Rust
categories: Rust
toc: true
abbrlink: b176cd6e
date: 2022-11-06 11:26:52
---

## Rust-CLI使用
- Rust提供了比较好的CLI接口,可以快速的编写CLI应用, 用于日常的工具类使用
- Android 反编译APK的过程，可以通过Rust来整合成命令行一步完成, 整合其中出来过程, 来应用Rust CLI的实践
- **目的熟悉Rust CLI来编写应用，并通过命令行自动化反编译APK几个过程，作为日常工具提效**

## 编写准备：
 - **反编译APK依赖的必要库：**
 
```
d2j-dex2jar
jd-cli
Apktool
```
应用该库使用为最新版本，如果有不支持兼容的需要确认Java使用的相关版本即可。

- **Rust CLI 编写依赖的库：**

```
clap 
console
execute 
indicatif
text2art 
```
这些库的使用方式和说明可在[crates.io](https://crates.io/)查到说明

## 代码解析：
- **编写CLI处理接口：**

```rust
    let matches = Command::new("Decompile APK")
        .author("lg.json@gmail.com")
        .version("1.0.0")
        .about("ApkDecompiler for Android, create by Spark Coding BU")
        .arg(
            Arg::new("file")
                .action(ArgAction::Set)
                .short('f')
                .long("file")
                .default_value("-")
                .help("The path to your apk."),
        )
        .after_help(
            "Longer explanation to appear after the options when \
                  displaying the help information from --help or -h",
        )
        .get_matches();
```

- Command使用的是clap来创建， 通过Arg创建对应的参数和应用，可以创建读个arg进行添加。

- **读取CLI的输入参数：**

```rust
  let file_path = match matches.get_one::<String>("file") {
        Some(it) => it,
        _ => return,
    };
    let apk_path = PathBuf::from(file_path);
```

- **开始执行:**

```rust
    pub fn start_decompile(&self) -> Result<()> {
        self.show_tools_info()?;
        self.create_output_dir()?;
        self.start_dex2jar()?;
        self.start_decompile_class()?;
        self.start_decompile_res()?;
        self.open_output()?;\
        Ok(())
    }
```
开始执行会显示工具对应的信息，创建文件输出的地址，开始解析对应的包

- **举例命令行的创建：**

```rust
   ///use dex2jar get APK's jar in output_path
    pub fn start_dex2jar(&self) -> Result<()> {
        let mut command = Command::new("sh");

        command
            .arg(self.exe_dir.join("lib/dex2jar/d2j-dex2jar.sh"))
            .arg("-f")
            .arg(&self.apk_path)
            .arg("-o")
            .arg(self.output_path.join("app.jar"));

        execute_state(command, "dex2jar");
        Ok(())
    }
```

- **工程注意点：**

```
1.使用build.rs在构建前需要把代码依赖的lib库拷到对应的target下，这里使用了构建脚本, 具体参见代码工程
2.如何使用cli的执行状态，来显示处理过程, 是CLI下常用的工具

```

- 最终工具处理效果： **（文中图片无法显示，请科学上网查看：[推荐工具](https://order.yizhihongxing.network/aff.php?aff=12299)）**
<div align=center width=100%>
  <img width=950% src="https://raw.githubusercontent.com/zhulg/allpic/master/decompilerapk.gif">
</div>


## 源码地址：

-  源码 [Github地址](https://github.com/zhulg/RustDecompileApk)
- 使用方式：./apkdecompiler -f ./test.apk

```
  _____                      _        _____                                        _  _
 / ____|                    | |      |  __ \                                      (_)| |
| (___   _ __    __ _  _ __ | | __   | |  | |  ___   ___   ___   _ __ ___   _ __   _ | |  ___  _ __
 \___ \ | '_ \  / _` || '__|| |/ /   | |  | | / _ \ / __| / _ \ | '_ ` _ \ | '_ \ | || | / _ \| '__|
 ____) || |_) || (_| || |   |   <    | |__| ||  __/| (__ | (_) || | | | | || |_) || || ||  __/| |
|_____/ | .__/  \__,_||_|   |_|\_\   |_____/  \___| \___| \___/ |_| |_| |_|| .__/ |_||_| \___||_|
        | |                                                                | |
        |_|                                                                |_|
begin del old file...in /Users/developer/apkdecompiler/output
✅ create ouput:/Users/developer/apkdecompiler/output
✅ dex2jar...done
✅ decompile class...done
✅ decompile Resource...done
```
