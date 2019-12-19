import { push, pop, peek } from './heapify'

let taskQueue = []
let currentTask = null
let currentCallback = null
let frameDeadline = 0
let frameLength = 1000 / 60

export function scheduleCallback(callback) {
  const currentTime = getTime()
  let startTime = currentTime
  let timeout = 3000
  let dueTime = startTime + timeout

  let newTask = {
    callback,
    startTime,
    dueTime
  }

  push(taskQueue, newTask)
  currentCallback = flush
  planWork()
}

function flush(iniTime) {
  let currentTime = iniTime
  currentTask = peek(taskQueue)

  while (currentTask) {
    if (currentTask.dueTime > currentTime && shouldYeild()) {
      break
    }
    let callback = currentTask.callback
    currentTask.callback = null
    const didout = currentTask.dueTime <= currentTime

    let next = callback(didout)
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
    more ? planWork() : (currentCallback = null)
  }
}

export const planWork = (() => {
  if (typeof MessageChannel !== 'undefined') {
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = flushWork
    return () => port.postMessage(null)
  }
  return () => setTimeout(flushWork, 0)
})()

export function shouldYeild() {
  return getTime() >= frameDeadline
}

const getTime = () => performance.now()
