
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


import { render } from "../../src/index"

render(elements, document.getElementById("app"))