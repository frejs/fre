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
let actions = []

export const enum LANE {
  UPDATE = 1 << 1,
  INSERT = 1 << 2,
  REMOVE = 1 << 3,
  SVG = 1 << 4,
  DIRTY = 1 << 5,
  HEAD = 1 << 6,
  NOWORK = 1 << 7,
}

export const render = (vnode: FreElement, node: Node): void => {
  const rootFiber = {
    node,
    props: { children: vnode },
  } as IFiber
  update(rootFiber)
}

export const update = (fiber?: IFiber) => {
  if (fiber && !(fiber.lane & LANE.DIRTY)) {
    fiber.lane = LANE.UPDATE | LANE.DIRTY
    schedule(() => {
      effect = fiber
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
  }
  return null
}

const capture = (WIP: IFiber): IFiber | undefined => {
  WIP.isComp = isFn(WIP.type)
  if (WIP.isComp) {
    if ((WIP.type as FC).memo && WIP.oldProps) {
      let scu = (WIP.type as FC).shouldUpdate || shouldUpdate
      if (!scu(WIP.props, WIP.oldProps) && WIP.lane === LANE.UPDATE) {
        // fast-fix
        while (WIP) {
          if (WIP.sibling) return WIP.sibling
          WIP = WIP.parent
        }
      }
    }
    updateHook(WIP)
  } else {
    updateHost(WIP)
  }
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
  if (WIP.isComp) {
    if (WIP.hooks) {
      side(WIP.hooks.layout)
      schedule(() => side(WIP.hooks.effect))
    }
    if (WIP.lane > 2) {
      // fast-fix
      WIP.child.lane |= WIP.lane
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
    bCh = (WIP.kids = arrayfy(children) as any)
  let aIdx = {},
    bIdx = {}

  for (i = 0; i < aCh.length; i++) {
    aIdx[key(aCh[i])] = i
  }
  for (i = 0; i < bCh.length; i++) {
    bIdx[key(bCh[i])] = i
  }

  for (var i = 0, j = 0, prev = null; i < aCh.length || j < bCh.length; ) {
    let b = bCh[j],
      a = aCh[i]

    if (a.type !== b.type) {
      add(b, i)
      remove(i)
      i++
      j++
    } else if (a === null) {
      i++
    } else if (bCh.length <= j) {
      remove(i)
      i++
    } else if (aCh.length <= i) {
      add(b, i)
      j++
    } else if (key(a) === key(b)) {
      i++
      j++
    } else {
      let currentNew = bIdx[key(a)]
      let wantedElmInOld = aIdx[key(b)]

      if (currentNew === undefined) {
        remove(i)
        i++
      } else if (wantedElmInOld === undefined) {
        add(b, i)
        j++
      } else {
        move(wantedElmInOld, i)
        aCh[wantedElmInOld] = null
        j++
      }
    }

    if (WIP.lane & LANE.SVG) {
      b.lane |= LANE.SVG
    }
    b.parent = WIP
    if (i > 0) {
      prev.sibling = b
    } else {
      WIP.child = b
    }
    prev = b
  }
}

const move = function (from, to) {
  actions.push({ type: 'move', from, to })
}
const add = function (elm, to) {
  actions.push({ type: 'add', elm: elm, to })
}
const remove = function (from) {
  actions.push({ type: 'remove', elm: from, before: from + 1 })
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

const key = (vnode) => (vnode.key == null ? vnode : vnode.key)

export const getCurrentFiber = () => currentFiber || null
export const isFn = (x: any): x is Function => typeof x === 'function'
export const isStr = (s: any): s is number | string =>
  typeof s === 'number' || typeof s === 'string'
