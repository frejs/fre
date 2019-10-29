import { h, render, useState } from '../src'

function Counter () {
  return <div>hello world</div>
}

render(<Counter />, document.getElementById('root'),()=>{
  console.log(111)
})
