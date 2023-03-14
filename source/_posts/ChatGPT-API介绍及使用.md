---
title: ChatGPT API介绍及使用
tags: ChatGPT
categories: ChatGPT
toc: true
abbrlink: c22af37b
date: 2023-03-10 07:44:59
---

## ChatGPT API介绍和使用
- ChatGPT API的发布，可以让大家快速使用，不仅可以搭建类似ChatGPT应用，还可以通过API制作自己的应用、接入自己的产品、快速拥有强大的AI能力。
- 本文介绍ChatGPT API如何使用、API key的创建，请求花费、定价规则、运行官方起名应用快速入门ChatGPT API 的使用。

### ChatGPT API 介绍
- **先看下张图：**从这图上官方正式介绍，可以使用API方式接入ChatGPT到自己的应用里了，这不仅仅对开发者，更多对不懂开发的人也可以通过自然语言及指令接入自己应用中。
 **（若文中图片无法显示，请科学上网查看：[推荐工具](https://order.yizhihongxing.network/aff.php?aff=12299)）**

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/chatgptapi_1.png">
</div>


- **API更新介绍：**
这里说到gpt-3.5-turbo是ChatGPT产品中使用的相同模型，但其价格为每1k tokens为0.002美元，相当于每100万token只需要2美元。 比我们现有的GPT-3.5模型便宜10倍，这是3月1号最新官网介绍。

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/chatgptapi_2.png">
</div>


### Tokens是什么
- **API计费单位**。
- **一次提问怎么计费 : 问题tokens + 答案tokens**
- 具体来讲，在模型里它指系统将句子和单词分解成的文本块，以便预测接下来应该输出什么文本。根据 OpenAI 官方文档显示，“ChatGPT is great!”这组单词需要六个 token，它的 API 将其分解为“Chat”、“G”、“PT”、“is”、“great”和“!”。与此同时，OpenAI 还专门提供了一个用于检查解释一串文本需要多少 token 的工具，并表示，按照一般的经验来看，在英语中“一个 token 通常对应大约 4 个字符”
<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/tokeninfo.png">
</div>

- **1000个tokens大概750个单词**

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/models.png">
</div>

### 如何预估tokens:

- 提供了技术tokens的方法，可以参考理解tokens的计算：

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/tokens.png">
</div>

## 创建账号和API Key

- 第一步我们需要登录openAI并注册账号，没有的需要先进行注册 (如果国内无法注册，可以看下方邮件地址邮件我）注册的账号里会先送有18美元，可以对基本的API测试和使用足够了。
- 第二步，通过账号登录后进行API key的创建，可以通过个人中心 View API keys来创建，点击创建即可。也可以通过QuickStart里的demo一步步创建。都是可以的，创建好要记得保存下来，后边将不会全部显示了，如果忘记需要移除再次创建。
<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/keycreate.png">
</div>

## 使用API
- 为了快速演示，使用curl来进行访问接口。 国内的朋友一定要记得科学上网，这个接口否则无法访问（代理一定要设置好，否则接口是无法访问的），我这里验证了后对API返回的数据也进行各说明，如图，返回的接口里有API给的信息和这次请求的花费。

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/api.png">
</div>

- 返回的数据包括了此次请求花费显示：

<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/apidata.png">
</div>


- 官方也提供了其他语言的SDK，你都可以快速接入。
<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/othersdk.png">
</div>


## 应用演示
- 运行官方的例子，可以通过代码和页面来查看具体API的使用方法。可以使用node来进行运行起来，并查看具体的代码, 运行后如图：
<div align=center width=100%>
  <img width=80% src="https://raw.githubusercontent.com/zhulg/allpic/master/pet.png">
</div>
- 这个demo 通过npm install 之后可以快速启动起来。官方也提供了其他产品接入的演示。希望给大家带来更多整合应用的灵感。
- 这个demo的运行需要注意，一个是node的版本不要太低18之后最好，其次访问时还是要科学上网。（有任何代理和账号注册问题都可以邮件我）
