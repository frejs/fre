import { h, useState, useEffect } from '../src'

export function withSuspense(fn) {
  let error = null
  let data = null
  let component = null
  let last = null

  return next => {
    if (last != next) {
      data = null
      last = next
    }
    if (error) throw error
    if (data) return data
    if (component) return h(component, next)
    throw fn(next).then(
      res => (res.default ? (component = res.default) : (data = res)),
      err => (error = err)
    )
  }
}

export function withContext(defaultValue) {
  const listeners = new Set()
  let backupValue = defaultValue

  return () => {
    const [value, setValue] = useState(backupValue)

    useEffect(() => {
      backupValue = value
      listeners.forEach(f => f !== setValue && f(value))
    }, [value])

    useEffect(() => {
      listeners.add(setValue)
      return () => {
        listeners.delete(setValue)
      }
    }, [])

    return [value, setValue]
  }
}
