import { isStr, arrayfy } from './reconcile'
import { FC, FreNode, FreText, IFiber } from './type'

// for jsx2
export const h = (type: string | FC, props: any, ...kids: FreNode[]) => {
  props = props || {}
  kids = flat(arrayfy(props.children || kids))

  if (kids.length) props.children = kids.length === 1 ? kids[0] : kids

  const key = props.key || null
  const ref = props.ref || null

  if (key) props.key = undefined
  if (ref) props.ref = undefined

  return createVnode(type, props, key, ref)
}

const some = <T>(x: T | boolean | null | undefined): x is T =>
  x != null && x !== true && x !== false

const flat = (arr: FreNode[], target: IFiber[] = []) => {
  arr.forEach((v) => {
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

export const createText = (vnode: FreText) =>
  ({ type: '#text', props: { nodeValue: vnode + '' } } as IFiber)

export function Fragment(props) {
  return props.children
}

export function memo<T extends FC>(fn: T, compare?: T['shouldUpdate']) {
  fn.memo = true
  fn.shouldUpdate = compare
  return fn
}

export const isArr = Array.isArray
