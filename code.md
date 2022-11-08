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

改变this方向


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

改变 this 方向，参数为数组

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

改变 this 指向，参数不限

bind 执行默认返回的是函数。

对于函数来说有两种方式调用，一种是直接调用，一种是通过 new 的方式

- 直接调用，这里选择了 apply 的方式实现，但是对于参数需要注意以下情况

  - 因为 bind 可以实现类似这样的代码 f.bind(obj, 1)(2)，所以我们需要将两边的参数拼接起来
  - 于是就有了这样的实现 args.concat(...arguments)

- 通过 new 调用，如何判断 this，对于 new 的情况来说，不会被任何方式改变 this


`test.bind({a: 1}, 1, 2)`