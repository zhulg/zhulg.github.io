---
title: go语言基础记录
tags: go
categories: go
toc: true
abbrlink: 35121
date: 2018-10-12 11:22:46
---

## go最基础备忘录
- Go的基本类型：

```
布尔类型：bool

字符串：string

有符号整形：int  int8  int16  int32  int64

无符号整形：uint uint8 uint16 uint32 uint64 uintptr

                  byte // uint8 的别名

                  rune // int32 的别名， 代表一个Unicode码点

浮点数：float32 float64

复数：complex64 complex128

```


- for 是 Go 中的 “while” 此时你可以去掉分号，因为 C 的 while 在 Go 中叫做 for。

```
func main() {
	sum := 1
	for sum < 1000 {
		sum += sum
	}
	fmt.Println(sum)
}

```

- if Go 的 if 语句与 for 循环类似，表达式外无需小括号 ( ) ，而大括号 { } 则是必须的。

```
func sqrt(x float64) string {
	if x < 0 {
		return sqrt(-x) + "i"
	}
	return fmt.Sprint(math.Sqrt(x))
}
```

- defer defer 语句会将函数推迟到外层函数返回之后执行。

```
func main() {
	defer fmt.Println("world")

	fmt.Println("hello")
}

```


## Go数组、切片
- 声明一个包含 5 个元素的整型数组

```
var array [5]int
```

- 声明一个包含 5 个元素的整型数组,用具体值初始化每个元素

```
array := [5]int{10, 20, 30, 40, 50}
```

- 容量由初始化值的数量决定

```
array := [...]int{10, 20, 30, 40, 50}
```

- 声明包含 3 个元素的指向字符串的指针数组

```
var array2 [3]*string
使用字符串指针初始化这个数组
array2 := [3]*string{new(string), new(string), new(string)}
使用颜色为每个元素赋值 *array2[0] = "Red" *array2[1] = "Blue" *array2[2] = "Green"
```

### 切片

- 切片是围绕动态数组的概念 构建的，可以按需自动增长和缩小。切片的动态增长是通过内置函数 append 来实现的,这个函 数可以快速且高效地增长切片。还可以通过对切片再次切片来缩小一个切片的大小
- 切片是一个很小的对象，对底层数组进行了抽象，并提供相关的操作方法。切片有 3 个字段 的数据结构，这些数据结构包含 Go 语言需要操作底层数组的元数据。
这 3 个字段分别是指向底层数组的指针、切片访问的元素的个数(即长度)和切片允许增长 到的元素个数(即容量)
- **创建切片的方法第一种：使用内置的 make 函数。当使用 make 时，需要传入一个参数，指定切片的长度**

```
创建一个字符串切片,其长度和容量都是 5 个元素 
slice := make([]string, 5)
创建一个整型切片,其长度为 3 个元素，容量为 5 个元素 
slice := make([]int, 3, 5)
```

- **另一种常用的创建切片的方法： 是使用切片字面量，这种方法和创建数组类似，只是不需要指定[]运算符里的值**。初始的长度和容量会基于初始化时提供的元素的 个数确定。

```
通过切片字面量来声明切片
创建字符串切片,其长度和容量都是 5 个元素
slice := []string{"Red", "Blue", "Green", "Yellow", "Pink"}
创建一个整型切片,其长度和容量都是 3 个元素 slice := []int{10, 20, 30}

使用索引声明切片
创建字符串切片
使用空字符串初始化第 100 个元素 slice := []string{99: ""} 记住，如果在[]运算符里指定了一个值，那么创建的就是数组而不是切片。只有不指定值的时候，才会创建切片，

声明数组和声明切片的不同,创建有 3 个元素的整型数组:
array := [3]int{10, 20, 30}
创建长度和容量都是 3 的整型切片:
slice := []int{10, 20, 30}
```


#### nil 和空切片

- 有时，程序可能需要声明一个值为 nil 的切片(也称 nil 切片)。只要在声明时不做任何初始化，就会创建一个 nil 切片.在需要描述一个不存在的切片时，nil 切片会很好用。例如，函数要求返回一个切片但是 发生异常的时候. 

```
 创建 nil 整型切片
 var slice []int

 声明空切片
使用 make 创建空的整型切片
    slice := make([]int, 0)
使用切片字面量创建空的整型切片 
   slice := []int{}
   
```

#### 使用切片
- 使用切片字面量来声明切片
```
创建一个整型切片,其容量和长度都是 5 个元素
slice := []int{10, 20, 30, 40, 50}
改变索引为 1 的元素的值 slice[1] = 25
切片之所以被称为切片，是因为创建一个新的切片就是把底层数组切出一部分
```

- 使用切片创建切片

```
创建一个整型切片,其长度和容量都是 5 个元素
slice := []int{10, 20, 30, 40, 50}
创建一个新切片, 其长度为 2 个元素，容量为 4 个元素 
newSlice := slice[1:3]
```

- 如何计算长度和容量
```
对底层数组容量是 k 的切片 slice[i:j]来说 
长度: j - i
容量: k - i
对 newSlice 应用这个公式就能得到代码清单 4-27 所示的数字。
计算新的长度和容量 对底层数组容量是 5 的切片 slice[1:3]来说
长度: 3 - 1 = 2 
容量: 5 - 1 = 4
可以用另一种方法来描述这几个值。第一个值表示新切片开始的元素的索引位置，这个例子 中是 1。第二个值表示开始的索引位置(1)，加上希望包含的元素的个数(2)，1+2 的结果是 3， 所以第二个值就是 3。容量是该与切片相关联的所有元素的数量
```

- 切片增加元素,要使用 append，需要一个被操作的切片和一个要追加的值。当 append 调用返回时，会返回一个包含修改结果的新切片。函数 append 总是会增加新切片的长 度，而容量有可能会改变，也可能不会改变，这取决于被操作的切片的可用容量

```
创建一个整型切片
// 其长度和容量都是 5 个元素
slice := []int{10, 20, 30, 40, 50}
// 创建一个新切片,其长度为 2 个元素，容量为 4 个元素 newSlice := slice[1:3]
// 使用原有的容量来分配一个新元素, 将新元素赋值为 60
newSlice = append(newSlice, 60)
```

- 使用append 同时增加切片的长度和容量,如果切片的底层数组没有足够的可用容量，append 函数会创建一个新的底层数组，将被引 用的现有的值复制到新数组里，再追加新的值

```
// 创建一个整型切片
// 其长度和容量都是 4 个元素
slice := []int{10, 20, 30, 40}
 
// 向切片追加一个新元素
// 将新元素赋值为 50
newSlice := append(slice, 50)

//当这个 append 操作完成后，newSlice 拥有一个全新的底层数组，这个数组的容量是原来 的两倍
```

- 在函数间传递切片:由于与切片关联的数据包含在底层数组里，不属于切片本身，所以将切片 复制到任意函数的时候，对底层数组大小都不会有影响。复制时只会复制切片本身，不会涉及底 层数组


#### 映射（map）

- 创建和初始化,使用make

```
使用 make 声明映射
创建一个映射，键的类型是 string，值的类型是 int
dict := make(map[string]int)
创建一个映射，键和值的类型都是 string
使用两个键值对初始化映射
dict := map[string]string{"Red": "#da1337", "Orange": "#e95a22"}
创建映射时，更常用的方法是使用映射字面量。映射的初始长度会根据初始化时指定的键值 对的数量来确定
```

- 使用映射字面量声明空映射
```
创建一个映射，使用字符串切片作为映射的键 dict := map[[]string]int{}
Compiler Exception:
invalid map key type []string 没有任何理由阻止用户使用切片作为映射的值，这个在使用一个映射 键对应一组数据时，会非常有用
```

- 声明一个存储字符串切片的映射 
```
创建一个映射，使用字符串切片作为值
dict := map[int][]string{}
```



## go指针
- Go 拥有指针。指针保存了值的内存地址。
- **一个指针变量指向了一个值的内存地址**
- **在指针类型前面加上 * 号（前缀）来获取指针所指向的内容**


```
   var a int= 20   /* 声明实际变量 */
   var ip *int        /* 声明指针变量 */
   ip = &a  /* 指针变量的存储地址 */
   
   
   fmt.Printf("a 变量的地址是: %x\n", &a  )// a 变量的地址是: 20818a220

   /* 指针变量的存储地址 */
   fmt.Printf("ip 变量储存的指针地址: %x\n", ip )//ip 变量储存的指针地址: 20818a220

   /* 使用指针访问值 */
   fmt.Printf("*ip 变量的值: %d\n", *ip ) //20
```



```
类型 *T 是指向 T 类型值的指针。其零值为 nil。

var p *int
& 操作符会生成一个指向其操作数的指针。

i := 42
p = &i
* 操作符表示指针指向的底层值。

```



## 指针常用场景
- 在go的方法定义里，作为接收者操作值
- **指针接收者的方法可以修改接收者指向的值（就像 Scale 在这做的）。由于方法经常需要修改它的接收者，指针接收者比值接收者更常用。结果是55.**
- **若使用值接收者（移除第 16 行 Scale 函数声明中的 * ，则结果是5），那么 Scale 方法会对原始 Vertex 值的副本进行操作。**

```
package main

import (
	"fmt"
	"math"
)

type Vertex struct {
	X, Y float64
}

func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

// 该方法接收着为 指针类型 *Vertex
func (v *Vertex) Scale(f float64) {
	v.X = v.X * f
	v.Y = v.Y * f
}

func main() {
	v := Vertex{3, 4}
	v.Scale(10)
	fmt.Println(v.Abs()) //输出50
}


```





## 结构体
- 一个结构体（struct）就是一个字段的集合,结构体字段使用点号来访问。

```
type A struct {
	X int
	Y int
}

func main() {
	v := A{1, 2}
	v.X = 4
	fmt.Println(v.X)
}

```

## 数据结构
- 数组，类型 [n]T 表示拥有 n 个 T 类型的值的数组。


- **切片,每个数组的大小都是固定的**。而切片则为数组元素提供动态大小的、灵活的视角。在实践中，切片比数组更常用。
类型 []T 表示一个元素类型为 T 的切片。

```
	primes := [6]int{2, 3, 5, 7, 11, 13}
	var s []int = primes[1:4]
	fmt.Println(s) //3,5,7
```

- 切片通过两个下标来界定，即一个上界和一个下界，二者以冒号分隔： a[low : high]
- **切片就像数组的引用**,切片并不存储任何数据，它只是描述了底层数组中的一段。更改切片的元素会修改其底层数组中对应的元素。与它共享底层数组的切片都会观测到这些修改。
- **切片文法** 类似于没有长度的数组文法。

```
这是一个数组文法：

[3]bool{true, true, false}
下面这样则会创建一个和上面相同的数组，然后构建一个引用了它的切片：

[]bool{true, true, false}

```

- **切片的长度与容量,切片拥有 长度 和 容量**

切片的长度就是它所包含的元素个数。切片的容量是从它的第一个元素开始数，到其底层数组元素末尾的个数。
切片 s 的长度和容量可通过表达式 len(s) 和 cap(s) 来获取。
Go 数组的长度不可改变，在特定场景中这样的集合就不太适用，Go中提供了一种灵活，功能强悍的内置类型切片("动态数组"),与数组相比切片的长度是不固定的，可以追加元素，在追加时可能使切片的容量增大

- **append() 和 copy() 函数** 如果想增加切片的容量，我们必须创建一个新的更大的切片并把原分片的内容都拷贝过来。

- **Range for 循环的 range 形式可遍历切片或映射**,当使用 for 循环遍历切片时，每次迭代都会返回两个值。第一个值为当前元素的下标，第二个值为该下标所对应元素的一份副本。

- **delete()** 函数用于删除集合的元素, 参数为 map 和其对应的 key。实例如下：

- **函数值 函数也是值。它们可以像其它值一样传递** 函数值可以用作函数的参数或返回值。

```
func compute(fn func(float64, float64) float64) float64 {
	return fn(3, 4)
}

func main() {
	hypot := func(x, y float64) float64 {
		return math.Sqrt(x*x + y*y)
	}
	fmt.Println(hypot(5, 12))

	fmt.Println(compute(hypot))
	fmt.Println(compute(math.Pow))
}

```

- **Go 函数可以是一个闭包**。闭包是一个函数值，它引用了其函数体之外的变量。该函数可以访问并赋予其引用的变量的值，换句话说，该函数被“绑定”在了这些变量上。
- 例如，函数 adder 返回一个闭包。每个闭包都被绑定在其各自的 sum 变量上。

```
func adder() func(int) int {
	sum := 0
	return func(x int) int {
		sum += x
		return sum
	}
}

func main() {
	pos, neg := adder(), adder()
	for i := 0; i < 10; i++ {
		fmt.Println(
			pos(i),
			neg(-2*i),
		)
	}
}

//值为：
0 0
1 -2
3 -6
6 -12
10 -20
15 -30
21 -42
28 -56
36 -72
45 -90

```


## 函数和方法

- Go 没有类。不过你可以为结构体类型定义方法。方法就是一类带特殊的 接收者 参数的函数。
- **方法，就是一类带特殊的 接收者 参数的函数**。方法接收者在它自己的参数列表内，位于 func 关键字和方法名之间。
- **函数是指不属于任何结构体、类型的方法,也就是说，函数是没有接收者的；而方法是有接收者的**
- (v Vertex) 是方法的接收着。

```
func (v Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

```

- **方法的声明和函数类似，他们的区别是：方法在定义的时候，会在func和方法名之间增加一个参数，这个参数就是接收者，这样我们定义的这个方法就和接收者绑定在了一起，称之为这个接收者的方法。**
- **Go语言里有两种类型的接收者：值接收者和指针接收者**
- 使用值类型接收者定义的方法，在调用的时候，使用的其实是值接收者的一个副本，所以对该值的任何操作，不会影响原来的类型变量。

## 类型转换和类型断言

- 类型断言是将接口类型的值x，转换成类型T。

```
格式为：
x.(T)
v := x.(T)
v, ok := x.(T)
类型断言的必要条件是x是接口类型,非接口类型的x不能做类型断言
```


## 接口

- **接口类型 是由一组方法签名定义的集合，interface 是一种类型**
- **在Golang中只要实现了接口定义的所有方法，就是（JAVA implement）实现了该interface **
- **空接口** 所有类型都实现了空接口，空接口可保存任何类型的值。（因为每个类型都至少实现了零个方法。）空接口被用来处理未知类型的值。例如，fmt.Print 可接受类型为 interface{} 的任意数量的参数
- 一个函数把interface{}作为参数，那么他可以接受任意类型的值作为参数，如果一个函数返回interface{},那么也就可以返回任意类型的值
- 空接口代码示例：

```
package main

import (
	"fmt"
)

//空接口使用，可以传入任何类型
func describe(i interface{}) {
	fmt.Printf("Type = %T, value = %v\n", i, i)
}

func main() {
	s := "Hello World"
	i := 10
	strt := struct{ name string }{name: "jason"}
	describe(s)
	describe(i)
	describe(strt)
}
```

- 接口可以用于类型断言，用于提取接口的基础值，语法：i.(T)

```
类型断言用于提取接口的基础值，语法：i.(T)

package main

import(
"fmt"
)

func assert(i interface{}){
    s:= i.(int)
    fmt.Println(s)
}

func main(){
  var s interface{} = 55
  assert(s)
}

```

- 以上程序打印的是int值， 但是如果我们给s 变量赋值的是string类型，程序就会panic。

- 接口可以拥有类型判断,类型type应该由类型转换的关键字type替换 i.(type)

```
package main

import (  
    "fmt"
)

func findType(i interface{}) {  
    switch i.(type) {
    case string:
        fmt.Printf("String: %s\n", i.(string))
    case int:
        fmt.Printf("Int: %d\n", i.(int))
    default:
        fmt.Printf("Unknown type\n")
    }
}
func main() {  
    findType("Naveen")
    findType(77)
    findType(89.98)
}
```

