import { performWork, HOOK, updateQueue, currentWIP } from './reconciler'

// export const useState = initial => scheduleUpdate.bind(null, initial)

export function useState(initial) {
  let state
  if (currentWIP === null) {
    state = initial
  }else{
    state = initial
  }
  let setter = v => {
    updateQueue.push({
      from: HOOK,
      instance: currentWIP,
      state: v
    })
    requestIdleCallback(performWork)
  }

  return [state, setter]
}
