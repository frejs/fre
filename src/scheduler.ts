import { ITask, ITaskCallback } from './type'

const queue: ITask[] = []
const threshold: number = 1000 / 60
const unit = []
let deadline: number = 0

export const schedule = (cb) => unit.push(cb) === 1 && postMessage()

export const scheduleWork = (callback: ITaskCallback, time: number): void => {
  const job = {
    callback,
    time,
  }
  queue.push(job)
  schedule(flushWork)
}

const postMessage = (() => {
  const cb = () => unit.splice(0, unit.length).forEach((c) => c())
  if (typeof MessageChannel !== 'undefined') {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = cb
    return () => port2.postMessage(null)
  }
  return () => setTimeout(cb)
})()

const flushWork = (): void => {
  deadline = getTime() + threshold
  let job = sortAndPeek(queue)
  while (job && !shouldYield()) {
    const callback = job.callback as any
    job.callback = null
    const next = callback()
    if (next) {
      job.callback = next as any
    } else {
      queue.shift()
    }
    job = sortAndPeek(queue)
  }
  job && schedule(flushWork)
}

export const shouldYield = (): boolean => {
  return (navigator as any)?.scheduling?.isInputPending() || getTime() >= deadline
}

export const getTime = () => performance.now()

const sortAndPeek = (queue: ITask[]) => queue.sort((a, b) => a.time - b.time)[0]
