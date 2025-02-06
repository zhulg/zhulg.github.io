---
aititle: Apache Camel
tags: springboot
Categories: 技术运维
abbrlink: 53101
date: 2017-08-16 18:13:47
---
### Apache Camel
- Camel 是一个开源的企业应用集成框架。
- 它采用URI来描述各种组件，这样你可以很方便地与各种传输或者消息模块进行交互，比如HTTP、 ActiveMQ、JMS、JBI、SCA、MINA或CXF Bus API。这些模块是采用可插拔的方式进行工作的。Apache Camel拥有小巧、依赖少等特点，能够很容易将其集成在各种Java应用中。
- **其核心的思想就是从一个from源头得到数据,通过processor处理,再发到一个to目的的**
- 在企业系统集成中做路由,流程控制一个非常好的框架

### Apache Camel的常用组件
- **Message**: 是Camel中一个基本的包含数据和路由的实体，Camel中消息以及数据都是以message类型进行传递

  1,header：message中包含头信息，存放在header中

  2,body：路由中消息和数据传输的实际内容存放在body中

  3,fault flag：错误标记，使用来标记正常或者错误的标记

- **Exchange**：是路由之间传递消息，通信，交换数据的抽象，用来传递，交换数据

 1, Exchange ID：每次交换数据的时候都会产生一个Exchange ID

 2, MEP ：一个类似InOnly或者InOut的消息交换模式。当模式是InOnly的时候，消息交换中  只包含IN-Message

 3, Exception：在路由过程中出现的异常

 4, Properties：类似与message 的headers ，但是他们将持续到整个exchange结束，Camel还可能利用他们进行一些特殊的通信。

 5, IN-Message：输入消息，在对消息处理之前，首先需要获取上个endpoint节点的消息

 6, OUT-Message：输出消息，向下一个endpoint传输的消息

- **Endpoint** 是Camel路由中的通道端点，可以发送和接受消息，在Camel中Endpoint使用URI来配置。在运行时Camel通过获取URL来查找到对应的组件。端点的功能强大、全面而且又可维护

- **Component** 是一些Endpoints URI的集合。他们通过连接码来链接（例如file:,jms:），而且作为一个endpoint的工厂。现在Camel中有超过80个Component。也可以通过扩展类来实现自己的Component

- **Route** 路由，它定义了Message如何在一个系统中传输的真实路径或者通道。路由引擎自身并不暴露给开发者，但是开发者可以自己定义路由，并且需要信任引擎可以完成复杂的传输工作。每个路由都有一个唯一的标识符，用来记录日志、调试、监控，以及启动或者停止路由。
路由也有一个输入的Message，因此他们也有效的链接到一个输入端点。路由定义了一种领域特有的语言（DSL）。Camel提供了java、scala和基于xml的Route-DSL。

- **Processor** 是一个消息接受者和消息通信的处理器。当然，Processor是Route的一个元素，可用来消息格式转换或者其他的一些变换。在路由传输消息的过程中，有时候需要对消息和数据进行处理在传输到下一个Endpoint中，Processor中就定义了一系列消息处理的过程

### 架构原理图
![原理](http://camel.apache.org/architecture.data/camel-components.png)