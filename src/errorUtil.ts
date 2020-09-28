import { getCurrentFiber, update } from './reconciler'


let freErrorNode: Node = document.createElement('fre')
let hasRegisterListener = false

export function dispatchEvent(cb) {
  const evt = document.createEvent('customEvent')
  //@ts-ignore
  evt.initCustomEvent('fre-error', false, true, cb)
  freErrorNode.dispatchEvent(evt)
}

export function registerErrorListener() {
  if (hasRegisterListener) {
    return
  }

  hasRegisterListener = true

  const handleError = (e) => {
    const current = getCurrentFiber()
    if (typeof e.error?.then === 'function') {
      current.lane = false
      current.hooks.list.forEach((h: any) => (h[3] ? (h[2] = 1) : h.length > 3 ? (h[2] = 2) : null))
      update(current)
    }
  }
  window.addEventListener('error', handleError)

  freErrorNode.addEventListener('fre-error', (event: CustomEvent) => {
    if (typeof event.detail === 'function') {
      event.detail()
    }
  })
}
