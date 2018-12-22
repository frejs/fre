export function patch(parent, element, oldNode, node) {
  console.log('111')
  console.log(c())
  if (oldNode == null) {
    //首次渲染，将node 的 dom 插到 body 下
    element = parent.insertBefore(create(node), element)
  } else if (node.tag && node.tag === oldNode.tag) {
    update(element, oldNode.data, node.data) //更新属性

    var reusableChildren = {} //可以复用的孩子{key:[type,vnode]}
    var oldElements = [] //旧的真实元素
    var newKeys = {} //新的vnode {key:vnode}

    for (var i = 0; i < oldNode.children.length; i++) {
      //循环旧的 vnode，这次循环主要是筛选出带key，可以复用的vnode，最终是{key:[type,vnode]}
      var oldElement = element.childNodes[i]
      oldElements[i] = oldElement

      var oldChild = oldNode.children[i]
      var oldKey = oldChild.data ? oldChild.data.key : null

      if (null != oldKey) {
        reusableChildren[oldKey] = [oldElement, oldChild]
      }
    }

    var i = 0
    var j = 0

    while (j < node.children.length) {
      //循环新的node的子节点，循环这个的目的
      var oldElement = oldElements[i] //这个是一个个 旧的 node 真实节点
      var oldChild = oldNode.children[i] //一个个旧的 vnode
      var newChild = node.children[j] //一个个新的vnode

      var oldKey = oldChild.data ? oldChild.data.key : null

      var newKey = newChild.data ? newChild.data.key : null

      var reusableChild = reusableChildren[newKey] || []

      if (null == newKey) {
        //这种是文字或者数字，直接下一个
        if (null == oldKey) {
          patch(element, oldElement, oldChild, newChild)
          j++
        }
        i++
      } else {
        if (oldKey === newKey) {
          //key相同的，如果新旧的key是相同的，就可以复用
          patch(element, reusableChild[0], reusableChild[1], newChild)
          i++
        } else if (reusableChild[0]) {
          //如果key不同，就在前面插入这个element
          console.log(element, reusableChild[0], oldElement)
          element.insertBefore(reusableChild[0], oldElement)
          patch(element, reusableChild[0], reusableChild[1], newChild)
        } else {
          patch(element, oldElement, null, newChild)
        }

        j++
        newKeys[newKey] = newChild
      }
    }

    while (i < oldNode.children.length) {
      //这个主要是用于删除的
      var oldChild = oldNode.children[i]
      var oldKey = oldChild.data ? oldChild.data.key : null
      if (null == oldKey) {
        element.removeChild(reusableChild[0])
      }
      i++
    }

    for (var i in reusableChildren) {
      var reusableChild = reusableChildren[i]
      var reusableNode = reusableChild[1]
      if (!newKeys[reusableNode.data.key]) {
        element.removeChild(reusableChild[0])
      }
    }
  } else if (node !== oldNode) {
    //然后会如果两个对象不同的话就直接替换
    var i = element
    parent.replaceChild((element = create(node)), i)
  }

  return element
}

export function create(vnode) {

  if (typeof vnode.type === 'function') {
    vnode = vnode.type(vnode.props)
  }
  let dom = document.createElement(vnode.type)
  for (let name in vnode.props) {
    setAttrs(dom, name, vnode.props[name])
  }
  vnode.children.forEach(child => {
    child =
      typeof child == 'object' ? create(child) : document.createTextNode(child)
    dom.appendChild(child)
  })

  return dom
}

function update(dom, oldProps, props) {
  let cloneProps = { ...oldProps, ...props }
  for (let name in cloneProps) {
    setAttrs(dom, name, cloneProps[name])
  }
}

function setAttrs(node, name, value) {
  switch (name) {
    case String(name.match(/on\w+/)):
      name = name.toLowerCase()
      node[name] = value || ''
      break
    case 'className':
      name === 'class'
      break
    case 'key':
      break
    case 'value':
      if (
        node.tagName.toUpperCase() === 'INPUT' ||
        node.tagName.toUpperCase() === 'TEXTAREA'
      ) {
        node.value = value
      } else {
        node.setAttribute(name, value)
      }
      break
    case 'style':
      node.style.cssText = value
      break
    default:
      node.setAttribute(name, value)
  }
}

function c() {
  try {
    throw new Error()
  } catch (e) {
    try {
      return e.stack
    } catch (e) {
      return ''
    }
  }
}