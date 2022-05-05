---
title: awk常用记录
tags: AWK
abbrlink: 39087
date: 2017-11-20 11:22:17
---

### AWK记录
- AWK是一种处理文本文件的语言，是一个强大的文本分析工具

### AWK工作原理

```
awk 'BEGIN{ commands } pattern{ commands } END{ commands }'
```

- 例如：

```
$ echo -e "A line 1\nA line 2" | awk 'BEGIN{ print "Start" } { print } END{ print "End" }'

Start
A line 1
A line 2
End
```

<!-- more -->

- 例如：

```
统计文件中的行数：
 awk 'END{ print NR }' filename 
 
以上命令只使用了END语句块，在读入每一行的时，awk会将NR更新为对应的行号，当到达最后一行NR的值就是最后一行的行号，所以END语句块中的NR就是文件的行数。
```


### 创建log.txt文本内容如下：

```
1 hello, world
2 this is a test
3 Are you like awk
This's a test
10 There are orange,apple,mongo
```
- **每行按空格或TAB分割，输出文本中的1项**

```
$awk '{print $1}' log.txt
1
2
3
this's
10
```

- **awk -F  #-F相当于内置变量FS, 指定分割字符**

```
awk -F, '{print $1}' log.txt
1 hello
2 this is a test
3 Are you like awk
this's  a test
10 There are orange

============或者使用内建变量=================

$ awk 'BEGIN{FS=","} {print $1,$2}'     log.txt
1 hello  world
2 this is a test
3 Are you like awk
this's  a test
10 There are orange apple


```

- **awk -v   设置变量**

```
$ awk -v a=1 '{print $1,$1+a}' log.txt
1 2
2 3
3 4
this's 1
10 11

```

- **awk -f {awk脚本} {文件名}**

```
 $ awk -f cal.awk log.txt
```

- **运算符的支持**
![](https://raw.githubusercontent.com/zhulg/allpic/master/awk1.png)

- **条件判断**

```
awk '$1>2' log.txt
3 Are you like awk
this's  a test
10 There are orange,apple,mongo
```

- **多条件判断**
- 过滤第一列大于2并且第二列等于'Are'的行
```
awk '$1>2 && $2=="Are" {print $1,$2,$3}' log.txt
3 Are you
```

- **内建变量(预定义变量)**
![](https://raw.githubusercontent.com/zhulg/allpic/master/awk2.png)

```

$ awk '{print NR,FNR,$1,$2,$3}' log.txt
1 1 2 this is
2 2 3 Are you
3 3 This's a test
4 4 10 There are

# 指定输出分割符
$  awk '{print $1,$2,$5}' OFS=" $ "  log.txt
2 $ this $ test
3 $ Are $ awk
This's $ a $
10 $ There $

```

- **使用正则，字符串匹配**

```
# 输出第二列包含 "th"，并打印第二列与第四列
$ awk '$2 ~ /th/ {print $2,$4}' log.txt
this a

```

```
~ 表示模式开始。// 中是模式。
# 输出包含"re" 的行
$ awk '/re/ ' log.txt
---------------------------------------------
3 Are you like awk
10 There are orange,apple,mongo
```

- 忽略大小写

```
$ awk 'BEGIN{IGNORECASE=1} /this/' log.txt
---------------------------------------------
2 this is a test
This's a test
```

- 模式取反

```
$ awk '$2 !~ /th/ {print $2,$4}' log.txt
---------------------------------------------
Are like
a
There orange,apple,mongo
$ awk '!/th/ {print $2,$4}' log.txt
---------------------------------------------
Are like
a
There orange,apple,mongo

```



### awk脚本

```
关于awk脚本，我们需要注意两个关键词BEGIN和END。
BEGIN{ 这里面放的是执行前的语句 }
END {这里面放的是处理完所有的行后要执行的语句 }
{这里面放的是处理每一行时要执行的语句}
```
- 假设有这么一个文件（学生成绩表）：

```
$ cat score.txt
Marry   2143 78 84 77
Jack    2321 66 78 45
Tom     2122 48 77 71
Mike    2537 87 97 95
Bob     2415 40 57 62
```

- 我们的awk脚本如下：

```
$ cat cal.awk
#!/bin/awk -f
#运行前
BEGIN {
    math = 0
    english = 0
    computer = 0
 
    printf "NAME    NO.   MATH  ENGLISH  COMPUTER   TOTAL\n"
    printf "---------------------------------------------\n"
}
#运行中
{
    math+=$3
    english+=$4
    computer+=$5
    printf "%-6s %-6s %4d %8d %8d %8d\n", $1, $2, $3,$4,$5, $3+$4+$5
}
#运行后
END {
    printf "---------------------------------------------\n"
    printf "  TOTAL:%10d %8d %8d \n", math, english, computer
    printf "AVERAGE:%10.2f %8.2f %8.2f\n", math/NR, english/NR, computer/NR
}

```
我们来看一下执行结果：

```
$ awk -f cal.awk score.txt
NAME    NO.   MATH  ENGLISH  COMPUTER   TOTAL
---------------------------------------------
Marry  2143     78       84       77      239
Jack   2321     66       78       45      189
Tom    2122     48       77       71      196
Mike   2537     87       97       95      279
Bob    2415     40       57       62      159
---------------------------------------------
  TOTAL:       319      393      350
AVERAGE:     63.80    78.60    70.00

```
- 参考链接：
- http://man.linuxde.net/awk 
- https://coolshell.cn/articles/9070.html
- http://www.runoob.com/linux/linux-comm-awk.html
