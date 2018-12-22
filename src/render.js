import { patch } from './patch'

let parent
let element
let oldVnode
let vnode
let root

export function render(vdom, el) {
  root = vdom
  parent = el
  vnode = vdom.type()
  rerender()
}

export function rerender() {
  vnode = root.type(root.props)
  
  setTimeout(() => {
    element = patch(parent, element, oldVnode, (oldVnode = vnode))
  })
}