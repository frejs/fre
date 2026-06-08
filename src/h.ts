import { isStr } from './reconcile'
import { FC, FreNode, FreText, Fiber } from './type'

export const h = (type: string | FC, props: any, ...kids: FreNode[]) => {
  props = props || {}
  kids = flat(arrayfy(props.children || kids))

  if (kids.length) {
    props.children = kids.length === 1 ? kids[0] : kids
  } else delete props.children

  const key = props.key || null
  const ref = props.ref || null

  if (key) props.key = undefined
  if (ref) props.ref = undefined

  return createVnode(type, props, key, ref)
}

const arrayfy = <T>(arr: T | T[] | null | undefined) =>
  !arr ? [] : isArr(arr) ? arr : [arr]

const some = <T>(x: T | boolean | null | undefined): x is T =>
  x != null && x !== true && x !== false

const flat = (arr: FreNode[], target: Fiber[] = []) => {
  arr.forEach((v) => {
    isArr(v)
      ? flat(v, target)
      : some(v) && target.push(isStr(v) ? createText(v) : v)
  })
  return target
}

export const createVnode = (type, props, key, ref) => ({ type, props, key, ref })

export const createText = (vnode: FreText) =>
  ({ type: '#text', props: { nodeValue: vnode + '' } } as Fiber)

export const Fragment = (props) => props.children
export const Suspense = (props) => props.children
export const ErrorBoundary = (props) => props.children

export const memo = <T extends FC>(fn: T, compare?: T['shouldUpdate']) => {
  fn.memo = true
  fn.shouldUpdate = compare
  return fn
}

export const isArr = Array.isArray

export const lazy = (factory) => {
  let status = 'unloaded'
  let result
  let promise
  return (props) => {
    switch (status) {
      case 'loaded': return h(result, props)
      case 'loading': throw promise
      default:
        status = 'loading'
        promise = factory().then((m) => {
          status = 'loaded'
          result = m.default
        })
        throw promise
    }
  }
}

