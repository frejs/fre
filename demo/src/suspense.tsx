import { render, lazy, Suspense, h } from '../../src/index'

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
  return <div>
    <Suspense fallback={'loading'}>
      <Lazy />
      <h1>222</h1>
      <Lazy />
      <h2>111</h2>
    </Suspense>
  </div>
}

render(<App />, document.getElementById('app'))