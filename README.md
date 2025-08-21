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

- **Do more with less** — Fre get the tiny size, but it has most features, virtual DOM, hooks API, Suspense, Fragments, Fre.memo and so on.

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
### Features

- [Suspense](https://github.com/yisar/fre#Suspense)

- [memo](https://github.com/yisar/fre#memo)

### Hooks API

- [useState](https://github.com/yisar/fre#usestate)

- [useEffect](https://github.com/yisar/fre#useeffect)

- [useReducer](https://github.com/yisar/fre#usereducer)

- [useLayout](https://github.com/yisar/fre#uselayout)

- [useCallback](https://github.com/yisar/fre#usecallback)

- [useMemo](https://github.com/yisar/fre#usememo)

- [useRef](https://github.com/yisar/fre#useref)

- [useContext](https://github.com/yisar/fre#useContext)


#### useState

`useState` is a base API, It will receive initial state and return an Array

You can use it many times, new state is available when component is rerender

```js
function App() {
  const [up, setUp] = useState(0)
  const [down, setDown] = useState(() => 0)
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

#### useContext

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function App() {
  return (
    <ThemeContext value="dark">
      <Button />
    </ThemeContext>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button class={className}>
      {children}
    </button>
  );
}
```

### Suspense
```js
const Hello = lazy('./hello.js')

export function App() {
  return (
    <div>
      <Suspense fallback={<div>loading...</div>}>
        <Hello />
        <div>world!</div>
      </Suspense>
    </div>
  )
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

#### License

MIT @yisar


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fyisar%2Ffre.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fyisar%2Ffre?ref=badge_large)
 
