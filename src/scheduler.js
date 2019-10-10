import { push, pop, peek } from './heapify'

let taskQueue = []
let currentTask = null
let currentCallback = null
let frameDeadline = 0

export function scheduleCallback (callback) {
  const currentTime = getTime()
  let startTime = currentTime
  let timeout = 5000 // idle
  let dueTime = startTime + timeout

  let newTask = {
    callback,
    startTime,
    dueTime
  }

  push(taskQueue, newTask)

  currentCallback = flushWork

  planWork()

  return newTask
}

function flushWork (iniTime) {
  try {
    return workLoop(iniTime)
  } finally {
    currentTask = null
  }
}

function workLoop (iniTime) {
  let currentTime = iniTime
  currentTask = peek(taskQueue)

  while (currentTask) {
    if (currentTask.dueTime > currentTime && shouldYeild()) break
    let callback = currentTask.callback
    if (callback) {
      currentTask.callback = null
      let next = callback()
      if (next) {
        currentTask.callback = next
      } else {
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue)
        }
      }
    } else pop(taskQueue)
    currentTask = peek(taskQueue)
  }

  return !!currentTask
}

function performWork () {
  if (currentCallback) {
    let currentTime = getTime()
    frameDeadline = currentTime + 5
    let moreWork = currentCallback(currentTime)
    if (!moreWork) {
      currentCallback = null
    } else {
      planWork()
    }
  }
}

const planWork = (() => {
  if (typeof MessageChannel !== 'undefined') {
    const channel = new MessageChannel()
    const port = channel.port2
    channel.port1.onmessage = performWork
    return () => port.postMessage(null)
  }
  return () => setTimeout(performWork, 0)
})()

export function shouldYeild () {
  return getTime() > frameDeadline
}

const getTime = () => performance.now()
