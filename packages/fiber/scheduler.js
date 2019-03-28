export class Scheduler {
  constructor (num = 1) {
    this.num = num
    this.count = 0
    this.iC = new Set()
    this.PH = new Map()
    this.HP = new Map()
  }
  isIdle () {
    return this.count < this.num
  }
  lock () {
    this.count++
  }
  unlock () {
    this.count--
  }
  wrap (fn) {
    this.lock()
    let isPromise = fn()
    try {
      return isPromise.then(res => {
        this.unlock()
        return res
      })
    } finally {
      this.unlock()
      return isPromise
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

    this.iC.add(this)
    tryIdleCall(this)

    return promise
  }

  cancelIdlePromise (promise) {
    removeIdlePromise(this, promise)
  }

  clear () {
    this.iC.forEach(promise => removeIdlePromise(this, promise))
    this.count = 0
    this.iC.clear()
    this.HP = new Map()
    this.PH = new Map()
  }
}

function removeIdlePromise (sm, promise) {
  if (!promise) return
  if (promise.timer) clearTimeout(promise.timer)
  if (sm.PH.has(promise)) {
    const handle = sm.PH.get(promise)
    sm.PH.delete(handle)
    sm.HP.delete(promise)
  }

  scheduler.iC.delete(promise)
}

function tryIdleCall (sm) {
  if (sm.try || sm.iC.size === 0) return
  sm.try = true
  setTimeout(() => {
    if (!sm.isIdle()) {
      sm.try = false
      return
    }
    setTimeout(() => {
      if (sm.isIdle()) {
        sm.try = false
        return
      }
      resolveOneIdeleCall(sm)
      sm.try = false
    }, 0)
  }, 0)
}

function resolveOneIdeleCall (sm) {
  if (sm.iC.size === 0) return
  const iterator = sm.iC.values()
  const oldestPromise = iterator.next().value

  oldestPromise.effect()
  setTimeout(() => tryIdleCall(sm), 0)
}
