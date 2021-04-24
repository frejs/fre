import { isStr } from './reconciler'
import { FreElement } from './type'

// for jsx2
export const h = (type, props, ...kids) => {
  props = props || {}
  kids = props.children || kids
  while (kids.some(isArr)) kids = [].concat(...kids)
  kids = kids.map(kid => isStr(kid) ? createText(kid as string) : kid)
  if (kids.length) props.children = kids.length === 1 ? kids[0] : kids
  delete props.key
  delete props.ref
  return createVnode(type, props, props.key, props.ref)
}

export const createVnode = (type, props, key = null, ref = null) => ({ type, props, key, ref })

export const createText = (vnode: string) => ({ type: 'text', props: { nodeValue: vnode + '' } } as FreElement)

export const recycleNode = (node) =>
  node.nodeType === 3
    ? createText(node.nodeValue)
    : createVnode(
      node.nodeName.toLowerCase(),
      { children: node.childNodes.map(recycleNode) }
    )

export const isArr = Array.isArray
