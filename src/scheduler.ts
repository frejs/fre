import { ITask, ITaskCallback } from './type'

const queue: ITask[] = []
let deadline: number = 0
const threshold: number = 1000 / 60
const callbacks = []

export const schedule = (cb) => callbacks.push(cb) === 1 && postMessage()

export const scheduleWork = (callback: ITaskCallback): void => {
  const currentTime = getTime()
  const job = {
    callback,
    time: currentTime + 3000,
  }
  queue.push(job)
  schedule(flushWork)
}

const postMessage = (() => {
  const cb = () => callbacks.splice(0, callbacks.length).forEach((c) => c())
  if (typeof MessageChannel !== 'undefined') {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = cb
    return () => port2.postMessage(null)
  }
  return () => setTimeout(cb)
})()

const flush = (initTime: number): boolean => {
  let currentTime = initTime
  let job = queue[0]

  while (job) {
    const timeout = job.time <= currentTime
    if (!timeout && shouldYield()) break

    const callback = job.callback
    job.callback = null

    const next = callback(timeout)
    if (next) {
      job.callback = next as any
    } else {
      queue.shift()
    }
    job = queue[0]
    currentTime = getTime()
  }
  return !!job
}

const flushWork = (): void => {
  const currentTime = getTime()
  deadline = currentTime + threshold
  flush(currentTime) && schedule(flushWork)
}

export const shouldYield = (): boolean => {
  return getTime() >= deadline
}

const getTime = () => performance.now()
