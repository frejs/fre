<p align="center"><img src="http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg" alt="fre logo" width="180"></p>
<h1 align="center">Fre</h1>
<p align="center">:ghost: Fast 1kB React like library with the same hooks API</p>
<p align="center">
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/v/fre.svg?style=flat-square" alt="npm-v"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/dt/fre.svg?style=flat-square" alt="npm-d"></a>
<a href="https://bundlephobia.com/result?p=fre"><img src="https://img.shields.io/bundlephobia/minzip/fre.svg?style=flat-square" alt="gzip"></a>
</p>

### Feature

- :tada: really functionalComponent, hooks API, render props
- :confetti_ball: Fiber Scheduler and hash keyed diff algorithm
- :telescope: minimal but wonderful , just 1 KB , no dependences

### Introduction

Fre (pronounced `/fri:/`, like free) is a tiny and perfect js library, It means [Free!](https://www.clicli.us/search/free) ~

| Package                                              | Version                                             | About          |
| ---------------------------------------------------- | --------------------------------------------------- | -------------- |
| [`Fre`](.)                                           | ![npm](https://img.shields.io/npm/v/fre.svg)        | fre core       |
| [`use-routes`](https://github.com/132yse/use-routes) | ![npm](https://img.shields.io/npm/v/use-routes.svg) | router for fre |

### Use

```shell
yarn add fre
```

```js
import { h, render, useState } from 'fre'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
```

### Hooks API

react hooks API is a miracle, and fre will make it become a leading role

#### useState

`useState` is a base API, It will receive initial state and return a Array

You can use it many times, new state is available when component is rerender

```js
function Counter() {
  const [up, setUp] = useState(0)
  const [down, setDown] = useState(0)
  return (
    <div>
      <h1>{up}</h1>
      <button onClick={() => setUp(up + 1)}>+</button>
      <h1>{down}</h1>
      <button onClick={() => setDown(down - 1)}>-</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
```

#### useReducer

`useReducer` and `useState` are almost the same，but `useReducer` needs a global reducer

```js
function reducer(state, action) {
  switch (action.type) {
    case 'up':
      return { count: state.count + 1 }
    case 'down':
      return { count: state.count - 1 }
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 1 })
  return (
    <div>
      {state.count}
      <button onClick={() => dispatch({ type: 'up' })}>+</button>
      <button onClick={() => dispatch({ type: 'down' })}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
```

#### useEffect

`useEffect` takes two parameters, the first is a effect callback and the second is an array, usually props

When the array changes, the effect callback will run after commitWork, such as `pureComponentDidUpdate`

if the array is empty, it means use once, such as `componentDidMount`

if the second is undefined, it means use every time , such as `componentDidUpdate`

```js
function Counter({ flag }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    document.title = 'count is ' + count
  }, [flag])
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
```

#### useMemo

`useMemo` has the same parameters as `useEffect`, but `useMemo` will be ran immediately.

```js
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      {(useMemo(<Sex />), [])}
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
```

#### useContext

Context is the state of external create, internal use

When it changes, all components that own `useContext` will rerender

```js
const ctx = createContext(0)

function App() {
  const [count, setCount] = useContext(ctx)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Other />
    </div>
  )
}

function Other() {
  const count = useContext(ctx)[0]
  return <h1>{count}</h1>
}
```

### FunctionalComponent

functionalComponent is a new components scheme

```js
function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Sex count={count} />
    </div>
  )
}

function Sex(props) {
  const [sex, setSex] = useState('boy')
  return (
    <div>
      <h2>{props.count}</h2>
      <h1>{sex}</h1>
      <button
        onClick={() => {
          sex === 'boy' ? setSex('girl') : setSex('boy')
        }}
      >
        x
      </button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
```

### props

Props are used for component communication

```js
function App() {
  const [sex, setSex] = useState('boy')
  return (
    <div>
      <Sex sex={sex} />
      <button
        onClick={() => (sex === 'boy' ? setSex('girl') : setSex('boy'))}
      />
    </div>
  )
}
function Sex(props) {
  return <div>{props.sex}</div>
}
```

Props contains children to render all the child elements of itself

```js
const HelloBox = () => (
  <Box>
    <h1>Hello world !</h1>
  </Box>
)

const Box = props => <div>{props.children}</div>
```

Hooks do not support HOC and extends, but render props are supported by default

```js
const HelloBox = () => <Box render={value => <h1>{value}</h1>} />

const Box = props => <div>{props.render('hello world!')}</div>
```

Also can be render children

```js
const HelloBox = () => (
  <Box>
    {value => {
      return <h1>{value}</h1>
    }}
  </Box>
)

const Box = props => <div>{props.children('hello world!')}</div>
```

#### HOC

Does not support HOC but you can renturn a function wrapped another function.

```js
function App() {
  return HOC(() => <div>I am wrapped by a HOC</div>)
}
```

### options

If you want to rewrite any function, please use options, such as:

```js
options.platform = 'miniapp'
options.commitWork = fiber => {
  Object.keys(fiber.effects).forEach(i => commit(i))
}
```

#### JSX

The default export h function needs to be configured

```js
import { h } from 'fre'
```

```json
{
  "plugins": [["transform-react-jsx", { "pragma": "h" }]]
}
```

If browser environment, recommend to use [htm](https://github.com/developit/htm)

Fre supports most JSX syntax, `if-else` is also Ok but need to be careful.

```jsx
{
  isShow && <A />
  isShow ? <A /> : null
  isShow ? <A /> : <B />
}
```

because there no `key` for them, please use it as late as possible.

#### Fiber

Fiber is a priority scheduling scheme.

It uses the traversal form of linked list to achieve time slicing

#### hash.keyed diff

Fre implements a compact diff algorithm

It uses hash to mark locations for easy comparison

#### License

_MIT_ ©132yse inspired by [anu](https://github.com/RubyLouvre/anu)
