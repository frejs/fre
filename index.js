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
  const state = useState({
    sex:'boy'
  })
  return h`
    <div>
      <p>${props.count}</p>
      <p>${state.sex}</p>
      <button onclick=${()=>{state.sex=state.sex==='boy'?'girl':'boy'}}>x</button>
    </div>
  `
}

render(h`<${counter} />`, document.body)
