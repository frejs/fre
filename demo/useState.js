import { h, render, useState } from '../src'

function Counter () {
  return 'hello world'
}

render(<Counter />, document.getElementById('root'),()=>{
  console.log(111)
})
