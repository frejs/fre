import { IFiber, ITask, ITaskCallback } from "./type"

const queue: ITask[] = []
const threshold: number = 1000 / 60
const transitions = []
let deadline: number = 0

export const startTransition = (cb) => {
  transitions.push(cb) && runTransition()
}

export const schedule = (callback: any): void => {
  queue.push({ callback } as any)
  startTransition(flush)
}

const transitionRunnerFactory = (useMicrotasks: boolean) => {
  const cb = () => transitions.splice(0, 1).forEach((c) => c())

  if (useMicrotasks) {
    if (typeof queueMicrotask !== "undefined") {
      return () => queueMicrotask(cb)
    }
    const resolvedPromise = Promise.resolve()
    return () => resolvedPromise.then(cb)
 }

  if (typeof MessageChannel !== "undefined") {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = cb
    return () => port2.postMessage(null)
  }
  return () => setTimeout(cb)
}

const runTransitionAsTask = transitionRunnerFactory(false)
const runTransitionAsMicroTask = transitionRunnerFactory(true)

let runTransition = runTransitionAsMicroTask

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
  const isInputPending =
    (navigator as any)?.scheduling?.isInputPending() || getTime() >= deadline
  runTransition = isInputPending ? runTransitionAsTask : runTransitionAsMicroTask
  return isInputPending
}

export const getTime = () => performance.now()

const peek = (queue: ITask[]) => queue[0]
