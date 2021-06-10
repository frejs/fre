import { render, useState, createRoot,h } from "../../src/index"

function App() {
  console.log('父组件')
  const [count, setCount] = useState(0)
  return (
    <div>
      <B i={1} />
      <B i={2} />
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

function B({ i }) {
  console.log('子组件', i)
  return 111
}

const root = createRoot(document.getElementById("app"))
root.mixin(function enableTimeSlicing() {
  let sync = true
  return {
    shouldYeild() {
      if (sync === true) {
        return false
      }
    }
  }
})
root.render(<App />)
