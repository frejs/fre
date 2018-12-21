export let fns

export function patch(parent, dom, oldVnode, vnode) {
  if (oldVnode === vnode) {
  } else if (oldVnode === null || oldVnode.type !== vnode.type) {
    let newDom = create(vnode)
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

export function create(vnode) {
  fns = filterFn(vnode)

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

function filterFn(obj) {
  let fns = {}
  return walk(obj, fns)
}

function walk(obj, fns) {
  if (obj) {
    Object.keys(obj).forEach(i => {
      if (i === 'type') {
        let f = obj[i]
        if (typeof f === 'function') {
          fns[f.name] = obj
        }
      } else if (i === 'children') {
        let arr = obj[i]
        arr.forEach(child => {
          walk(child, fns)
        })
      }
    })
  }
  return fns
}
