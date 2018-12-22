import { rerender, comps } from './render'

let golbal = {}
export var once = true

export function useState(state) {
  if (Object.keys(golbal).length > 0) {
    state = {
      ...state,
      ...golbal
    }
  }

  return proxy(state)
}

function proxy(state) {
  let newState = new Proxy(state, {
    get(obj, key) {
      if (golbal[key]) {
        return golbal[key]
      } else {
        return obj[key]
      }
    },
    set(obj, key, val) {
      golbal[key] = val
      obj[key] = val
      rerender()
      return true
    }
  })

  return newState
}
