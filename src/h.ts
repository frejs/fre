import { Attributes, FC, FreNode, IFiber, PropsWithChildren, FreElement } from './type'
import { some, isFn,isStr } from './reconciler'
import {Flag} from './diff'

// Supported and simplify jsx2
// * https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md
export const h = function <P extends Attributes = {}>(type: FC<P>, attrs: P): Partial<IFiber> {
  for (var vnode, rest = [], children = [], i = arguments.length; i-- > 2; ) {
    rest.push(arguments[i])
  }
  const props = attrs || ({} as P)
  const key = props.key || null
  const ref = props.ref || null

  while (rest.length > 0) {
    if (isArr((vnode = rest.pop()))) {
      for (var i = vnode.length; i-- > 0; ) {
        rest.push(vnode[i])
      }
    } else if (some(vnode)) {
      children.push( isStr(vnode)? createText(vnode as string):vnode )
    }
  }
  // delete them to reduce loop performance
  delete props.key

  return { type, props, children, key, ref } as Partial<IFiber>
}

export function createText(vnode: string) {
  return { type: Flag.Text as any, props: { nodeValue: vnode } } as FreElement
}

export const Fragment = (props: PropsWithChildren): FreNode => {
  return props.children
}
export const isArr = Array.isArray
