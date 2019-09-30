let firstTask = null
let isPerform = false

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
    if (!isPerform) {
      requestHostCallback(flushWork)
    }
  }

  return newTask
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
