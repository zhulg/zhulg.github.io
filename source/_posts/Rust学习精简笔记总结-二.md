---
title: Rust学习精简笔记总结(二)
abbrlink: 6b1809c0
date: 2022-10-03 22:06:44
tags: Rust
categories: Rust
---

# Rust精简笔记第2部分
- 继续Rust基础知识点总结，趁假期回顾学习
- *参考The Rust Programming Language &  Rust in Action*

## 八，泛型、Trait、生命周期

#### 泛型：

- **函数定义中使用泛型**

```
fn largest<T>(list: &[T]) -> T {
}
//函数 largest 有泛型类型 T。它有个参数 list，其类型是元素为 T 的 slice。largest 函数的返回值类型也是 T
//类型参数声明位于函数名称与参数列表中间的尖括号 <>
```

- **结构体定义中的泛型**

```rust
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let integer = Point { x: 5, y: 10 };
    let float = Point { x: 1.0, y: 4.0 };
}
```

- **枚举定义中的泛型**

```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}

```

- **方法定义中的泛型**

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let p = Point { x: 5, y: 10 };

    println!("p.x = {}", p.x());
}
```

#### Trait：
-  通过 trait 以一种抽象的方式定义共享的行为,*trait*  类似于其他语言中的接口，但也不完全一样.


```rust
//定义 trait Summary ,定义summarize调取->summarize_author默认方法，达到调用默认行为，区分开实现trait的的定义
pub trait Summary {
    fn summarize_author(&self) -> String;
    fn summarize(&self) -> String {
        format!("(Read more from {}...)", self.summarize_author())
    }
}

pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}
//实现 trait Summary
impl Summary for Tweet {
    fn summarize_author(&self) -> String {
        format!("@{}", self.username)
    }
}

fn main() {
    let tweet = Tweet {
        username: String::from("horse_ebooks"),
        content: String::from("of course, as you probably already know, people"),
        reply: false,
        retweet: false,
    };

    println!("1 new tweet: {}", tweet.summarize());
}

```

- **trait 作为参数：**

```rust
// 方法接收是实现了 trait Summary的类型
pub fn notify(item: &impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
```

- **Trait Bound：** 
    impl Trait 适用于短小的例子。trait bound 则适用于更复杂的场景，trait bound 与泛型参数声明在一起，位于尖括号中的冒号后面。

```rust
//使用相同类型的trait可以转换成下边的更简单写法
pub fn notify(item1: &impl Summary, item2: &impl Summary) {}

// trait Bound的写法
pub fn notify<T: Summary>(item1: &T, item2: &T) {}
```

- **通过 `+` 指定多个 trait bound:**

```rust
pub fn notify<T: Summary + Display>(item: &T) {}
```

- **通过 `where` 简化 trait bound：**

  每个泛型有其自己的 trait bound，所以有多个泛型参数的函数在名称和参数列表之间会有很长的 trait bound 信息，这使得函数签名难以阅读

```rust
fn some_function<T, U>(t: &T, u: &U) -> i32
    where T: Display + Clone,
          U: Clone + Debug
{
}
```

#### 声明周期：
- Rust 中的每一个引用都有其 生命周期（lifetime），也就是引用保持有效的作用域，Rust 编译器有一个借用检查器（borrow checker）它比较作用域来确保所有的借用都是有效的

- **函数签名中的生命周期注解：**

```rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}
fn main() {
    let string1 = String::from("abcd");
    let string2 = "xyz";

    let result = longest(string1.as_str(), string2);
    println!("The longest string is {}", result);
}

```

- 参数声明周期使用方法，或者靠编译器提示添加。

```rust
&i32        // 引用, 没有生命周期参数的 i32 的引用
&'a i32     // 带有显式生命周期的引用 ，一个有叫做 'a 的生命周期参数的 i32 的引用
&'a mut i32 // 带有显式生命周期的可变引用 一个生命周期也是 'a 的 i32 的可变引用

```

- **结构体定义中的生命周期注解：**
```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}
fn main() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");
    let i = ImportantExcerpt {
        part: first_sentence,
    };
}
```

- **静态生命周期:**

- 生命周期能够存活于整个程序期间。所有的字符串字面值都拥有 'static 生命周期

```rust
let s: &'static str = "I have a static lifetime.";
```

## 九，集合：
#### vector:
- 类型是 Vec<T> 在内存中彼此相邻地排列所有的值, vector 只能储存相同类型的值

```rust
  // Vec::new 创建
  let v: Vec<i32> = Vec::new();
  v.push(2);
  v.push(4);
  let x = v.pop();

```

- **初始值来创建一个 Vec<T> :**

```rust

 let v = vec![1, 2, 3];

```

- **读取 vector 的元素:**
     使用 &[index] 返回一个引用, 或者使用 get 方法以索引作为参数来返回一个 Option<&T>。
```rust
fn main() {
    let v = vec![1, 2, 3, 4, 5];

    let third: &i32 = &v[2];
    println!("The third element is {}", third);

    match v.get(2) {
        Some(third) => println!("The third element is {}", third),
        None => println!("There is no third element."),
    }
}
```
- **使用枚举来储存多种类型:**
    创建一个储存枚举值的 vector，这样最终就能够通过vector存储实际是不同类型的值了
    
 ````rust
 fn main() {
    enum SpreadsheetCell {
        Int(i32),
        Float(f64),
        Text(String),
    }
    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Text(String::from("blue")),
        SpreadsheetCell::Float(10.12),
    ];
}

 ```
 
#### HashMap

```rust
    let mut scores = HashMap::new();
    scores.insert(String::from("Blue"), 10); //插入
    //只在键没有对应值时插入
    scores.entry(String::from("Yellow")).or_insert(50);
    scores.entry(String::from("Blue")).or_insert(50);
    println!("{:?}", scores);
```

- more： https://doc.rust-lang.org/std/collections/index.html

## 十，函数、闭包、迭代器

#### 函数：
 -  函数的定义方式及在结构体实现里关联函数，关联函数与方法的使用区别
 
```rust
use std::primitive;

struct Point {
    x: i32,
    y: i32,
}
impl Point {
    // 关联函数(没有self相关参数)
    fn new(x: i32, y: i32) -> Point {
        Point { x: x, y: y }
    }
    // 方法(参数为&self，是个隐示的，调用时无需传递表明是该类型而已）
    fn get_x(&self) -> i32 {
        self.x
    }
}
fn main() {
    //关联函数使用:: 方法使用类型.方法，如Point::new, point.get_x
    let point = Point::new(5, 6);
    println!("get x={}", point.get_x());
}

```
#### 闭包：
-  闭包（closures）是可以保存在一个变量中或作为参数传递给其他函数的匿名函数。
-  闭包的定义以一对竖线（|）开始，在竖线中指定闭包的参数

```rust
fn  add_one_v1   (x: u32) -> u32 { x + 1 }  //函数的定义
let add_one_v2 = |x: u32| -> u32 { x + 1 }; // 完整标注的闭包定义
let add_one_v3 = |x|             { x + 1 };  // 闭包定义中省略了类型注解
let add_one_v4 = |x|               x + 1  ;  // 闭包体只有一行,去掉了大括号

```
















