import { ITask, ITaskCallback } from './type'
import { isFn } from './reconciler'

const macroTask: ITask[] = []
let currentCallback: ITaskCallback | undefined
let currentEffect = null
let frameDeadline: number = 0
const frameLength: number = 5

export const scheduleCallback = (callback: ITaskCallback): void => {
  const currentTime = getTime()
  const newTask = {
    callback,
    time: currentTime + 3000,
  }

  macroTask.push(newTask)
  currentCallback = flush as ITaskCallback
  postMessage()
}

const flush = (initTime: number): boolean => {
  let currentTime = initTime
  let currentTask = peek(macroTask)

  while (currentTask) {
    const timeout = currentTask.time <= currentTime
    if (!timeout && shouldYeild()) break

    const callback = currentTask.callback
    currentTask.callback = null

    const next = isFn(callback) && callback(timeout)
    next ? (currentTask.callback = next) : macroTask.shift()

    currentTask = peek(macroTask)
    currentTime = getTime()
  }

  return !!currentTask
}

const peek = (queue: ITask[]) => {
  queue.sort((a, b) => a.time - b.time)
  return queue[0]
}

const flushWork = (e: { data: any }): void => {
  if (e?.data) {
    currentEffect()
  } else if (isFn(currentCallback)) {
    const currentTime = getTime()
    frameDeadline = currentTime + frameLength
    const more = currentCallback(currentTime)
    more ? postMessage() : (currentCallback = null)
  }
}

export const postMessage: any = (() => {
  if (typeof MessageChannel !== 'undefined') {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = flushWork
    return (cb: any) => {
      cb && (currentEffect = cb)
      port2.postMessage(cb ? true : false)
    }
  }
  return (cb: any) => setTimeout(cb || flushWork)
})()

export const shouldYeild = (): boolean => {
  return getTime() >= frameDeadline
}

export const getTime = () => performance.now()
