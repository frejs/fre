import { options } from 'fre'
import { Fiber, Component } from '../../src/type'

options.updateHook = fiber => {
  if (
    fiber.type?.tag === fiber.MEMO &&
    fiber.dirty == 0 &&
    !shouldUpdate(fiber.oldProps, fiber.props)
  ) {
    cloneChildren(fiber)
    return
  }
}

export function memo(fn: Component) {
  fn.tag = 5
  return fn
}

function cloneChildren(WIP: Fiber) {
  if (!WIP.child) return
  let child = WIP.child
  let newChild = child
  newChild.op = 0
  WIP.child = newChild
  newChild.parent = WIP
  newChild.sibling = null
}

function shouldUpdate<T extends Object>(a: T, b: T) {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}
