import HTMLString from './README.md'
import './style.css'
import { h, render, useEffect } from 'fre'

function App () {
  useEffect(() => {
    document.querySelector('.wrap').innerHTML = HTMLString
  })
  return (
    <div class='container'>
      <div class='wrap' />
    </div>
  )
}

render(<App />, document.body)
