<p align="center"><img src="http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg" alt="fre logo" width="180"></p>
<h1 align="center">Fre</h1>
<p align="center">:ghost: Tiny React16 like library with Concurrent and Suspense.</p>
<p align="center">
<a href="https://circleci.com/gh/132yse/fre"><img src="https://img.shields.io/circleci/project/github/132yse/fre.svg?style=flat-square" alt="Build Status"></a>
<a href="https://codecov.io/gh/132yse/fre"><img src="https://img.shields.io/codecov/c/github/132yse/fre.svg?style=flat-square" alt="Code Coverage"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/v/fre.svg?style=flat-square" alt="npm-v"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/dt/fre.svg?style=flat-square" alt="npm-d"></a>
<a href="https://bundlephobia.com/result?p=fre"><img src="https://img.shields.io/bundlephobia/minzip/fre.svg?&style=flat-square" alt="gzip"></a>
</p>

### Feature

- :tada: Functional Component and hooks API
- :confetti_ball: Concurrent and Suspense
- :telescope: keyed reconcilation algorithm

### Introduction

Fre (pronounced `/fri:/`, like free) is a tiny and perfect js library, It means [Free!](https://www.clicli.us/search/free) ~

#### Contributors

Fre has wonderful code, we need anyone to join us improve together.

<table><tbody><tr>
<td><a target="_blank" href="https://github.com/132yse"><img width="70px" src="https://avatars0.githubusercontent.com/u/12951461?s=70&v=4"></a></td>
<td><a target="_blank" href="https://github.com/mindplay-dk"><img width="70px" src="https://avatars3.githubusercontent.com/u/103348?s=70&v=4"></a></td>
<td><a target="_blank" href="https://github.com/hkc452"><img width="70px" src="https://avatars2.githubusercontent.com/u/3286658?s=70&v=4"></a></td>
<td><a target="_blank" href="https://github.com/yiliang114"><img width="70px" src="https://avatars1.githubusercontent.com/u/11473889?s=70&v=4"></a></td>
</tr></table></tbody>

#### Users or sponsors

Thanks for the following websites and sponsors, If you do the same, please tell us with issue~

<table><tbody><tr>
<td><a target="_blank" href="https://ke.qq.com/course/368629?flowToken=1015240"><img height="60px" src="https://ws1.sinaimg.cn/large/0065Zy9ely1g983zobxqzj30ka03y0v6.jpg"></a></td>
<td><a target="_blank" href="https://www.clicli.me"><img height="60px" src="https://ws1.sinaimg.cn/large/0065Zy9ely1g983rcrcyuj30a305sgm2.jpg"></a></td>
</tr></table></tbody>

### Demo

- [async rendering demo](https://codesandbox.io/s/suspicious-rosalind-i06mv)

- [key-based reconcilation demo](https://codesandbox.io/s/fre-demo-d7vm7)

- [suspense demo](https://codesandbox.io/s/fre-suspense-demo-h5nfy)

Thanks for [Rasmus Schultz](https://github.com/mindplay-dk)

### Use

```shell
yarn add fre
````

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

`useEffect` takes two parameters, the first is a effect callback and the second is an array

if the array changed, the callback will execute after commitWork, such as `pureComponentDidUpdate`

if the array is empty, it means execute once, such as `componentDidMount`

if no array, it means execute every time , such as `componentDidUpdate`

if useEffect returns a function, the function will execute before next commitWork, such as `componentWillUnmount`

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

#### useCallback

`useCallback` has the same parameters as `useEffect`, but `useCallback` will return a cached function.

```js
const set = new Set()

function Counter() {
  const [count, setCount] = useState(0)
  const cb = useCallback(() => {
    console.log('cb was cached')
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

render(<Counter />, document.getElementById('root'))
```

#### useRef

`useRef` will return a function or an object.

```js
function App() {
  useEffect(() => {
    console.log(t) // { current:<div>t</div> }
  })
  const t = useRef(null)
  return <div ref={t}>t</div>
}
```

If it use a function, It can return a cleanup and exectes when removed.

```js
function App() {
  const t = useRef(dom => {
    if (dom) {
      doSomething()
    } else {
      cleanUp()
    }
  })
  return flag && <span ref={t}>I will removed</span>
}
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

#### JSX(JavaScript extension)

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

#### Concurrent

Fre implements a tiny priority scheduler, which like react Fiber.

It can break the work, and when there are idle time, the work will continue.

Concurrent Mode is also called `time slicing` or `concurrent mode`.

#### Suspense

Suspense is another way to break the work.

It throws promise, and fre catches promise then suspend the work. It waits until resolve to the promise.

#### key-based reconcilation

Fre implements a compact reconcilation algorithm support keyed, which also called diff.

It uses hash to mark locations to reduce much size.

#### License

_MIT_ ©132yse inspired by [react](https://github.com/facebook/react) [anu](https://github.com/RubyLouvre/anu)
