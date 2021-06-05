import {
  IFiber,
  FreElement,
  FC,
  Attributes,
  HTMLElementEx,
  FreNode,
  IRef,
  IEffect,
} from "./type"
import { createElement, updateElement } from "./dom"
import { resetCursor } from "./hook"
import { scheduleWork, shouldYield, schedule } from "./scheduler"
import { isArr, createText } from "./h"

let currentFiber: IFiber
let finish = null
let effect = null

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
  done?: () => void
): void => {
  const rootFiber = {
    node,
    props: { children: vnode },
    done,
  } as IFiber
  dispatchUpdate(rootFiber)
}

export const dispatchUpdate = (fiber?: IFiber) => {
  if (fiber && !(fiber.lane & LANE.DIRTY)) {
    fiber.lane = LANE.UPDATE | LANE.DIRTY
    fiber.sibling = null
    effect = fiber
    scheduleWork(reconcileWork as any, fiber)
  }
}

const reconcileWork = (WIP?: IFiber): boolean => {
  while (WIP && !shouldYield()) WIP = reconcile(WIP)
  if (WIP) return reconcileWork.bind(null, WIP)
  if (finish) commitWork(finish)
  return null
}

const reconcile = (WIP: IFiber): IFiber | undefined => {
  isFn(WIP.type) ? updateHook(WIP) : updateHost(WIP)
  if (WIP.child) return WIP.child
  while (WIP) {
    if (!finish && WIP.lane & LANE.DIRTY) {
      finish = WIP
      WIP.lane &= ~LANE.DIRTY
      return null
    }
    finishWork(WIP)
    if (WIP.sibling) return WIP.sibling
    WIP = WIP.parent
  }
}

const finishWork = (WIP) => {
  // TODO: simlify this implemention
  if (isFn(WIP.type)) {
    invokeHooks(WIP)
    // return
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
  reconcileChildren(WIP, children)
}

const updateHost = (WIP: IFiber): void => {
  WIP.parentNode = getParentNode(WIP) as any

  if (!WIP.node) {
    if (WIP.type === "svg") WIP.lane |= LANE.SVG
    WIP.node = createElement(WIP) as HTMLElementEx
  }
  reconcileChildren(WIP, WIP.props.children)
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

const reconcileChildren = (WIP: any, children: FreNode): void => {
  let aCh = WIP.kids || [],
    bCh = (WIP.kids = arrayfy(children) as any),
    aHead = 0,
    bHead = 0,
    aTail = aCh.length - 1,
    bTail = bCh.length - 1,
    keyed = null

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aTail], bCh[bTail])) break
    clone(aCh[aTail--], bCh[bTail--], LANE.UPDATE)
  }

  while (aHead <= aTail && bHead <= bTail) {
    if (!same(aCh[aHead], bCh[bHead])) break
    clone(aCh[aHead++], bCh[bHead++], LANE.UPDATE)
  }

  if (aHead > aTail) {
    while (bHead <= bTail) {
      let c = bCh[bTail--]
      c.lane = LANE.INSERT
    }
  } else if (bHead > bTail) {
    while (aHead <= aTail) {
      let c = aCh[aTail--]
      c.lane = LANE.REMOVE
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
      let c = bCh[bTail--]
      let idx = keyed[c.key]
      if (idx != null) {
        clone(aCh[idx], c, LANE.INSERT)
        delete keyed[c.key]
      } else {
        c.lane = LANE.INSERT
      }
    }
    for (const k in keyed) {
      let c = aCh[keyed[k]]
      c.lane = LANE.REMOVE
    }
  }

  for (var i = bCh.length - 1, prev = null; i >= 0; i--) {
    const child = bCh[i]
    child.parent = WIP
    if (i === bCh.length - 1) {
      if (WIP.lane & LANE.SVG) {
        child.lane |= LANE.SVG
      }
      WIP.child = child
    } else {
      prev.sibling = child
    }
    prev = child
  }
}

function clone(a, b, lane) {
  b.lastProps = a.props
  b.node = a.node
  b.kids = a.kids
  b.hooks = a.hooks
  b.ref = a.ref
  b.lane = lane
}

const commitWork = (fiber: IFiber): void => {
  let eff = fiber
  while (eff) {
    commit(eff)
    eff = eff.next
  }
  fiber.done?.()
  finish = null
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
      schedule(() => side(hooks.effect))
    }
  }
}

const commit = (fiber: IFiber): void => {
  let { lane, parentNode, node, ref } = fiber
  if (isFn(fiber.type)) return
  if (lane & LANE.REMOVE) {
    kidsRefer(fiber.kids)
    parentNode.removeChild(fiber.node)
    refer(ref, null)
    fiber.lane = 0
    return
  }
  if (lane & LANE.UPDATE) {
    updateElement(node, fiber.lastProps || {}, fiber.props)
  }
  if (lane & LANE.INSERT) {
    let sibling = fiber.sibling
    if (sibling) sibling.prev = fiber
    parentNode.insertBefore(node, fiber.prev?.node)
  }
  refer(ref, node)
}

const same = (a, b) => {
  return a && b && (a.key === b.key) && (a.type === b.type)
}

const arrayfy = (arr) => (!arr ? [] : isArr(arr) ? arr : [arr])

const refer = (ref: IRef, dom?: HTMLElement): void => {
  if (ref)
    isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement })!.current = dom)
}

const kidsRefer = (kids: any): void => {
  kids.forEach((kid) => {
    kid.kids && kidsRefer(kid.kids)
    refer(kid.ref, null)
  })
}

const side = (effects: IEffect[]): void => {
  effects.forEach((e) => e[2] && e[2]())
  effects.forEach((e) => (e[2] = e[0]()))
  effects.length = 0
}

export const getCurrentFiber = () => currentFiber || null
export const isFn = (x: any): x is Function => typeof x === "function"
export const isStr = (s: any): s is number | string =>
  typeof s === "number" || typeof s === "string"
