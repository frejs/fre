<p align="center"><img src="http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg" alt="fre logo" width="150"></p>
<h1 align="center">Fre</h1>
<p align="center">:ghost: Tiny React16 like framework with Concurrent.</p>
<p align="center">
<a href="https://circleci.com/gh/yisar/fre"><img src="https://img.shields.io/circleci/project/github/yisar/fre.svg?style=flat-square" alt="Build Status"></a>
<a href="https://codecov.io/gh/yisar/fre"><img src="https://img.shields.io/codecov/c/github/yisar/fre.svg?style=flat-square" alt="Code Coverage"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/v/fre.svg?style=flat-square" alt="npm-v"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/dt/fre.svg?style=flat-square" alt="npm-d"></a>
<a href="https://bundlephobia.com/result?p=fre"><img src="https://img.shields.io/bundlephobia/minzip/fre.svg?&style=flat-square" alt="gzip"></a>
<a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square" alt="prettier"></a>
</p>

### Feature

- :tada: Functional Component and hooks API
- :confetti_ball: Concurrent and Suspense
- :telescope: keyed reconcilation algorithm
- :shaved_ice: exact updating(UI = f(state))

#### Contributors

Fre has wonderful code, we need more to join us and improve together.

<a href="https://github.com/yisar/fre/graphs/contributors"><img src="https://opencollective.com/fre/contributors.svg?width=890&button=false" /></a>

#### Sponsors

Use fre and donate us, no matter how much, please let us know

<table><tbody><tr>
<td><a target="_blank" href="https://ke.qq.com/course/368629?flowToken=1015240"><img height="60px" src="https://ws1.sinaimg.cn/large/0065Zy9ely1g983zobxqzj30ka03y0v6.jpg"></a></td>
<td><a target="_blank" href="https://www.clicli.me"><img height="60px" src="https://ws1.sinaimg.cn/large/0065Zy9ely1g983rcrcyuj30a305sgm2.jpg"></a></td>
</tr></table></tbody>
<a target="_blank" href="https://opencollective.com/fre"><img height="60px" src="https://opencollective.com/fre/sponsor.svg?avatarHeight=60"></a>

### Real world

[clicli.me](https://www.clicli.me)

Any other demos [click here](https://github.com/yisar/fre/tree/master/demo/src)

### Use

```shell
yarn add fre
```

```js
import { h, render, useState } from 'fre'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
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

`useState` is a base API, It will receive initial state and return a Array

You can use it many times, new state is available when component is rerender

```js
function App() {
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
    <div>
      {state.count}
      <button onClick={() => dispatch({ type: 'up' })}>+</button>
      <button onClick={() => dispatch({ type: 'down' })}>+</button>
    </div>
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
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}
```

If it return a function, the function can do cleanups:

```js
useEffect(() => {
    document.title = 'count is ' + count
    reutn () => {
      store.unsubscribe()
    }
}, [])
```

#### useLayout

More like useEffect, but useEffect queue in `requestAnimationFrame`, but useLayout is sync and block commitWork.

```js
useLayout(() => {
  document.title = 'count is ' + count
}, [flag])
```

#### useMemo

`useMemo` has the same parameters as `useEffect`, but `useMemo` will return a cached value.

```js
function App() {
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
```

#### useCallback

`useCallback` is based `useMemo`, it will return a cached function.

```js
const cb = useCallback(() => {
  console.log('cb was cached')
}, [])
```

The implement amount to

```js
useMemo(() => cb, deps)
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

### Exact updating

This optimization mainly includes two aspects:

1. Shallow compare props

```js
<Compoent />
<Compoent /> // ×
<Compoent value={111}/>
<Compoent value={111}/> // ×
<Compoent value={222}/> // √
<Compoent value={[]}/>
<Compoent value={[]}/> // √
```

2. `===` compare state

```js
const [state, setState] = useState('hello')
setState('hello') // × because state have not changed
setState('world') // √
```

### render props / children

```js
const HelloBox = () => <Box render={value => <h1>{value}</h1>} />

const Box = props => <div>{props.render('hello world!')}</div>
```

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

### Concurrent

Fre implements a tiny priority scheduler, which called [Concurrent Mode](https://reactjs.org/docs/concurrent-mode-intro.html).

It uses the `linked list` data struct to iterate a tree, which can better break, continue, and fallback.

At the same time, it uses double buffering to separate reading and writing.

Of course, the new data struct brings different algorithms and many possibilities.

#### time slicing

Time slicing is the scheduling of reconcilation, synchronous tasks, sacrifice CPU and reduce blocking time

#### Suspense

Suspense is the scheduling of promise, asynchronous tasks, break current tasks, and continue tasks after promise resolve

#### key-based reconcilation

Fre implements a compact reconcilation algorithm support keyed, which also called diff.

It uses hash to mark locations to reduce much size.

#### License

_MIT_ ©yisar inspired by [react](https://github.com/facebook/react) [preact](https://github.com/preactjs/preact) [anu](https://github.com/RubyLouvre/anu)
