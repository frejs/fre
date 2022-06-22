<p align="center"><img src="https://user-images.githubusercontent.com/44045911/147237798-174728c9-7399-4b47-be39-78ef69198a0d.png" alt="fre logo" width="130"></p>
<h1 align="center">Fre</h1>
<p align="center">👻 Tiny Concurrent UI library with Fiber.</p>
<p align="center">
<a href="https://github.com/yisar/fre/actions"><img src="https://img.shields.io/github/workflow/status/yisar/fre/main.svg" alt="Build Status"></a>
<a href="https://codecov.io/gh/yisar/fre"><img src="https://img.shields.io/codecov/c/github/yisar/fre.svg" alt="Code Coverage"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/v/fre.svg" alt="npm-v"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/dt/fre.svg" alt="npm-d"></a>
<a href="https://bundlephobia.com/result?p=fre"><img src="http://img.badgesize.io/https://unpkg.com/fre/dist/fre.js?compression=brotli&label=brotli" alt="brotli"></a>
</p>

- **Concurrent Mode** — This is an amazing idea, which implements the coroutine scheduler in JavaScript, it also called **Time slicing**.

- **O(ND) reconcilation algorithm** — Fre has a minimal longest-common-subsequence algorithm, It supported keyed, pre-process.

- **Do more with less** — After tree shaking, project of hello world is only 1KB, but it has most features, virtual DOM, hooks API, Fragments and so on.

### Contributors

<a href="https://github.com/yisar/fre/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=yisar/fre" />
</a>

### Use

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

But at the same time, fre has obvious advantages in reconciliation algorithm and bundle size.

- vue / preact

To some extent, vue and preact are similar. They have similar synchronous rendering, only the API is different.

The reconciliation algorithm of fre is similar to vue3, but the biggest difference is that vue/preact do not support concurrent mode, this means that the roadmap is totally different.

| framework | concurrent | offscreen | reconcilation algorithm | bundle size |
| --------- | ---------- | --------- | ----------------------- | ----------- |
| fre2      | √          | √         | ★★★★                 | 2kb         |
| react18   | √          | √         | ★★                    | 43kb        |
| vue3      | ×          | x         | ★★★★★               | 33kb        |
| preactX   | ×          | x         | ★★★                  | 4kb         |

#### License

MIT @yisar


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fyisar%2Ffre.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fyisar%2Ffre?ref=badge_large)

赠李白诗：
Liquor is freshly cooked in the mountains, and yellow chickens peck millet in autumn.

Hutong cooks chicken and drinks liquor, while children laugh and hold clothes.

Singing to get drunk and masturbating, dancing and setting sun for glory.

It's not too early to lobby Wan Cheng's hardships, and travel far and wide with the whip.

The foolish woman in Kuaiji bought ministers lightly, and Yu also left home and went west to Qin.

Looking up to the sky and laughing and going out, I am a Penghao people.