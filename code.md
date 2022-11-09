# JavaScript 进阶

通过阅读源码与部分源码手写，达到进阶目的。

# 手写原理

手写部分常见函数

## call

```js
Function.prototype.myCall = function(ctx) {
  // 默认指向 window
  if (!ctx) {
    ctx = window
  }
  // 当指向基础数据类型时
  if (typeof ctx != 'object') {
    ctx = new Object(ctx)
  }
  const symbol = Symbol()
  ctx[symbol] = this // 执行函数赋值
  const args = [...arguments].slice(1) // 参数
  const res = ctx[symbol](...args) // 执行函数 
  delete ctx[symbol]
  return res
}

function test() {
  console.log(this);
  console.log(arguments);
}
test.call(1, "a", "b");

test.myCall(1, "a", "b");
```

改变 `this` 方向


## apply

```js
Function.prototype.myApply = function(ctx) {
  if (!ctx) {
    ctx = window
  }
  if (typeof ctx != 'object') {
    ctx = new Object(ctx)
  }
  const symbol = Symbol()
  ctx[symbol] = this
  let res
  if (arguments[1]) {
    res = ctx[symbol](...arguments[1])
  } else {
    res = ctx[symbol]()
  }
  delete ctx[symbol]
  return res
}

function test() {
  console.log(this);
  console.log(arguments);
}
test.apply(1, "a", "b");

test.myApply(1, "a", "b");
```

改变 `this` 方向，参数为数组

## bind

```js
Function.prototype.myBind = function(ctx) {
  if (!ctx) {
    ctx = window
  }
  if (typeof ctx != 'object') {
    ctx = new Object(ctx)
  }
  const args = [...arguments].slice(1)
  const _this = this

  // 返回函数
  return function Fn() {
     // 因为返回一个函数，需要判断 new F() 情况
    if (_this instanceof Fn) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(ctx, args.concat(...arguments))
  }
}

function test() {
  console.log(this.a)
  console.log(arguments)
}

test.bind({a: 1})()

test.myBind({a: 1}, 1, 2)()
```

改变 `this` 指向，参数不限

`bind` 执行默认返回的是函数。

对于函数来说有两种方式调用，一种是直接调用，一种是通过 `new` 的方式

- 直接调用，这里选择了 `apply` 的方式实现，但是对于参数需要注意以下情况

  - 因为 bind 可以实现类似这样的代码 `f.bind(obj, 1)(2)`，所以我们需要将两边的参数拼接起来
  - 于是就有了这样的实现 `args.concat(...arguments)`

- 通过 `new` 调用，如何判断 `this`，对于 `new` 的情况来说，不会被任何方式改变 `this`


`test.bind({a: 1}, 1, 2)`

## new 

```js
function create() {
  let obj = {}
  const Con = [].shift.call(arguments)
  obj.__proto__ = Con.prototype
  let result = Con.apply(obj, arguments)
  return result instanceof Object ? result : obj
}

function Test(a) {
  console.log(this, a)
}

console.dir(new Test(1))

console.log(create(Test, 1));
```

在调用 new 的过程中会发生以上四件事情：

- 新生成了一个对象
- 链接到原型
- 绑定 this
- 返回新对象

对于对象来说，其实都是通过 new 产生的，无论是 `function Foo()` 还是 `let a = { b : 1 }` 。

对于创建一个对象来说，更推荐使用字面量的方式创建对象（无论性能上还是可读性）。因为你使用 `new Object()` 的方式创建对象需要通过作用域链一层层找到 `Object`，但是你使用字面量的方式就没这个问题。

```js
function Foo() {}
// function 就是个语法糖
// 内部等同于 new Function()
let a = { b: 1 }
// 这个字面量内部也是使用了 new Object()
```

## instanceof

```js
function myInstaceof(left, right) {
  let prototype = right.prototype
  left = left.__proto__
  while(true) {
    if (!left) {
      return false
    }
    if (left === prototype) {
      return true
    }
    left = left.__proto__
  }
}

console.log([] instanceof Object);
console.log({} instanceof Object);

console.log(myInstaceof([], Object));
console.log(myInstaceof({}, Object));

```

`instanceof` 可以正确的判断对象的类型，因为内部机制是通过判断对象的原型链中是不是能找到类型的 `prototype`

- 获取类型的原型
- 获得对象的原型
- **一直循环判断对象的原型是否等于类型的原型**，直到对象原型为 `null`，因为原型链最终为 `null`