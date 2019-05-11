<p align="right"><strong>只可亵玩♂ 不可生产</strong></p>
<p align="center"><img src="http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg" alt="fre logo" width="180"></p>
<h1 align="center">Fre</h1>
<p align="center">:ghost: Fast 1kb React-like hooks API js library</p>
<p align="center">
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/v/fre.svg?style=flat-square" alt="npm-v"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/dm/fre.svg?style=flat-square" alt="npm-d"></a>
<a href="https://bundlephobia.com/result?p=fre"><img src="https://img.shields.io/bundlephobia/minzip/fre.svg?style=flat-square" alt="gzip"></a>
</p>

### Feature

- :tada: really functionalComponent, hooks API, render props
- :confetti_ball: Fiber Reconciler and hash keyed diff algorithm
- :telescope: minimal but wonderful , just 1 KB , no dependences

### Introduction

Fre (pronounced `/fri:/`, like free) is a tiny and perfect js library, It means freedom ~

其实，free 是一部动漫名，也是我最喜欢的番没有之一，haru 是我儿子！ [参见 c 站](https://www.clicli.top/search/free)

### Compare

|        | 尺寸 |    组件化     |     特性     |                        路由                        |
| :----: | :--: | :-----------: | :----------: | :------------------------------------------------: |
|  fre   | 1kb  |     hooks     |    Fiber     | [use-routes](https://github.com/132yse/use-routes) |
| preact | 3kb  |     class     |     diff     |                        ...                         |
|  vue   | 10kb |      SFC      | Proxy + diff |                     vue-router                     |
| react  | 33kb | class + hooks |    Fiber     |                    react-router                    |

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

react hooks API 在实现上是个奇迹，这也是我写 fre 的原因（对骚 ♂ API 的痴迷）

hooks API 创造了新的组件化方案，react 由于兼容 class ，所以很多实现上并不纯粹

fre 的世界里，hooks 是主角~

#### useState

useState 是最基本的 API，它传入一个初始值，每次函数执行都能拿到新值

可 use 多次，use 的内容可以是对象或数组

```js
function Counter() {
  const [up, setUp] = useState(0)
  const [down, setDown] = useState(0)
  return (
    <div>
      <h1>{up}</h1>
      <button onClick={() => setUp(up + 1)}>+</button>
      <h1>{down}</h1>
      <button onClick={() => setDown(down -1)}>-</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
```

#### useReducer

useReducer 和 useState 几乎是一样的，需要外置外置 reducer (全局)

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

useEffect 接受两个参数，第一个参数是一个副作用函数，第二个参数是个数组，通常为 props

当第二个参数的某一项发生变化时，执行副作用函数，执行时机为一轮 commit 结束

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

useMemo 和 useEffect 参数一致，不同的是，第一个参数通常是组件函数，马上同步执行

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

context 是在外部 create ，内部 use 的 state，它和全局变量的区别在于，如果多个组件同时 useContext，那么这些组件都会 rerender

而，如果多个组件同时 useState 同一个全局变量，则只有触发 setState 的当前组件 rerender

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

新的组件化方案，完全的 functional，组件通讯和 react 几乎一致

```js
function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Sex count={count}/>
    </div>
  )
}

function Sex(props){
  const [sex, setSex] = useState('boy')
  return (
    <div>
      <h2>{props.count}</h2>
      <h1>{sex}</h1>
      <button onClick={() => {sex==='boy'?setSex('girl'):setSex('boy')}}>x</button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
```

### props

props 用于组件间通信，和 react 行为一致

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

和 react 一样，props 默认包含了 children，用于渲染组件的所有子元素

```js
const HelloBox = () => (
  <Box>
    <h1>Hello world !</h1>
  </Box>
)

const Box = props => <div>{props.children}</div>
```

值得一提，hooks 的世界里，不存在 HOC 和 extends，但是天生支持 render props/children

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

#### Fiber

fre 的 Fiber 架构是 Fiber reconciler 的最小实现，fre Fiber 仅仅是采用了链表的遍历形式，并没能实现对等的调度方案

内部仍然是通过 micro task 控制更新的

#### hash.keyed diff

fre 实现了一个非常精彩的 hash keyed diff 算法，和 react 的排位算法对等，但实现不同

这也是 fre 最精彩的机制之一

#### JSX

默认也对外暴露了 h 函数，可以选用 JSX

```js
import { h } from 'fre'
```

webpack 需配置：

```js
{
  "plugins": [
    ["transform-react-jsx", { "pragma":"h" }]
  ]
}
```

当然，如果是想要用于浏览器环境，可以使用 [htm](https://github.com/developit/htm)

#### License

_MIT_ ©132yse inspired by [anu](https://github.com/RubyLouvre/anu)

