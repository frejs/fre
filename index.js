import{ render, html as h, useState } from './src'

function counter() {
  const state = useState({
    count: 0
  })

  return h`
    <div>
      ${h`<${count} count=${state.count} />`}
      <button onclick=${() => {state.count++}}>+</button>
      <button onclick=${() => {state.count--}}>-</button>
    </div> 
  `
}

function count(props){
  return h`
    <p>${props.count}</p>
  `
}

render(h`<${counter} />`, document.body)
