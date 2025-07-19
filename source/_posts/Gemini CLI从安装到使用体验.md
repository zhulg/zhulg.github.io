---
title: 实测 Google Gemini CLI：从安装到使用体验，AI 命令行也开始卷起来了
tags: AI
categories: AI
toc: true
abbrlink: e3022ca1
date: 2025-07-19 13:21:16
---

Google这两天刚推出了Gemini CLI，它是一个基于 Gemini 模型构建的 AI 命令行助手（Agent），支持本地运行、插件拓展，还能调用 Gemini 2.5 Pro 模型。重点是**免费使用，限额相当豪横，卷的起飞的节奏。**

说起命令行的工具，可能更适合技术人员使用，使用起来也很高效，想起当时Chatgpt刚刚爆火的时候，各种登录不上，网络无法连接，地区封号等，于是我也写了个基于ChatGpt的CLI工具，可以直接访问大模型API，直接有效，深受好评！

无图无真相，截个图:

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250719132741284)

运行截图：

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250719132458282)

不自恋了，今天看看现在Google现在推出的 gemini CLI 效果到底如何。



1. 官方介绍：

使用gemini CLI, 我们只需使用个人 Google 帐户登录即可获得免费的 Gemini Code Assist 许可证，同时也打通了 Gemini Code Assist 也可以在vscode里安装插件来使用。

最吸引我们的应该是这个图，允许访问 Gemini 2.5 Pro 及其庞大的 100 万个令牌上下文窗口，提供了业界最高的限额，每分钟 60 个模型请求，每天 1,000 个请求，均免费。

*这个对于目前在使用付费版的AI工具来说最为吸引人，还付什么费用。这真正卷起来，对个人使用者来说也是白嫖了。*

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250719132459801)



**1. 快速安装Gemini**

安装步骤：命令行运行该命令即可，当然npm是需要安装过的。

```
npm install -g @google/gemini-cli
```

 

 

安装完成，可以选择自己登录方式，如官网介绍，直接使用google账号进行登录；

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250719132642260)

登录成功后，可以通过 / 来查看相关的菜单使用说明，比如：设置自己喜欢的Theme

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250719132500414)

可以在命令行执行gemini来看下效果：

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/gCwibMtn41zP41vNe6BpL9tw2kfdkSy7oNGEq9barKo9icsuibfSbibnn71O3E0wZICSssaiatQlY0nfudc3H1mYgPQ/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)

比如，查看目前Gemini可用的工具：输入框输入 /tools



![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250719132500999)



**2. 实测：生成一个设计师个人介绍网页**

我们先让他实现个人介绍的网页，告诉他这个是为一名设计师来设计的网页，必然需要的效果要好一些。

先在自己命令行下，创建对应的目录：

```
mkdir testGemini
cd testGemini
```



然后我们执行 gemini命令，把我们需要的需求直接输入，当然如果我们的prompt简单，那是无法让他完我们很好的设计。所以基于他强大的token能力，我们先让写prompt然后再进行让他代码实现。

 

```
 请帮我为一位设计师生成一个完整的个人介绍网页，包含内容文案、网页结构建议和代码实现。设计师擅长品牌设计、UI/UX、网页视觉，熟练使用 Photoshop、Figma、Illustrator，注重极简美学和用户体验。

设计风格要求：
整体视觉简洁、清新、克制
主色调为“豆沙绿”（偏柔和自然的绿色系）
字体现代、留白充分，具备高级感

页面结构包括：
顶部导航栏：左侧为个人 logo 或名字，右侧为导航链接（如“关于我 / 项目 / 联系我”）

自我介绍区：
圆形头像
一句简洁的个人定位（如“热爱极简的 UI 设计师”）
一段不超过 120 字的自我简介（自然、亲切，突出设计理念和经验）

技能展示区：
用图标或小标签的形式展示常用工具（Photoshop、Figma、Illustrator）
强项（品牌设计 / UI 设计 / 视觉表达等）

项目展示区：
展示 3~6 个代表性项目，每个项目包含：项目名、一句话说明、我的角色、缩略图（可占位）
排版美观，可卡片式或网格展示

联系我模块：
邮箱地址、Behance / Dribbble / GitHub 链接
可选微信二维码（打赏或合作联系），加一句简洁友好的提示语，如“欢迎交流合作 👋”

技术要求：
使用 HTML + TailwindCSS（或 React + TailwindCSS）实现
页面需要响应式设计，在移动端和桌面端都美观易读
添加轻微的动画效果（如卡片悬浮、淡入动画等，可使用 Framer Motion 或 CSS）

输出内容请包括：

一段适合放网页上的“个人简介文案”
一组技能/工具标签内容
三个示例项目的介绍（项目名 + 简要描述 + 我的角色）
网页代码实现（HTML 或 React，配合 TailwindCSS）
自定义豆沙绿配色方案（Tailwind 的自定义颜色变量）
若支持，添加打赏/联系合作二维码模块（占位图即可）
```

 

执行中间我们需要确认下即可。

最后生成的效果如下：

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250719132501276)

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/gCwibMtn41zP41vNe6BpL9tw2kfdkSy7o8vUm8l1GOWpF0pn8wtriaGa7kc9ibc7wE0mdeSKmsujIwianX3EFxtRAw/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1)



**3. 文件操作能力：**

这个应该是google的基因和强项，涉及搜索，抓取和总结能力。

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250719132501845)

提示失败，需要安全验证，我们先试用另外一篇文章看看。

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250719132502343)

做这个验证，其实我们就可以通过命令行来批量操作，很多东西就可以实现。（懂技术就应该能领悟到我们可以用这个来做什么）

**4.代码定位修复能力**

我们通过@来在当前目录下，告诉gemini CLI 需要把我们之前的页面的元素进行修改，查找和定位能力应该也比较快和准。

*当然这对于* *Gemini 2.5 Pro 代码能力来说应该是小菜一碟。*

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250719132615983)



**4. 验证情况总结**

整体来看，Gemini CLI 作为一个开源的 AI 命令行助手，已经展示出不俗的潜力，特别是在代码生成、本地文件操作、插件扩展等方面，体现出了 CLI 工具的独特优势。

不过，结合实际体验，也暴露出一些不足之处：

**在生成网页代码等任务时，响应时间较长，虽然这是大模型“深度思考”的副作用，但相比 Cursor 等现有工具，速度感受上明显要慢一拍。**

**Gemini CLI 支持通过** `@文件路径` 操作本地文件，这本应是命令行工具的一大优势，但在我测试过程中，频繁操作时偶尔会出现界面卡顿甚至中断的情况，影响使用流畅性。

部分功能尚未开放或不稳定，例如文档中提到的 MCP接入，目前尚未成功验证，工具也偶尔报错或无响应。作为刚发布的版本，Gemini CLI 还需要时间完善生态和稳定性。

**尽管如此，我依然认为它是一个值得关注的新工具：**

CLI 工具的使用门槛虽然比 Web 高一点，但对于习惯终端工作的开发者来说，Gemini CLI 是一个极具潜力的 AI 助手。

**它的开源策略、大模型接入能力、插件化扩展方向，技术人员的使用，相信*****\*终端里的 AI 智能体，也是未来的一种技术流的交互方式。\****

**CLI的方向就是一个让技术人员用起来更爽，操作更直接，命令行有自己的独特优势，虽然有一些小小失望，但相信gemini CLI会快速壮大，相信Google的技术实力，也相信他的开源必将更多人参与贡献。**
