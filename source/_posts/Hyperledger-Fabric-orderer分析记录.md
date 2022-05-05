---
title: Hyperledger Fabric orderer分析记录
tags: 区块链
categories: 区块链
toc: true
abbrlink: 43591
date: 2018-08-29 17:51:46
---

## Fabric Orderer主要作用

Orderer，为排序节点，对所有发往网络中的交易进行排序，将排序后的交易进行出块，之后提交给Committer进行提交处理。

**Orderer代码在orderer目录,基于1.2代码**

```
orderer
├── README.md
├── common
│   ├── blockcutter //切块代码
│   ├── bootstrap //初始区块的提供方式
│   ├── broadcast //广播代码
│   ├── localconfig //本地配置相关实现
│   ├── metadata   //通过metadata.go实现获取版本信息。
│   ├── msgprocessor //消息处理
│   ├── multichannel
│   ├── performance
│   └── server
├── consensus //共识代码
│   ├── consensus.go
│   ├── kafka
│   └── solo
├── main.go  //main入口
├── mocks
│   ├── common
│   └── util
└── sample_clients
    ├── broadcast_config
    ├── broadcast_msg
    └── deliver_stdout
```

<!-- more -->

## Orderer核心启动代码
- 通过 orderer 包下的 main() 方法实现，会进一步调用到 orderer/common/server 包中的 Main() 方法。

```go
func Main() {
    //解析命令行参数
	fullCmd := kingpin.MustParse(app.Parse(os.Args[1:]))

	// "version" command
	if fullCmd == version.FullCommand() {
		fmt.Println(metadata.GetVersionInfo())
		return
	}
   //加载本地配置
	conf, err := localconfig.Load()
	if err != nil {
		logger.Error("failed to parse config: ", err)
		os.Exit(1)
	}
	initializeLoggingLevel(conf)
	initializeLocalMsp(conf)

	prettyPrintStruct(conf)
	Start(fullCmd, conf)
}
```


- localconfig.Load（）：从本地配置文件和环境变量中读取配置信息，构建配置树结构。
- initializeLoggingLevel(conf)：配置日志级别。
- initializeLocalMsp(conf)：配置 MSP 结构。
- prettyPrintStruct(conf)： 打印相关
- 	Start(fullCmd, conf)：完成启动后的核心工作。



## 1、加载命令行工具并解析命令行参数

orderer的命令行工具，基于gopkg.in/alecthomas/kingpin.v2实现，地址：http://gopkg.in/alecthomas/kingpin.v2。
相关代码如下

```go
var (
	app = kingpin.New("orderer", "Hyperledger Fabric orderer node")
    //创建子命令start和version
	start = app.Command("start", "Start the orderer node").Default()
	version   = app.Command("version", "Show version information")
	benchmark = app.Command("benchmark", "Run orderer in benchmark mode")
)

//代码在orderer/main.go
```

metadata.GetVersionInfo()代码如下：

```go
func GetVersionInfo() string {
	Version = common.Version
	if Version == "" {
		Version = "development build"
	}

	return fmt.Sprintf("%s:\n Version: %s\n Commit SHA: %s\n"+
		" Go version: %s\n OS/Arch: %s\n"+
		" Experimental features: %s\n", ProgramName, Version, common.CommitSHA,
		runtime.Version(),
		fmt.Sprintf("%s/%s", runtime.GOOS, runtime.GOARCH), common.Experimental)
}
//代码在orderer/metadata/metadata.go
```

## 2、加载配置文件

配置文件的加载，基于viper实现，即https://github.com/spf13/viper。

```go
conf, err := localconfig.Load()
//代码在orderer/main.go
```

localconfig.Load()代码如下：

```go
func Load() (*TopLevel, error) {
	config := viper.New()
	 //cf.InitViper作用为加载配置文件路径及设置配置文件名称
	coreconfig.InitViper(config, "orderer")
	config.SetEnvPrefix(Prefix)
	config.AutomaticEnv()
	replacer := strings.NewReplacer(".", "_")
	config.SetEnvKeyReplacer(replacer)

	if err := config.ReadInConfig(); err != nil {
		return nil, fmt.Errorf("Error reading configuration: %s", err)
	}

	var uconf TopLevel
	if err := viperutil.EnhancedExactUnmarshal(config, &uconf); err != nil {
		return nil, fmt.Errorf("Error unmarshaling config into struct: %s", err)
	}

	uconf.completeInitialization(filepath.Dir(config.ConfigFileUsed()))
	return &uconf, nil
}

//代码在orderer/localconfig/config.go
```


## 3、初始化日志系统（日志输出、日志格式、日志级别等）

```go
initializeLoggingLevel(conf)
//代码在orderer/main.go
```

initializeLoggingLevel(conf)代码如下：

```go

func initializeLoggingLevel(conf *localconfig.TopLevel) {
    //初始化日志输出对象及输出格式
	flogging.InitBackend(flogging.SetFormat(conf.General.LogFormat), os.Stderr)
	 //按初始化日志级别
	flogging.InitFromSpec(conf.General.LogLevel)
}
//代码在orderer/main.go
```


## 4、初始化本地MSP
```go
initializeLocalMsp(conf)
```

initializeLocalMsp(conf)代码如下：

```go
func initializeLocalMsp(conf *localconfig.TopLevel) {
	// Load local MSP
	err := mspmgmt.LoadLocalMsp(conf.General.LocalMSPDir, conf.General.BCCSP, conf.General.LocalMSPID)
	if err != nil { // Handle errors reading the config file
		logger.Fatal("Failed to initialize local MSP:", err)
	}
}
//代码在orderer/main.go
```
## 5,启动Start方法

```go
func Start(cmd string, conf *localconfig.TopLevel) {
	signer := localmsp.NewSigner() // 初始化签名结构
	serverConfig := initializeServerConfig(conf)
	grpcServer := initializeGrpcServer(conf, serverConfig)
	caSupport := &comm.CASupport{
		AppRootCAsByChain:     make(map[string][][]byte),
		OrdererRootCAsByChain: make(map[string][][]byte),
		ClientRootCAs:         serverConfig.SecOpts.ClientRootCAs,
	}
	tlsCallback := func(bundle *channelconfig.Bundle) {
		// only need to do this if mutual TLS is required
		if grpcServer.MutualTLSRequired() {
			logger.Debug("Executing callback to update root CAs")
			updateTrustedRoots(grpcServer, caSupport, bundle)
		}
	}

	manager := initializeMultichannelRegistrar(conf, signer, tlsCallback)
	mutualTLS := serverConfig.SecOpts.UseTLS && serverConfig.SecOpts.RequireClientCert
	server := NewServer(manager, signer, &conf.Debug, conf.General.Authentication.TimeWindow, mutualTLS)

	switch cmd {
	case start.FullCommand(): // "start" command
		logger.Infof("Starting %s", metadata.GetVersionInfo())
		initializeProfilingService(conf)
		ab.RegisterAtomicBroadcastServer(grpcServer.Server(), server)
		logger.Info("Beginning to serve requests")
		grpcServer.Start()
	case benchmark.FullCommand(): // "benchmark" command
		logger.Info("Starting orderer in benchmark mode")
		benchmarkServer := performance.GetBenchmarkServer()
		benchmarkServer.RegisterService(server)
		benchmarkServer.Start()
	}
}
```

## 5-1 start方法里
- **经过initializeServerConfig(conf)**
- **initializeGrpcServer(conf, serverConfig)启动Grpc服务**
- **初始化initializeMultiChainManager（启动共识插件，接收和处理消息）**

```go
manager := initializeMultiChainManager(conf, signer)
```

**initializeMultiChainManager(conf, signer)代码如下：**

```go
func initializeMultichannelRegistrar(conf *localconfig.TopLevel, signer crypto.LocalSigner,
	callbacks ...func(bundle *channelconfig.Bundle)) *multichannel.Registrar {
    // 创建操作账本的工厂结构
	lf, _ := createLedgerFactory(conf)
	// Are we bootstrapping?
	 如果是首次启动情况，默认先创建系统通道的本地账本结构
	if len(lf.ChainIDs()) == 0 {
		initializeBootstrapChannel(conf, lf)//初始化引导通道（获取初始区块、创建链、添加初始区块）
	} else {
		logger.Info("Not bootstrapping because of existing chains")
	}
    //初始化共识插件，共识插件负责跟后台的队列打交道
	consenters := make(map[string]consensus.Consenter)
	consenters["solo"] = solo.New()
	consenters["kafka"] = kafka.New(conf.Kafka)
	
   // 创建各个账本的管理器（Registrar）结构，并启动共识过程
	return multichannel.NewRegistrar(lf, consenters, signer, callbacks...) //LedgerFactory、Consenter、签名

}
```

## 5-1-1: initializeMultiChainManager方法总结

```
创建账本操作的工厂结构；
如果是新启动情况，利用给定的系统初始区块文件初始化系统通道的相关结构；
完成共识插件（包括 solo 和 kafka 两种）的初始化；
multichannel.NewRegistrar(lf, consenters, signer) 方法会扫描本地账本数据（此时至少已存在系统通道），创建 Registrar 结构，并为每个账本都启动共识（如 Kafka 排序）过程。
```

## 5-1-2: multichannel.NewRegistrar方法

- 核心相关代码

```go
existingChains := ledgerFactory.ChainIDs()
for _, chainID := range existingChains { // 启动本地所有的账本结构的共识过程
	if _, ok := ledgerResources.ConsortiumsConfig(); ok { // 如果是系统账本（默认在首次启动时会自动创建）
		chain := newChainSupport(r, ledgerResources, consenters, signer)
		chain.Processor = msgprocessor.NewSystemChannel(chain, r.templator, msgprocessor.CreateSystemChannelFilters(r, chain))
		r.chains[chainID] = chain
		r.systemChannelID = chainID
		r.systemChannel = chain
		defer chain.start() // 启动共识过程
	else // 如果是应用账本
		chain := newChainSupport(r, ledgerResources, consenters, signer)
		r.chains[chainID] = chain
		chain.start()  // 启动共识过程,以 Kafka 共识插件为例，最终以协程方式调用到 orderer.consensus.kafka 包中的 startThread() 方法，将在后台持续运行
	}
```


## 5-2, 根据输入命令选择启动方式 ("start"下)

```go
//启动Go profiling服务（Go语言分析工具）
initializeProfilingService(conf)
//绑定 gRPC 服务并启动
ab.RegisterAtomicBroadcastServer(grpcServer.Server(), server)
logger.Info("Beginning to serve requests")
grpcServer.Start()
```



