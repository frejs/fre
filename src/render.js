import { patch } from './patch'

let parent
let element
let oldVnode = element
let vnode

export function render(vdom, el) {
  parent = el
  vnode = vdom
  rerender()
}

export function rerender() {
  setTimeout(() => {
  element =  patch(parent, element, oldVnode, (oldVnode = vnode))
  })
}
