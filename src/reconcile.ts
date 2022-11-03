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
  WIP.childNodes = Array.from(WIP.node.childNodes || [])
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

  for (var i = 0, prev = null; i < bCh.length; i++) {
    let newFiber = bCh[i]
    const oldFiber = aCh[i]

    if (!same(oldFiber, newFiber)) {
      if (oldFiber) {
        newFiber.lane === LANE.REMOVE
        effect.next = newFiber
        effect = effect.next
      }
      if (newFiber) {
        newFiber.lane === LANE.INSERT
        effect.next = newFiber
        effect = effect.next
      }
    } else {
      // diff
      newFiber = oldFiber
    }

    if (WIP.lane & LANE.SVG) {
      newFiber.lane |= LANE.SVG
    }
    newFiber.parent = WIP
    if (i > 0) {
      prev.sibling = newFiber
    } else {
      WIP.child = newFiber
    }
    prev = newFiber
  }
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

export const getCurrentFiber = () => currentFiber || null
export const isFn = (x: any): x is Function => typeof x === 'function'
export const isStr = (s: any): s is number | string =>
  typeof s === 'number' || typeof s === 'string'
