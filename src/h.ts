import { isStr } from './reconciler'
import { FreElement } from './type'

// for jsx2
export const h = (type, props, ...kids) => {
  props = props || {}
  kids = props.children || kids
  let key = props.key || null, ref = props.ref || null
  while (kids.some(isArr)) kids = [].concat(...kids)
  kids = kids.map(kid => isStr(kid) ? createText(kid as string) : kid)
  if (kids.length) props.children = kids.length === 1 ? kids[0] : kids
  delete props.key
  delete props.ref
  return createVnode(type, props, key, ref)
}

export const createVnode = (type, props, key, ref) => {
  return {
    type,
    props,
    key,
    ref,
  }
}

export function createText(vnode: string) {
  return { type: 'text', props: { nodeValue: vnode } } as FreElement
}

export function Fragment(props) {
  return props.children
}

export const isArr = Array.isArray
