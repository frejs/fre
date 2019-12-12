import { h, useState, useEffect, render, useCallback } from '../../src'

// import { render } from 'react-dom'
// import { createElement as h, useState, useEffect } from 'react'

export function withContext(defaultValue) {
  const listeners = new Set()
  let backupValue = defaultValue

  return () => {
    const [value, setValue] = useState(backupValue)

    useEffect(() => {
      backupValue = value
      listeners.forEach(f => f(value))
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

const useTheme = withContext('light')

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

render(<App />, document.body)
