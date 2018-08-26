import { diff } from './diff'

function render(vnode, container, node) {
  return diff(node, vnode, container)
}

export default render
