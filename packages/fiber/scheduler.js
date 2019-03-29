export class Scheduler {
  constructor (amount = 1) {
    this.amount = amount
    this.count = 0
    this.set = new Set
    this.map = new Map
  }
  isIdle () {
    return this.count < this.amount
  }
  lock () {
    this.count++
  }
  unlock () {
    this.count--
  }
  wrap (fn) {
    this.lock()
    let f = fn()
    if (!!f && typeof f.then === 'function') {
      return e.then(res => {
        this.unlock()
        return res
      })
    } else {
      this.unlock()
      return f
    }
  }
  requestIdlePromise (options) {
    options = options || {}
    let resolve
    const promise = new Promise(res => (resolve = res))
    const resolveOut = () => {
      removeIdlePromise(this, promise)
      resolve()
    }

    promise.effect = resolveOut

    if (options.timeout) {
      const timer = setTimeout(() => promise.effect(), options.timeout)
      options.timer = timer
    }

    this.set.add(promise)
    tryIdleCall(this)
    return promise
  }

  cancelIdlePromise (promise) {
    removeIdlePromise(this, promise)
  }

  clear () {
    this.set.forEach(promise => removeIdlePromise(this, promise))
    this.count = 0
    this.set.clear()
    this.map = new Map
  }
}

function removeIdlePromise (sm, promise) {
  if (!promise) return
  if (promise.timer) clearTimeout(promise.timer)
  if (sm.map.has(promise)) {
    const handle = sm.map.get(promise)
    sm.map.delete(handle)
  }

  sm.set.delete(promise)
}

function tryIdleCall (sm) {
  if (sm.try || sm.set.size === 0) return
  sm.try = true
  setTimeout(() => {
    if (!sm.isIdle()) {
      sm.try = false
      return
    }
    setTimeout(() => {
      if (!sm.isIdle()) {
        sm.try = false
        return
      }
      resolveOneIdeleCall(sm)
      sm.try = false
    }, 0)
  }, 0)
}

function resolveOneIdeleCall (sm) {
  if (sm.set.size === 0) return
  const iterator = sm.set.values()
  const oldestPromise = iterator.next().value

  oldestPromise.effect()
  setTimeout(() => tryIdleCall(sm), 0)
}
