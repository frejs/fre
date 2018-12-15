function counter() {
  const state = useState({
    count: 0
  })

  return h`
    <div>
      <p>${state.count}</p>
      <button onclick=${() => {state.count++}}>+</button>
      <button onclick=${() => {state.count--}}>-</button>
    </div> 
  `
}

mount(h`<${counter} />`, document.body)

// hooks √
// Proxy √
// tagged template √
// vdom diff √
