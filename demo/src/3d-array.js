import { render,h } from '../../src'

function App() {
  return (
    <div>
  {Array(3).fill().map((x, i) =>
    Array(3).fill().map((y, j) =>
      Array(3).fill().map((z, k) => (
          <div>
            {i},{j},{k}
          </div>
        )
      )
    )
  )}
</div>
  )
}

render(<App />, document.body)