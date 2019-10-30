import { push, pop, peek } from './heapify'

let taskQueue = []
let currentTask = null
let currentCallback = null
let scheduling = false
let frameDeadline = 0
let frameLength = 5

export function scheduleCallback (callback) {
  const currentTime = getTime()
  let startTime = currentTime
  let timeout = 5000
  let dueTime = startTime + timeout

  let newTask = {
    callback,
    startTime,
    dueTime
  }

  push(taskQueue, newTask)

  currentCallback = flushWork

  if (!scheduling) {
    planWork()
    scheduling = true
  }

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
    if (currentTask.dueTime > currentTime && shouldYeild()) {
      break
    }
    let callback = currentTask.callback
    if (callback) {
      currentTask.callback = null
      const didout = currentTask.dueTime <= currentTime
      
      let next = callback(didout)
      if (next) {
        currentTask.callback = next
      } else {
        pop(taskQueue)
      }
    } else pop(taskQueue)

    currentTask = peek(taskQueue)
    currentTime = getTime()
  }

  return !!currentTask
}

function performWork () {
  if (currentCallback) {
    let currentTime = getTime()
    frameDeadline = currentTime + frameLength
    let moreWork = currentCallback(currentTime)

    if (moreWork) {
      planWork()
    } else {
      scheduling = false
      currentCallback = null
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
  return getTime() >= frameDeadline
}

const getTime = () => performance.now()
