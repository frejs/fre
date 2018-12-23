import { rerender } from './render'

const override = Object.create(null)
const deleted = Object.create(null)

export function observe(state) {
  if (Object.keys(override).length > 0) {
    state = { ...state,...override }
  }

  return proxy(state)
}

function proxy(obj) {
  function get(key) {
    let value
    if (!deleted[key]) value = override[key] || obj[key]
    if (typeof value === 'object') {
      value = proxy(value)
      override[key] = value
    }
    return value
  }

  return new Proxy({}, {
    get(_, key) {
      return get(key)
    },
    set(_, key, val) {
      override[key] = val
      delete deleted[key]
      rerender()
      return true
    }
  })
}
