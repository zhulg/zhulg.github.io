---
title: Flutter Widget生命周期总结
tags: flutter
categories: App
toc: true
abbrlink: f4ca6a79
date: 2022-05-27 14:26:29
---

- Flutter Widget生命周期分为2种，一种有状态的组件StatefulWidget的生命周期，和无状态的StatelessWidget 组件的生命周期。

## 一.StatefulWidget的生命周期

-  先看一张statefulwidget生命周期图 **（若文中图片无法显示，请科学上网查看：[推荐工具](https://order.yizhihongxing.network/aff.php?aff=12299)）**
-  继承StatefulWidget的组件会先进行构造方法，在进行对应的Widget的CreateState, 在State里

![](https://raw.githubusercontent.com/zhulg/allpic/master/flutter_widgetlifecycle.png)


### *1.createState：*
- 创建新的StatefulWidget的时候，就会立即执行createState方法，**返回一个state的实例与当前widget建立关系。**

```
class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);
  final String title;
  @override
  State<MyHomePage> createState() => _MyHomePageState();
}
```

### *2. initState：*
-  initState 是 StatefulWidget 创建完后，在State里调用的第一个方法, 只执行一次（iOS 的 viewDidLoad()、Android 的 onCreate）, StatefulWidget 已经被加载到渲染树里了但还没开始渲染，这里常做一些初始化变量工作。

```
  @override
  void initState(){
    super.initState();
  }

```

### *3. didChangeDependencies:*
- 在initState回调函数执行之后立即调用，之后当 StatefulWidget 刷新的时候，就不会调用了, **当State对象的依赖发生变化时会被再次调用（层级变化&共享依赖变化）**。官网文档举例，如果之前build构建里依赖的 InheritedWidget 发生变化之后，那么他的 didChangeDependencies 会被再次调用。（InheritedWidget是 Flutter 中非常重要的一个功能型组件，它提供了一种在 widget 树中从上到下共享数据的方式，应用的根 widget 中通过InheritedWidget共享了一个数据，可以在任意子widget 中来获取该共享的数据）（场景：主题颜色、地区语言或者其他通用变量等）

```
@override
void didChangeDependencies() { }
```

### *4. build：*
- build方法在didChangeDependencies之后会立即调用，之后每次当setState方法被调用后，都会进行重新build，并返回要渲染的widiget 

```
@override
Widget build(BuildContext context) {
  return Scaffold()
}
```

### *5. didUpdateWidget：*

- 比较严谨官方描述:  If the parent widget changes its properties or configurations, and the parent wants to rebuild the child widget, with the same Runtime Type, then didUpdateWidget is triggered. This unsubscribes to the old widget and subscribes to the configuration changes of the new widget! 

```
@override
  void didUpdateWidget(covariant CurrentClass oldWidget) {
    // TODO: implement didUpdateWidget
    super.didUpdateWidget(oldWidget);
  }
```
### *6.  deactivate：*

- 当要将 State 对象从渲染树中移除的时候，就会调用 deactivate 生命周期，这标志着 StatefulWidget 将要销毁，但是有时候 State 不会被销毁，而是重新插入到渲染树种(例如；当使用Navigator.push 移动到下一个屏幕)

```
@override
  void deactivate() {
    super.deactivate();
  }
```
### *7. dispose*
- 当 View 不需要再显示，从渲染树中移除的时候，State 就会永久的从渲染树中移除，就会调用 dispose 生命周期，(在 dispose 里做一些取消监听、动画的操作，和 initState 是相反)

```
@override
  void dispose() {
    super.dispose();
  }
```
## 二. StatelessWidget的生命周期
- StatelessWidget的生命周期比较简单，通过构造方法，build方法来进行渲染需要的widget，由于是无状态的也就执行一次。

---

深入理解 Flutter 的生命周期是写出高质量、高性能应用的基础。同样地，在日常开发和内容创作中，善用自动化工具也是提升个人效率的关键。如果你对如何将 AI 与自动化工具结合，打造一套属于自己的高效工作流感兴趣，可以阅读我的另一篇实战文章：[《N8N教程：搭建公众号自动化写作工作流完整指南》](/posts/52630d3b.html)。
