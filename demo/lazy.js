import { h } from '../src/h'

const cache = {}

export function lazy(fn) {
  const key = Symbol()
  cache[key] = {
    data: undefined,
    error: undefined,
    promise: fn().then(
      data => (cache[key].data = data.default),
      error => (cache[key].error = error)
    )
  }
  return function Lazy(props) {
    if (cache[key].error) {
      throw cache[key].error
    }
    if (cache[key].data) {
      const Component = cache[key].data
      return h(Component, props)
    }
    if (cache[key].promise) {
      throw cache[key].promise
    }
    throw new Error()
  }
}
