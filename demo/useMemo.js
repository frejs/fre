// import {h, render} from 'preact'
// import {useEffect,useMemo,useState,useCallback} from './preact/dist/hooks'
import {h,render,useState,useMemo,useEffect} from '../src'

function Counter () {
  const [count, setCount] = useState(0)
  // const [flag, setFlag] = useState(true)
  useMemo(() => 'text', [])
  // useCallback(one, [])
  useEffect(() => {})
  return (
    <div>
      <h1>
        {count}
      </h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
