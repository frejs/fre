import { megre } from './util'
export function h (type, props) {
  let rest = []
  let children = []
  let length = arguments.length

  while (length-- > 2) rest.push(arguments[length])

  while (rest.length) {
    let node = rest.pop()
    if (node && node.pop) {
      for (length = node.length; length--;) rest.push(node[length])
    } else if (node === null || node === true || node === false) {
    } else {
      children.push(
        typeof node !== 'object'
          ? { type: 'text', props: { nodeValue: node } }
          : node
      )
    }
  }

  return {
    type,
    props: megre(props, { children }),
    key: (props || {}).key || null
  }
}
