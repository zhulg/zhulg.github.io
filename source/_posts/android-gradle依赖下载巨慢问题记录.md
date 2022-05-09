---
title: android gradle依赖下载巨慢问题记录
tags:
  - android
  - gradle
abbrlink: 4988
date: 2018-08-09 18:32:00
---

- 有段时间没写Android项目了，最近android9也发布了。当年也是从1.5开始的android之路。。。时间飞快。
- 今天构建一个项目，从头搭，发现android依赖库居然很长时间都没拉下了。。。已经科学上网。
- 想起各种代理，准备找找阿里云仓库解决下


- 在repositories里使用阿里仓库

```
    repositories {
//        google()
//        jcenter()

        maven { url 'https://plugins.gradle.org/m2/' }
        maven { url 'http://maven.aliyun.com/nexus/content/repositories/google' }
        maven { url 'http://maven.aliyun.com/nexus/content/groups/public/' }
        maven { url 'http://maven.aliyun.com/nexus/content/repositories/jcenter'}

    }
    
```

- 在allprojects里

```

allprojects {
    repositories {
//        jcenter()
//        maven {
//            url "https://maven.google.com"
//        }

        maven { url 'https://plugins.gradle.org/m2/' }
        maven { url 'http://maven.aliyun.com/nexus/content/repositories/google' }
        maven { url 'http://maven.aliyun.com/nexus/content/groups/public/' }
        maven { url 'http://maven.aliyun.com/nexus/content/repositories/jcenter'}

    }
}

```
- 再次进行同步，依赖很快同步下来。