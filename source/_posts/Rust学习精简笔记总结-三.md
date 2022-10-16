---
title: Rust学习精简笔记总结(三)
date: 2022-10-16 10:21:29
tags: Rust
categories: Rust
toc: true
---

# Rust精简笔记第3部分
- 继续整理rust笔记，过程会发现一些rust盲区理解，可深入源码学习, 从笔记知识点映射背后源码定义。
- *参考The Rust Programming Language &  Rust in Action*

## 十一，指针&智能指针
 - 指针是一个包含内存地址的变量的通用概念， 智能指针（smart pointers）是一类数据结构，他们的表现类似指针，但是也拥有额外的元数据和功能
 - 智能指针通常使用结构体实现，智能指针其实现了 Deref 和 Drop trait(离开作用域时运行的代码)
 
#### 1. Box<T> 用于在堆上分配值:

```rust
let b = Box::new(1);
```
#### 2. Rc<T> 引用计数智能指针:
- Rc<T> 只能用于单线程场景

```rust
   //Rc::clone 只会增加引用计数, 这样a,b都是指向1
    let a = Rc::new(1);
    let b = Rc::clone(&a);
```
#### 3. RefCell\<T> 和内部可变性模式:

- **RefCell\<T> 代表其数据的唯一的所有权**, 他具有如下特点:

```rust
// 在任意给定时刻，只能拥有一个可变引用或任意数量的不可变引用 之一（而不是两者）。
//引用必须总是有效的。

    let num = 1;
    let r1 = RefCell::new(1);
    // Ref - 只有一个不可变借用
    let r2 = r1.borrow();
    // RefMut - mutable  可变借用
    let r3 = r1.borrow_mut();
    // RefMut - 可变借用
    let r4 = r1.borrow_mut();
```

- **内部可变性（Interior mutability):**
    是Rust 中的一个设计模式，它允许你即使在有不可变引用时也可以改变数据。
- 实现是通过不可变的Rc\<T>, 此时的T的类型为RefCell\<T>， **即结合成Rc\<RefCell\<T>> 来实现内部可变性**，而外部是无法修改的。     
- let value = Rc::new(RefCell::new(5)) 完整例子如下：


```rust
#[derive(Debug)]
enum List {
    Cons(Rc<RefCell<i32>>, Rc<List>),
    Nil,
}

use crate::List::{Cons, Nil};
use std::cell::RefCell;
use std::rc::Rc;

fn main() {
    let value = Rc::new(RefCell::new(5));

    let a = Rc::new(Cons(Rc::clone(&value), Rc::new(Nil)));

    let b = Cons(Rc::new(RefCell::new(3)), Rc::clone(&a));
    let c = Cons(Rc::new(RefCell::new(4)), Rc::clone(&a));

    *value.borrow_mut() += 10;

    println!("a after = {:?}", a);
    println!("b after = {:?}", b);
    println!("c after = {:?}", c);
}


```

## 十二，使用和引用模块代码：
- 模块的创建和引用

```rust
fn some_function() {}
mod outer_module {
    // private module
    pub mod inner_module {
        // public module
        pub fn inner_public_function() {
            super::super::some_function();
        }
        fn inner_private_function() {}
    }
}
fn main() {
    // 绝对路径 从 crate 根开始，以 crate 名或者字面值 crate 开头。
    crate::outer_module::inner_module::inner_public_function();
    //  相对路径（relative path）从当前模块开始，以 self、super 或当前模块的标识符开头。
    outer_module::inner_module::inner_public_function();
    // 使用 use 关键字将路径引入作用域
    use outer_module::inner_module;
    inner_module::inner_public_function();
}

```

