import { h, useState, useEffect, render } from '../src'

// import { render, createElement as h } from 'preact/compat'
// import { useState, useEffect } from 'preact/hooks'

// import { render } from 'react-dom'
// import { createElement as h, useState, useEffect } from 'react'

export function createContext(defaultValue) {
  const listeners = new Set()
  let backupValue = defaultValue

  return () => {
    const [value, setValue] = useState(backupValue)

    useEffect(() => {
      backupValue = value
      listeners.forEach(f => f !== setValue && f(value))
    }, [value])

    useEffect(() => {
      listeners.add(setValue)
      return () => {
        listeners.delete(setValue)
      }
    }, [])

    return [value, setValue]
  }
}

const useTheme = createContext('light')

function App() {
  console.log(111)
  const [theme, setTheme] = useTheme()
  return (
    <div>
      {theme}
      <A />
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        change
      </button>
    </div>
  )
}

function A() {
  console.log(222)
  const [theme] = useTheme()
  return <div>{theme}</div>
}

render(<App />, document.getElementById('root'))
