import{ render, html, useState } from './src'

function counter() {
  const state = useState({
    count: {
      num:0
    }
  })

  return html`
    <div>
      ${html`<${count} count=${state.count.nu} />`}
      <button onclick=${() => {state.count++}}>+</button>
      <button onclick=${() => {state.count--}}>-</button>
    </div>
  `
}

function count(props){
  return html`
    <h1>${props.count}</h1>
  `
}

render(html`<${counter} />`, document.body)

// let state = {
//   count: 1,
//   sex: {
//     sex: 'boy'
//   }
// }
