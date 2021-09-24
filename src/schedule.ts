import { ITask } from './type'

const queue: ITask[] = []
const threshold: number = 5

let deadline: number = 0

export const schedule = (callback: any): void => {
  queue.push({ callback } as any)
  postTask()
}

const task = (pending: boolean) => {
  if (!pending && typeof Promise !== 'undefined') {
    // TODO: queueMicrotask
    return () => queueMicrotask(flush)
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
  deadline = getTime() + threshold
  let job = peek(queue)
  while (job && !shouldYield()) {
    const { callback } = job as any
    job.callback = null
    const next = callback()
    if (next) {
      job.callback = next as any
    } else {
      queue.shift()
    }
    job = peek(queue)
  }
  job && postTask()
}

export const shouldYield = (): boolean => {
  const pending = getTime() >= deadline
  postTask = task(pending)
  return pending
}

export const getTime = () => performance.now()

const peek = (queue: ITask[]) => queue[0]
