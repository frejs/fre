**Fre** 是一个基于 Fiber 架构的前端框架，它的核心是异步渲染，主要包括时间切片和 Suspense

和 react 不同的是，fre 使用了更好的 reconcilation 算法，可以进行预处理（两端遍历）

经过 tree shaking 后，hello world 项目只有 2kb，但它拥有很多功能，比如 hooks API，函数组件，Fragment……

## 快速开始

```shell
yarn add fre
```

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

- [useState](https://github.com/yisar/fre#usestate)

- [useEffect](https://github.com/yisar/fre#useeffect)

- [useReducer](https://github.com/yisar/fre#usereducer)

- [useLayout](https://github.com/yisar/fre#uselayout)

- [useCallback](https://github.com/yisar/fre#usecallback)

- [useMemo](https://github.com/yisar/fre#usememo)

- [useRef](https://github.com/yisar/fre#useref)

### useState

useState 是主要的一个 hook，它有一个浅表的优化，即每次 setState 都会和上次的值进行对比

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

useReducer 和 useState 类似，但它使用了 redux 类似的 api，有时候这有利于组织逻辑

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

useEffect 是处理 effect 的一个 hook，它发生在宏任务中，所以可以进行 dom 操作，它的时机和规则如下：

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

返回值是一个函数，用来清理副作用

```js
useEffect(() => {
  document.title = "count is " + count
  return () => {
    store.unsubscribe()
  }
}, [])
```

### useLayout

useLayout 和 useEffect 类似，但它是同步发生的，dom 还没有发生变化，会阻塞渲染

```js
useLayout(() => {
  console.log(dom) // null
}, [flag])
```

### useMemo

`useMemo` 可以缓存一个值，甚至可以用它缓存组件：

```js
const memo = (c) => (props) => useMemo(() => c, [Object.values(props)])
```

### useCallback

`useCallback` 基于 `useMemo`, 只不过是缓存了一个函数

```js
const cb = useCallback(() => {
  console.log("cb was cached")
}, [])
```

### useRef

`useRef` 一般来说是一个函数或对象，对象的 current 是 dom 元素

```js
function App() {
  useEffect(() => {
    console.log(t) // { current:<div>t</div> }
  })
  const t = useRef(null)
  return <div ref={t}>t</div>
}
```

它也可以直接是一个函数，此时可以进行清理工作

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

Suspense 是异步渲染的另一个用例，它的核心是当 Promise 被 throw 出去的时候，组件会进行回退，并悬停，等到 Promise resolve 后再继续渲染

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

每个框架的权衡和发展路线不同，所以强行进行比对是不科学的，但是……我们可以辩证地看待它们

- react

react 是 fre 的灵感来源，所以很大程度上，fre 将会追随 react，它们也拥有一致的发展路线——探索 Concurrent Mode

但有所不同的是，fre 会更加注重核心算法和数据结构

- vue / preact

从某种角度上，vue 和 preact 是类似的，它们都是同步渲染的框架，对用户来说可能代表不了什么

但是同步渲染的实现方式是完全不同的，最终结果是 vue 或 preact 无法支持时间切片

| framework | concurrent | reconcilation algorithm | bundle size |
| --------- | ---------- | ----------------------- | ----------- |
| fre2      | √          | ★★★★                    | 2kb         |
| react17   | √          | ★★                      | 39kb        |
| vue3      | ×          | ★★★★★                   | 30kb        |
| preactX   | ×          | ★★★★                    | 4kb         |

## License

MIT @yisar

Fre is inspired by many libraries, pay our respects to them: [react](https://github.com/facebook/react) [snabbdom](https://github.com/snabbdom/snabbdom) [preact](https://github.com/preactjs/preact) [anu](https://github.com/RubyLouvre/anu)
