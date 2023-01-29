// 递归实现获取节点数据中某个节点
function getElementById(node, id) {
  if (!node) return null
  if (node.id === id) return node

  for(let i = 0, len = node.childNodes.length; i < len; i++) {
    const found = getElementById(node.childNodes[i], id)
    if (found) {
      return found
    }
  }
  return null
}

// 非递归实现
function getElementId(node, id) {
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