import { lazy, Suspense } from '../../compat/index'
import { render, h, useEffect, useState } from '../../dist/fre.esm'

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
  const [count, setCount] = useState(0)

  useEffect(() => {
    setTimeout(() => setCount(count + 1), 1000)
  })

  return (
    <div>
      <h1>{count}</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {console.log(123)}
        {Array(10)
          .fill()
          .map((v) => {
            return <A key={v}/>
          })}
      </Suspense>
    </div>
  )
}
render(<App />, document.getElementById('root'))
