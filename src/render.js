import { create, patch } from './patch'
import { once } from './hooks'

export function render(vnode, el) {
  setTimeout(_render(vnode, el), 0)
}

function _render(vnode, el) {
  if (once) {
    patch(el, null, null, vnode)
    once = true
  }
}
