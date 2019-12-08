import { h, render } from '../../src'

export function lazy(fn) {
  let error = null
  let data = null
  let component = null
  let last = null

  return next => {
    if (last != next) {
      data = null
      last = next
    }
    if (error) throw error
    if (data) return data
    if (component) return h(component, next)
    throw fn(next).then(
      res => (res.default ? (component = res.default) : (data = res)),
      err => (error = err)
    )
  }
}

const OtherComponent = lazy(() => {
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          default: () => <div>Hello</div>
        }),
      1000
    )
  )
})

function App() {
  return <OtherComponent />
}

render(<App />, document.getElementById('root'))
