import { IFiber, IRef, } from "./type"
import { updateElement } from "./dom"
import { isFn, LANE, deletions, config } from './reconciler'

export const commit = (fiber: IFiber): void => {
  let e = fiber.next
  fiber.next = null
  do {
    const s = e.sibling
    if (s && isFn(s.type)) {
      e.sibling = s.child
    }
    paint(e)
  } while (e = e.next)
  deletions.forEach(e => {
    if (isFn(e.type)) {
      e.child.lane = LANE.REMOVE
      paint(e.child)
    } else {
      paint(e)
    }
  })
  deletions.length = 0
  config && config.done()
}

const paint = (fiber: IFiber): void => {
  let { lane, parentNode, node, ref } = fiber
  if (lane & LANE.REMOVE) {
    kidsRefer(fiber.kids)
    parentNode.removeChild(fiber.node)
    refer(ref, null)
    fiber.lane = 0
    return
  }
  let s = fiber.sibling
  if (s) s.prev = fiber
  if (lane & LANE.UPDATE) {
    updateElement(node, fiber.lastProps || {}, fiber.props)
  }
  if (lane & LANE.INSERT) {
    parentNode.insertBefore(node, fiber.prev?.node)
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