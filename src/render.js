export let vm, prevNode, ele

export function mount(vnode, el) {
  ele = el
  vm = vnode
  prevNode = vnode.type()
  el.innerHTML = ''
  const node = render(vnode)
  el.appendChild(node)
}

export function render(vnode) {
  if (typeof vnode.type === 'function') {
    prevNode = vnode.type(vnode.props)
    vnode = vnode.type(vnode.props)
  }
  let node = document.createElement(vnode.type)
  for (let name in vnode.props) {
    setAttr(node, name, vnode.props[name])
  }

  vnode.children.forEach(child => {
    child =
      typeof child == 'object' ? render(child) : document.createTextNode(child)
    node.appendChild(child)
  })

  return node
}

export function setAttr(node, name, value) {
  if (/on\w+/.test(name)) {
    name = name.toLowerCase()
    node[name] = value || ''
  } else {
    switch (name) {
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
}
