import { render, useState, h, useEffect } from "../../src/index"

function App() {
  console.log('function component is rendering')

    const [state, setState] = useState(0)

    function increment() {
      setState(v => {
        console.log('increment to', v + 1)
        return v + 1
      })
    }

    return (
      h('div', {}, [
        h('p', {}, `State: ${state}`),
        h('button', { onClick: increment }, '+')
      ])
    )
}

function B({i}){
  console.log('子组件',i)
  return 111
}

render(<App />, document.getElementById("app"))
