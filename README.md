# Fre

> 1kb React-like library

- **Less is more** The goal of Fre is to minimize code and memory usage, while also having more features such as virtual dom, fragments, and hooks APIs

- **Good portability** Fre only has one file and does not require building, which makes it easier to port to other platforms, such as embedded systems.

### Usage

```shell
yarn add fre
```

```js
import { render, useState } from 'fre'

function App() {
  const [count, setCount] = useState(0)
  return <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
}

render(<App/>, document.body)
```
#### License

MIT @yisar
