import { isStr } from './reconciler'
import { FreElement } from './type'

// for jsx2
export const h = (type, props, ...kids) => {
  props = props || {}
  kids = flat(props.children || kids)
  if (kids.length) props.children = kids.length === 1 ? kids[0] : kids
  delete props.key
  delete props.ref
  return createVnode(type, props, props.key, props.ref)
}

const flat = (arr) => [].concat(...arr.map(v => isArr(v) ? [].concat(flat3(v)) : isStr(kid) ? createText(v) : v))

export const createVnode = (type, props, key=null, ref=null) => ({ type, props, key, ref })

export const createText = (vnode: any) => ({ type: 'text', props: { nodeValue: vnode + '' } } as FreElement)

export function Fragment(props) {
  return props.children
}

export const isArr = Array.isArray
