---
title: Elasticsearch 问题记录
date: 2017-12-01 16:08:58
tags: Elasticsearch
---

- 错误日志：field "name" was indexed without position data; cannot run PhraseQuery 

```
java.lang.IllegalStateException: field "name" was indexed without position data; cannot run PhraseQuery (phrase=name:"bbc ddr")
	at org.apache.lucene.search.PhraseQuery$PhraseWeight.scorer(PhraseQuery.java:411)
	at org.apache.lucene.search.Weight.bulkScorer(Weight.java:160)
	at org.apache.lucene.search.IndexSearcher.search(IndexSearcher.java:666)
	at org.apache.lucene.search.IndexSearcher.search(IndexSearcher.java:473)
	at org.elasticsearch.search.query.QueryPhase.execute(QueryPhase.java:388)
	at org.elasticsearch.search.query.QueryPhase.execute(QueryPhase.java:108)
	at org.elasticsearch.search.SearchService.loadOrExecuteQueryPhase(SearchService.java:247)
	at org.elasticsearch.search.SearchService.executeQueryPhase(SearchService.java:261)
	at org.elasticsearch.action.search.SearchTransportService$6.messageReceived(SearchTransportService.java:331)
	at org.elasticsearch.action.search.SearchTransportService$6.messageReceived(SearchTransportService.java:328)
	at org.elasticsearch.transport.RequestHandlerRegistry.processMessageReceived(RequestHandlerRegistry.java:69)
	at org.elasticsearch.transport.TransportService$7.doRun(TransportService.java:627)
	at org.elasticsearch.common.util.concurrent.ThreadContext$ContextPreservingAbstractRunnable.doRun(ThreadContext.java:638)
	at org.elasticsearch.common.util.concurrent.AbstractRunnable.run(AbstractRunnable.java:37)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
	at java.lang.Thread.run(Thread.java:748)
```

- 问题与描述解决方法一致：https://github.com/elastic/elasticsearch/issues/4475
