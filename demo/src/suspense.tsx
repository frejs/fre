import { render, lazy, Suspense,h } from '../../src/index'

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
  return <Suspense fallback={'loading'}>
    <Lazy/>
    <div>111</div>
    <Lazy/>
  </Suspense>
}

render(<App />, document.getElementById('app'))