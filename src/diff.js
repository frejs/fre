import { setAttr } from './dom'

export function diff(node, vnode, container) {
  const ret = diffNode(node, vnode)

  if (container && ret.parentNode !== container) {
    container.appendChild(ret)
  }
  return ret
}

function diffNode(node, vnode) {
  let newNode = node
  if (
    typeof vnode === undefined ||
    typeof vnode === null ||
    typeof vnode === 'boolean'
  ) {
    vnode = ''
  }

  if (typeof vnode === 'number' || typeof vnode === 'string') {
    if (node && node.nodeType === 3) {
      if (node.textContent !== vnode) {
        node.textContent = vnode
      }
    } else {
      newNode = document.createTextNode(vnode)
      if (node && node.parentNode) {
        node.parentNode.replaceChild(newNode, node)
      }
    }

    return newNode
  }
  if (typeof vnode.type === 'function') {
    return diffComponent(node, vnode)
  }

  if (!node || !isSameNodeType(node, vnode)) {
    newNode = document.createElement(vnode.type)
    if (node) {
      [...node.childNodes].map(newNode.appendChild)

      if (node.parentNode) {
        node.parentNode.replaceChild(newNode, node)
      }
    }
  }

  if (vnode.children.length > 0 || newNode.childNodes.length > 0) {
    diffChildren(newNode, vnode.children)
  }

  diffAttrs(newNode, vnode)
  return newNode
}

function diffChildren(node, vchildren) {
  const nodeChildren = node.childNodes
  const children = []

  const keyed = {}

  if (nodeChildren.length > 0) {
    for (let i = 0; i < nodeChildren.length; i++) {
      const child = nodeChildren[i]
      const key = child.key
      if (key) {
        keyed[key] = child
      } else {
        children.push(child)
      }
    }
  }

  if (vchildren.length > 0) {
    let min = 0
    let childrenLen = children.length

    for (let i = 0; i < vchildren.length; i++) {
      const vchild = vchildren[i]
      const key = vchild.key

      let child

      if (key) {
        if (keyed[key]) {
          child = keyed[key]
          keyed[key] = undefined
        }
      } else if (min < childrenLen) {
        for (let j = min; j < childrenLen; j++) {
          let c = children[j]
          if (c && isSameNodeType(c, vchild)) {
            child = c
            children[j] = undefined

            if (j === children - 1) childrenLen--
            if (j === min) min++
          }
        }
      }

      child = diffNode(child, vchild)

      const f = nodeChildren[i]

      if (child && child !== node && child !== f) {
        if (!f) {
          node.appendChild(child)
        } else if (child === f.nextSibling) {
          removeNode(f)
        } else {
          node.insertBefore(child, f)
        }
      }
    }
  }
}

function diffComponent(node, vnode) {
  let component = node && node.component
  let oldNode = node

  if (component && component.constructor === vnode.type) {
    setComponentProps(component, vnode.props)

    node = component.base
  } else {
    if (component) {
      unmountComponent(component)
      oldNode = null
    }

    component = createComponent(vnode.type, vnode.props)

    setComponentProps(component, vnode.props)
    node = component.base

    if (oldNode && node !== oldNode) {
      oldNode.component = null
      removeNode(oldNode)
    }
  }

  return node
}

function setComponentProps(component, props) {
  if (!component.base) {
    if (component.willMount) component.willMount()
  } else if (component.willChange) {
    component.willChange(props)
  }

  component.props = props
  renderComponent(component)
}

export function renderComponent(component) {
  let base

  const vnode = component.render()

  if (component.base && component.willUpdate) {
    component.willUpdate()
  }

  base = diffNode(component.base, vnode)

  if (component.base) {
    if (component.updated) component.updated()
  } else if (component.mounted) {
    component.mounted()
  }

  component.base = base
}

function createComponent(component, props) {
  let inst

  if (component.prototype && component.prototype.render) {
    inst = new component(props)
  } else {
    inst = new component(props)
    inst.constructor = component
    inst.render = () => this.constructor(props)
  }

  return inst
}

function unmountComponent(component) {
  if (component.willUnmout) component.willUnmout()
  removeNode(component.base)
}

function isSameNodeType(node, vnode) {
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return node.nodeType === 3
  }

  if (typeof vnode.type === 'string') {
    return node.nodeName.toLowerCase() === vnode.type.toLowerCase()
  }

  return node && node.component && node.component.constructor === vnode.type
}

function diffAttrs(node, vnode) {
  const nodeAttr = {}
  const vnodeAttr = vnode.props

  for (let i = 0; i < node.attributes.length; i++) {
    const attr = node.attributes[i]
    nodeAttr[attr.name] = attr.value
  }

  for (let name in nodeAttr) {
    if (!(name in vnodeAttr)) {
      setAttr(node, name, undefined)
    }
  }

  for (let name in vnodeAttr) {
    if (nodeAttr[name] !== vnodeAttr[name]) {
      setAttr(node, name, vnodeAttr[name])
    }
  }
}

function removeNode(node) {
  if (node && node.parentNode) {
    node.parentNode.removeChild(node)
  }
}
