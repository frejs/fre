import { IFiber, ITask, ITaskCallback } from "./type"
import { options } from "./reconcile"

const queue: ITask[] = []
const threshold: number = 1000 / 60
const transitions = []
let deadline: number = 0

let lastHandleMessage = null

export const startTransition = (cb) => {
  transitions.push(cb) && postMessage()
}

export const schedule = (callback: any): void => {
  queue.push({ callback } as any)
  startTransition(flush)
}

const postMessage = (() => {
  const cb = () => transitions.splice(0, 1).forEach((c) => c())

  if (typeof MessageChannel !== "undefined") {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = cb
    return () => port2.postMessage(null)
  } else {
    lastHandleMessage &&
      window.removeEventListener("message", lastHandleMessage)
    const handleMessage = (event) => {
      if (event.data == "zero-timeout-message") {
        cb()
      }
    }
    lastHandleMessage = handleMessage
    window.addEventListener("message", handleMessage)
    return () => window.postMessage("zero-timeout-message", "*")
  }
})()

const flush = (): void => {
  deadline = getTime() + threshold
  let job = peek(queue)
  while (job && !shouldYield()) {
    const { callback } = job as any
    job.callback = null
    const next = callback()
    if (next) {
      job.callback = next as any
    } else {
      queue.shift()
    }
    job = peek(queue)
  }
  job && startTransition(flush)
}

export const shouldYield = (): boolean => {
  if (options.sync) return false
  return (
    (navigator as any)?.scheduling?.isInputPending() || getTime() >= deadline
  )
}

export const getTime = () => performance.now()

const peek = (queue: ITask[]) => queue[0]
