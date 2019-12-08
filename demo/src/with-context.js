import { h, useState, useEffect, render } from '../../src'

// import { render, createElement as h } from 'preact/compat'
// import { useState, useEffect } from 'preact/hooks'

// import { render } from 'react-dom'
// import { createElement as h, useState, useEffect } from 'react'

export function withContext(defaultValue) {
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

const useTheme = withContext('light')

function App() {
  const [theme, setTheme] = useTheme()
  const setMemoTheme = useCallback(() =>
    setTheme(theme === 'dark' ? 'light' : 'dark')
  )
  return (
    <div>
      {theme}
      <A />
      <button onClick={setMemoTheme}>change</button>
    </div>
  )
}

function A() {
  console.log(222)
  const [theme] = useTheme()
  return <div>{theme}</div>
}

render(<App />, document.getElementById('root'))
