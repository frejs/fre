'use strict'

const proxyClone = obj => {
  const override = Object.create(null)
  const deleted = Object.create(null)

  const get = name => {
    let value
    if (!deleted[name]) value = override[name] || obj[name]
    if (isObject(value)) {
      value = proxyClone(value)
      override[name] = value
    }
    if (typeof value === 'function') {
      value = value.bind(obj)
    }
    return value
  }

  return new Proxy(Object.prototype, {
    getPrototypeOf: () => Object.getPrototypeOf(obj),
    getOwnPropertyDescriptor: (target, name) => {
      let desc
      if (!deleted[name]) {
        desc =
          Object.getOwnPropertyDescriptor(override, name) ||
          Object.getOwnPropertyDescriptor(obj, name)
      }
      if (desc) desc.configurable = true
      debug('getOwnPropertyDescriptor %s = %j', name, desc)
      return desc
    },
    defineProperty: () => {
      throw new Error('Not yet implemented: defineProperty')
    },
    has: (_, name) => {
      const has = !deleted[name] && (name in override || name in obj)
      debug('has %s = %s', name, has)
      return has
    },
    get: (receiver, name) => {
      const value = get(name)
      debug('get %s = %j', name, value)
      return value
    },
    set: (_, name, val) => {
      delete deleted[name]
      override[name] = val
      debug('set %s = %j', name, val)
      return true
    },
    deleteProperty: (_, name) => {
      debug('deleteProperty %s', name)
      deleted[name] = true
      delete override[name]
    },
    ownKeys: () => {
      const keys = Object.keys(obj)
        .concat(Object.keys(override))
        .filter(unique)
        .filter(key => !deleted[key])
      debug('ownKeys %j', keys)
      return keys
    }
  })
}