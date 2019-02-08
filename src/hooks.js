import { scheduleUpdate, currentInstance } from '../src/reconciler'

export function useState(initial) {
  let setter = v => {
    scheduleUpdate(v)
  }
  let state = currentInstance ? currentInstance.state[0] : initial
  state = !state ? initial : state
  return [state, setter]
}
