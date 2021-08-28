import {
  IFiber,
  FreElement,
  FC,
  Attributes,
  HTMLElementEx,
  FreNode,
  IEffect,
} from "./type"
import { createElement } from "./dom"
import { resetCursor } from "./hook"
import { schedule, shouldYield, startTransition } from "./schedule"
import { isArr, createText } from "./h"
import { commit } from "./commit"

let currentFiber: IFiber
let finish = null
let effect = null
let detach = null
export let options: any = {}

export const enum LANE {
  UPDATE = 1 << 1,
  INSERT = 1 << 2,
  REMOVE = 1 << 3,
  SVG = 1 << 4,
  DIRTY = 1 << 5,
  HEAD = 1 << 6
}

export const render = (vnode: FreElement, node: Node, config?: any): void => {
  const rootFiber = {
    node,
    props: { children: vnode },
  } as IFiber
  if (config) {
    options = config
  }
  update(rootFiber)
}

export const update = (fiber?: IFiber) => {
  if (fiber && !(fiber.lane & LANE.DIRTY)) {
    fiber.lane = LANE.UPDATE | LANE.DIRTY
    schedule(() => {
      effect = detach = fiber
      return reconcile(fiber)
    })
  }
}

const reconcile = (WIP?: IFiber): boolean => {
  while (WIP && !shouldYield()) WIP = capture(WIP)
  if (WIP) return reconcile.bind(null, WIP)
  if (finish) {
    commit(finish)
    finish = null
    options.done && options.done()
  }
  return null
}

const capture = (WIP: IFiber): IFiber | undefined => {
  WIP.isComp = isFn(WIP.type)
  WIP.isComp ? updateHook(WIP) : updateHost(WIP)
  if (WIP.child) return WIP.child
  while (WIP) {
    bubble(WIP)
    if (!finish && (WIP.lane & LANE.DIRTY)) {
      finish = WIP
      WIP.lane &= ~LANE.DIRTY
      return null
    }
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

const bubble = (WIP) => {
  if (WIP.isComp) {
    if (WIP.hooks) {
      side(WIP.hooks.layout)
      startTransition(() => side(WIP.hooks.effect))
    }
  } else {
    effect.e = WIP
    effect = WIP
  }
}

const updateHook = <P = Attributes>(WIP: IFiber): void => {
  resetCursor()
  currentFiber = WIP
  let children = (WIP.type as FC<P>)(WIP.props)
  diffKids(WIP, simpleVnode(children))
}

const updateHost = (WIP: IFiber): void => {
  WIP.parentNode = getParentNode(WIP) as any || {}
  if (!WIP.node) {
    if (WIP.type === "svg") WIP.lane |= LANE.SVG
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  WIP.after = WIP.parentNode['prev']
  WIP.parentNode['prev'] = WIP.lane & LANE.HEAD ? null : WIP.node
  WIP.node['prev'] = null

  diffKids(WIP, WIP.props.children)
}

const simpleVnode = (type: any) =>
  isStr(type) ? createText(type as string) : type

const getParentNode = (WIP: IFiber): HTMLElement | undefined => {
  while ((WIP = WIP.parent)) {
    if (!WIP.isComp) return WIP.node
  }
}

const diffKids = (WIP: any, children: FreNode): void => {
  let aCh = WIP.kids || [],
    bCh = (WIP.kids = arrayfy(children) as any),
    aHead = 0,
    bHead = 0,
    aTail = aCh.length - 1,
    bTail = bCh.length - 1,
    I = null,
    P = null

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aTail], bCh[bTail])) break
    clone(aCh[aTail--], bCh[bTail], LANE.UPDATE, WIP, bTail--)
  }

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aHead], bCh[bHead])) break
    bCh[bHead].lane |= LANE.HEAD
    aHead++; bHead++
  }

  if (aHead > aTail) {
    while (bHead <= bTail) {
      let c = bCh[bTail]
      c.lane = LANE.INSERT
      linke(c, WIP, bTail--)
    }
  } else if (bHead > bTail) {
    while (aHead <= aTail) {
      let c = aCh[aTail--]
      c.lane = LANE.REMOVE
      detach.d = c
      detach = c
    }
  } else {
    if (!I && !P) {
      // [1,2,3,4,5]
      // [1,4,3,2,5]
      // [0,3,2,1,4]
      I = {}
      P = []
      for (let i = aHead; i <= aTail; i++) {
        let k = aCh[i].key || '.' + i
        I[k] = i
      }
      for (let i = bHead; i <= bTail; i++) {
        let k = bCh[i].key || '.' + i
        P[I[k]] = i
      }
      var lis = findLis(P, bHead)
    }
    while (bHead <= bTail) {
      let c = bCh[bTail]
      let idx = I[c.key || '.' + bTail]
      if (idx != null && same(c, aCh[idx])) {
        clone(aCh[idx], c, lis.indexOf(idx) > -1 ? LANE.UPDATE : LANE.INSERT, WIP, bTail--)
        delete I[c.key]
      } else {
        c.lane = LANE.INSERT
        linke(c, WIP, bTail--)
      }
    }

    for (const k in I) {
      let c = aCh[I[k]]
      c.lane = LANE.REMOVE
      detach.d = c
      detach = c
    }
  }

  while (bHead-- > 0) {
    clone(aCh[bHead], bCh[bHead], LANE.UPDATE, WIP, bHead)
  }
}

function linke(kid, WIP, i) {
  kid.parent = WIP
  if (WIP.lane & LANE.SVG) {
    kid.lane |= LANE.SVG
  }
  if (WIP.isComp && (WIP.lane & LANE.INSERT)) {
    kid.lane |= LANE.INSERT
  }
  if (i === WIP.kids.length - 1) {
    WIP.child = kid
  } else {
    WIP._prev.sibling = kid
  }
  WIP._prev = kid
}

function clone(a, b, lane, WIP, i) {
  b.oldProps = a.props
  b.node = a.node
  b.kids = a.kids
  b.hooks = a.hooks
  b.ref = a.ref
  b.lane = lane
  linke(b, WIP, i)
}

const same = (a, b) => {
  return a && b && a.key === b.key && a.type === b.type
}

export const arrayfy = (arr) => (!arr ? [] : isArr(arr) ? arr : [arr])

const side = (effects: IEffect[]): void => {
  effects.forEach((e) => e[2] && e[2]())
  effects.forEach((e) => (e[2] = e[0]()))
  effects.length = 0
}

const findLis = (ns, start) => {
  let seq = [],
    is = [],
    l = -1,
    pre = new Array(ns.length)

  for (var i = start, len = ns.length; i < len; i++) {
    let n = ns[i]
    if (n < 0) continue
    let j = bs(seq, n)
    if (j !== -1) pre[i] = is[j]
    if (j === l) {
      l++;
      seq[l] = n
      is[l] = i
    } else if (n < seq[j + 1]) {
      seq[j + 1] = n
      is[j + 1] = i
    }
  }

  for (i = is[l]; l >= 0; i = pre[i], l--) {
    seq[l] = i
  }

  return seq
}

const bs = (seq, n) => {
  let lo = -1,
    hi = seq.length

  if (hi > 0 && seq[hi - 1] <= n) return hi - 1

  while (hi - lo > 1) {
    let mid = (lo + hi) >>> 1
    if (seq[mid] > n) {
      hi = mid
    } else {
      lo = mid
    }
  }
  return lo
}

export const getCurrentFiber = () => currentFiber || null
export const isFn = (x: any): x is Function => typeof x === "function"
export const isStr = (s: any): s is number | string =>
  typeof s === "number" || typeof s === "string"
