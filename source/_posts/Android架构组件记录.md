---
title: Android架构组件记录
tags: Android
categories: Android
toc: true
abbrlink: 57116
date: 2019-07-31 17:43:48
---


## Android官方架构组件

- 官方实验室地址：https://codelabs.developers.google.com/codelabs/android-lifecycles/index.html?index=..%2F..%2Findex#0
- 官方例子：https://github.com/googlesamples/android-architecture-components



### LifeCycle

- 通俗理解：有一个具有生命周期的组件 A (例如 Activity 或 Fragment)，而另一个组件 B 需要响应 A 组件的生命周期，传统的方式是在组件 A 的生命周期依赖组件 B，但是这种方式导致代码健壮性较低，同时易导致一系列的错误。使用 Lifecycle 组件，您可以将组件 B 的代码从组件 A 的生命周期方法中移到组件本身


![](https://developer.android.com/images/topic/libraries/architecture/lifecycle-states.svg)



<!-- more -->

### LiveData

- LiveData 是一个可观察的数据持有者。与常规可观察性不同，LiveData 具有生命周期感知能力，这意味着它尊从其他应用程序组件（例如 Activity, Fragment, Service）的生命周期。 这种设计确保 LiveData 只更新处于活动生命周期状态的应用程序组件观察者。如果观察者的生命周期处于 STARTED 或 RESUMED 状态，则 LiveData 会将观察者视为活动状态。LiveData 仅将更新通知给活跃的观察者，未注册和非活动的观察者不会收到有关更新的通知。
- **创建一个 LiveData,然后一个简单的方法调用，我们在监听数据变化时传入了两个参数，前者 owner 用于将 livedata 与生命周期绑定，后者监听数据的变化，这样你就能使用 LiveData 了**
- **如果观察者的生命周期处于 STARTED 或 RESUMED 状态，则 LiveData 会将观察者视为活动状态。LiveData 仅将更新通知给活跃的观察者**

```
- LiveData 是一个可以被观察的数据持有类，它可以感知 Activity、Fragment或Service 等组件的生命周期。简单来说，他主要有一下优点。
- 它可以做到在组件处于激活状态的时候才会回调相应的方法，从而刷新相应的 UI。不用担心发生内存泄漏
- 当 config 导致 activity 重新创建的时候，不需要手动取处理数据的储存和恢复。它已经帮我们封装好了。
- 当 Actiivty 不是处于激活状态的时候，如果你想 livedata setValue 之后立即回调 obsever 的 onChange 方法，而不是等到 Activity 处于激活状态的时候才回调 obsever 的 onChange 方法，你可以使用 observeForever 方法，但是你必须在 onDestroy 的时候 removeObserver。
- 在你的项目中，是不是经常会碰到这样的问题，当网络请求结果回来的时候，你经常需要判断 Activity 或者 Fragment 是否已经 Destroy， 如果不是 destroy，才更新 UI。而当你如果使用 Livedata 的话，因为它是在 Activity 处于 onStart 或者 onResume 的状态时，他才会进行相应的回调，因而可以很好得处理这个问题，不必谢一大堆的 activity.isDestroyed()。接下来，让我们一起来看一下 LiveData 的使用
```
#### LiveData 的子类
- LiveData 是一个抽象类，我们不能直接使用。
- MutableLiveData 是 LiveData 的一个最简单实现，它可以接收数据更新并通知观察者。


### ViewModel
- ViewModel 目的在于以生命周期的形式存储和管理与 UI 相关的数据。 ViewModel 允许数据在配置变化（例如屏幕旋转）后仍然存活。
- ViewModel 的使用很简单，创建一个类继承 ViewModel,如果你想在 ViewModel 中使用 Context，可以继承 AndroidViewModel,然后通过一行代码即可得到 ViewModel 对象

 ```
 val viewModel = ViewModelProviders.of(this).get(UserViewModel::class.java)
 ```


#### **ViewModel负责为View准备数据。它们将数据暴露给正在监听更改的任何视图。在Android中，使用ViewModel类时应该记住一些具体的事实：**

```
 ViewModel可以在Activity配置更改中保留其状态。它保存的数据立即可用于下一个Activity实例，而不需要在onSaveInstanceState()中保存数据，并手动还原。
 ViewModel与特定的Activity或Fragment实例无关。
 ViewModel允许在Fragment之间轻松共享数据（意味着您不再需要通过ctivity来协调动作）。
 ViewModel将保持在内存中，直到Lifecycle的范围永远消失 - Activity调用finish; 在Fragment调用ditached。
 因为ViewModel独立于Activity或Fragment实例，它不直接引用其中的任何View或保持上下文的引用。真会导致内存泄漏。
 如果ViewModel需要应用的上下文(例如查找系统服务)，它可继承AndroidViewModel类，并有一个构造函数来接收Application实例。

```




### 最佳实践
- 尽可能保持您的 UI 控制器（activity 和 fragment）精简。他们不应该试图获取他们自己的数据;相反，使用 ViewModel 来做到这一点，并通过监听 LiveData 对象来更新视图。
- 尝试编写数据驱动的用户界面，其中您的 UI 控制器的职责是在数据更改时更新视图，或将用户操作通知给ViewModel。
- 把你的数据逻辑放在  ViewModel 类中。 ViewModel 应作为您的 UI 控制器和其他应用程序之间的连接器。 但要小心，ViewModel 不负责提取数据（例如，来自网络）。 相反，ViewModel 应调用相应的组件来获取数据，然后将结果提供给UI控制器
- 使用 Data Binding 在视图和 UI 控制器之间保持干净的界面。 这可以使您的视图更具说明性，并最大限度地减少需要在 activity 和 fragment 中编写的更新代码。 如果你喜欢用 java 编程语言来做到这一点，可以使用像 Butter Knife 这样的库来避免样板代码并且能够更好的抽象。
- 如果您的 UI 很复杂，请考虑创建一个 presenter 来处理 UI 修改。这可能是一项艰巨的任务，但它可以使您的 U I组件更易于测试。
- 避免在 ViewModel 中引用 View 或 Activity 上下文。如果 ViewModel 存活的时间比 Activity（在配置更改的情况下），将会造成 activity 的内存泄漏



##Kotlin

- BugKotlinDocument 方法注释插件
- findviewbyid 通过引入 kotlinx.android.synthetic.main.activity_main.* 直接用变量

- LiveData 还支持简单的数据变换。目前在 Transformations 类中有 map 和 switchMap 两个变换函数，如果属性 RxJava 则对这两个函数应该不陌生：
 ```
 map 是把一个数据类型变换为另外一个数据类型。
 switchMap 是把一个数据变化为另外一个 LiveData 。
 ```



