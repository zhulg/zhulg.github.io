---
title: Android等保评测处理
tags: Android
categories: App
toc: true
abbrlink: 65331
date: 2020-09-30 10:39:19
---

- 等保评测常见问题处理，处理等保类相关风险，加固是最好的选择，特别是付费专业版。但是有些付费还是比较贵。
- 从代码层面可通过TracerPid反调试实现防止代码动态调试


## 防止反调试原理

- TracerPid反调试的原理就是检测这个字段是否为0，为0说明没有被调试，不为0说明正在被调试，检测调试器直接退出就可以达到反调试的效果

![](https://raw.githubusercontent.com/zhulg/allpic/master/androiddenbao.png)

- 代码里的处理方式，只需要定时扫描这个文件，判断TracerPid的值就能做到反调试的情况，从而避免动态调试和注入的情况出现。
- 核心代码

```
    private fun isUnderTraced(): Boolean {
        val processStatusFilePath =
            java.lang.String.format(Locale.US, "/proc/%d/status", Process.myPid())
        val procInfoFile = File(processStatusFilePath)
        try {
            val b = BufferedReader(FileReader(procInfoFile))
            var readLine: String?
            while (b.readLine().also { readLine = it } != null) {

                if (readLine?.contains("TracerPid")!!) {
                    val arrays =
                        readLine!!.split(":".toRegex()).toTypedArray()
                    if (arrays.size == 2) {
                        val tracerPid = arrays[1].trim { it <= ' ' }.toInt()
                        if (tracerPid != 0) {
                            return true
                        }
                    }
                }
            }
            b.close()
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return false
    }
```


## 相关so文件处理
- 有些so文件为系统的，打算等保需要加固，可以通过导出加固方式，也可以通过规避加入，像lib/armeabi-v7a/librsjni.so   文件：
lib/armeabi-v7a/libRSSupport.so  renderscript这些系统的的可以去除掉进行特殊处理。ß
```
    packagingOptions {
        // for renderscript
        exclude 'lib/armeabi-v7a/libRSSupport.so'
        exclude 'lib/armeabi-v7a/librsjni_androidx.so'
        exclude 'lib/armeabi-v7a/librsjni.so'
    }
```