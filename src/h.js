export const isArr = Array.isArray

export function h(type, attrs, ...args) {
  let props = attrs || {}
  let key = props.key || null
  let ref = props.ref || null
  let children = []

  for (let i = 0; i < args.length; i++) {
    let vnode = args[i]
    if (vnode == null || vnode === true || vnode === false) {
    } else if (typeof vnode === 'string' || typeof vnode === 'number') {
      children.push(createText(vnode))
    } else {
      while (isArr(vnode) && vnode.some(v => isArr(v))) {
        vnode = [].concat(...vnode)
      }
      children.push(vnode)
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

export function Fragment(props) {
  return props.children
}
