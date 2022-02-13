---
title: kotlin常混淆操作记录
date: 2019-08-20 15:23:52
tags: App
categories: Android
toc: true
---

### kotlin易混淆操作符
- **操作符？**
-  如果要允许为空，我们可以声明一个变量为可空字符串，写作 String?

```
var b: String? = "abc"
b = null // ok
print(b)
var b: String? = "abc"
b = null // ok
print(b)
```



- 安全调用操作符 ?

```
val a = "Kotlin"
val b: String? = null
println(b?.length)
println(a?.length) // 无需安全调用
```

- 以上结果
```
null
6
如果 b 非空，就返回 b.length，否则返回 null，这个表达式的类型是 Int?。
```

- **安全调用在链式调用中很有用**。例如，如果一个员工 Bob 可能会（或者不会）分配给一个部门， 并且可能有另外一个员工是该部门的负责人，那么获取 Bob 所在部门负责人（如果有的话）的名字，我们写作：

```
bob?.department?.head?.name
如果任意一个属性（环节）为空，这个链式调用就会返回 null。
```


-  **操作符!!**
第三种选择是为 NPE 爱好者准备的：非空断言运算符（!!）将任何值转换为非空类型，若该值为空则抛出异常。我们可以写 b!! ，这会返回一个非空的 b 值 （例如：在我们例子中的 String）或者如果 b 为空，就会抛出一个 NPE 异常：

```
val l = b!!.length
因此，如果你想要一个 NPE，你可以得到它，但是你必须显式要求它，否则它不会不期而至。
```

- **安全的类型转换**
- 如果对象不是目标类型，那么常规类型转换可能会导致 ClassCastException。 另一个选择是使用安全的类型转换，如果尝试转换不成功则返回 null：

```
val aInt: Int? = a as? Int
val aInt: Int? = a as? Int
```


##### 取值方法(Getter)与设值方法(Setter)
```
var <propertyName>[: <PropertyType>] [= <property_initializer>]
    [<getter>]
    [<setter>]
```
- 其中的初始化器(initializer), 取值方法(getter), 以及设值方法(setter)都是可选的. 如果属性类型可以通过初始化器自动推断得到, (或者可以通过取值方法的返回值类型推断得到, 详情见下文), 则属性类型的声明也可以省略.

- 如果我们定义一个自定义取值方法(Getter), 那么每次读取属性值时都会调用这个方法(因此我们可以用这种方式实现一个计算得到的属性). 下面是一个自定义取值方法的示例:

```
val isEmpty: Boolean
    get() = this.size == 0

```

#### field的使用

- 幕后属性或幕后字段。在Kotlin语言中，如果在类中定义一个成员变量，Kotlin将自动生成默认setter/getter方法。而Kotlin提供了一种非常特殊的方式声明setter/getter方法：

```
  var name: String? = null
        set(value) {
            field = value
            name = value //如果这样写，则出现循环调用
        }
        get() = field

```
- field是当前属性的影子，就是当前的值this,setter/getter方法中使用。


#### kotlin in/out泛型中使用

- 父类泛型对象可以赋值给子类泛型对象，用 in,子类泛型对象可以赋值给父类泛型对象，用 out。
- 如果你的类是将泛型作为内部方法的返回，那么可以用 out：

```
interface Production<out T> {
    fun produce(): T
}
可以称其为 production class/interface，因为其主要是产生（produce）指定泛型对象。因此，可以这样来记：produce = output = out。

```

- In(逆变)

```
如果你的类是将泛型对象作为函数的参数，那么可以用 in：

interface Consumer<in T> {
    fun consume(item: T)
}
可以称其为 consumer class/interface，因为其主要是消费指定泛型对象。因此，可以这样来记：consume = input = in。
```

- Invariant(不变)
- 如果既将泛型作为函数参数，又将泛型作为函数的输出，那就既不用 in 或 out。
```
interface ProductionConsumer<T> {
    fun produce(): T
    fun consume(item: T)
}
```