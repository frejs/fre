import { push, pop, peek } from './heapify'
import { Task } from './type'

let taskQueue: Task[] = []
let currentCallback: ((iniTime: number) => boolean) | null | undefined
let frameDeadline: number = 0
const frameLength: number = 5

export function scheduleCallback(callback: Function) {
  const currentTime = getTime()
  const startTime = currentTime
  const timeout = 3000
  const dueTime = startTime + timeout

  let newTask = {
    callback,
    startTime,
    dueTime
  }

  push(taskQueue, newTask)
  currentCallback = flush
  planWork(null)
}

function flush(iniTime: number) {
  let currentTime = iniTime
  let currentTask = peek(taskQueue)

  while (currentTask) {
    const didout = currentTask.dueTime <= currentTime
    if (!didout && shouldYeild()) break

    let callback = currentTask.callback
    currentTask.callback = null

    let next = callback && callback(didout)
    next ? (currentTask.callback = next) : pop(taskQueue)

    currentTask = peek(taskQueue)
    currentTime = getTime()
  }

  return !!currentTask
}

function flushWork() {
  if (currentCallback) {
    let currentTime = getTime()
    frameDeadline = currentTime + frameLength
    let more = currentCallback(currentTime)
    more ? planWork(null) : (currentCallback = null)
  }
}

export const planWork = (() => {
  if (typeof MessageChannel !== 'undefined') {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = flushWork
    return (cb: FrameRequestCallback | null) =>
      cb ? requestAnimationFrame(cb) : port2.postMessage(null)
  }
  return (cb: TimerHandler | null) => setTimeout(cb || flushWork)
})()

export function shouldYeild() {
  return getTime() >= frameDeadline
}

export const getTime = () => performance.now()
