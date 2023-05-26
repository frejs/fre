import { IFiber, IRef } from './type'
import { updateElement } from './dom'
import { isFn, TAG } from './reconcile'


export const commit = (fiber: any) => {
  if (!fiber) {
    return
  }
  const { op, before, elm } = fiber.action || {}
  if (op & TAG.INSERT || op & TAG.MOVE) {
    if (fiber.isComp) {
      fiber.child.action.op |= fiber.action.op
    } else {
      fiber.parentNode.insertBefore(elm.node, before?.node)
    }
  }
  if (op & TAG.UPDATE) {
    if (fiber.isComp) {
      fiber.child.action.op |= fiber.action.op
    } else {
      updateElement(fiber.node, fiber.old.props || {}, fiber.props)
    }
  }

  refer(fiber.ref, fiber.node)

  fiber.action = null

  commit(fiber.child)
  commit(fiber.sibling)
}

const refer = (ref: IRef, dom?: HTMLElement): void => {
  if (ref)
    isFn(ref) ? ref(dom) : ((ref as { current?: HTMLElement })!.current = dom)
}

const kidsRefer = (kids: any): void => {
  kids.forEach(kid => {
    kid.kids && kidsRefer(kid.kids)
    refer(kid.ref, null)
  })
}

export const removeElement = fiber => {
  if (fiber.isComp) {
    fiber.hooks && fiber.hooks.list.forEach(e => e[2] && e[2]())
    fiber.kids.forEach(removeElement)
  } else {
    fiber.parentNode.removeChild(fiber.node)
    kidsRefer(fiber.kids)
    refer(fiber.ref, null)
  }
}