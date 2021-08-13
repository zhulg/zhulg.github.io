---
title: WebView跨域问题
date: 2021-08-13 13:54:41
tags: App
categories: App
toc: true
---

## WebView同源策略

- #### 从出现的问题来讲：

- 移动端使用webView去加载本地H5离线包（file://），在离线的H5里有http相关的请求，这样会出现file协议和http造成的不同源问题

```
from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

- 或者类似出现：

```
cross origin requests are only supported for protocol schemes: http, data, chrome, https.
```
﻿
#### 出现原因：

 - 同源策略造成，大众叫法一般称为跨域了
 - 同源要满足：协议相同、域名相同、端口相同  *http://www.example.com:80/*
 - 同源政策的目的，是为了保证用户信息的安全，防止恶意的网站窃取数据
 
﻿
#### ​CORS是什么：
- 是一种基于HTTP 头的机制，该机制通过允许服务器标示除了它自己以外的其它 origin（域，协议和端口），这样浏览器可以访问加载这些资源。
- 跨源资源共享还通过一种机制来检查服务器是否会允许要发送的真实请求，该机制通过浏览器发起一个到服务器托管的跨源资源的"预检"请求。
- 在预检中，浏览器发送的头中标示有HTTP方法和真实请求中会用到的头。
- 跨源域资源共享（ CORS ）机制允许 Web 应用服务器进行跨源访问控制，从而使跨源数据传输得以安全进行。
﻿

#### ​原理解决：​

- 出现不同源情况下，使用cors的方式来进行解决，如上日志描述
- 对请求的资源服务器设置允许跨源请求
- 使用WebView的设置允许使用file文件来进行访问，但是APP安全性来说是致命
- 使用同源的方式来进行请求和加载    
      
#### 推荐方案：
- Android上以前解决该类问题方案设置 setAllowFileAccessFromFileURLs 来允许其他协议访问加载的file开头的页面，这个已经被披露严重漏洞
- 官方推荐： WebViewAssetLoader   androidx.webkit.WebViewAssetLoader
        
```
Helper class to load local files including application's static assets and resources using http(s):﻿// URLs inside a WebView class. Loading local files using web-like URLs instead of ﻿"file://" is desirable as it is compatible with the Same-Origin policy.
```

- AssetsPathHandler ​为该PathHandler的实现类
-  **提供 AssetsPathHandler, ResourcesPathHandler 、InternalStoragePathHandler 满足各个场景需要**
- ﻿DEFAULT_DOMAIN默认appassets.androidplatform.net 字符串常量可替换

- AssetsPathHandler的用法：

```
 final WebViewAssetLoader assetLoader = new WebViewAssetLoader﻿.﻿Builder﻿(﻿)
          .﻿addPathHandler﻿(﻿"/assets/"﻿, new AssetsPathHandler﻿(﻿this﻿)﻿)
          .﻿build﻿(﻿)﻿;
﻿
 webView.﻿setWebViewClient﻿(﻿new WebViewClient﻿(﻿) {
     @Override
     @RequiresApi﻿(﻿21﻿)
     public WebResourceResponse shouldInterceptRequest﻿(﻿WebView view,
                                      WebResourceRequest request) {
         return assetLoader.﻿shouldInterceptRequest﻿(request.﻿getUrl﻿(﻿)﻿)﻿;
     }
﻿
     @Override
     @SuppressWarnings﻿(﻿"deprecation"﻿) // for API < 21
     public WebResourceResponse shouldInterceptRequest﻿(﻿WebView view,
                                      WebResourceRequest request) {
         return assetLoader.﻿shouldInterceptRequest﻿(﻿Uri﻿.﻿parse﻿(request)﻿)﻿;
     }
 }﻿)﻿;
﻿
 WebSettings webViewSettings = webView.﻿getSettings﻿(﻿)﻿;
 // Setting this off for security. Off by default for SDK versions >= 16.
 webViewSettings.﻿setAllowFileAccessFromFileURLs﻿(﻿false﻿)﻿;
 // Off by default, deprecated for SDK versions >= 30.
 webViewSettings.﻿setAllowUniversalAccessFromFileURLs﻿(﻿false﻿)﻿;
 // Keeping these off is less critical but still a good idea, especially if your app is not
 // using file:// or content:// URLs.
 webViewSettings.﻿setAllowFileAccess﻿(﻿false﻿)﻿;
 webViewSettings.﻿setAllowContentAccess﻿(﻿false﻿)﻿;
﻿
 // Assets are hosted under http(s)://appassets.androidplatform.net/assets/... .
 // If the application's assets are in the "main/assets" folder this will read the file
 // from "main/assets/www/index.html" and load it as if it were hosted on:
 // https://appassets.androidplatform.net/assets/www/index.html
 webview.﻿loadUrl﻿(﻿"https://appassets.androidplatform.net/assets/www/index.html"﻿)﻿;
 
```
 
 - **这样在loadurl是就可以使用 https://appassets.androidplatform.net/assets/www/index.html  主要domain的部分和后边assets是需要对应的，这样通过https来加载，而实际好找的对应的本地资源通过流的方式进行的读取，避免了非同源问题的出现。**
﻿
﻿
