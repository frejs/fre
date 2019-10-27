export function useSuspense (promise) {
  let status = 'pending'
  let result
  let currentState = null
  let suspense = arg =>
    promise(arg).then(res => {
      status = 'success'
      result = res
    })
  return {
    read (state) {
      if (currentState !== state) {
        status = 'pending'
        currentState = state
      }
      if (status === 'pending') {
        throw suspense(state)
      } else {
        return result
      }
    }
  }
}
