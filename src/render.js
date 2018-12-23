import { patch } from './patch'

let parent, element, oldVnode, vnode, root, lock

export function mount(vdom, el) {
  root = vdom
  parent = el
  vnode = vdom.type()
  rerender()
}

export function rerender() {
  vnode = root.type(root.props)
  if (!lock) {
    lock = true
    setTimeout(() => {
      lock = !lock
      element = patch(parent, element, oldVnode, (oldVnode = vnode))
    })
  }
}
