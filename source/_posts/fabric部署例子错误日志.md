---
title: fabric部署例子错误日志
date: 2018-02-24 19:15:49
tags: 区块链
---

- 部署Building Your First Network例子时，最后一步出现错误
- ![](https://raw.githubusercontent.com/zhulg/allpic/master/fabric-error.png)

- 日志为：Error: Error endorsing chaincode: rpc error: code = Unknown desc = Timeout expired while starting chaincode mycc:1.0(networkid:dev,peerid:peer0.org1.example.com,tx:936cdc1e9dd24b6eb0ae456ebd33b74706fdc682f5ce33c4c7bb479edc2e8353)
- 在mac环境下操作，可能与端口映射有关，暂时记录后续解决。


#### 第二天进行上述问题解决

- 网上有相同错误出现也在最后一步，目前没有人回答解决方式。
- 把容器关掉，重启电脑，按照文档重新操作。
- 仍旧采用手动模式启动网络和构建环境，这次在最后一步没有出现上述错误。
- 对比之前步骤：是对代码进行重新拉取（之前操作过代码），重新参照文档进行执行步骤进行，问题解决。

```
[zhulianggang@deMacBook-Pro:/Users/Meixin/Blockchain/fabric-samples/first-network$CHANNEL_NAME=$CHANNEL_NAME TIMEOUT=100 docker-compose -f docker-compose-cli.yaml up -d
Creating peer0.org1.example.com ... done
Creating cli ... done
Creating peer1.org1.example.com ...
Creating peer1.org2.example.com ...
Creating peer0.org1.example.com ...
Creating orderer.example.com ...
Creating cli ...
[zhulianggang@deMacBook-Pro:/Users/Meixin/Blockchain/fabric-samples/first-network$docker exec -it cli bash
NNEL_NAME=mychannelopt/gopath/src/github.com/hyperledger/fabric/peer# export CHA
root@f3f2e62d56b9:/opt/gopath/src/github.com/hyperledger/fabric/peer#
root@f3f2e62d56b9:/opt/gopath/src/github.com/hyperledger/fabric/peer#
NNEL_NAME=mychannelopt/gopath/src/github.com/hyperledger/fabric/peer# export CHA
root@f3f2e62d56b9:/opt/gopath/src/github.com/hyperledger/fabric/peer#
le.com/msp/tlscacerts/tlsca.example.com-cert.pemample.com/orderers/orderer.examp
2018-02-26 03:12:56.001 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2018-02-26 03:12:56.001 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2018-02-26 03:12:56.013 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2018-02-26 03:12:56.016 UTC [msp] GetLocalMSP -> DEBU 004 Returning existing local MSP
2018-02-26 03:12:56.016 UTC [msp] GetDefaultSigningIdentity -> DEBU 005 Obtaining default signing identity
2018-02-26 03:12:56.016 UTC [msp] GetLocalMSP -> DEBU 006 Returning existing local MSP
2018-02-26 03:12:56.016 UTC [msp] GetDefaultSigningIdentity -> DEBU 007 Obtaining default signing identity
2018-02-26 03:12:56.016 UTC [msp/identity] Sign -> DEBU 008 Sign: plaintext: 0A8C060A074F7267314D53501280062D...53616D706C65436F6E736F727469756D
2018-02-26 03:12:56.016 UTC [msp/identity] Sign -> DEBU 009 Sign: digest: B5D898A654F2EABC35005D34CED73EE570B2610DD5EA613383174A3AA5C59B33
2018-02-26 03:12:56.016 UTC [msp] GetLocalMSP -> DEBU 00a Returning existing local MSP
2018-02-26 03:12:56.016 UTC [msp] GetDefaultSigningIdentity -> DEBU 00b Obtaining default signing identity
2018-02-26 03:12:56.017 UTC [msp] GetLocalMSP -> DEBU 00c Returning existing local MSP
2018-02-26 03:12:56.017 UTC [msp] GetDefaultSigningIdentity -> DEBU 00d Obtaining default signing identity
2018-02-26 03:12:56.017 UTC [msp/identity] Sign -> DEBU 00e Sign: plaintext: 0AC3060A1508021A0608B8F6CDD40522...20AA143C54061DF7DAB091F959E8DE23
2018-02-26 03:12:56.017 UTC [msp/identity] Sign -> DEBU 00f Sign: digest: AA79F2F70CBBEB5B34445F2AECA34700B0BF5C57E4532ED4032AE2560F8BD765
2018-02-26 03:12:56.149 UTC [msp] GetLocalMSP -> DEBU 010 Returning existing local MSP
2018-02-26 03:12:56.150 UTC [msp] GetDefaultSigningIdentity -> DEBU 011 Obtaining default signing identity
2018-02-26 03:12:56.150 UTC [msp] GetLocalMSP -> DEBU 012 Returning existing local MSP
2018-02-26 03:12:56.150 UTC [msp] GetDefaultSigningIdentity -> DEBU 013 Obtaining default signing identity
2018-02-26 03:12:56.150 UTC [msp/identity] Sign -> DEBU 014 Sign: plaintext: 0AC3060A1508021A0608B8F6CDD40522...B68EBE5D9DB612080A021A0012021A00
2018-02-26 03:12:56.150 UTC [msp/identity] Sign -> DEBU 015 Sign: digest: 317192563E677B3B3F16EFAC2286A09EEFF929D636C7EEEC74CECB6895601041
2018-02-26 03:12:56.153 UTC [channelCmd] readBlock -> DEBU 016 Got status: &{NOT_FOUND}
2018-02-26 03:12:56.154 UTC [msp] GetLocalMSP -> DEBU 017 Returning existing local MSP
2018-02-26 03:12:56.155 UTC [msp] GetDefaultSigningIdentity -> DEBU 018 Obtaining default signing identity
2018-02-26 03:12:56.170 UTC [channelCmd] InitCmdFactory -> INFO 019 Endorser and orderer connections initialized
2018-02-26 03:12:56.370 UTC [msp] GetLocalMSP -> DEBU 01a Returning existing local MSP
2018-02-26 03:12:56.371 UTC [msp] GetDefaultSigningIdentity -> DEBU 01b Obtaining default signing identity
2018-02-26 03:12:56.371 UTC [msp] GetLocalMSP -> DEBU 01c Returning existing local MSP
2018-02-26 03:12:56.371 UTC [msp] GetDefaultSigningIdentity -> DEBU 01d Obtaining default signing identity
2018-02-26 03:12:56.371 UTC [msp/identity] Sign -> DEBU 01e Sign: plaintext: 0AC3060A1508021A0608B8F6CDD40522...EF996566D82D12080A021A0012021A00
2018-02-26 03:12:56.371 UTC [msp/identity] Sign -> DEBU 01f Sign: digest: 10BC20CFB31CF56778E028F01EFF2E064ABCC753200CA906B9D13B998B4427F9
2018-02-26 03:12:56.377 UTC [channelCmd] readBlock -> DEBU 020 Received block: 0
2018-02-26 03:12:56.378 UTC [main] main -> INFO 021 Exiting.....
root@f3f2e62d56b9:/opt/gopath/src/github.com/hyperledger/fabric/peer# ls
channel-artifacts  crypto  mychannel.block  scripts
el join -b mychannel.block th/src/github.com/hyperledger/fabric/peer# peer chann
2018-02-26 03:13:12.733 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2018-02-26 03:13:12.733 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2018-02-26 03:13:12.741 UTC [channelCmd] InitCmdFactory -> INFO 003 Endorser and orderer connections initialized
2018-02-26 03:13:12.742 UTC [msp/identity] Sign -> DEBU 004 Sign: plaintext: 0A8A070A5C08011A0C08C8F6CDD40510...929B4E708DB81A080A000A000A000A00
2018-02-26 03:13:12.742 UTC [msp/identity] Sign -> DEBU 005 Sign: digest: 1A319B71E615CC7D4071E1587AEE41061CB4FF5E68680166310788D109AA5208
2018-02-26 03:13:12.808 UTC [channelCmd] executeJoin -> INFO 006 Peer joined the channel!
2018-02-26 03:13:12.808 UTC [main] main -> INFO 007 Exiting.....
go/chaincode_example02v 1.0 -p github.com/hyperledger/fabric/examples/chaincode/
2018-02-26 03:13:20.735 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2018-02-26 03:13:20.735 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2018-02-26 03:13:20.736 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2018-02-26 03:13:20.736 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2018-02-26 03:13:20.813 UTC [golang-platform] getCodeFromFS -> DEBU 005 getCodeFromFS github.com/hyperledger/fabric/examples/chaincode/go/chaincode_example02
2018-02-26 03:13:20.993 UTC [golang-platform] func1 -> DEBU 006 Discarding GOROOT package fmt
2018-02-26 03:13:20.993 UTC [golang-platform] func1 -> DEBU 007 Discarding provided package github.com/hyperledger/fabric/core/chaincode/shim
2018-02-26 03:13:20.993 UTC [golang-platform] func1 -> DEBU 008 Discarding provided package github.com/hyperledger/fabric/protos/peer
2018-02-26 03:13:20.994 UTC [golang-platform] func1 -> DEBU 009 Discarding GOROOT package strconv
2018-02-26 03:13:20.997 UTC [golang-platform] GetDeploymentPayload -> DEBU 00a done
2018-02-26 03:13:21.005 UTC [msp/identity] Sign -> DEBU 00b Sign: plaintext: 0A89070A5B08031A0B08D1F6CDD40510...5F74FD270000FFFFDB02AC89002C0000
2018-02-26 03:13:21.005 UTC [msp/identity] Sign -> DEBU 00c Sign: digest: 02E5237D20C2C3CBFE7B25142D6B768F4EA32874302BDA8FAF41094AAC54C9C5
2018-02-26 03:13:21.010 UTC [chaincodeCmd] install -> DEBU 00d Installed remotely response:<status:200 payload:"OK" >
2018-02-26 03:13:21.010 UTC [main] main -> INFO 00e Exiting.....
' -P "OR ('Org1MSP.member','Org2MSP.member')"gs":["init","a", "100", "b","200"]}
2018-02-26 03:13:26.505 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2018-02-26 03:13:26.505 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2018-02-26 03:13:26.512 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2018-02-26 03:13:26.512 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2018-02-26 03:13:26.513 UTC [msp/identity] Sign -> DEBU 005 Sign: plaintext: 0A95070A6708031A0C08D6F6CDD40510...324D53500A04657363630A0476736363
2018-02-26 03:13:26.514 UTC [msp/identity] Sign -> DEBU 006 Sign: digest: 4713950FB2016BDEE810A76DA80E1A73703740B5F7C8E6230E617E843605280C
2018-02-26 03:13:39.871 UTC [msp/identity] Sign -> DEBU 007 Sign: plaintext: 0A95070A6708031A0C08D6F6CDD40510...1974DA15342608566EF6D2AE756A4CBF
2018-02-26 03:13:39.872 UTC [msp/identity] Sign -> DEBU 008 Sign: digest: E32CF9439BF3964502AAA3D418094EF596F9C9E70DC3E40FFCF26F1095593FC4
2018-02-26 03:13:39.881 UTC [main] main -> INFO 009 Exiting.....
root@f3f2e62d56b9:/opt/gopath/src/github.com/hyperledger/fabric/peer# peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["query","a"]}'
2018-02-26 03:14:02.583 UTC [msp] GetLocalMSP -> DEBU 001 Returning existing local MSP
2018-02-26 03:14:02.583 UTC [msp] GetDefaultSigningIdentity -> DEBU 002 Obtaining default signing identity
2018-02-26 03:14:02.583 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 003 Using default escc
2018-02-26 03:14:02.584 UTC [chaincodeCmd] checkChaincodeCmdParams -> INFO 004 Using default vscc
2018-02-26 03:14:02.584 UTC [msp/identity] Sign -> DEBU 005 Sign: plaintext: 0A95070A6708031A0C08FAF6CDD40510...6D7963631A0A0A0571756572790A0161
2018-02-26 03:14:02.584 UTC [msp/identity] Sign -> DEBU 006 Sign: digest: 681150DCAE15AFAD4F1F6755A38CEA9A1860E2900A2C06D77953F604BCBC32EF
Query Result: 100
2018-02-26 03:14:02.601 UTC [main] main -> INFO 007 Exiting.....
root@f3f2e62d56b9:/opt/gopath/src/github.com/hyperledger/fabric/peer#
```