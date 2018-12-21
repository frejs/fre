import { patch } from './patch'

export let parent
export let oldNode
export let el

export function render(vnode, el) {
  rerender(el, null, null, vnode)
  el = el
}

export function rerender(parent, element, oldVnode, vnode) {
  setTimeout(() => {
    parent = patch(parent, element, oldVnode, (oldNode = vnode))
  })

}