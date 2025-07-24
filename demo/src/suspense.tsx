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

export function App() {
  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        <Lazy />
        <div>222</div>
      </Suspense>
    </div>
  )
}

render(<App />, document.getElementById('app'))