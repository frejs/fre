//和 react 不同的是，children 是作为第二个参数传入，而不是 props.children
export function h (type, props) {
  let rest = []
  let children = []
  let length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  while (rest.length) {
    let node = rest.pop()
    if (node && node.pop) {
      for (length = node.length; length--;) {
        rest.push(node[length])
      }
    } else if (node === null || node === true || node === false) {
    } else {
      children.push(node)
    }
  }

  return typeof type === 'function'
    ? name(props || {}, children)
    : {
      type,
      props: props || {},
      children,
      key: props && props.key
    }
}
