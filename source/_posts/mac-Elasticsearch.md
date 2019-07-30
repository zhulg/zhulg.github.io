---
title: mac Elasticsearch
date: 2017-09-13 10:53:25
tags: Elasticsearch
---
### 1,Mac安装Elasticsearch 
- Elasticsearch 是一个基于 Apache Lucene(TM) 的开源搜索引擎。被认为是迄今为止最先进、性能最好的、功能最全的搜索引擎库。并通过简单的 RESTful API 来隐藏 Lucene 的复杂性，从而让全文搜索变得简单。
- mac 安装

```
brew install elasticsearch
```

<!-- more -->

- 安装结果

```
==> Downloading https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.6.0.tar.gz
######################################################################## 100.0%
==> Caveats
Data:    /usr/local/var/elasticsearch/elasticsearch_zhulianggang/
Logs:    /usr/local/var/log/elasticsearch/elasticsearch_zhulianggang.log
Plugins: /usr/local/opt/elasticsearch/libexec/plugins/
Config:  /usr/local/etc/elasticsearch/
plugin script: /usr/local/opt/elasticsearch/libexec/bin/elasticsearch-plugin

To have launchd start elasticsearch now and restart at login:
  brew services start elasticsearch
Or, if you don't want/need a background service you can just run:
  elasticsearch
==> Summary
🍺  /usr/local/Cellar/elasticsearch/5.6.0: 104 files, 35.9MB, built in 15 minutes 21 seconds
```


- 安装信息查询
```
 brew info elasticsearch
```
- 启动（不想后台运行的话）

```
 elasticsearch 
```
- 查看 http://127.0.0.1:9200/

### 2,安装可视化插件 elasticsearch-head 

```
git clone git://github.com/mobz/elasticsearch-head.git
cd elasticsearch-head
npm install
npm run start
```
- 其中 npm install 可能失败。失败执行 npm install grunt --save-dev
- 访问 http://localhost:9100/  查看可视化 Elasticsearch。
- **下次启动可以直接npm run start**

### 3,修改配置文件（为了允许 elasticsearch-head 运行时的跨域）
- Elasticsearch 配置文件，即 config/elasticsearch.yml。这里我们需要在配置中增加以下配置，为了允许 elasticsearch-head 运行时的跨域：

 ```
 # allow origin
http.cors.enabled: true
http.cors.allow-origin: "*"
 ```
- 运行一般在后台起守护线程启动 Elasticsearch，在命令行加入 -d 指定。自然，也可以加入 -p ，可将进程 ID 记录到文件中。**cd 到/usr/local目录**
```
./bin/elasticsearch -d
```
- 访问 http://localhost:9200/

- 要关闭 Elasticsearch 进程，需要通过 ps 找到对应的 pid，在 kill pid 即可。

```
ps aux |grep elasticsearch
kill -7 pid
```

### 4,Java代码方式创建索引

```
//1,索引创建
elasticSearch.getClient().admin().indices().prepareCreate(indices).execute().actionGet();
//2,Mapping 构建
XContentBuilder builder = XContentFactory.jsonBuilder().startObject().startObject(mappingType).startObject("properties")......endObject().endObject().endObject();
//3,创建使用mapping(mapping  在 Elasticsearch  中的作用就是约束。)
//mapping用于数据类型声明, Mapping它定义了 Type 的属性，指定分词器。如：
//"id": {
    "index": "not_analyzed",
    "type": "string"
}

PutMappingRequest mapping = Requests.putMappingRequest(indices)
					.type(mappingType).source(builder);
elasticSearch.getClient().admin().indices().putMapping(mapping).actionGet(); 
//4,批量放入索引数据（一般循环里使用bulkRequest.add）
BulkRequestBuilder bulkRequest = client.prepareBulk();  
            Map<String, Object> map = new HashMap<>();  
            map.put("name", "Jack");  
  IndexRequest request = client.prepareIndex("dept", "employee","3433").setSource(map).request();  
            bulkRequest.add(request); 


```