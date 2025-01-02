---
title: go语言glide包管理器使用
tags: go
categories: go
toc: true
abbrlink: 42315
date: 2018-03-07 19:09:02
---

- glide 安装 
  ```
  brew install glide 
  ```
- glide包使用日志记录


- 日志记录错误地方可以重新执行查看

```
/Users/Meixin/Blockchain/LearnGo/src/github.com$glide init
[INFO]	Generating a YAML configuration file and guessing the dependencies
[INFO]	Attempting to import from other package managers (use --skip-import to skip)
[INFO]	Scanning code to look for dependencies
[INFO]	--> Found reference to bogus/package
[INFO]	--> Found reference to github.com/DATA-DOG/godog
[INFO]	--> Adding sub-package gherkin to github.com/DATA-DOG/godog
[INFO]	--> Found reference to github.com/Shopify/sarama
[INFO]	--> Found reference to github.com/cloudflare/cfssl/api
[INFO]	--> Adding sub-package csr to github.com/cloudflare/cfssl
[INFO]	--> Adding sub-package log to github.com/cloudflare/cfssl
[INFO]	--> Adding sub-package signer to github.com/cloudflare/cfssl
[INFO]	--> Found reference to github.com/davecgh/go-spew/spew
[INFO]	--> Found reference to github.com/fsouza/go-dockerclient
[INFO]	--> Found reference to github.com/golang/groupcache/lru
[INFO]	--> Found reference to github.com/golang/mock/gomock
[INFO]	--> Found reference to github.com/golang/protobuf/jsonpb
[INFO]	--> Adding sub-package proto to github.com/golang/protobuf
[INFO]	--> Adding sub-package ptypes to github.com/golang/protobuf
[INFO]	--> Adding sub-package ptypes/empty to github.com/golang/protobuf
[INFO]	--> Adding sub-package ptypes/timestamp to github.com/golang/protobuf
[INFO]	--> Found reference to github.com/gorilla/mux
[INFO]	--> Found reference to github.com/hashicorp/go-version
[INFO]	--> Found reference to github.com/looplab/fsm
[INFO]	--> Found reference to github.com/miekg/pkcs11
[INFO]	--> Found reference to github.com/mitchellh/mapstructure
[INFO]	--> Found reference to github.com/op/go-logging
[INFO]	--> Found reference to github.com/pkg/errors
[INFO]	--> Found reference to github.com/spf13/cast
[INFO]	--> Found reference to github.com/spf13/cobra
[INFO]	--> Found reference to github.com/spf13/pflag
[INFO]	--> Found reference to github.com/spf13/viper
[INFO]	--> Found reference to github.com/stretchr/testify/assert
[INFO]	--> Adding sub-package mock to github.com/stretchr/testify
[INFO]	--> Found reference to github.com/syndtr/goleveldb/leveldb
[INFO]	--> Adding sub-package leveldb/iterator to github.com/syndtr/goleveldb
[INFO]	--> Adding sub-package leveldb/opt to github.com/syndtr/goleveldb
[INFO]	--> Adding sub-package leveldb/util to github.com/syndtr/goleveldb
[INFO]	--> Found reference to golang.org/x/crypto/ocsp
[INFO]	--> Found reference to golang.org/x/crypto/sha3
[INFO]	--> Found reference to golang.org/x/net/context
[INFO]	--> Found reference to google.golang.org/grpc
[INFO]	--> Adding sub-package codes to google.golang.org/grpc
[INFO]	--> Adding sub-package connectivity to google.golang.org/grpc
[INFO]	--> Adding sub-package credentials to google.golang.org/grpc
[INFO]	--> Adding sub-package grpclog to google.golang.org/grpc
[INFO]	--> Adding sub-package keepalive to google.golang.org/grpc
[INFO]	--> Adding sub-package peer to google.golang.org/grpc
[INFO]	--> Adding sub-package status to google.golang.org/grpc
[INFO]	--> Found reference to gopkg.in/alecthomas/kingpin.v2
[INFO]	--> Found reference to gopkg.in/yaml.v2
[INFO]	--> Found reference to hyperledger/cci/appinit
[INFO]	--> Found reference to hyperledger/cci/org/hyperledger/chaincode/example02
[INFO]	--> Found reference to hyperledger/ccs
[INFO]	Writing configuration file (glide.yaml)
[INFO]	Would you like Glide to help you find ways to improve your glide.yaml configuration?
[INFO]	If you want to revisit this step you can use the config-wizard command at any time.
[INFO]	Yes (Y) or No (N)?
y
[INFO]	Looking for dependencies to make suggestions on
[INFO]	--> Scanning for dependencies not using version ranges
[INFO]	--> Scanning for dependencies using commit ids
[INFO]	Gathering information on each dependency
[INFO]	--> This may take a moment. Especially on a codebase with many dependencies
[INFO]	--> Gathering release information for dependencies
[INFO]	--> Looking for dependency imports where versions are commit ids
[INFO]	Here are some suggestions...
[INFO]	The package github.com/DATA-DOG/godog appears to have Semantic Version releases (http://semver.org).
[INFO]	The latest release is v0.7.5. You are currently not using a release. Would you like
[INFO]	to use this release? Yes (Y) or No (N)
n
[INFO]	Would you like to remember the previous decision and apply it to future
[INFO]	dependencies? Yes (Y) or No (N)
y
[INFO]	No proposed changes found. Have a nice day.
[zhulianggang@bogon:/Users/Meixin/Blockchain/LearnGo/src/github.com$ls
Knetic		glide.yaml	hyperledger	nsf
[zhulianggang@bogon:/Users/Meixin/Blockchain/LearnGo/src/github.com$glide install
[INFO]	Lock file (glide.lock) does not exist. Performing update.
[INFO]	Downloading dependencies. Please wait...
[INFO]	--> Fetching github.com/davecgh/go-spew
[INFO]	--> Fetching github.com/golang/protobuf
[INFO]	--> Fetching github.com/miekg/pkcs11
[INFO]	--> Fetching github.com/op/go-logging
[INFO]	--> Fetching github.com/fsouza/go-dockerclient
[INFO]	--> Fetching github.com/looplab/fsm
[INFO]	--> Fetching github.com/cloudflare/cfssl
[INFO]	--> Fetching github.com/spf13/cobra
[INFO]	--> Fetching bogus/package
[INFO]	--> Fetching github.com/spf13/viper
[INFO]	--> Fetching github.com/hashicorp/go-version
[INFO]	--> Fetching github.com/pkg/errors
[INFO]	--> Fetching github.com/Shopify/sarama
[INFO]	--> Fetching github.com/gorilla/mux
[INFO]	--> Fetching github.com/spf13/cast
[INFO]	--> Fetching github.com/golang/groupcache
[INFO]	--> Fetching github.com/golang/mock
[INFO]	--> Fetching github.com/mitchellh/mapstructure
[INFO]	--> Fetching github.com/spf13/pflag
[INFO]	--> Fetching github.com/DATA-DOG/godog
[WARN]	Unable to checkout bogus/package
[ERROR]	Update failed for bogus/package: Cannot detect VCS
[INFO]	--> Fetching github.com/stretchr/testify
[INFO]	--> Fetching github.com/syndtr/goleveldb
[INFO]	--> Fetching golang.org/x/crypto/ocsp
[INFO]	--> Fetching golang.org/x/crypto/sha3
[INFO]	--> Fetching golang.org/x/net/context
[INFO]	--> Fetching google.golang.org/grpc
[INFO]	--> Fetching gopkg.in/alecthomas/kingpin.v2
[INFO]	--> Fetching gopkg.in/yaml.v2
[INFO]	--> Fetching hyperledger/cci/appinit
[WARN]	Unable to checkout hyperledger/cci/appinit
[ERROR]	Update failed for hyperledger/cci/appinit: Cannot detect VCS
[INFO]	--> Fetching hyperledger/cci/org/hyperledger/chaincode/example02
[WARN]	Unable to checkout hyperledger/cci/org/hyperledger/chaincode/example02
[ERROR]	Update failed for hyperledger/cci/org/hyperledger/chaincode/example02: Cannot detect VCS
[INFO]	--> Fetching hyperledger/ccs
[WARN]	Unable to checkout hyperledger/ccs
[ERROR]	Update failed for hyperledger/ccs: Cannot detect VCS
[WARN]	Unable to checkout golang.org/x/crypto/ocsp
[ERROR]	Update failed for golang.org/x/crypto/ocsp: Cannot detect VCS
[WARN]	Unable to checkout golang.org/x/crypto/sha3
[ERROR]	Update failed for golang.org/x/crypto/sha3: Cannot detect VCS
[WARN]	Unable to checkout golang.org/x/net/context
[ERROR]	Update failed for golang.org/x/net/context: Cannot detect VCS
[WARN]	Unable to checkout google.golang.org/grpc
[ERROR]	Update failed for google.golang.org/grpc: Cannot detect VCS
[WARN]	Unable to checkout github.com/fsouza/go-dockerclient
[ERROR]	Update failed for github.com/fsouza/go-dockerclient: Unable to get repository: Cloning into '/Users/zhulianggang/.glide/cache/src/https-github.com-fsouza-go-dockerclient'...
error: RPC failed; curl 56 SSLRead() return error -9806
fatal: The remote end hung up unexpectedly
fatal: early EOF
fatal: index-pack failed
: exit status 128
[ERROR]	Failed to do initial checkout of config: Cannot detect VCS
Cannot detect VCS
Cannot detect VCS
Cannot detect VCS
Cannot detect VCS
Cannot detect VCS
Cannot detect VCS
Cannot detect VCS
Unable to get repository: Cloning into '/Users/zhulianggang/.glide/cache/src/https-github.com-fsouza-go-dockerclient'...
error: RPC failed; curl 56 SSLRead() return error -9806
fatal: The remote end hung up unexpectedly
fatal: early EOF
fatal: index-pack failed
: exit status 128
```