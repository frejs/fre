import { IFiber, IRef, } from "./type"
import { updateElement } from "./dom"
import { getKid, isFn, LANE } from './reconcile'

export const commit = (fiber: IFiber): void => {
  let d = fiber
  let e = d.e
  fiber.e = null
  do {
    let s = e.s
    while (s && isFn(s.type)) {
      s = getKid(s)
    }
    e.s = s
    insert(e)
  } while (e = e.e)

  while (d = d.d) remove(d)
  fiber.d = null
}

const insert = (fiber: IFiber): void => {
  let { lane, parentNode, node, ref } = fiber
  let s = fiber.s
  if (s) s.prev = fiber
  if (lane & LANE.UPDATE) {
    updateElement(node, fiber.lastProps || {}, fiber.props)
  }
  if (lane & LANE.INSERT) {
    const after = fiber.prev?.node
    parentNode.insertBefore(node, after)
  }
  refer(ref, node)
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
    kidsRefer(d.kids)
    d.parentNode.removeChild(d.node)
    refer(d.ref, null)
  }
}