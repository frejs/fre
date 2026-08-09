# fre/tui

#### Hello world

```jsx
import FreTUI, { Text } from 'fre/tui'

const App = ({ text }) => {
  return <Text color="Red">{text}</Text>
}

FreTUI.render(<App text="hello world" />)
```

#### How to handle input

```jsx
import { useState } from 'react'
import FreTUI, { Text, useInput, exit } from 'fre/tui'

const App = () => {
  const [counter, setCounter] = useState(0)

  useInput(
    input => {
      if (input === 'k') setCounter(counter + 1)
      if (input === 'j') setCounter(counter - 1)
      if (input === 'q') exit()
    },
    [counter]
  )

  return (
    <Text>
      counter: <Text bold>{counter}</Text>
    </Text>
  )
}

FreTUI.render(<App />)
```