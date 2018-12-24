export function patch(parent, element, oldVnode, vnode) {
  if (oldVnode == vnode) {
  } else if (oldVnode == null) {
    element = parent.insertBefore(create(vnode), element)
  } else if (vnode.type && vnode.type === oldVnode.type) {
    if (typeof vnode.type === 'function') {
      vnode = vnode.type(vnode.props)
      oldVnode = oldVnode.type(oldVnode.props)
      patch(parent, element, oldVnode, vnode)
    }
    update(element, oldVnode.props, vnode.props)

    let reusableChildren = {}
    let oldElements = []
    let newKeys = {}

    oldVnode.children.forEach((oldChild, index) => {
      let oldElement = element.childNodes[index]
      oldElements[index] = oldElement
      let oldKey = oldChild.props ? oldChild.props.key : null

      if (null != oldKey) {
        reusableChildren[oldKey] = [oldElement, oldChild]
      }
    })

    let i = 0
    let j = 0

    while (j < vnode.children.length) {
      let oldElement = oldElements[i]
      let oldChild = oldVnode.children[i]
      let newChild = vnode.children[j]

      let oldKey = oldChild.props ? oldChild.props.key : null
      let newKey = newChild.props ? newChild.props.key : null

      let reusableChild = reusableChildren[newKey] || []

      if (null == newKey) {
        if (null == oldKey) {
          patch(element, oldElement, oldChild, newChild)
          j++
        }
        i++
      } else {
        if (oldKey === newKey) {
          patch(element, reusableChild[0], reusableChild[1], newChild)
          i++
        } else if (reusableChild[0]) {
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
      let oldChild = oldVnode.children[i]
      let oldKey = oldChild.props ? oldChild.props.key : null
      if (null == oldKey) {
        element.removeChild(reusableChild[0])
      }
      i++
    }

    for (let i in reusableChildren) {
      let reusableChild = reusableChildren[i]
      let reusableNode = reusableChild[1]
      if (!newKeys[reusableNode.props.key]) {
        element.removeChild(reusableChild[0])
      }
    }
  } else if (oldVnode !== vnode) {
    let i = element
    parent.replaceChild((element = create(vnode)), i)
  }

  return element
}

export function create(vnode) {
  if (typeof vnode.type === 'function') {
    vnode = vnode.type(vnode.props, ...vnode.children)
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

function update(element, oldProps, props) {
  let cloneProps = { ...oldProps, ...props }
  for (let name in cloneProps) {
    setAttrs(element, name, cloneProps[name])
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
