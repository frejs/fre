import { scheduleUpdate, currentInstance } from '../src/reconciler'
let hooks = new WeakMap() //Couter():[]

export function useState(initial) {
  let setter = v => {
    scheduleUpdate(v)
  }
  let state = currentInstance ? currentInstance.state : initial
  state = !state ? initial : state
  return [state, setter]
}
