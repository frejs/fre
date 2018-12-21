import { patch } from './patch'
import { comp, once } from './hooks'

let parent
let element
let oldVnode
let vnode

export function render(vdom, el) {
  parent = el
  vnode = vdom
  rerender()
}

export function rerender() {
  if (!once) {
    vnode = comp.type()
  }
  setTimeout(() => {
    console.log(oldVnode,vnode)
    element = patch(parent, element, oldVnode, (oldVnode = vnode))
  })
}
