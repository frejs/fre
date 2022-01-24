import {
  IFiber,
  FreElement,
  FC,
  Attributes,
  HTMLElementEx,
  FreNode,
  IEffect,
} from './type'
import { createElement } from './dom'
import { resetCursor } from './hook'
import { schedule, shouldYield } from './schedule'
import { isArr, createText } from './h'
import { commit } from './commit'

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
  HEAD = 1 << 6,
  NOWORK = 1 << 7,
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
    if (!finish && WIP.lane & LANE.DIRTY) {
      finish = WIP
      WIP.lane &= ~LANE.DIRTY
      return null
    }
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

const bubble = WIP => {
  if (WIP.isComp) {
    if (WIP.hooks) {
      side(WIP.hooks.layout)
      schedule(() => side(WIP.hooks.effect))
    }
  } else {
    effect.e = WIP
    effect = WIP
  }
}

const shouldUpdate = (a, b) => {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
}

const updateHook = <P = Attributes>(WIP: IFiber): any => {
  if ((WIP.type as any).memo && !shouldUpdate(WIP.oldProps, WIP.props)) {
    return
  }
  resetCursor()
  currentFiber = WIP
  let children = (WIP.type as FC<P>)(WIP.props)
  diffKids(WIP, simpleVnode(children))
}

const updateHost = (WIP: IFiber): void => {
  WIP.parentNode = (getParentNode(WIP) as any) || {}
  if (!WIP.node) {
    if (WIP.type === 'svg') WIP.lane |= LANE.SVG
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  WIP.after = WIP.parentNode['prev']
  WIP.parentNode['prev'] = WIP.node

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
    bTail = bCh.length - 1

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aTail], bCh[bTail])) break
    clone(aCh[aTail--], bCh[bTail], LANE.UPDATE, WIP, bTail--)
  }

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aHead], bCh[bHead])) break
    bCh[bHead].lane |= LANE.HEAD
    aHead++
    bHead++
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
    let I = {},
      P = []
    for (let i = bHead; i <= bTail; i++) {
      I[bCh[i].key] = i
      P[i] = -1
    }
    for (let i = aHead; i <= aTail; i++) {
      let j = I[aCh[i].key]
      if (j != null) {
        P[j] = i
      } else {
        let c = aCh[i]
        c.lane = LANE.REMOVE
        detach.d = c
        detach = c
      }
    }
    let lis = findLis(P, bHead),
      i = lis.length - 1

    while (bHead <= bTail) {
      let c = bCh[bTail]
      if (bTail === lis[i]) {
        clone(aCh[P[bTail]], c, LANE.UPDATE, WIP, bTail--)
        i--
      } else if (P[bTail] === -1) {
        c.lane = LANE.INSERT
        linke(c, WIP, bTail--)
      } else {
        clone(aCh[P[bTail]], c, LANE.INSERT, WIP, bTail--)
      }
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
  if (WIP.isComp && WIP.lane & LANE.INSERT) {
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
  if (!same(a, b)) {
    // remove a first, insert b second.
    b.lane = LANE.INSERT
    b.kids = a.kids
    a.lane = LANE.REMOVE
    a.kids = []
    detach.d = a
    detach = a
    linke(b, WIP, i)
  } else {
    b.hooks = a.hooks
    b.ref = a.ref
    b.node = a.node
    b.oldProps = a.props
    b.lane = lane
    b.kids = a.kids
    linke(b, WIP, i)
  }
}

const same = (a, b) => {
  return a && b && a.key === b.key && a.type === b.type
}

export const arrayfy = arr => (!arr ? [] : isArr(arr) ? arr : [arr])

const side = (effects: IEffect[]): void => {
  effects.forEach(e => e[2] && e[2]())
  effects.forEach(e => (e[2] = e[0]()))
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
      l++
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
  if (hi > 0 && seq[hi - 1] <= n) {
    return hi - 1
  }
  while (hi - lo > 1) {
    let mid = (lo + hi) >> 1
    if (seq[mid] > n) {
      hi = mid
    } else {
      lo = mid
    }
  }
  return lo
}

export const getCurrentFiber = () => currentFiber || null
export const isFn = (x: any): x is Function => typeof x === 'function'
export const isStr = (s: any): s is number | string =>
  typeof s === 'number' || typeof s === 'string'
