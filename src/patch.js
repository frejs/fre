//这个方法就是，第一次渲染的时候，parent 是根节点，然后 parent 就变成 element 了
export var comps

export function patch(parent, element, oldVnode, vnode) {
  if (oldVnode == null) {
    //首次渲染，将node 的 dom 插到 body 下
    element = parent.insertBefore(create(vnode), element)
  } else if (vnode.type && vnode.type === oldVnode.type) {
    //标签相同，就更新属性，但是如果都是function的话，那就没办法
    if (typeof vnode.type === 'function') {
      vnode = vnode.type(vnode.props)
      oldVnode = oldVnode.type(oldVnode.props)
      patch(parent, element, oldVnode, vnode)
    }
    update(element, oldVnode.props, vnode.props) //更新属性

    var reusableChildren = {} //可以复用的孩子{key:[type,vnode]}
    var oldElements = [] //旧的真实元素
    var newKeys = {} //新的vnode {key:vnode}

    //遍历旧的 vnode，这次循环主要是筛选出带key，可以复用的vnode，最终是{key:[type,vnode]}
    oldVnode.children.forEach((oldChild, index) => {
      var oldElement = element.childNodes[index]
      oldElements[index] = oldElement
      var oldKey = oldChild.props ? oldChild.props.key : null

      if (null != oldKey) {
        reusableChildren[oldKey] = [oldElement, oldChild]
      }
    })

    var i = 0
    var j = 0

    while (j < vnode.children.length) {
      //循环新的node的子节点，循环这个的目的
      var oldElement = oldElements[i] //这个是一个个 旧的 node 真实节点
      var oldChild = oldVnode.children[i] //一个个旧的 vnode
      var newChild = vnode.children[j] //一个个新的vnode

      var oldKey = oldChild.props ? oldChild.props.key : null

      var newKey = newChild.props ? newChild.props.key : null

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
          element.insertBefore(reusableChild[0], oldElement)
          patch(element, reusableChild[0], reusableChild[1], newChild)
        } else {
          patch(element, oldElement, null, newChild)
        }

        j++
        newKeys[newKey] = newChild
      }
    }

    while (i < oldVnode.children.length) {
      //这个主要是用于删除的
      var oldChild = oldVnode.children[i]
      var oldKey = oldChild.props ? oldChild.props.key : null
      if (null == oldKey) {
        element.removeChild(reusableChild[0])
      }
      i++
    }

    for (let i in reusableChildren) {
      var reusableChild = reusableChildren[i]
      var reusableNode = reusableChild[1]
      if (!newKeys[reusableNode.props.key]) {
        element.removeChild(reusableChild[0])
      }
    }
  } else if (oldVnode !== vnode) {
    //然后会如果两个对象不同的话就直接替换
    var i = element
    parent.replaceChild((element = create(vnode)), i)
  }

  return element
}

export function create(vnode) {
  if (typeof vnode.type === 'function') {
    vnode = vnode.type(vnode.props)
  }
  let element =
    typeof vnode === 'string' || typeof vnode === 'number'
      ? document.createTextNode(vnode)
      : document.createElement(vnode.type)

  if (vnode.props) {
    vnode.children.forEach(child => {
      element.appendChild(create(child))
    })

    for (let name in vnode.props) {
      setAttrs(element, name, vnode.props[name])
    }
  }

  return element
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
