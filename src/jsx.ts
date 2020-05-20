import { Vnode, Ref, Props, Component } from './type'
import { Flag, some } from './reconciler'

// Supported and simplify jsx2
// * https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md
export function jsx(type, attrs) {
  let props: Props = attrs || {}
  let key: string = props.key || null
  let ref: Ref = props.ref || null
  let children: (Vnode | string)[] = []

  for (let i = 2; i < arguments.length; i++) {
    let vnode = arguments[i]
    if (some(vnode)) {
      // if vnode is a nest array, flat them first
      while (isArr(vnode) && vnode.some(v => isArr(v))) {
        console.log(111)
        vnode = [].concat(...vnode)
      }
      children.push(vnode)
    }
  }

  if (children.length) {
    // if there is only on child, it not need an array, such as child use as a function
    props.children = children.length === 1 ? children[0] : children
  }
  // delete them to reduce loop performance
  delete props.key
  delete props.ref

  return { type, props, key, ref }
}

export function Fragment(props: Props) {
  return props.children
}

export const isArr = Array.isArray
