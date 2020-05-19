import { Heap, Task } from './type'

/* Largely inspired by follows:
  https://github.com/facebook/react/blob/master/packages/scheduler/src/SchedulerMinHeap.js
  https://github.com/jviide/sorted-queue
*/
export function push(heap: Heap, node: Task): void {
  const i = heap.length
  heap.push(node)
  siftUp(heap, node, i)
}

export function pop(heap: Heap): Task | null {
  const first = heap[0]
  if (!first) return null
  const last = heap.pop()
  if (last !== first) {
    heap[0] = last
    siftDown(heap, last, 0)
  }
  return first
}

function siftUp(heap: Heap, node: Task, i: number): void {
  while (i > 0) {
    const pi = (i - 1) >>> 1
    const parent = heap[pi]
    if (cmp(parent, node) <= 0) return
    heap[pi] = node
    heap[i] = parent
    i = pi
  }
}

function siftDown(heap: Heap, node: Task, i: number): void {
  for (; ;) {
    const li = i * 2 + 1
    const left = heap[li]
    if (li >= heap.length) return
    const ri = li + 1
    const right = heap[ri]
    const ci = ri < heap.length && cmp(right, left) < 0 ? ri : li
    const child = heap[ci]
    if (cmp(child, node) > 0) return
    heap[ci] = node
    heap[i] = child
    i = ci
  }
}

function cmp(a: Task, b: Task): number {
  return a.dueTime - b.dueTime
}

export function peek(heap: Heap): Task | null {
  return heap[0] || null
}
