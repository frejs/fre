import { render, html, useState } from './src'

function counter() {
  const state = useState({
    count: 0
  })

  return html`
    <div>
      <p>${state.count}</p>
      <button onclick=${() => {state.count++}}>+</button>
      <button onclick=${() => {state.count--}}>-</button>
    </div>
  `
}

render(html`<${counter} />`, document.body)
