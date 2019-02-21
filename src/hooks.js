import { scheduleUpdate, currentInstance } from './reconciler'
let cursor = 0

function update(k, r, v) {
  r ? (v = r(this.state[k], v)) : v
  //这里实现不太准确，目的是确保每次只执行一次
  setTimeout(() => scheduleUpdate(this, k, v))
}
export function resetCursor() {
  cursor = 0
}
export function useState(initState) {
  return useReducer(null, initState)
}
export function useReducer(reducer, initState) {
  let key = '$' + cursor
  let setter = update.bind(currentInstance, key, reducer)
  if (currentInstance) cursor++
  let state
  if (currentInstance) state = currentInstance.state
  if (typeof state === 'object' && key in state) {
    return [state[key], setter]
  } else {
    if (currentInstance) currentInstance.state[key] = initState
  }
  let value = initState
  return [value, setter]
}
