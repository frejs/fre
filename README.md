<p align="center"><img src="http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg" alt="fre logo" width="180"></p>
<h1 align="center">Fre</h1>
<p align="center">:ghost: Fast 1kb JavaScript library with Fiber and hooks API</p>
<p align="center">
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/v/fre.svg?style=flat-square" alt="npm-v"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/dm/fre.svg?style=flat-square" alt="npm-d"></a>
<a href="https://bundlephobia.com/result?p=fre"><img src="https://img.shields.io/bundlephobia/minzip/fre.svg?style=flat-square" alt="gzip"></a>
</p>

### Feature

- :tada: hooks API , really functionalComponents
- :confetti_ball: Fiber scheduler instead of diff algorithm
- :telescope: All in one , just 1 KB

### Introduction

Fre (pronounced `/fri:/`, like free) is a tiny and perfect javascript library, It means freedom ~

其实，free 是一部动漫名，也是我最喜欢的番没有之一，haru 是我儿子！ [参见 c 站](https://www.clicli.top/search/free)

### Compare

|  | 尺寸 | 组件化 | 状态更新 |
| :------: | :------: | :------: | :------: |
| fre | 1kb | hooks | Fiber |
| preact | 3kb | class | vdom diff |
| vue | 10kb | SFC | Proxy |
| react | 33kb | class + hooks | Fiber |


### Use

```JavaScript
import { render, h, useState } from 'fre'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('app'))

```

### Hooks API

纯 hooks API，完全移除 class ，class 和 hooks 是水火不容的，没办法配合使用，所以 hooks 对 class 是替代关系，而不是替补关系

``` JavaScript
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

ReactDOM.render(<Counter />, document.getElementById('root'))
```

### FunctionalComponent

新的组件化方案，完全的 functional ，不解释，就是爽，组件通讯和 react 几乎一致

```JavaScript
function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Sex />
    </div>
  )
}

function Sex(props){
  const [sex, setSex] = React.useState(0)
  return (
    <div>
      <h1>{up}</h1>
      <button onClick={() => {sex==='boy'?setSex('girl'):setSex('boy')}}>+</button>
    </div>
  )
}

ReactDOM.render(<Counter />, document.getElementById('root'))
```

### props

props 用于组件间通信，还支持渲染 children

另外，正在考虑将生命周期放到 props 中，也可能是单独写一个生命周期的 hook

```javascript
function Sex(props){
  const [sex, setSex] = React.useState(0)
  return <div>{props.children}</div>
}
```
### Fiber

fre 可以说是 fiber 的最小实现了，不过 fiber 是内部算法，用来替代 diff 的

包含时间切片，调度的极简实现，由于关键的 `requestIdeCallback` 兼容到 ie11，所以如果运行低版本 ie 中需要自行打补丁

#### JSX

默认也对外暴露了 h 函数，可以选用 JSX

```JavaScript
import { h } from 'fre'
```

webpack 需配置：

```JavaScript
{
  "plugins": [
    ["transform-react-jsx", { "pragma":"h" }]
  ]
}
```
当然，如果运行于浏览器环境，推荐 [htm](https://github.com/developit/htm)

#### License

_MIT_ ©132yse
