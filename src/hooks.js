import { scheduleWork, getCurrentInstance } from './reconciler'
let cursor = 0
let oldInputs = []

function update (key, reducer, value) {
  reducer ? (value = reducer(this.state[key], value)) : value
  this.state[key] = value
  scheduleWork(this)
}
export function resetCursor () {
  cursor = 0
}
export function useState (initState) {
  return useReducer(null, initState)
}
export function useReducer (reducer, initState) {
  let current = getCurrentInstance()
  let key = '$' + cursor
  let setter = update.bind(current, key, reducer)
  if (!current) {
    return [initState, setter]
  } else {
    cursor++
    let state = current.state
    if (typeof state === 'object' && key in state) {
      return [state[key], setter]
    } else {
      current.state[key] = initState
    }
    let value = initState
    return [value, setter]
  }
}
export function useEffect (effect, inputs) {
  let current = getCurrentInstance()
  if (current) {
    let key = '$' + cursor
    current.effects[key] = useMemo(effect, inputs)
    cursor++
  }
}

export function useMemo (create, inputs) {
  return function () {
    let current = getCurrentInstance()
    if (current) {
      let hasChaged = inputs
        ? oldInputs.some((value, i) => inputs[i] !== value)
        : true
      if (hasChaged) {
        create()
      }
      oldInputs = inputs
    }
  }
}
