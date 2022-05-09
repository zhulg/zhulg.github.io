---
title: springboot里几个常用注解
tags: springboot
categories: springboot
toc: true
abbrlink: 6507
date: 2017-08-04 18:23:30
---
#### Spring里几个常用注解区别
|注解	|用途|
|--- |---|
|@Controller|	处理http请求|
|@RestController	|spring 4 新加注解，@RestController = @Controller + @ResponseBody |
|@RequestMapping	|配置url映射|
|@PathVariable	|获取url中的数据|
|@RequestParam	|获取请求参数的值|
|@GetMapping	|组合注解 (  @RequestMapping(value = "/hello" , method = RequestMethod.GET) 等价于 @GegMapping("/hello")


- @RestController和Controller都在类上注解
- @Controller 用于页面的跳转（return "index"）跳转到index页面去，否则返回的内容就是字符串 "index"
- 当类使用@Controller注解，而对应的接口方法需要返回JSON，XML或自定义mediaType内容到页面，则需要在对应的方法上加上@ResponseBody注解。



- 以下代码不跳转

```
@RestController
public class HelloController {
    
    @RequestMapping("/hello")
    public String hello() {
        return "Hello World";
    }
}
```
- 以下代码进行跳转

```
@Controller
public class HelloController {
    
    //当使用@Controller，想要返回内容。则添加@ResponseBody
    @ResponseBody
    @RequestMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @RequestMapping("/")
    public String index(ModelMap map) {
        map.addAttribute("host", "hello jason");
        return "index";
    }
}
```