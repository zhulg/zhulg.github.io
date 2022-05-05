---
title: '404'
permalink: /404
date: 2022-05-05 15:56:16
comments: false
layout: false
---

<!DOCTYPE html>
<html>
<head>
<!-- 设置内容的编码格式 -->
<meta charset="utf-8"/>
<meta name="keywords" content="404页"/>
</head>
<body>
<br>
<h1>原链接有调整，请到首页，通过文章标题来查阅</h1>
<h2>笔记首页： <a href="https://zhulg.github.io/" target="_blank" title="">https://zhulg.github.io/</a></h2>
<h2><div id="countdown"></div></h2>
<script language="javascript" type="text/javascript">
    var time = 5
    var divLabel = document.getElementById("countdown")
    var label = "秒钟后系统将帮您自动跳转到笔记首页。"
    divLabel.innerHTML = time.toString() + label
    function updateTime(){
        time = time-1
        if(time>=0){ divLabel.innerHTML = time.toString() + label }
        else{ divLabel.innerHTML = "正在跳转到关于&amp;联系我，请稍后。。。" }
    }
    setInterval("updateTime()",1000);
    setTimeout("javascript:location.href='https://zhulg.github.io'", time*1000);
</script>

</body>
</html>
