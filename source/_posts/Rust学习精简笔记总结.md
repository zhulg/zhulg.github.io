---
title: Rust学习精简笔记总结
tags: Rust
categories: Rust
toc: true
abbrlink: 658f0ea2
date: 2022-09-24 14:53:01
---

# Rust精简笔记
- 适用对Rust感兴趣，想快速学习上手（多学几轮）、Rust知识点速查、回顾。
- 精简总结使用，深入扩展需继续对应官网，真知实践。
- *参考The Rust Programming Language &  Rust in Action*

## 一.**变量：**
- **变量声明使用let, 默认为不可变（即只读），声明可变变量 mut （可读写）**

 ```rust
  let x = 5;  //类型可以由编译器自动推断出来
  let y: i32 = 6;  //或者是在创建变量时，声明类型
  let z = 7i32;  //数字类型，可以在数字字面量中加入类型注解
 ```
 
## 二.**基本数据类型：**
#### 数字类型:
- 分为有符号和无符号整数，浮点数类型、特定平台的整数
- **每一个有符号的变体可以储存包含从 -2<sup>n-1</sup> 到2<sup>n-1</sup>-1 在内的数字**，这里 n 是变体使用的位数。如：i8 范围（-128-127）
- **无符号的范围为0到 2<sup>n</sup>-1**，如: u8 范围（0-255）(00000000 - 11111111)

|  类型   | 长度  | 描述|
|---| ---| ---|
|i8, i16, i32, i64, i128| 8,16,32,64,64,128 (bit)|  有符号整数|
|u8, u16, u32, u64, u128| 8,16,32,64,64,128 (bit)|  无符号整数|
|f32, f64|                32,64(位)| f32 是单精度浮点数，f64 是双精度浮点数|
| isize,  usize| 32或64 | 32 位架构上它们是 32 位的，64 位架构上它们是 64 位的|


#### Rust中的整型字面值:

|  数字字面值   | 描述|
| ---| ---|
|Decimal (十进制)| 1_100 （使用 _ 做为分隔符以方便读数）|
|Hex (十六进制)|	0xff（0x开头）|
|Octal (八进制)|	0o77 （0o开头）| 
|Binary (二进制)|	0b1111_0000（0b开头）|
|Byte (单字节字符)(仅限于u8)|	b'A'（b开头）|

#### 布尔类型 bool：

```rust
fn main() {
    let t = true;
    let f: bool = false; // with explicit type annotation
}

```
#### 复合类型：
-  **元组（tuple）和数组（array）**

- **Tuple**: 将多个其他类型的值组合进一个复合类型，声明后长度固定，索引下标从0开始.

```
    let tup: (i32, f64, u8) = (500, 8.4, 2); //声明类型
    let score = ("Team A", 12); //自推断
    let five_hundred = tup.0; //取出元组里的500，下标0
```
-  **array**: 数组里数据类型必现一致，长度固定

```rust
let a = [1, 2, 3, 4, 5]; // 自推断
let b: [i32; 5] = [1, 2, 3, 4, 5]; // 在方括号中包含每个元素的类型，后跟分号，再后跟数组元素的数量。
let c = [3; 5]; //变量名为c的数组将包含 5 个元素,数值都为3，等价与let a = [3, 3, 3, 3, 3]
```

## 三. 流程控制

#### if &  if let：

```rust
    let number = 3;
    if number < 5 {
        println!("condition was true");
    } else {
        println!("condition was false");
    }
    
  // match pattern and assign variable
    if let Some(i) = num {
        println!("number is: {}", i);
    }
   // if let 语法让我们以一种不那么冗长的方式结合 if 和 let，来处理只匹配一个模式的值而忽略其他模式的情况
```

#### loop:

```rust
    let mut count = 0;
    loop {
        count += 1;
        if count == 4 {
            println!("break");
            break;
        }
    }
```

Nested loops & labels (循环标签): 如果存在嵌套循环在一个循环上指定一个 循环标签（loop label) 标识为'名字

```rust
    'outer: loop {
        'inner: loop {
            break; // This breaks the inner loop
            break 'outer; //   // This breaks the outer loop
        }
    }
```

#### while &  while let:

```rust
    while n < 101 {
        n += 1;
    }
    let mut optional = Some(0);
    while let Some(i) = optional {
        print!("{}", i);
    }
```

#### for 遍历集合:

```rust
    let a = [10, 20, 30, 40, 50];
    for element in a {
        println!("the value is: {element}");
    }
    
    //使用iter()
    let array = [(1, 2), (2, 3)];
    for (x, y) in array.iter() {
        // x, y accessible in loop body only
        println!("x={},y={}", x, y);
    }
```

#### match:

```rust
    let optional = Some(0);
    match optional {
        Some(i) => println!("{}", i),
        None => println!("No value."),
    }
```

## 四.所有权&引用&借用

#### 所有权规则:

```
Rust 中的每一个值都有一个 所有者（owner）
值在任一时刻有且只有一个所有者
当所有者（变量）离开作用域，这个值将被丢弃
```
#### 借用规则：(引用的行为)

```
同一作用域内，一个资源要么有一个可变引用，要么存在多个不可变引用
引用总是有效的
```

#### String引用：

```rust
    let s1 = String::from("hello world!");
    let s1_ref = s1; // immutable reference
    let mut s2 = String::from("hello");
    let s2_ref = &mut s2; // mutable reference
    s2_ref.push_str(" world!");
```

- 函数里使用值，**但不获取所有权, 使用&，获取变量引用 ，仅读权限**

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);
    println!("The length of '{}' is {}.", s1, len);
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

- 函数里参数可变引用, **使用&mut ，获取变量可变操作**

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
}
//  对参数声明&mut ，操作写字符
fn change(some_string: &mut String) {
    some_string.push_str(", world");
    println!("{}", some_string);
}
```

#### 操作符对应的权限：

```
x   不可变的值（所有权）
&x  x不可变的引用 （只读）
&mut x  x的可变引用（读写）
```

#### 字符串 slice:
- slice 允许你引用集合中一段连续的元素序列，而不用引用整个集合。slice 是一类引用，它没有所有权

```rust
fn main() {
    let s = String::from("hello world");

    let hello = &s[0..5];
    let world = &s[6..11];
}

```

## 五. struct
- **普通结构体： struct+一个名字，在大括号中每一部分可以是不同类型，定义每一部分数据的名字和类型，称之为结构体字段**

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}

```

- 创建一个实例需要以结构体的名字开头，接着在大括号中使用 key: value 键-值对的形式提供字段

```rust
    let userinfo = User {
        email: String::from("someone@example.com"),
        username: String::from("someusername123"),
        active: true,
        sign_in_count: 1,
    };
```

#### 元组结构体（tuple structs):
- 元组结构体有着结构体名称提供的含义，但没有具体的字段名，只有字段的类型

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```

#### 类单元结构体（unit-like structs）:
-  没有任何字段的结构体

```rust
struct AlwaysEqual;
fn main() {
    let subject = AlwaysEqual;
}
```

#### impl为结构体添加方法：

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

```

- &self 实际上是 self: &Self 的缩写。在一个 impl 块中，Self 类型是 impl 块的类型的别名。方法的第一个参数必须有一个名为 self 的Self 类型的参数

#### impl里的关联函数：

```rust
impl Rectangle {
    fn square(size: u32) -> Self {
        Self {
            width: size,
            height: size,
        }
    }
}
```

- 所有在 impl 块中定义的函数被称为 **关联函数（associated functions**），因为它们与 impl 后面命名的类型相关。我们可以定义不以 self 为第一参数的关联函数（因此不是方法），因为它们并不作用于一个结构体的实例

- **多个 impl 块**： 每个结构体都允许拥有多个 impl 块, 但一个方法只能属于一个impl块。

## 六.Enum

- 结构体给予将字段和数据聚合在一起的方法，像 Rectangle 结构体有 width 和 height 两个字段。而枚举给予你将一个值成为一个集合之一的方法。


```rust
enum IpAddrKind {
    V4,
    V6,
}
enum IpAddrKind {
    V4,
    V6,
}

fn main() {
    let four = IpAddrKind::V4;
    let six = IpAddrKind::V6;
    route(IpAddrKind::V4);
    route(IpAddrKind::V6);
}

fn route(ip_kind: IpAddrKind) {}

```

####  **枚举可以包含不同的类型:**

```rust
enum Message {
    Quit, // 没有关联任何数据
    Move { x: i32, y: i32 }, //类似结构体包含命名字段
    Write(String), //包含单独一个 String
    ChangeColor(i32, i32, i32), //包含三个 i32
}

```

- 结构体和枚举还有另一个相似点：**就像可以使用 impl 来为结构体定义方法那样**，也可以在枚举上定义方法。这是一个定义于我们 Message 枚举上的叫做 call 的方法：

```rust
fn main() {
    enum Message {
        Quit,
        Move { x: i32, y: i32 },
        Write(String),
        ChangeColor(i32, i32, i32),
    }

    impl Message {
        fn call(&self) {
            // 在这里定义方法体
        }
    }

    let m = Message::Write(String::from("hello"));
    m.call();
}

```

#### 标准库中实用的枚举：Option

```rust
enum Option<T> {
        None,
        Some(T),
    }
```

```
enum Result<T, E> {
    OK(T),
    Err(E),
}
```

## 七.match控制流结构
- 前面流程控制简单说明了match使用，**结合enum来看看match的更多使用场景总结**

- **基础匹配语法：**

```rust
    let number = 2;
    match number {
        1 | 2 => println!("1 or 2"), // 匹配到某一个
        3..=5 => println!("3到5"),  // 通过 ..= 匹配值的范围
        _ => println!("invalid"),    //未匹配到 _
    }
```

#### match 解构结构体:

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 0, y: 7 };

    let Point { x: a, y: b } = p;
    assert_eq!(0, a);
    assert_eq!(7, b);
}

```

#### 解构枚举：

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msg = Message::ChangeColor(0, 160, 255);

    match msg {
        Message::Quit => {
            println!("The Quit variant has no data to destructure.")
        }
        Message::Move { x, y } => {
            println!(
                "Move in the x direction {} and in the y direction {}",
                x, y
            );
        }
        Message::Write(text) => println!("Text message: {}", text),
        Message::ChangeColor(r, g, b) => println!(
            "Change the color to red {}, green {}, and blue {}",
            r, g, b
        ),
    }
}
//打印结果到change the color....

```

#### 解构嵌套的结构体和枚举:

```rust
enum Color {
    Rgb(i32, i32, i32),
    Hsv(i32, i32, i32),
}

enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(Color),
}

fn main() {
    let msg = Message::ChangeColor(Color::Hsv(0, 160, 255));

    match msg {
        Message::ChangeColor(Color::Rgb(r, g, b)) => println!(
            "Change the color to red {}, green {}, and blue {}",
            r, g, b
        ),
        Message::ChangeColor(Color::Hsv(h, s, v)) => println!(
            "Change the color to hue {}, saturation {}, and value {}",
            h, s, v
        ),
        _ => (),
    }
}

```

#### 用 .. 忽略剩余值:

```rust
//通过使用 .. 来忽略 Point 中除 x 以外的字段
fn main() {
    struct Point {
        x: i32,
        y: i32,
        z: i32,
    }

    let origin = Point { x: 0, y: 0, z: 0 };

    match origin {
        Point { x, .. } => println!("x is {}", x),
    }
}

```

####  **Match guards:**
- 匹配守卫（match guard）是一个指定于 match 分支模式之后的额外 if 条件，它也必须被满足才能选择此分支

```rust
fn main() {
    let num = Some(4);
    match num {
        Some(x) if x < 5 => println!("less than five: {}", x),
        Some(x) => println!("{}", x),
        None => (),
    }
}

```

####  **@绑定:**
- 运算符@，允许我们在创建一个存放值的变量的同时，测试其值是否匹配模式。即@ 可以在一个模式中同时测试和保存变量值。

```rust
fn main() {
    enum Message {
        Hello { id: i32 },
    }
    let msg = Message::Hello { id: 5 };
    match msg {
        Message::Hello {
            id: id_variable @ 3..=7, //使用id_variable变量配合@，以便此分支相关联的代码可以使用它
        } => println!("Found an id in range: {}", id_variable),
        Message::Hello { id: 10..=12 } => {
            println!("Found an id in another range")
        }
        Message::Hello { id } => println!("Found some other id: {}", id),
    }
}

```
