<div align="center">

<p><img src="https://user-images.githubusercontent.com/44045911/147237798-174728c9-7399-4b47-be39-78ef69198a0d.png" alt="fre logo" width="130"></p>
<h1>Fre</h1>
<p>👻 Tiny Concurrent UI library with Fiber.</p>

![GitHub License](https://img.shields.io/github/license/frejs/fre)
[![Build Status](https://img.shields.io/github/actions/workflow/status/yisar/fre/main.yml)](https://github.com/yisar/fre/actions)
[![Code Coverage](https://img.shields.io/codecov/c/github/frejs/fre.svg)](https://codecov.io/gh/yisar/fre)
[![npm-v](https://img.shields.io/npm/v/fre.svg)](https://npmjs.com/package/fre)
[![npm-d](https://img.shields.io/npm/dt/fre.svg)](https://npmjs.com/package/fre)
[![brotli](http://img.badgesize.io/https://unpkg.com/fre/dist/fre.js?compression=brotli&label=brotli)](https://bundlephobia.com/result?p=fre)

</div>


- **Concurrent Mode** — This is an amazing idea, which implements the coroutine scheduler in JavaScript, it also called **Time slicing**.

- **Keyed reconcilation algorithm** — Fre has a minimal diff algorithm, It supported keyed, pre-process, offscreen rendering and hydrate.

- **Do more with less** — After tree shaking, project of hello world is only 1KB, but it has most features, virtual DOM, hooks API, Fragments, Fre.memo and so on.

### Contributors

<a href="https://github.com/yisar/fre/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=yisar/fre" />
</a>

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

### Hooks API

- [useState](https://github.com/yisar/fre#usestate)

- [useEffect](https://github.com/yisar/fre#useeffect)

- [useReducer](https://github.com/yisar/fre#usereducer)

- [useLayout](https://github.com/yisar/fre#uselayout)

- [useCallback](https://github.com/yisar/fre#usecallback)

- [useMemo](https://github.com/yisar/fre#usememo)

- [useRef](https://github.com/yisar/fre#useref)

#### useState

`useState` is a base API, It will receive initial state and return an Array

You can use it many times, new state is available when component is rerender

```js
function App() {
  const [up, setUp] = useState(0)
  const [down, setDown] = useState(0)
  return (
    <>
      <h1>{up}</h1>
      <button onClick={() => setUp(up + 1)}>+</button>
      <h1>{down}</h1>
      <button onClick={() => setDown(down - 1)}>-</button>
    </>
  )
}
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

function App() {
  const [state, dispatch] = useReducer(reducer, { count: 1 })
  return (
    <>
      {state.count}
      <button onClick={() => dispatch({ type: 'up' })}>+</button>
      <button onClick={() => dispatch({ type: 'down' })}>-</button>
    </>
  )
}
```

#### useEffect

It is the execution and cleanup of effects, which is represented by the second parameter

```
useEffect(f)       //  effect (and clean-up) every time
useEffect(f, [])   //  effect (and clean-up) only once in a component's life
useEffect(f, [x])  //  effect (and clean-up) when property x changes in a component's life
```

```js
function App({ flag }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    document.title = 'count is ' + count
  }, [flag])
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  )
}
```

If it returns a function, the function can do cleanups:

```js
useEffect(() => {
  document.title = 'count is ' + count
  return () => {
    store.unsubscribe()
  }
}, [])
```

#### useLayout

More like useEffect, but useLayout is sync and blocking UI.

```js
useLayout(() => {
  document.title = 'count is ' + count
}, [flag])
```

#### useMemo

`useMemo` has the same rules as `useEffect`, but `useMemo` will return a cached value.

```js
const memo = (c) => (props) => useMemo(() => c, [Object.values(props)])
```

#### useCallback

`useCallback` is based `useMemo`, it will return a cached function.

```js
const cb = useCallback(() => {
  console.log('cb was cached.')
}, [])
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

If it uses a function, it can return a cleanup and executes when removed.

```js
function App() {
  const t = useRef((dom) => {
    if (dom) {
      doSomething()
    } else {
      cleanUp()
    }
  })
  return flag && <span ref={t}>I will removed</span>
}
```
### Fragments

```js
// fragment
function App() {
  return <>{something}</>
}
// render array
function App() {
  return [a, b, c]
}
```


### jsx2

```js
plugins: [
  [
    '@babel/plugin-transform-react-jsx',
    {
      runtime: 'automatic',
      importSource: 'fre',
    },
  ],
]
```

### Compare with other frameworks

The comparison is difficult because the roadmap and trade-offs of each framework are different, but we have to do so.

- react

React is the source of inspiration for fre. Their implementation and asynchronous rendering are similar. The most amazing thing is **concurrent mode**, which means that react and fre have the same roadmap -- **Exploring concurrent use cases**.

But at the same time, fre has obvious advantages in concurrent mode and bundle size.

- vue / preact

To some extent, vue and preact are similar. They have similar synchronous rendering, only the API is different.

The reconciliation algorithm of fre is similar to vue2, but the biggest difference is that vue/preact do not support concurrent mode, this means that the roadmap is totally different.

#### License

MIT @yisar


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fyisar%2Ffre.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fyisar%2Ffre?ref=badge_large)
 
