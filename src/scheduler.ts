import { ITask, ITaskCallback } from './type'
import { isFn } from './reconciler'

const macroTask: ITask[] = []
let frameDeadline: number = 0
const frameLength: number = 5
const cbs = []

export const schedule = (cb) => cbs.push(cb) === 1 && requestMC()()

export const scheduleWork = (callback: ITaskCallback): void => {
  const currentTime = getTime()
  const newTask = {
    callback,
    time: currentTime + 3000,
  }
  macroTask.push(newTask)
  schedule(flushWork)
}

const requestMC = () => {
  const cb = () => cbs.splice(0, cbs.length).forEach((c) => c())
  if (typeof MessageChannel !== 'undefined') {
    const channel = new MessageChannel()
    channel.port1.onmessage = cb
    return () => channel.port2.postMessage(null)
  }
  return () => setTimeout(cb)
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

const flushWork = (): void => {
  const currentTime = getTime()
  frameDeadline = currentTime + frameLength
  flush(currentTime) && schedule(flushWork)
}

export const shouldYeild = (): boolean => {
  return getTime() >= frameDeadline
}

const getTime = () => performance.now()
