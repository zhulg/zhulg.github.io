---
title: App WebView白屏总结
date: 2020-12-30 10:39:30
tags: App
categories: App
toc: true
---

## App上WebView白屏
- 在移动端上场景的H5页面白屏问题，根据平台分为Android和ios端上H5白屏问题（相关解决和优化基于移动端侧）
- Android的的白屏问题表现现对比较多些，按问题类型大致可以概括为：

```
机型兼容造成
JS语法兼容造成
网络加载获取数据造成
软件系统版本兼容造成
内存或者渲染进程造成
android上疑难杂症
```

- IOS的问题造成白屏的原因现对较少，因为WKWebView来说通过系统组件来保障，相对Android系统webview碎片化要好的多：

```
网络加载获取数据造成
系统软件版本造成
JS语言兼容造成
内存不足造成
```

## Android端白屏问题（APP侧解决方案）

- 常见的语法造成白屏相关

```
使用了es6的语法对低版本未做兼容引入了三方外部插件，外部插件语法存在兼容性问题
语法错误造成页面无法渲染
```

- webview加载H5界面时,H5中的一些控件标签可能使用后android中不支持设置如下方式

```
// 解决对某些标签的不支持出现白屏
webSettings.setDomStorageEnabled(true);
```

- 一些机型硬件加速相关问题

```
webView.setBackgroundColor(ContextCompat.getColor(this,android.R.color.transparent));
webView.setBackgroundResource(R.color.black);//根据需求修改
```

- 网络资源获取造成的白屏
```
 这种情况与获取的资源有关系，可以通过loading状态和箭听webviewClient方法进行处理
 （这次主要调研基于业务的本地化内存造成的白屏）
```

### 内存相关造成白屏
- 内存导致的白屏或者其他异常问题，有时白屏显示，有时界面渲染失败等奇怪现象，但是内存白屏是最不好处理，又需要给用户友好体验的问题。
- **webview自身内存问题**：本身webview自身比较重，切存在activity或fragment里就牵涉到声明周期和创建的问题，和声明周期里回收问题，一般解决方法在声明周期销毁时先destory在设置null 。先加载null内容的过程需要实际代码验证。
 
```
  if (mWebView != null) {
        mWebView.loadDataWithBaseURL(null, "", "text/html", "utf-8", null); 
        mWebView.clearHistory(); 
        mLayout.removeView(mWebView); 
         mWebView.destroy(); 
         mWebView = null; 
    } 
```
- 独立进程的方式，一般不采用涉及跨进程数据通信，加大维护难度

- **加载内容内存问题造成的白屏**：可以从以下几个思路进行解决

```
 监控webview的渲染进程状态
 监测H5页面白屏页面
 监测webview里的内存
 
```

#### 监控WebView渲染进程（适合项目应用）
- webView的内存从4.4变为基于Google的Chromium的实现
- ![](https://a77db9aa-a-7b23c8ea-s-sites.googlegroups.com/a/chromium.org/dev/developers/design-documents/multi-process-architecture/arch.png?attachauth=ANoY7cqlEjwaSt9DhazJlP1VN54Qg4oNubWeXO7MRVGONSZrVwZCB2Vvl2kcllXIMx0HiAUkj5NDQnHjw5WLRfTG9HUkGpS55566yzX_vxQm51n-BkL8mxAn-MTQxOW3-hkfSplcGkVnicYgxFLnP2iCsf_dh1_T1Ofao4EYgGBgzD7r6NbnSOtNCLDPp5_ZrEKP8Btw5dVA8YeOLe9lSJmjt3In3DVKSvxhzYhj5fAvATUExgxC4v-ZbATgEttqxZyXitUfe-HifXb9KZRAfKKk3BkizPjZmw%3D%3D&attredirects=0)

- Chromium的架构可以看到（Android 8.0默认打开多进程），Render Process 是单独的进程通过IPC来交互数据，GPU Process仍然为Browser Process的一个线程

```
We use separate processes for browser tabs to protect the overall application from bugs and glitches in the rendering engine. We also restrict access from each rendering engine process to others and to the rest of the system. In some ways, this brings to web browsing the benefits that memory protection and access control brought to operating systems.
We refer to the main process that runs the UI and manages tab and plugin processes as the "browser process" or "browser." Likewise, the tab-specific processes are called "render processes" or "renderers." The renderers use the Blink open-source layout engine for interpreting and laying out HTML.
```

- 官网架构里解释了相关多进程的目的，browser是单独的进程，确保渲染在出现故障的时候可以不影响browser的进程显示。
-  **我们相关的白屏的出现除了之前的因素和语法问题之前，就是渲染进程出现了问题。因为我们白屏主要出现在渲染进程，那就可以通过渲染进程查找出问题时相关的状态信息，问题就转化为我们如何知道Render Process的相关状态和监控**

- 关于Render进程可以在文档里查到关于webview的Termination Handling ，通过该方法检测到渲染进程, 通过实现client里的onRenderProcessGone方法。
- **原理和实现：**

```
当检测到渲染进程被页面大内存消耗导致被杀或者异常终止时，
移除当前webview实例并消耗，否则新渲染进程会失效
通过新的实例加载出新的执行逻辑，可以reload页面或者其他业务逻辑, （而browser进程不死用户无感知）
防止当前reload页面如有大内存死循环，可能直接会被系统kill
（要考虑到系统版本限制问题，并适用于X5WebView）
```

- 代码demo可以联系我,目前暂时未放gitlab上

#### 监控WebView页面白屏（适合数据采集）
- 内存问题是造成白屏的重要一部分，还有就是其他莫名奇妙问题造成的页面白屏（这种白屏可能不是内存，js语法、网络加载等造成白屏）
- 如果能够在APP端检测到白屏页面出现，采取相应的提示或者reload ,也是很好解决疑难杂症的白屏方案
- 技术点实现：
```
对WebView在调用完成后进行截图
遍历截图的像素点的颜色值
设定白色像素点比例确认是否白屏
```

####  监测webview里的内存
- 目前关于如何监测webView里的内存占用情况，在原生端上还没有更好的思路去处理，需要进一步调研
- 在项目里的实现，可以优先使用前2中方案。

## Ios端WKWebView白屏
- 相对Android上的白屏，ios白屏的出现在app端上大部分为内存占用产生。
- **产生的原因**：WKWebView 是运行在一个独立进程中的组件，当 WKWebView 上占用内存过大时，WKWebView 所在的 WebContent Process 会被系统 kill 掉，反映在用户体验上就是发生了白屏。

### ios系统方案

- WKNavigationDelegate的回调方法webViewWebContentProcessDidTerminate 里直接进行reload

```
 尝试在每次请求kWebview前清理缓存
 webview reload
```

### 白屏像素检测（因为有些不是内存引起的，也不回调系统的方法）
- 原理：类似于android的白屏检测，通过截图检测像素点，来判断是否白屏

```
通过获取截图
截图进行缩放
像素点进行遍历判断比例
```
