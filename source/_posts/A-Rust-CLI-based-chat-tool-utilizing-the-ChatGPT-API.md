---
title: A Rust CLI-based chat tool utilizing the ChatGPT API
tags: ChatGPT
categories: ChatGPT
abbrlink: dca54e0f
date: 2023-03-15 08:08:07
---



# ChatGPT CLI


- A tool for chatting using the ChatGPT API, written in Rust CLI.You can use this tool to chat, just by setting your API Key.
- You can modify the API domain and other API parameters when you start the chat.
- The source code will be shared in the article for reference.


## Why create ChatGPT CLI

- **If you can access the network through VPN, you can watch this video to learn more.**

   <iframe width="560" height="315"
src="https://www.youtube.com/embed/UXSgo9Ounuk" 
frameborder="0" 
allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
allowfullscreen></iframe>



 **（若文中视频&图片无法显示，请科学上网查看：[推荐工具](https://order.yizhihongxing.network/aff.php?aff=12299)）**


## Introduction to the core code

- **首先构建命令行工具和信息：**let matches = Command::new("ChatGPT CLI").使用 clap 库创建一个命令行工具，其中包含多个命令行参数（如 DomainName，APIKey 等）和一个命令行帮助信息

```
    let matches = Command::new("ChatGPT CLI")
        .author("lg.json@gmail.com")
        .version("1.0.0")
        .about(
            "x\n
                    ChatGPT CLI Create by zhulg (lg.json@gmail.com)
            | 1.You just need to input your api key, the cli version V0.1.1     |
            | 2.No need access internet with VPN, and just enjoy it.            |
            | 3.If you want to use it in China, you can use my api key.         |                                                   |
            |-------------------------------------------------------------------|",
        )
        .arg(
            Arg::new("DomainName")
                .action(ArgAction::Set)
                .short('d')
                .long("Domain")
                .default_value("api.openai.com")
                .help("Sets the API Domain name."),
        )
        
```

- 支持自定义API域名和API密钥，支持从命令行参数或环境变量中设置密钥

```
fn read_api_key() -> String {
    // If the OPENAI_API_KEY environment variable is not set,
    // ask the user to input the API key and save it to the
    // environment variables for future use.
    let api_key = env::var("OPENAI_API_KEY").unwrap_or_else(|_| {
        console::set_colors_enabled(true);
        let prompt_style = Style::new().yellow();
        let api_key: String = Input::new()
            .with_prompt(prompt_style.apply_to("Input your API key").to_string())
            .interact_text()
            .unwrap();
        env::set_var("OPENAI_API_KEY", &api_key);
        api_key
    });
    api_key
}
```

- 通过控制台输入一个消息并回车，该CLI会将该消息发送给OpenAI GPT-3.5-turbo模型，并显示该模型返回的响应消息

```
    let response = client
        .post(url)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&json!({
            "model": "gpt-3.5-turbo",
            "max_tokens": max_tokens.parse::<i32>().unwrap(),
            "temperature": 0.5 ,
            "messages": [{"role": "user", "content": line}]
        }))
        .send()
        .await?
        .json::<Value>()
        .await?;
```



## Install

### source code 
  1. build code 
```
cargo build
```
  2. cd target/debug 
    
```
   ./chatgpt_rust
```

### Other Install

- **If you have Rust installed, you can install the CLI using cargo:**

```
cargo install chatgpt_rust
```

## Usage

- Linux/MacOS Run the following command in your terminal:

  ```
  chatgpt_rust
  ```
- **（若文中图片无法显示，请科学上网查看：[推荐工具](https://order.yizhihongxing.network/aff.php?aff=12299)）**

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/chatgpt_cli.png">
</div>
  
- chatgpt_rust --help 

```

                    ChatGPT CLI Create by zhulg (lg.json@gmail.com)
            | 1.You just need to input your api key, the cli version    |
            | 2.No need access internet with VPN, and just enjoy it.    |
            | 3.If you want to use it in China, you can use my api key. |
            | --------------------------------------------------------- |

Usage: chatgpt_rust [OPTIONS]

Options:
  -d, --Domain <DomainName>  Sets the API Domain name. [default: api.openai.com]
  -k, --key <APIKey>         Sets the API key. If not provided, the cli will ask for it,
                             You can also set the OPENAI_API_KEY environment variable. [default: ]
  -t, --tokens <max_tokens>  sets the max_tokens, default is 1000 [default: 1000]
  -h, --help                 Print help
  -V, --version              Print version
 

```

## Option:
 Set your ‘OPENAI_API_KEY’ Environment Variable using zsh,  No set will ask the user to input the API key in the terminal.

1. Run the following command in your terminal, replacing yourkey with your API key. 

```
echo "export OPENAI_API_KEY='yourkey'" >> ~/.zshrc

```
2. Update the shell with the new variable:

```
source ~/.zshrc
```
3. Confirm that you have set your environment variable using the following command. 
   
```
echo $OPENAI_API_KEY
```
The value of your API key will be the resulting output.

## Source code 

[SourceCode](https://github.com/zhulg/ChatGPT_CLI_Rust)
