
  const elements = 
    <ul>
      {Array(2)
        .fill(null)
        .map((_, i) =>
          Array(2)
            .fill(null)
            .map((_, j) =>
              Array(2)
                .fill(null)
                .map((_, k) => (
                  <li>
                    {i},{j},{k}
                  </li>
                ))
            )
        )}
    </ul>
  

console.log(elements)


import { render, useState } from "../../src/index"

function App() {
  console.log(123)
  const [count, setCount] = useState(0)
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  )
}

render(elements, document.getElementById("app"))