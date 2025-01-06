---
title: 如何构建大模型应用？一文搞懂LangChain和RAG的原理和使用
tags:
  - AI
  - 大模型
  - LangChain
  - RAG
categories: AI
keyword:
  - 大模型应用
  - AI
  - LangChain开发
  - RAG
abbrlink: e93d67e9
date: 2025-01-06 09:45:15
---

目前ChatGPT、AIGC各种应用如火如荼，技术人如何使用大模服务自己的业务，如何构建大模型应用？一文搞懂LangChain和RAG的原理和使用，文中附带相关代码可以更好的理解其中的定义。

我今天通过LangChain框架，一起看下如何简化大模型应用的开发，介绍下实际的工作场景。如果你也在做大模型开发，或者正在为如何切入这一领域而苦恼，欢迎在评论区与我们分享你的想法和经验。

## langchain是什么?

大模型应用开发里，**langchain是一个开源的框架，专门为帮助开发者构建基于大语言模型的应用程序**。通俗来讲，他负责与大模型来交互，也方便提供大模型做不到的事情。

### 为什么用LangChain

如上边说的他作为与大模型的交互桥梁，因为大模型核心工作是作为推理和内容生成，只具备底座模型。而在真实产品中要集成和使用大模型，还要牵涉到大量的私有数据和工作要做。

如图：

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250106095026224)

如果从图上看，可能也还有疑惑，服务端也是可以直接掉LLM的对吗？

没错。实际上是可以直接调用大模型的API. 比如openAI也提供的有接口。

但是，由于大模型有这么多，国内外成千上万，也不可能把大模型自己的API都学一遍吧？完全可以使用langchain抽象出来的接口来对接大模型。

更核心的原因是，很多大模型是无法做到的工作，比如大模型无法联网、查询私有数据库、怎么调用第三方API获取数据，大模型token限制，私有化模型调用。

这些在业务使用中大模型本身是不具备的，也不是大模型强行，大模型功能是专注推理和生成。

通俗来讲，就是大模型已经很强，但是需要我们把私有的数据、知识、客观事实提供给他，让他正确的变强，这个交互过程就有langchain来做（所以他不仅仅是个包装来调用LLM的框架）。

**Langchain通过简化与语言模型的交互以及整合其他工具（如搜索、数据库和API）来实现复杂的应用逻辑，看下这个框架的构成：**

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250106094935407)

有了基本概念，看下通过langchain的使用场景大概就好理解了，一些场景如下：

聊天机器人类：支持多轮上下文对话，利用langchain提供的记忆模块 

自动化工作流：如客户支持、内容生成等，基于chain的设计

搜索与问答总结类：结合文档检索和生成模型，实现更准确的问答，RAG的设计

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250106094902717)



对于开发者来说，通过langchain来开发大模型应用，可以简化很多接口的封装，langchain已经提供很多抽象，同时在向量数据库、数据存储上都有比较好的接口了，其中RAG也在langchain里有对应的设计。

## RAG是什么?

RAG是 LangChain 支持的一种关键技术模式，上边介绍的在使用langchain时一种比较场景的场景，在做知识检索类回答类应用时候被大量使用。单独来说一下，就是RAG技术在目前大模型中还是使用比较多的场景，他可以基于本地数据、文档和大模型来结合使用。

先来看下RAG技术的定义和构成，RAG 是一种利用检索增强生成的技术框架。它将**信息检索**和生成模型（LLM）结合在一起，解决大模型在特定领域的回答和一些幻觉的解决，不同于模型的微调，让回答在垂直领域更专业。

**工作的基本流程：**

1. 1. 检索（Retrieval）：从外部知识库（如向量数据库、文档存储）中检索与问题相关的信息。通过向量化查询找到最相关的文档或片段。
2. 2. 增强（Augmented）：将检索到的信息作为上下文，提供给生成模型（如 GPT）进行辅助。
3. 3. 生成（Generation）：基于检索到的上下文和原始输入，生成更加准确和上下文相关的回答。

RAG的使用就是为了让大模型的回答更准确，更实时和专业，根据前面介绍的langchain和RAG的定义，通过一个举例来说明下使用。

## 举个例子，说明怎么使用

了解大模型开发的应该知道，无论是openai的API还是其他家的，都会有token的限制，这样我们在与大模型对话时候，就不能超过最大的token限制，如果一本书有几百页，我们如何能通过大模型快速找出这本书的某一处内容，还要自然回答，如果是直接搜素（比如使用es）那肯定比较生硬。

第一步:

 LangChain 的向量存储功能，将文档文本加载并存储为向量。具体需要做的是对文档内容进行分隔，embedding后存入向量数据库，目的是能够通过向量找到对应相似度，为后续搜索做准备。（这些都可以LangChain提供的组件来实现）

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250106094902759)



第二步：

这幅图来说明通过RAG的一个工作流程，通过查询向量数据库，从向量数据库中检索相关内容，将检索到的上下文和用户问题结合，给到了LLM，最终生成具体的答案。

![图片](https://raw.githubusercontent.com/zhulg/allpic/master/640-20250106095046024)



如果我们用代码来模拟下看，这个对技术人来说，更容易理解（**非技术可以忽略）看下边的代码来说明langchain和RAG的使用。**

 

```
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from langchain.text_splitter import CharacterTextSplitter
from langchain.document_loaders import TextLoader

# 设置 API 密钥（需要替换为你的 OpenAI API 密钥）
import os
os.environ["OPENAI_API_KEY"] = "your-openai-api-key"

# 1. 准备文档内容
# 假设我们有一个文本文件 data.txt，包含需要存储的知识
loader = TextLoader("data.txt")
documents = loader.load()

# 将文档分割为更小的片段以适配向量化
text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
split_docs = text_splitter.split_documents(documents)

# 2. 创建向量数据库
embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_documents(split_docs, embeddings, persist_directory="./chroma_db")

# 3. 初始化检索器和大模型
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})  # 检索相关性最高的3个片段
llm = OpenAI(model="gpt-4")

# 4. 定义提示模板
prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template="""
    You are an intelligent assistant. Based on the following context:
    {context}
    Please answer the question:
    {question}
    """
)

# 5. 构建 RAG 流程
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True,
    chain_type_kwargs={"prompt": prompt_template}
)

# 6. 查询
query = "What is the main benefit of using RAG with LLMs?"
result = qa_chain({"query": query})

# 输出结果
print("Answer:")
print(result["result"])

# 如果需要查看检索到的上下文
print("\\nSource Documents:")
for doc in result["source_documents"]:
    print(doc.page_content)
```



以上介绍了用langchain来做大模型开发的使用，主要是理解langchain提供的一些抽象和功能，使用langchain能做的还有更多内容，后边在对langchain的使用做一些分享，今天文章是先有个概貌的理解。

**ps: 后边一些代码的讲解和一些AI电子版的书籍会在视频号上进行分享，公众号的内容还是以概念和漫谈形式来写，也适合碎片化阅读习惯。**
