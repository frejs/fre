import { h, render } from '../src'

export function lazy(fn) {
  let error = null
  let last = null
  let component = null
  let data = null

  return next => {
    if (last != next) {
      data = null
      last = next
    }
    if (error) throw error
    if (component) return h(component, next)
    if (data) return data
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
