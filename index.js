import{ render, html, useState } from './src'

function counter() {
  const state = useState({
    count: 0
  })

  return html`
    <div>
      <h1>${state.count}</h1>
      <button onclick=${() => {state.count++}}>+</button>
      <button onclick=${() => {state.count--}}>-</button>
    </div> 
  `
}

render(html`<${counter} />`, document.body)