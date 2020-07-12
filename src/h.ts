import { Attributes, FC, FreNode, IFiber, PropsWithChildren, FreElement } from './type'
import { some, isStr } from './reconciler'

// Supported and simplify jsx2
// * https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md
export const h = function <P extends Attributes = {}>(type: FC<P>, attrs: P): Partial<IFiber> {
  let props = attrs || ({} as P)
  let key = props.key || null
  let ref = props.ref || null

  let children: FreNode[] = []
  let simple = ''
  const len = arguments.length
  for (let i = 2; i < len; i++) {
    let child = arguments[i]
    const end = i === len - 1
    // if vnode is a nest array, flat them first
    while (isArr(child) && child.some((v) => isArr(v))) {
      child = [].concat(...child)
    }
    let vnode = some(child) ? child : ''
    const str = isStr(vnode)
    // merge simple nodes
    if (str) simple += String(vnode)
    if (simple && (!str || end)) {
      children.push(createText(simple))
      simple = ''
    }
    if (!str) children.push(vnode)
  }

  if (children.length) {
    // if there is only on child, it not need an array, such as child use as a function
    props.children = children.length === 1 ? children[0] : children
  }
  // delete them to reduce loop performance
  delete props.key
  delete props.ref

  return { type, props, key, ref } as Partial<IFiber>
}

export function createText(vnode: string) {
  return { type: 'text', props: { nodeValue: vnode } } as FreElement
}

export const Fragment = (props: PropsWithChildren): FreNode => {
  return props.children
}
export const isArr = Array.isArray
