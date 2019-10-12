<p align="center"><img src="http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg" alt="fre logo" width="180"></p>
<h1 align="center">Fre</h1>
<p align="center">:ghost: Tiny React16 like library with Async rendering.</p>
<p align="center">
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/v/fre.svg?style=flat-square" alt="npm-v"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/dt/fre.svg?style=flat-square" alt="npm-d"></a>
<a href="https://bundlephobia.com/result?p=fre"><img src="https://img.shields.io/bundlephobia/minzip/fre.svg?&style=flat-square" alt="gzip"></a>
<a href="https://jq.qq.com/?_wv=1027&k=5Zyggbc"><img src="https://img.shields.io/badge/qq.group-813783512-ff69b4.svg?maxAge=2592000&style=flat-square"></a>
<a href="https://coveralls.io/github/132yse/fre"><img src="https://img.shields.io/coveralls/github/132yse/fre?style=flat-square" alt="Code Coverage"></a>
<a href="https://travis-ci.org/132yse/fre"><img src="https://img.shields.io/travis/132yse/fre?style=flat-square" alt="Build Status"></a>
</p>

### Feature

- :tada: Functional Component and hooks API
- :confetti_ball: Async rendering like react Fiber（also called time slicing, concurrent mode）
- :telescope: keyed reconcilation（also called diff） algorithm

### Introduction

Fre (pronounced `/fri:/`, like free) is a tiny and perfect js library, It means [Free!](https://www.clicli.us/search/free) ~

| Package                                              | Version                                             | About                 |
| ---------------------------------------------------- | --------------------------------------------------- | --------------------- |
| [`Fre`](https://github.com/132yse/fre)               | ![npm](https://img.shields.io/npm/v/fre.svg)        | fre core              |
| [`Fard`](https://github.com/132yse/fard)             | ![npm](https://img.shields.io/npm/v/fard.svg)       | mini-program with fre |
| [`use-routes`](https://github.com/132yse/use-routes) | ![npm](https://img.shields.io/npm/v/use-routes.svg) | router for fre        |

### Demo

- [async rendering demo](https://codesandbox.io/s/suspicious-rosalind-i06mv)

- [key-based reconcilation demo](https://codesandbox.io/s/fre-demo-uxuic)

Thanks for [Rasmus Schultz](https://github.com/mindplay-dk)

### Use

```shell
yarn add fre
```

```js
import { h, render, useState } from "fre"

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById("root"))
```

### Hooks API

- [useState](https://github.com/132yse/fre#usestate)

- [useEffect](https://github.com/132yse/fre#useeffect)

- [useReducer](https://github.com/132yse/fre#usereducer)

- [useCallback](https://github.com/132yse/fre#usecallback)

- [useMemo](https://github.com/132yse/fre#usememo)

- [useRef](https://github.com/132yse/fre#useref)

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

render(<Counter />, document.getElementById("root"))
```

#### useReducer

`useReducer` and `useState` are almost the same，but `useReducer` needs a global reducer

```js
function reducer(state, action) {
  switch (action.type) {
    case "up":
      return { count: state.count + 1 }
    case "down":
      return { count: state.count - 1 }
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 1 })
  return (
    <div>
      {state.count}
      <button onClick={() => dispatch({ type: "up" })}>+</button>
      <button onClick={() => dispatch({ type: "down" })}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById("root"))
```

#### useEffect

`useEffect` takes two parameters, the first is a effect callback and the second is an array

if the array changed, the callback will execute after commitWork, such as `pureComponentDidUpdate`

if the array is empty, it means execute once, such as `componentDidMount`

if no array, it means execute every time , such as `componentDidUpdate`

if useEffect returns a function, the function will execute before next commitWork, such as `componentWillUnmount`

```js
function Counter({ flag }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    document.title = "count is " + count
  }, [flag])
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById("root"))
```

#### useCallback

`useCallback` has the same parameters as `useEffect`, but `useCallback` will return a cached function.

```js
const set = new Set()

function Counter() {
  const [count, setCount] = useState(0)
  const cb = useCallback(() => {
    console.log("cb was cached")
  }, [count])
  set.add(cb)

  return (
    <div>
      <h1>{set.size}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

#### useMemo

`useMemo` has the same parameters as `useEffect`, but `useMemo` will return a cached value.

```js
function Counter() {
  const [count, setCount] = useState(0)
  const val = useMemo(() => {
    return new Date()
  }, [count])
  return (
    <div>
      <h1>
        {count} - {val}
      </h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById("root"))
```

#### useRef

`useRef` will return a object which contains current node.

```js
import { useRef, useEffect } from "fre"

function Counter() {
  useEffect(() => {
    console.log(t) // { current:<div>t</div> }
  })
  const t = useRef(null)
  return <div ref={t}>t</div>
}

render(<Counter />, document.getElementById("root"))
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
  const [sex, setSex] = useState("boy")
  return (
    <div>
      <h2>{props.count}</h2>
      <h1>{sex}</h1>
      <button
        onClick={() => {
          sex === "boy" ? setSex("girl") : setSex("boy")
        }}
      >
        x
      </button>
    </div>
  )
}

render(<App />, document.getElementById("root"))
```

### props

Props are used for component communication

```js
function App() {
  const [sex, setSex] = useState("boy")
  return (
    <div>
      <Sex sex={sex} />
      <button onClick={() => (sex === "boy" ? setSex("girl") : setSex("boy"))} />
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

const Box = props => <div>{props.render("hello world!")}</div>
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

const Box = props => <div>{props.children("hello world!")}</div>
```

### options

If you want to rewrite any function, please use options, such as:

```js
options.end = false
options.commitWork = fiber => {
  // something you will rewrite commitWork
}
```

#### JSX

The default export h function needs to be configured

```js
import { h } from "fre"
```

```json
{
  "plugins": [["transform-react-jsx", { "pragma": "h" }]]
}
```

If browser environment, recommend to use [htm](https://github.com/developit/htm)

#### Async rendering

Fre implements a tiny priority scheduler, which like react Fiber.

Async rendering is also called `time slicing` or `concurrent mode`.

#### key-based reconcilation

Fre implements a compact reconcilation algorithm support keyed, which also called diff.

It uses hash to mark locations to reduce much size.

#### License

_MIT_ ©132yse inspired by [react](https://github.com/facebook/react) [anu](https://github.com/RubyLouvre/anu)
