import { scheduleUpdate, currentInstance, resetInstance } from './reconciler'
let cursor = 0
let oldInputs = []

function update(key, reducer, value) {
  reducer ? (value = reducer(this.state[key], value)) : value
  scheduleUpdate(this, key, value)
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
export function useEffect(effect, inputs) {
  if (currentInstance) {
    let key = '$' + cursor
    currentInstance.effects[key] = useMemo(effect, inputs)
    cursor++
  }
}

export function useMemo(create, inputs) {
  return function() {
    if (currentInstance) {
      let hasChaged = inputs.length
        ? oldInputs.some((value, i) => inputs[i] !== value)
        : true
      if (hasChaged) {
        create()
      }
      oldInputs = inputs
    }
  }
}
