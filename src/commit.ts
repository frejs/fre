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
  let suspenseNodeComment = null
  let p = fiber?.parent
  let parent = null
  while (p) {
    parent = p.node
    if (parent && parent.nodeType !== 8) break
    if (parent?.nodeType === 8 && parent.nodeValue === 'Suspense') {
      suspenseNodeComment = parent
    }
    p = p.parent
  }

  if ((op & TAG.INSERT || op & TAG.MOVE) && !fiber.isComp) {
    if (parent) {
      parent.insertBefore(cur?.node, suspenseNodeComment ?? ref?.node)
    }
  }
  if ((op & TAG.UPDATE) && !fiber.isComp) {
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
