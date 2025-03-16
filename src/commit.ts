import { FiberFinish, FiberHost, HTMLElementEx, Fiber, Ref, TAG } from './type'
import { updateElement } from './dom'
import { isFn } from './reconcile'

export const commit = (fiber?: FiberFinish) => {
  if (!fiber) {
    return
  }
  const { op, before, elm } = fiber.action || {}
  if (op & TAG.INSERT || op & TAG.MOVE) {
    if (fiber.isComp && fiber.child) {
      fiber.child.action.op |= fiber.action.op
    } else {
      fiber.parentNode.insertBefore(elm.node, before?.node)
    }
  }
  if (op & TAG.UPDATE) {
    if (fiber.isComp && fiber.child) {
      fiber.child.action.op |= fiber.action.op
    } else {
      updateElement(
        fiber.node,
        (fiber.old as FiberHost).props || {},
        (fiber as FiberHost).props
      )
    }
  }

  refer(fiber.ref, fiber.node)

  fiber.action = null

  commitSibling(fiber.child)
  commitSibling(fiber.sibling)
}

function commitSibling(fiber?: FiberFinish) {
  if (fiber?.memo) {
    commitSibling(fiber.sibling)
  } else {
    commit(fiber)
  }
}

const refer = (ref?: Ref<HTMLElementEx>, dom?: HTMLElementEx) => {
  if (ref) isFn(ref) ? ref(dom) : (ref.current = dom)
}

const kidsRefer = (kids: Fiber[]) => {
  kids.forEach((kid) => {
    kid.kids && kidsRefer(kid.kids)
    refer(kid.ref, null)
  })
}

export const removeElement = (fiber: Fiber) => {
  if (fiber.isComp) {
    fiber.hooks && fiber.hooks.list.forEach((e) => e[2] && e[2]())
    fiber.kids.forEach(removeElement)
  } else {
    // @ts-expect-error
    fiber.parentNode.removeChild(fiber.node)
    kidsRefer(fiber.kids)
    refer(fiber.ref, null)
  }
}
