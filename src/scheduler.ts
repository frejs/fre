import { ITask, ITaskCallback, IVoidCb } from './type'
import { isFn } from './reconciler'

let taskQueue: ITask[] = []
let currentCallback: ITaskCallback | undefined
let frameDeadline: number = 0
const frameLength: number = 5

export const scheduleCallback = (callback: ITaskCallback): void => {
  const currentTime = getTime()
  const timeout = 3000
  const dueTime = currentTime + timeout

  let newTask = {
    callback,
    dueTime,
  }

  taskQueue.push(newTask)
  currentCallback = flush as ITaskCallback
  planWork()
}

const flush = (iniTime: number): boolean => {
  let currentTime = iniTime
  let currentTask = peek(taskQueue)

  while (currentTask) {
    const timeout = currentTask.dueTime <= currentTime
    if (!timeout && shouldYeild()) break

    let callback = currentTask.callback
    currentTask.callback = null

    let next = isFn(callback) && callback(timeout)
    next ? (currentTask.callback = next) : taskQueue.shift()

    currentTask = peek(taskQueue)
    currentTime = getTime()
  }

  return !!currentTask
}

const peek = (queue: ITask[]) => {
  queue.sort((a, b) => a.dueTime - b.dueTime)
  return queue[0]
}

const flushWork = (e): void => {
  if (e.data) {
    currentEffect()
  } else if (isFn(currentCallback)) {
    let currentTime = getTime()
    frameDeadline = currentTime + frameLength
    let more = currentCallback(currentTime)
    more ? planWork() : (currentCallback = null)
  }
}

let currentEffect = null

export const planWork: any = (() => {
  if (typeof MessageChannel !== 'undefined') {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = flushWork
    return (cb) => {
      cb && (currentEffect = cb)
      port2.postMessage(cb ? true : false)
    }
  }
  return (cb: any) => setTimeout(flushWork || cb)
})()

export const shouldYeild = (): boolean => {
  return getTime() >= frameDeadline
}

export const getTime = () => performance.now()
