import { render, h, lazy, Suspense } from '../../dist/fre.esm'

const OtherComponent = lazy(() => {
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          default: () => <div>hello world</div>
        }),
      1000
    )
  )
})
function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  )
}
render(<App />, document.getElementById('root'))
