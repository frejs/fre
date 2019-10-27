export function createResource () {
  return wrapPromise(fetchDogs)
}

function fetchDogs (num) {
  console.log('fetch users from clicli...')
  return fetch('https://api.clicli.us/users?level=4&page=1&pageSize=' + num)
    .then(res => res.json())
    .then(data => {
      return data.users
    })
}

function wrapPromise (promise) {
  let status = 'pending'
  let result
  let currentArg = null
  let suspender = arg =>
    promise(arg).then(
      r => {
        status = 'success'
        result = r
      },
      e => {
        status = 'error'
        result = e
      }
    )
  return {
    read (arg) {
      if (currentArg !== arg) {
        status = 'pending'
        currentArg = arg
      }
      if (status === 'pending') {
        throw suspender(arg)
      } else if (status === 'error') {
        throw result
      } else if (status === 'success') {
        return result
      }
    }
  }
}
