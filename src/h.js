export function h (type, config) {
  let props = config || {}
  let key = props.key || null
  let children = []

  for (let i = 2; i < arguments.length; i++) {
    let vnode = arguments[i]
    if (vnode == null || vnode === true || vnode === false) {
    } else if (Array.isArray(vnode) || typeof vnode === 'object') {
      children.push(vnode)
    } else if (typeof vnode === 'function') {
      children = vnode
    } else {
      children.push({ type: 'text', props: { nodeValue: vnode } })
    }
  }

  delete props.key

  props.children = children

  return { type, props, key }
}
