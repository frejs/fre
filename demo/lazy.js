import { h, render } from '../src'

const cache = {}

export function lazy(fn) {
  const key = Symbol()
  cache[key] = {
    data: void 0,
    error: void 0,
    done: void 0,
    promise: fn().then(
      data => {
        cache[key].data = data.default
        cache[key].done = true
      },
      error => (cache[key].error = error)
    )
  }
  return function Lazy(props) {
    if (cache[key].error) {
      throw cache[key].error
    }
    if (cache[key].data) {
      const Component = cache[key].data
      const newProps = { done: cache[key].done, ...props }
      return h(Component, newProps)
    }
    if (cache[key].promise) {
      throw cache[key].promise
    }
    throw new Error()
  }
}

const OtherComponent = lazy(() => {
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          default: function Hello() {
            return <div>Hello</div>
          }
        }),
      1000
    )
  )
})

function Suspense(props) {
  const { fallback, children } = props
  return children
}

function App() {
  return (
    <Suspense fallback={() => 'loading'}>
      <OtherComponent />
    </Suspense>
  )
}

render(<App />, document.getElementById('root'))
