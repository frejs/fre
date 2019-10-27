export function createSuspense (promise) {
  let pending = true
  let result
  let currentState = null

  return {
    useSuspense (state) {
      if (currentState !== state) {
        pending = true
        currentState = state
      }
      if (pending) {
        throw promise(state).then(res => {
          pending = false
          result = res
        })
      } else {
        return result
      }
    }
  }
}
