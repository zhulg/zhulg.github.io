---
title: Java单例模式总结
date: 2020-08-28 10:38:12
tags: java
categories: Java
---

- 单例的创建常分为2种类型
```
 懒汉式：使用的时候才创建
 饿汉式：类加载的视角就创建了实例
```

## 懒汉式

- 常见例子，线程不安全的懒汉式

```
public class Singleton {  
    private static Singleton instance;  
    private Singleton (){}  
    public static Singleton getInstance() {  
        if (instance == null) {  
            instance = new Singleton();  
        }  
        return instance;  
    }  
}
```

- 单线程的时候工作正常，但在多线程的情况下就有问题了。如果两个线程同时运行到判断instance是否为null的if语句，并且instance的确没有被创建时，那么两个线程都会创建一个实例
- 多线程的懒汉式:  通过**synchronized方式**来确保线程安全，但是因为是锁的方式，每次调用getInstance()方法时都被synchronized关键字锁住了，会引起线程阻塞，影响程序的性能
```
public static synchronized Singleton1 getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
```

## 饿汉式
- 无线程安全问题，不能延迟加载，影响系统性能。

```
public class Singleton {  
    private static Singleton instance = new Singleton();  
    private Singleton (){}  
    public static Singleton getInstance() {  
		return instance;  
    }  
}

```

- 如何解决线程安全，并能做到性能不受影响


## 好的单例方式
- 考虑到线程安全，性能问题，延迟初始化角度进行单例的创建和使用

### 1.双重检验锁:

```
public class Singleton {  
    private volatile static Singleton singleton;  //1:volatile修饰
    private Singleton (){}  
    public static Singleton getSingleton() {  
    if (singleton == null) {  //2:减少不要同步，优化性能
        synchronized (Singleton.class) {  // 3：同步，线程安全
        if (singleton == null) {  
            singleton = new Singleton();  //4：创建singleton 对象
        }  
        }  
    }  
    return singleton;  
    }  
}
```

- 相关好处：

 ```
 延迟初始化。和懒汉模式一致，只有在初次调用静态方法getSingleton，才会初始化signleton实例。
性能优化。同步会造成性能下降，在同步前通过判读singleton是否初始化，减少不必要的同步开销。
线程安全。同步创建Singleton对象，同时注意到静态变量singleton使用volatile修饰。
```

-  volatile的作用是什么，volatile主要包含两个功能。
```
保证可见性。使用 volatile 定义的变量，将会保证对所有线程的可见性。
禁止指令重排序优化。
```
- 由于 volatile 禁止对象创建时指令之间重排序，所以其他线程不会访问到一个未初始化的对象，从而保证安全性。


- 上边代码为什么要使用volatile ？
- 虽然已经使用synchronized进行同步，但在第4步创建对象时，会有下面的伪代码：
```
memory=allocate(); //1：分配内存空间
ctorInstance();   //2:初始化对象
singleton=memory; //3:设置singleton指向刚排序的内存空间
```
- 复制代码当线程A在执行上面伪代码时，2和3可能会发生重排序，因为重排序并不影响运行结果，还可以提升性能，所以JVM是允许的。如果此时伪代码发生重排序，步骤变为1->3->2,线程A执行到第3步时，线程B调用getsingleton方法，在判断singleton==null时不为null，则返回singleton。但此时singleton并还没初始化完毕，线程B访问的将是个还没初始化完毕的对象。当声明对象的引用为volatile后，伪代码的2、3的重排序在多线程中将被禁止!




### 2.静态内部类模式:
- 静态内部类，线程安全，主动调用时才实例化，延迟加载效率高，推荐使用。

```
public class Singleton { 
    private Singleton(){
    }
      public static Singleton getSingleton(){  
        return Inner.instance;  
    }  
    private static class Inner {  
        private static final Singleton instance = new Singleton();  
    }  
} 

```

- 静态内部类方式的好处：

```
外部类加载时并不需要立即加载内部类，内部类不被加载则不去初始化INSTANCE，故而不占内存
实现代码简洁，延迟初始化。调用getSingleton才初始化Singleton对象。
线程安全。JVM在执行类的初始化阶段，会获得一个可以同步多个线程对同一个类的初始化的锁。
```

- **静态内部类又是如何实现线程安全的？** 
-  虚拟机会保证一个类的<clinit>()方法在多线程环境中被正确地加锁、同步，如果多个线程同时去初始化一个类，那么只会有一个线程去执行这个类的<clinit>()方法，其他线程都需要阻塞等待，直到活动线程执行<clinit>()方法完毕
- 可以看出instance在创建过程中是线程安全的，所以说静态内部类形式的单例可保证线程安全，也能保证单例的唯一性，同时也延迟了单例的实例化

- **_其他知识： init和clinit区别_**
-  init和clinit方法执行时机不同
```
init是对象构造器方法，也就是说在程序执行 new 一个对象调用该对象类的 constructor 方法时才会执行init方法，而clinit是类构造器方法，也就是在jvm进行类加载—–验证—-解析—–初始化，中的初始化阶段jvm会调用clinit方法。
```
- 执行目的的不同

```
init是instance实例构造器，对非静态变量解析初始化，而clinit是class类构造器对静态变量，静态代码块进行初始化
```




### 3.枚举单例模式
- 枚举类型，无线程安全问题，在涉及到反射和序列化的单例中，建议使用下文的枚举类型模式。避免反序列化创建新的实例, Effective Java 是推荐该方法的
- 枚举单例模式的线程安全, 同样利用静态内部类中的类初始化锁, 枚举单例模式能够在序列化和反射中保证实例的唯一性。

```
public enum Singleton {
    INSTANCE;
    public void doSomething(){
        //todo
    }
}
```

-  为什么枚举单例是线程安全的
-  其实枚举在经过javac的编译之后，会被转换成形如public final class T extends Enum的定义，枚举中的各个枚举项同事通过static来定义的。 例如枚举：
```
public enum T {
    SPRING,SUMMER,AUTUMN,WINTER;
}
```
- 反编译之后

```
public final class T extends Enum
{
    //省略部分内容
    public static final T SPRING;
    public static final T SUMMER;
    public static final T AUTUMN;
    public static final T WINTER;
    private static final T ENUM$VALUES[];
    static
    {
        SPRING = new T("SPRING", 0);
        SUMMER = new T("SUMMER", 1);
        AUTUMN = new T("AUTUMN", 2);
        WINTER = new T("WINTER", 3);
        ENUM$VALUES = (new T[] {
            SPRING, SUMMER, AUTUMN, WINTER
        });
    }
}
```

- **static类型的属性会在类被加载之后被初始化, 当一个Java类第一次被真正使用到的时候静态资源被初始化、Java类的加载和初始化过程都是线程安全的（因为虚拟机在加载枚举的类的时候，会使用ClassLoader的loadClass方法，而这个方法使用同步代码块保证了线程安全）。所以，创建一个enum类型是线程安全的**
