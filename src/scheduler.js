import { push, pop, peek } from './min-heap'

let taskQueue = []
let taskId = 1

let currentTask = null
let currentCallback = null
let inMC = false

export function scheduleCallback (callback) {
  const currentTime = getTime()
  let startTime = currentTime
  let timeout = 5000 // idle
  let dueTime = startTime + timeout

  let newTask = {
    id: taskId++,
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
    port.postMessage(null)
  }
}
function flushWork (iniTime) {
  try {
    let currentTime = iniTime
    currentTask = peek(taskQueue)

    let callback = currentTask.callback
    if (callback) {
      let didout = currentTask.dueTime < currentTime
      callback(didout)
    }
  } finally {
    currentTask = null
  }
}

function portMessage () {
  if (currentCallback) {
    let currentTime = getTime()
    let moreWork = currentCallback(currentTime)
    moreWork
      ? port.postMessage(null)
      : (inMC = false) && (currentCallback = null)
  } else inMC = false
}

const getTime = () => performance.now()

const channel = new MessageChannel()
const port = channel.port2
channel.port1.onmessage = portMessage
