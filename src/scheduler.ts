import { push, pop, peek } from './heapify'
import { ITask, ITaskCallback, IVoidCb } from './type'
import { isFn } from './reconciler'

let taskQueue: ITask[] = []
let currentCallback: ITaskCallback | undefined
let frameDeadline: number = 0
const frameLength: number = 5

export function scheduleCallback(callback: ITaskCallback): void {
  const currentTime = getTime()
  const timeout = 3000
  const dueTime = currentTime + timeout

  let newTask = {
    callback,
    dueTime
  }

  push(taskQueue, newTask)
  currentCallback = flush as ITaskCallback
  planWork(null)
}

function flush(iniTime: number): boolean {
  let currentTime = iniTime
  let currentTask = peek(taskQueue)

  while (currentTask) {
    const timeout = currentTask.dueTime <= currentTime
    if (!timeout && shouldYeild()) break

    let callback = currentTask.callback
    currentTask.callback = null

    let next = isFn(callback) && callback(timeout)
    next ? (currentTask.callback = next) : pop(taskQueue)

    currentTask = peek(taskQueue)
    currentTime = getTime()
  }

  return !!currentTask
}

function flushWork(): void {
  if (isFn(currentCallback)) {
    let currentTime = getTime()
    frameDeadline = currentTime + frameLength
    let more = currentCallback(currentTime)
    more ? planWork(null) : (currentCallback = null)
  }
}

export const planWork: (cb?: IVoidCb | undefined) => number | void = (() => {
  if (typeof MessageChannel !== 'undefined') {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = flushWork
    return (cb?: IVoidCb) =>
      cb ? requestAnimationFrame(cb) : port2.postMessage(null)
  }
  return (cb?: IVoidCb) => setTimeout(cb || flushWork)
})()

export function shouldYeild(): boolean {
  return getTime() >= frameDeadline
}

const getTime = () => performance.now()
