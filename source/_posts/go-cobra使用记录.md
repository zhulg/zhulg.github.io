---
title: go cobra使用记录
tags: go
categories: go
toc: true
abbrlink: 3161
date: 2018-11-02 18:15:18
---

- go cobra 地址 https://github.com/spf13/cobra.git ,是一个创建CLI 命令行的golang库。
- 使用cobra可以在cli下返回程序和交互，功能强大。


## 下载
- go get -u github.com/spf13/cobra/cobra （下载时可能要科学上网）
- 下载玩后记得go install 

## 使用
- cli 下执行corba,可相关操作方法如下

```
Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.

Usage:
  cobra [command]
Available Commands:
  add         Add a command to a Cobra Application
  help        Help about any command
  init        Initialize a Cobra Application

Flags:
  -a, --author string    author name for copyright attribution (default "YOUR NAME")
      --config string    config file (default is $HOME/.cobra.yaml)
  -h, --help             help for cobra
  -l, --license string   name of license for the project
      --viper            use Viper for configuration (default true)

Use "cobra [command] --help" for more information about a command.

```
### 创建项目
- cobra init mydemo

```
mydemo
├── LICENSE
├── cmd
│   └── root.go
└── main.go

1 directory, 3 files
```

- corba add test （添加一个测试文件）查看目录

```
mydemo/
├── LICENSE
├── cmd
│   ├── root.go
│   └── test.go
└── main.go
```

- **到项目下运行 go run main.go test **

```
mydemo$go run main.go test
test called
```

- 一个基本cobra工程完成，使用go run main.go test ,查看test.go 文件可以看到相关的命令及test called所处位置

```
package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

// testCmd represents the test command
var testCmd = &cobra.Command{
	Use:   "test",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("test called")
	},
}

func init() {
	rootCmd.AddCommand(testCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// testCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// testCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
```

## cobra子命令的使用
- 形如  go run main.go test testsecond
- 创建子命令这种方式，只需要把子命令添加到父命令里即可，父命令在root命令里即可。构建方式如下
- 使用cobra add testsecond 目录下创建了testsecond.go文件

```
mydemo/
├── LICENSE
├── cmd
│   ├── root.go
│   ├── test.go
│   └── testsecond.go
└── main.go
```

- 进入到testsecond.go 文件，把init方法里，用父命令添加即可

```
testCmd.AddCommand(testsecondCmd)

```

- **使用：go run main.go test testsecond 发现打印出**

```
testsecond called

```

## 添加参数
- 根据提示添加即可。
