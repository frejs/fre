//h 函数，和 react 不同的是，children 不再放到 props 里，而是作为第二个参数传入

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
    ? type(props || {}, children)
    : {
      type,
      props: props || {},
      children,
      key: props && props.key
    }
}
