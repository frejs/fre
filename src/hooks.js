import { scheduleUpdate, currentInstance } from './reconciler'
let cursor = 0

function update(k, v) {
  scheduleUpdate(this, k, v)
}
export function resetCursor() {
  cursor = 0
}
export function useState(initial) {
  let key = '$' + cursor
  let setter = update.bind(currentInstance, key)
  if (currentInstance) cursor++
  let state = currentInstance ? currentInstance.state : initial
  if (typeof state === 'object' && key in state) {
    return [state[key], setter]
  }
  state = initial
  return [state, setter]
}
