import { FiberFinish, FiberHost, HTMLElementEx, Fiber, Ref, TAG, MODE } from './type'
import { updateElement } from './dom'
import { isFn } from './reconcile'

export const commit = (fiber?: FiberFinish) => {
  if (!fiber) {
    return
  }
  if(fiber.mode & MODE.OFFSCREEN) return commitSibling(fiber.sibling)
  refer(fiber.ref, fiber.node)
  commitSibling(fiber.child)
  let { op, ref, cur } = fiber.action || {}
  let parent = fiber?.parent?.node
  let suspenseNodeComment = null
  if (parent?.nodeType === 8) {
    if (parent?.nodeValue === 'Suspense') {
      suspenseNodeComment = parent
    }
    parent = parent.parentNode as any
  }

  if (op & TAG.INSERT || op & TAG.MOVE) {
    let comment = null
    if (fiber.isComp) {
      //@ts-ignore
      comment = fiber?.node?.firstChild
    }
    parent.insertBefore(cur?.node, suspenseNodeComment ?? ref?.node)
    if (fiber.isComp) {
      fiber.node = comment
    }
  }
  if (op & TAG.UPDATE) {
    const node = fiber.node
    updateElement(
      node,
      (fiber.alternate as FiberHost)?.props || {},
      (fiber as FiberHost).props
    )
  }
  fiber.action = null
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
  kids?.forEach((kid) => {
    kid.kids && kidsRefer(kid.kids)
    refer(kid.ref, null)
  })
}

export const removeElement = (fiber: Fiber, flag: boolean = true) => {
  fiber.flag = TAG.REMOVE
  if (fiber.isComp) {
    fiber.hooks && fiber.hooks.list.forEach((e) => e[2] && e[2]())
  } else {
    if (flag) {
      (fiber.node?.parentNode as any)?.removeChild(fiber.node)
      flag = false
    }
    kidsRefer(fiber.kids)
    refer(fiber.ref, null)
  }
  fiber?.kids?.forEach(v => removeElement(v, flag))
}
