# 算法

## 递归算法



```js
// 遍历 DOM 树。DOM 🌲根节点 document ，我们要寻找的 id='d-cal'
function getElementById(node, id){
    // 当前结点不存在，已经到了叶子结点了还没有找到，返回 null
    if(!node) return null;
    // 当前结点的 id 符合查找条件，返回当前结点
    if(node.id === id) return node;
    for(var i = 0; i < node.childNodes.length; i++){
        var found = getElementById(node.childNodes[i], id);
        if(found) return found;
    }
    return null;
}
getElementById(document, "d-cal");
```

```JS
// 非递归实现
function getElementById(node, id) {
  while(node) {
    if (node.id === id) return node
    node = nextElement(node)
  }
  return null
}

function nextElement(node) {
  // 判断是否存在子节点
  if (node.children.length > 0) {
    return node.children[0]
  }
  // 再判断是否存在相邻节点
  if (node.nextElementSibling) {
    return node.nextElementSibling
  }
  // 查找父节点的相邻节点
  while(node.parentNode) {
    if (node.parentNode.nextElementSibling) {
      return node.parentNode.nextElementSibling
    }
    node = node.parentNode
  }
  return null
}
```

**递归算法**是一种直接或者间接调用自身函数或者方法的算法。

- 斐波那契数列
- 汉诺塔问题
- 树的遍历及相关操作

优缺点：

- 优点：实现简单
- 缺点：运行效率低，循环递归调用过程中系统为每层返回点，局部变量等开辟了栈来存储，递归太深，容易发送栈移除。

解题策略：

- 第一步：明确函数的输入输出

- 第二步：寻找递归结束条件

- 第三步：明确递归关系式，怎么通过各种递归调用来组合解决当前问题

## 分治算法

分治算法是一个很重要的算法，快速排序、归并排序等都是基于分治策略进行实现的。

分而治之，将复杂问题，分成两个或多个相似的子问题，再把子问题分成更小的子问题，直到更小的问题可以简单求解

- 二分查找
- 归并排序
- 快速排序
- 汉诺塔问题
- React 时间分片

解题策略:

- 第一步：分解，将原问题分解为若干个规模较小，相互独立，与原问题形式相同的子问题

- 第二步：解决，解决各个子问题

- 第三步：合并，将各个子问题的解合并为原问题的解