import { scheduleUpdate, currentInstance } from '../src/reconciler'
let cursor = -1

function update(k, v) {
  scheduleUpdate(this, k, v)
}
export function resetCursor() {
  cursor = 0
}
export function useState(initial) {
  let key = cursor + 'hook'
  cursor++
  let setter = update.bind(currentInstance, key)
  let state = currentInstance ? currentInstance.state : initial
  if (typeof state === 'object' && key in state) {
    return [state[key], setter]
  }
  let v = initial
  return [v, setter]
}
