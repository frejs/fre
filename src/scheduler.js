import { push, pop, peek } from './heapy'

let taskQueue = []
let currentTask = null
let currentCallback = null
let inMC = false
let frameLength = 5
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

  requestHostCallback(flushWork)

  return newTask
}
function requestHostCallback (cb) {
  currentCallback = cb
  if (!inMC) {
    inMC = true
    planWork()
  }
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
    frameDeadline = currentTime + frameLength
    let moreWork = currentCallback(currentTime)
    if (!moreWork) {
      inMC = false
      currentCallback = null
    } else {
      planWork()
    }
  } else inMC = false
}

function planWork () {
  port ? port.postMessage(null) : setTimeout(performWork, 0)
}

export function shouldYeild () {
  return getTime() > frameDeadline
}

const getTime = () => performance.now()

const channel = new MessageChannel()
const port = channel.port2
channel.port1.onmessage = portMessage
