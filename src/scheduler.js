let firstTask = null
let currentTask = null
let isPerform = false
let isSchedule = false
let FD = 0
let FPS = 20
let timeoutTime = -1
let inMacro = false
let deadline = {
  didTimeout: false,
  timeRemaining: FD - performance.now()
}

function schedulerCallback (cb, dueTime, config) {
  let currentTime = performance.now()
  let dueTime = currentTime + dueTime
  let startTime

  if (config != null) {
    if (config.delay > 0) {
      startTime = currentTime + delay
    } else startTime = currentTime
  }

  let newTask = {
    cb,
    startTime,
    dueTime,
    next: null,
    prev: null
  }

  if (startTime > currentTime) {
  } else {
    insertTask(newTask, dueTime)
    if (!isPerform) requestHostCallback(flushWork, dueTime)
  }
  return newTask
}

function flushWork (didTimeout) {
  deadline.didTimeout = didTimeout
  try {
    if (didTimeout) {
      while (firstTask != null) {
        let currenTime = performance.now()
        if (firstTask.dueTime <= currenTime) {
          do {
            flushTask()
          } while (firstTask != null && firstTask.dueTime <= currenTime)
          continue
        }
        break
      }
    } else {
      if (firstTask != null) {
        do {
          flushTask()
        } while (firstTask != null && FD - performance.now() > 0)
      }
    }
  } finally {
    if (firstTask != null) {
      requestHostCallback(flushTask, firstTask.dueTime)
    } else {
      isPerform = false
    }
  }
}

function flushTask () {
  let flushed = firstTask
  let next = firstTask.next
  if (firstTask === next) {
    firstTask = null
    next = null
  } else {
    let prev = firstTask.prev
    firstTask = prev.next = next
    next.prev = prev
  }
  flushed.next = flushed.prev = null

  let cb = flushed.cb
  let dueTime = flushed.dueTime
  let prevLevel = currentLevel
  let prevDueTime = currentDueTime
  currentDueTime = dueTime

  try {
    cb(deadline)
  } finally {
    currentLevel = prevLevel
    currentDueTime = prevDueTime
  }
}

function insertTask (newTask, dueTime) {
  if (firstTask == null) {
    firstTask = firstTask.next = firstTask.prev = newTask
  } else {
    let next = null
    let task = firstTask

    do {
      if (dueTime < task.dueTime) {
        next = task
        break
      }
      task = task.next
    } while (task != firstTask)
    if (next == null) {
      next = task
    } else if (next == firstTask) {
      firstTask = newTask
    }

    let prev = next.prev
    prev.next = next.prev = newTask
    newTask.next = next
    newTask.prev = prev
  }
}

function requestHostCallback (cb, dt) {
  if (isPerform) {
    cancelHostCallback()
  }
  currentTask = cb
  if (dt < 0) {
    setTimeout(idle)
  } else if (!isSchedule) {
    defer(tick)
  }
}

function cancelHostCallback () {
  isSchedule = null
  timeoutTime = -1
}

function defer (cb) {
  rafid = requestAnimationFrame(time => {
    clearTimeout(outid)
    cb(time)
  })
  outid = setTimeout(() => {
    cancelAnimationFrame(rafid)
    cb(new Date())
  }, 100)
}

function tick (rafTime) {
  isSchedule ? defer(tick) : (isPerform = false)
  let nextTime = rafTime - FD + FPS
  if (nextTime < FPS && prevTime < FPS) {
    if (nextTime < 8) nextTime = 8
    FPS = nextTime < prevTime ? prevTime : nextTime
  } else prevTime = nextTime

  FD = rafTime + FPS
  if (!isEvent) setTimeout(idle)
}

function idle (rafTime) {
  inMacro = true
  let currentTime = performance.now()
  let didTimeout = false
  let scheduleCb = null
  let prevCb = scheduleCb

  if (FD - currentTime < 1) {
    if (prevTime < currentTime) {
      didTimeout = true
    } else {
      defer(tick)
      scheduleCb = prevCb
      return
    }
  }

  if (prevCb != null) {
    isSchedule = true
    try {
      prevCb(didTimeout)
    } finally {
      isSchedule = false
    }
  }
}
