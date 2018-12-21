import { render, html, useState } from './src'

function counter() {
  const state = useState({
    count: 0
  })

  return html`
    <div>
      <p key="p">${state.count}</p>
      <button onclick=${() => {state.count++}} key="+">+</button>
      <button onclick=${() => {state.count--}} key="-">-</button>
    </div>
  `
}

render(html`<${counter} />`, document.body)