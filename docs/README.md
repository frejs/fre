

**Fre** is a Tiny Javascript framework with Fiber. It implements the coroutine scheduler in JavaScript, and the rendering is asynchronous, which supports Time slicing and Suspense.

It also has a better reconciliation algorithm, which traverses from both ends with O (n) complexity, and supports keyed.

After tree shaking, project of hello world is only 2KB, but it has most features, virtual DOM, hooks API, Fragment and more.

## Quick start

```shell
yarn add fre
```

### Via Vite

We recommend that you use [Vite](https://github.com/vitejs/vite) to develop and build fre projects.

[/richajak/vite-fre/](https://github.com/richajak/vite-fre) is a template, [/wcastand/esm-fre/](https://github.com/wcastand/esm-fre) is another one.

### Usage

```js
import { render, useState } from "fre"

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
  )
}

render(<App />, document.body)
```

### Output

```js fre
export default () => {
  const [count, setCount] = useState(0)
  return html`<button
    style="background: rgb(189 30 104);padding: 10px 50px;color: #fff;"
    onClick=${() => setCount(count + 1)}
  >
    ${count}
  </button>`
}
```

## Hooks API

- [useState](#usestate)

- [useEffect](#useeffect)

- [useReducer](#usereducer)

- [useLayout](uselayout)

- [useCallback](usecallback)

- [useMemo](usememo)

- [useRef](useref)

### useState

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

### useReducer

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

function App() {
  const [state, dispatch] = useReducer(reducer, { count: 1 })
  return (
    <>
      {state.count}
      <button onClick={() => dispatch({ type: "up" })}>+</button>
      <button onClick={() => dispatch({ type: "down" })}>-</button>
    </>
  )
}
```

### useEffect

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
    document.title = "count is " + count
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
  document.title = "count is " + count
  return () => {
    store.unsubscribe()
  }
}, [])
```

### useLayout

More like useEffect, but useLayout is sync and blocking UI.

```js
useLayout(() => {
  document.title = "count is " + count
}, [flag])
```

### useMemo

`useMemo` has the same rules as `useEffect`, but `useMemo` will return a cached value.

```js
const memo = (c) => (props) => useMemo(() => c, [Object.values(props)])
```

### useCallback

`useCallback` is based `useMemo`, it will return a cached function.

```js
const cb = useCallback(() => {
  console.log("cb was cached")
}, [])
```

### useRef

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

## Suspense

This is another feature of concurrent rendering, which can achieve asynchronous refresh without the aid of state.

```js
const LazyComponent = lazy(Component)

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  )
}
```

## New JSX transform

```js
plugins: [
  [
    "@babel/plugin-transform-react-jsx",
    {
      runtime: "automatic",
      importSource: "fre",
    },
  ],
]
```

## Compare with other frameworks

The comparison is difficult because the roadmap and trade-offs of each framework are different, but we have to do so.

- react

React is the source of inspiration for fre. Their implementation and asynchronous rendering are similar. The most amazing thing is **concurrent mode**, which means that react and fre have the same roadmap -- **Exploring concurrent use cases**.

But at the same time, fre has obvious advantages in reconciliation algorithm and bundle size.

- vue / preact

To some extent, vue and preact are similar. They have similar synchronous rendering, only the API is different.

The reconciliation algorithm of fre is similar to vue, but the biggest difference is that vue/preact do not support concurrent mode, this means that the roadmap is totally different.

| framework | concurrent | reconcilation algorithm | bundle size |
| --------- | ---------- | ----------------------- | ----------- |
| fre2      | √          | ★★★★                    | 2kb         |
| react17   | √          | ★★                      | 39kb        |
| vue3      | ×          | ★★★★★                   | 30kb        |
| preactX   | ×          | ★★★★                    | 4kb         |

## License

MIT @yisar 

Fre is inspired by many libraries, pay our respects to them: [react](https://github.com/facebook/react) [snabbdom](https://github.com/snabbdom/snabbdom) [preact](https://github.com/preactjs/preact) [anu](https://github.com/RubyLouvre/anu)
