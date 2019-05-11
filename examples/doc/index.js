import HTMLString from './README.md'
import './style.css'
import { h, render, useEffect } from 'fre'

function App () {
  useEffect(() => {
    document.querySelector('.wrap').innerHTML = HTMLString
  })
  return (
    <div class='container'>
      <div class='logo'>
        <p align='center'>
          <img
            src='http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg'
            alt='fre logo'
            width='180'
          />
        </p>
        <h1 align='center'>Fre</h1>
        <h3 align='center'>Fast 1kb React-like hooks API js library</h3>
      </div>
      <div class='wrap' />
    </div>
  )
}

render(<App />, document.body)
