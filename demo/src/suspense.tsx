import { h, render, lazy, Suspense } from '../../src/index'

const Lazy = lazy(() => {
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
  return <Suspense fallback={<div>Loading...</div>}>
    <Lazy/>
  </Suspense>
}

render(<App />, document.getElementById('root'))