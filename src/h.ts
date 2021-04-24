import { isStr } from './reconciler'
import { FreElement } from './type'

// for jsx2
export const h = (type, props, ...kids) => {
  props = props || {}
  kids = props.children || kids
  props.children = kids.length === 1 ? kids[0] : flat(kids)
  return createVnode(type, props)
}

export const createVnode = (type, props) => ({
  type,
  props,
  key: props.key,
  ref: props.ref,
})

export function createText(vnode: string) {
  return { type: 'text', props: { nodeValue: vnode } } as FreElement
}

export function Fragment(props) {
  return props.children
}

const flat = (ary) => ary.reduce((pre, cur) => isArr(cur) ? pre.concat(flat(cur)) : isStr(cur) ? (cur = createText(cur as string)) : cur, [])

export const isArr = Array.isArray
