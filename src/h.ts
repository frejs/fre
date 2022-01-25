import { isStr, arrayfy } from './reconcile'
import { FreElement } from './type'

// for jsx2
export const h = (type, props: any, ...kids) => {
  props = props || {}
  kids = flat(arrayfy(props.children || kids))

  if (kids.length) props.children = kids.length === 1 ? kids[0] : kids

  const key = props.key || null
  const ref = props.ref || null

  if (key) props.key = undefined
  if (ref) props.ref = undefined

  return createVnode(type, props, key, ref)
}

const some = (x: unknown) => x != null && x !== true && x !== false

const flat = (arr: any[], target = []) => {
  arr.forEach(v => {
    isArr(v)
      ? flat(v, target)
      : some(v) && target.push(isStr(v) ? createText(v) : v)
  })
  return target
}

export const createVnode = (type, props, key, ref) => ({
  type,
  props,
  key,
  ref,
})

export const createText = (vnode: any) =>
  ({ type: '#text', props: { nodeValue: vnode + '' } } as FreElement)

export function Fragment(props) {
  return props.children
}

export function memo(fn){
  fn.memo = true
  return fn
}

export const isArr = Array.isArray
