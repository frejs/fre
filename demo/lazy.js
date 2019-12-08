import { h, render } from '../src'

export function lazy(fn) {
  let error = null
  let component = null

  return function Lazy(props) {
    if (error) throw error
    if (!component)
      throw fn().then(
        data => (component = data.default),
        error => (error = error)
      )
    return h(component, props)
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
