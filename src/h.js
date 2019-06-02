import { merge } from './util'
export function h (type, props) {
  let rest = []
  let children = []
  let length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  while (rest.length) {
    let vnode = rest.pop()
    if (vnode && vnode.pop) {
      for (length = vnode.length; length--;) rest.push(vnode[length])
    } else if (vnode === null || vnode === true || vnode === false) {
      vnode = { type: () => {} }
    } else if (typeof vnode === 'function') {
      children = vnode
    } else {
      children.push(
        typeof vnode === 'object'
          ? vnode
          : { type: 'text', props: { nodeValue: vnode } }
      )
    }
  }
  return {
    type,
    props: merge(props, { children }),
    key: props && props.key
  }
}
