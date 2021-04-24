import { isStr } from './reconciler'
import { FreElement } from './type'

// for jsx2
export const h = (type, props, ...kids) => {
  props = props || {}
  kids = props.children || kids
  kids.length && (props.children = flat(kids))
  let key = props.key || null, ref = props.ref || null
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

const flat = (arr) => {
  return isArr(arr) ? arr.reduce((pre, cur) => isArr(cur) ? pre.concat(flat(cur)) : flat(cur), []) : isStr(arr) ? createText(arr as string) : arr
}

export const isArr = Array.isArray
