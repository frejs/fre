export function h(type, attrs, ...args) {
  let props = attrs || {}
  let key = props.key || null
  let ref = props.ref || null
  let children = []

  for (let i = 0; i < args.length; i++) {
    let vnode = args[i]
    if (vnode == null || vnode === true || vnode === false) {
    } else {
      const vnodeType = typeof vnode
      const toPush = ['string', 'number'].includes(vnodeType) ? createText(vnode) : vnode
      children.push(toPush)
    }
  }

  if (children.length) {
    props.children = children.length === 1 ? children[0] : children
  }

  delete props.key
  delete props.ref

  return { type, props, key, ref }
}

export function createText(vnode) {
  return { type: 'text', props: { nodeValue: vnode } }
}
