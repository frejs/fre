import { create } from './patch'

export function render(vnode, el) {
  console.log(vnode)
  let dom = create(vnode)
  el.appendChild(dom)
}
