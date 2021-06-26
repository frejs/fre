import { IFiber, IRef, } from "./type"
import { updateElement } from "./dom"
import { getKid, isFn, LANE } from './reconcile'

export const commit = (fiber: IFiber): void => {
  let d = fiber
  let e = d.e
  fiber.e = null
  do {
    while (e.s && isFn(e.s.type)) {
      e.s = getKid(e.s)
    }
    insert(e)
  } while (e = e.e)

  while (d = d.d) remove(d)
  fiber.d = null
}

const insert = (fiber: IFiber): void => {
  let s = fiber.s
  if (s) s.prev = fiber
  if (fiber.lane & LANE.UPDATE) {
    updateElement(fiber.node, fiber.oldProps || {}, fiber.props)
  }
  if (fiber.lane & LANE.INSERT) {
    const after = fiber.prev?.node
    fiber.parentNode.insertBefore(fiber.node, after)
  }
  refer(fiber.ref, fiber.node)
}

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

const remove = (d) => {
  if (isFn(d.type)) {
    remove(d.child)
  } else {
    if (d.lane & LANE.REMOVE) {
      console.log(d)
      d.hooks.list.forEach((e) => e[2] && e[2]())
    }
    kidsRefer(d.kids)
    d.parentNode.removeChild(d.node)
    refer(d.ref, null)
  }
}