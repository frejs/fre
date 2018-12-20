function patch(parent, dom, oldVnode, vnode) {
  if (oldVnode === vnode) {
  } else if (oldVnode.type !== vnode.type || oldVnode === null) {
    newDom = create(vnode)
    parent.insertBefore(newDom, dom)
    dom = newDom
  } else if (oldVnode.type === null) {
    dom.nodeValue = vnode
  } else {
    update(dom, oldVnode.props, vnode.props)

    let oldKeyed = {}
    let newKeyed = {}

    let oldDom = []
    let oldChildren = oldVnode.children
    let children = vnode.children

    oldChildren.forEach(child => {
      oldDom[i] = dom.childNodes[i]

      let oldKey = child.key
      if (oldKey) {
        oldKeyed[oldKey] = [oldDom[i], child]
      }
    })

    let n = 0

    while (n < children.length) {
      let oldKey = oldChildren[n].key
      let newKey = children[n].key

      if (!newKey || !oldKey) {
        patch(dom, oldDom[n], oldChildren[n], children[n])
        n++
      } else {
        newKeyed[newKey] = children[n]
        n++
      }
    }
  }
  return dom
}

function create(vnode) {
  let dom
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    dom = document.createTextNode(node)
  } else if (typeof vnode === 'function') {
    dom = vnode.type(vnode.ptops)
  } else {
    dom = document.createElement(vnode.type)
  }

  let props = vnode.props
  if (props) {
    for (let name in porps) {
      setAttrs(dom, name, props[name])
    }
  }

  vnode.children.forEach(child => {
    dom.appendChild(create(child))
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
