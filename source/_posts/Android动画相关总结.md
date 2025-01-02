---
title: Android动画相关总结
tags: Android
categories: App
abbrlink: 42188
date: 2020-08-25 20:53:00
---


- Android的动画常用的种类，一般指视图动画、属性动画、以及过渡动画
- 常用的种类一般为4种，分别适用于不同的场景

```
Frame Animation：逐帧动画，即顺序播放事先做好的图像，跟电影类似 。
Tween Animation：补间动画，通过对场景里的对象不断做图像变换 

Property Animation：属性动画，补间动画增强版，支持对对象执行动画。
Transition Animation：过渡动画，主要是实现Activity或View过渡动画效果
```

## 动画实现方式
- 一种方式定义在资源文件里方式xml形式，另一一种通过代码方式，视图动画常用xml定义方式。

## 视图动画
- 使用视图动画框架可以创建两种类型的动画：

```
帧动画：通过使用 AnimationDrawable 按顺序显示一系列图片来创建动画, 即顺序播放事先做好的图像，跟电影类似 
补间动画：通过使用 Animation 对单张图片执行一系列转换来创建动画

```

### 帧动画
-  **在 XML 中定义的按顺序显示一系列图片的动画（如电影）**

```
animation-list：xml文件根节点的标签名，表示逐帧动画。item表示每一帧的资源内容。
android:oneshot：该属性用来控制动画是否循环播放，true表示不会循环播放，false表示会循环播放。
android:duration：该属性表示每一帧持续播放的时间
```

- 官网例子:

```
    <?xml version="1.0" encoding="utf-8"?>
    <animation-list xmlns:android="http://schemas.android.com/apk/res/android"
        android:oneshot="false">
        <item android:drawable="@drawable/rocket_thrust1" android:duration="200" />
        <item android:drawable="@drawable/rocket_thrust2" android:duration="200" />
        <item android:drawable="@drawable/rocket_thrust3" android:duration="200" />
    </animation-list>
    
```

- 使用：

```
   val rocketImage: ImageView = findViewById(R.id.rocket_image)
    rocketImage.setBackgroundResource(R.drawable.rocket_thrust)
    val rocketAnimation = rocketImage.background
    if (rocketAnimation is Animatable) {
        rocketAnimation.start()
    } 
```

### 补间动画
- **在 XML中定义的动画，用于对图形执行旋转、淡出、移动和拉伸等转换，并指定动画变化的时间与方式等 ，主要有四种基本的效果：透明度、缩放、位移、旋转**

- 在xml文件形式定义时，xml文件中标签名分别如下所示：

```
alph：渐变透明度动画效果
scale： 渐变尺寸伸缩动画效果
translate：画面转换位置移动动画效果
rotate：画面转移旋转动画效果
```

- 在Java代码中，对应的类分别为AlphaAnimation，ScaleAnimation，TranslateAnimation，RotateAnimation

## 属性动画 
 - **通过使用 Animator 在设定的时间段内修改对象的属性值来创建动画**
 - 在 XML 中定义的动画的话，用于在设定的一段时间内修改目标对象的属性，例如背景颜色或 Alpha 值。
- Animator是属性动画的基类，是一个抽象类。该抽象类有两个重要的具体实现类，分别是：ValueAnimator和ObjectAnimator类。另外还会使用到Evaluator，AnimatorSet等类

```
    <set
      android:ordering=["together" | "sequentially"]>

        <objectAnimator
            android:propertyName="string"
            android:duration="int"
            android:valueFrom="float | int | color"
            android:valueTo="float | int | color"
            android:startOffset="int"
            android:repeatCount="int"
            android:repeatMode=["repeat" | "reverse"]
            android:valueType=["intType" | "floatType"]/>

        <animator
            android:duration="int"
            android:valueFrom="float | int | color"
            android:valueTo="float | int | color"
            android:startOffset="int"
            android:repeatCount="int"
            android:repeatMode=["repeat" | "reverse"]
            android:valueType=["intType" | "floatType"]/>

        <set>
            ...
        </set>
    </set>
    
```

- 该文件必须具有一个根元素，可以是 <set>、<objectAnimator> 或 <valueAnimator>。可以将动画元素（包括其他 <set> 元素）组合到 <set> 元素中。

- 使用：

```
    val set: AnimatorSet = AnimatorInflater.loadAnimator(myContext, R.animator.property_animator)
        .apply {
            setTarget(myObject)
            start()
        }
    
```
- ObjectAnimator的原理是直接对对象的属性值进行改变操作，从而实现动画效果 

## 过渡动画
- 一般通过使用 Android 的过渡框架，只需提供起始布局和结束布局，即可为界面中的各种运动添加动画效果。可以选择所需的动画类型（例如，淡入/淡出视图或更改视图尺寸），而过渡框架会确定如何为从起始布局到结束布局的运动添加动画效果。
- 过渡框架包含以下功能：

```
群组级动画：将一个或多个动画效果应用于视图层次结构中的所有视图。
内置动画：对淡出或移动等常见效果使用预定义动画。
资源文件支持：从布局资源文件加载视图层次结构和内置动画。
生命周期回调：接收可控制动画和层次结构更改流程的回调
```

- 用户在多个 Activity 之间移动的切换过渡动画， activity.overridePendingTransition() 的过渡动画