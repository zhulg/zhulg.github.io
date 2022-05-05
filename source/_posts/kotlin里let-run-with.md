---
title: kotlin里范围函数let/run/with等使用
tags: kotlin
abbrlink: 48067
date: 2019-08-02 23:50:27
---

### run

-  run函数是说明最简单的范围方法,mood 被完全封闭在run范围内

```
fun test() {
    var mood = "I am sad"

    run {
        val mood = "I am happy"
        println(mood) // I am happy
    }
    println(mood)  // I am sad
}
```
<!-- more -->