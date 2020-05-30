import { render, h, lazy, Suspense } from '../../compat/index'

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

const B = lazy(() => {
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          default: function Hello() {
            console.log(performance.now())
            return <div>B</div>
          }
        }),
      1000
    )
  )
})

const C = () => 'C'

function App() {
  console.log(performance.now())
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <A />
        <B />
      </Suspense>
    </div>
  )
}
render(<App />, document.getElementById('root'))
