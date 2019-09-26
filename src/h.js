export function h (type, config) {
  let props = config || {}
  let key = props.key || null
  let children = []

  for (let i = 2; i < arguments.length; i++) {
    let vnode = arguments[i]
    if (vnode == null || vnode === true || vnode === false) {
    } else if (typeof vnode === 'number' || typeof vnode === 'string') {
      children.push({ type: 'text', props: { nodeValue: vnode } })
    } else {
      children.push(vnode)
    }
  }
  
  if (children.length) {
    props.children = children.length === 1
      ? children[0]
      : children
  }

  return { type, props, key }
}
