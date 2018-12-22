import{ render, html, useState } from './src'

function counter() {
  const state = useState({
    count: {
      num:0
    }
  })

  return html`
    <div>
      ${html`<${count} count=${state.count.num} />`}
      <button onclick=${() => {state.count.num++}}>+</button>
      <button onclick=${() => {state.count.num--}}>-</button>
    </div>
  `
}

function count(props){
  return html`
    <h1>${props.count}</h1>
  `
}

render(html`<${counter} />`, document.body)
