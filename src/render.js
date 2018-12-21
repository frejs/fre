import { create } from './patch'

export function render(vnode, el) {
  let dom = create(vnode)
  el.appendChild(dom)
}
