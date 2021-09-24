import { ITask } from './type'

const queue: ITask[] = []
const threshold: number = 5

let deadline: number = 0

export const schedule = (task: any): void => {
  queue.push(task) && postTask()
}

const task = (pending: boolean) => {
  if (!pending && typeof Promise !== 'undefined') {
    // TODO: queueMicrotask
    return () => Promise.resolve().then(flush)
  }
  if (typeof MessageChannel !== 'undefined') {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = flush
    return () => port2.postMessage(null)
  }
  return () => setTimeout(flush)
}

let postTask = task(false)

const flush = (): void => {
  let task, next
  deadline = getTime() + threshold // TODO: heuristic algorithm
  while ((task = queue.pop()) && !shouldYield()) {
    ;(next = task()) && queue.push(next) && schedule(next)
  }
}

export const shouldYield = (): boolean => {
  const pending = getTime() >= deadline
  postTask = task(pending)
  return pending
}

export const getTime = () => performance.now()
