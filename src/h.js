export function h(type, attrs, ...args) {
  let props = attrs || {}
  let key = props.key || null
  let ref = props.ref || null
  let children = []

  for (let i = 0; i < args.length; ++i) {
    let child = args[i]
    const type = typeof child

    if (type === 'boolean' || child == null) {
      break
    }

    if (type === 'string' || type === 'number') {
      child = createText(child)
    }

    children.push(child)
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
