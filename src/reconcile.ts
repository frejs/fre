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
import { commit } from './commit'

let currentFiber: IFiber
let finish = null
let effect = null
export let deletions = []
let bbb = null

export const enum LANE {
  UPDATE = 1 << 1,
  INSERT = 1 << 2,
  REMOVE = 1 << 3,
  SVG = 1 << 4,
  DIRTY = 1 << 5,
  Suspense = 1 << 6,
  Error = 1 << 7,
  Boundary = Suspense | Error,
}
export const render = (
  vnode: FreElement,
  node: Node,
): void => {
  const rootFiber = {
    node,
    props: { children: vnode },
  } as IFiber
  dispatchUpdate(rootFiber)
}

export const dispatchUpdate = (fiber?: IFiber) => {
  if (fiber && !(fiber.lane & LANE.DIRTY)) {
    fiber.lane = LANE.UPDATE | LANE.DIRTY
    fiber.sibling = null
    effect = fiber
    schedule(reconcile.bind(null, fiber) as any)
  }
}

const reconcile = (WIP?: IFiber): boolean => {
  while (WIP && !shouldYield()) WIP = capture(WIP)
  if (WIP) return reconcile.bind(null, WIP)
  if (finish) {
    commit(finish)
    finish = null
  }
  return null
}

const capture = (WIP: IFiber): IFiber | undefined => {
  isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP)
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

const bubble = (WIP) => {
  if (isFn(WIP.type)) {
    const kid = WIP.child
    kid.sibling = WIP.sibling
    kid.lane |= WIP.lane
    invokeHooks(WIP)
  } else {
    effect.next = WIP
    effect = WIP
  }
}

const updateHook = <P = Attributes>(WIP: IFiber): void => {
  currentFiber = WIP
  resetCursor()
  try {
    var children = (WIP.type as FC<P>)(WIP.props)
  } catch (e) {
    const then = typeof e?.then === "function",
      p = getBoundary(WIP, then),
      fb = simpleVnode(p.props.fallback, e)
    if (!p || !fb) throw e
    if (then) {
      if (!p.laziness) {
        p.laziness = []
        p.child = children = fb
      }
      p.laziness.push(e)
    } else {
      children = fb
    }
  }
  isStr(children) && (children = simpleVnode(children))
  diffKids(WIP, children)
}

const updateHost = (WIP: IFiber): void => {
  WIP.parentNode = getParentNode(WIP) as any

  if (!WIP.node) {
    if (WIP.type === "svg") WIP.lane |= LANE.SVG
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  diffKids(WIP, WIP.props.children)
}

const simpleVnode = (type: any, props?: any) =>
  isStr(type) ? createText(type as string) : isFn(type) ? type(props) : type

const getParentNode = (WIP: IFiber): HTMLElement | undefined => {
  while ((WIP = WIP.parent)) {
    if (!isFn(WIP.type)) return WIP.node
  }
}

const getBoundary = (WIP: IFiber, then): IFiber | undefined => {
  while ((WIP = WIP.parent)) {
    if ((WIP.type as any).lane & (then ? LANE.Suspense : LANE.Error)) {
      return WIP
    }
  }
}

const diffKids = (WIP: any, children: FreNode): void => {
  let aCh = WIP.kids || [],
    bCh = (WIP.kids = arrayfy(children) as any),
    aHead = 0,
    bHead = 0,
    aTail = aCh.length - 1,
    bTail = bCh.length - 1,
    keyed = null

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aTail], bCh[bTail])) break
    clone(aCh[aTail--], bCh[bTail], LANE.UPDATE, WIP, bTail--)
  }

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aHead++], bCh[bHead++])) break
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
      deletions.push(c)
    }
  } else {
    if (!keyed) {
      keyed = {}
      for (let i = aHead; i <= aTail; i++) {
        let k = aCh[i].key
        if (k) keyed[k] = i
      }
    }
    while (bHead <= bTail) {
      let c = bCh[bTail]
      let idx = keyed[c.key]
      if (idx != null) {
        clone(aCh[idx], c, LANE.INSERT, WIP, bTail--)
        delete keyed[c.key]
      } else {
        c.lane = LANE.INSERT
        linke(c, WIP, bTail--)
      }
    }
    for (const k in keyed) {
      let c = aCh[keyed[k]]
      c.lane = LANE.REMOVE
      deletions.push(c)
    }
  }

  while (bHead-- > 0) {
    clone(aCh[bHead], bCh[bHead], LANE.UPDATE, WIP, bHead)
  }

}

function linke(kid, WIP, i) {
  kid.parent = WIP
  if (i === WIP.kids.length - 1) {
    if (WIP.lane & LANE.SVG) kid.lane |= LANE.SVG
    WIP.child = kid
  } else {
    WIP.p.sibling = kid
  }
  WIP.p = kid
}

function clone(a, b, lane, WIP, i) {
  b.lastProps = a.props
  b.node = a.node
  b.kids = a.kids
  b.hooks = a.hooks
  b.ref = a.ref
  b.lane = lane
  linke(b, WIP, i)
}

function invokeHooks(fiber) {
  const { hooks, lane, laziness } = fiber
  if (laziness) {
    Promise.all(laziness).then(() => {
      fiber.laziness = null
      dispatchUpdate(fiber)
    })
  }
  if (hooks) {
    if (lane & LANE.REMOVE) {
      hooks.list.forEach((e) => e[2] && e[2]())
    } else {
      side(hooks.layout)
      startTransition(() => side(hooks.effect))
    }
  }
}

const same = (a, b) => {
  const type = (c) => isFn(c.type) ? c.type.name : c.type
  return a && b && (a.key === b.key) && (type(a) === type(b))
}

const arrayfy = (arr) => (!arr ? [] : isArr(arr) ? arr : [arr])

const side = (effects: IEffect[]): void => {
  effects.forEach((e) => e[2] && e[2]())
  effects.forEach((e) => (e[2] = e[0]()))
  effects.length = 0
}

export const getCurrentFiber = () => currentFiber || null
export const isFn = (x: any): x is Function => typeof x === "function"
export const isStr = (s: any): s is number | string =>
  typeof s === "number" || typeof s === "string"
