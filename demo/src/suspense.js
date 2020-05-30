import { lazy, Suspense } from '../../compat/index'
import { render, h } from '../../dist/fre.esm'

const A = lazy(() => {
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          default: function Hello() {
            return <div>A</div>
          }
        }),
      1000
    )
  )
})

function App() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <A />
      </Suspense>
    </div>
  )
}
render(<App />, document.getElementById('root'))
