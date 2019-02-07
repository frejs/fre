<p align="center"><img src="http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg" alt="fre logo" width="180"></p>
<h1 align="center">Fre</h1>
<p align="center">Fast 1kb JavaScript reactive library and can run directly in brower without compile.</p>
<p align="center">
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/v/fre.svg?style=flat-square" alt="npm-v"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/dm/fre.svg?style=flat-square" alt="npm-d"></a>
</p>

### Feature

- :tada: hooks style makes function run anywhere
- :confetti_ball: tagged template turn to JSX-like
- :mega: Reactive because Proxy
- :telescope: All in one , just 1 KB

### Introduction

Fre (pronounced `/fri:/`, like free) is a tiny and perfect javascript library, It means freedom ~

其实，free 是一部动漫名，也是我最喜欢的番没有之一，haru 是我儿子！ [参见 c 站](https://www.clicli.top/search/free)

### Install

```shell
yarn add fre -S
```

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

#### hooks API

其实这里应该叫做`functionalCompoent`比较合适，一种新的组件化方案

非常感谢 react 发明了 hooks API 这一神作，和 `render props`、`HOC`、`mixin` 不同，它的“状态共享”不借助类

它是真真 ♂ 的 function 自己维护状态

这使得 fre 的组件化得以实现，在此之前，这是 fre 最大的坑，之前的 Proxy 劫持方案，无法记录是状态来自哪里

所以，这次重构，真正使得 fre 成为一个`完整`的框架了，接下来就是优化 diff 等√

```javaScript
import { render, useState, h } from "fre"

function Sex() {
  const [sex, setSex] = useState("boy")
  return (
    <div class="sex">
      <button onClick={() => setSex(sex === "boy" ? "girl" : "boy")}>x</button>
      <Counter sex={sex} />
    </div>
  )
}

function Counter(props) {
  const [count, setCount] = useState(0)
  return (
    <div class="counter">
      <h1>{props.sex}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <h1>{count}</h1>
    </div>
  )
}

render(<Sex />, document.getElementById("app"))
```

### props

虽然 hooks API 使得 state 在 function 内部受控，但是 props 仍然是这个组件从外部接受的√

如下，sex 就是从父组件传下来的

```javascript
function Counter(props) {
  const [count, setCount] = useState(0)
  return (
    <div class="counter">
      <h1>{props.sex}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <h1>{count}</h1>
    </div>
  )
}
```
不过我认为，props 负责的事情，理应更多
我正在思考，生命周期是否要交于 props 控制，或者 useEffects 会更好？

#### JSX

默认也对外暴露了 h 函数，可以选用 JSX

```JavaScript
import { h } from 'fre'
```

webpack 需配置：

```JavaScript
{
  "plugins": [
    ["transform-react-jsx", { "pragma":"Fre.h" }]
  ]
}
```

#### keyed-diff-patch

fre 使用的是 preact 的 diff 方案，vdom 直接和 dom 比对，然后操作 dom，同时 children 还会根据 key 进行重复利用

#### Article

《Fre：又一个小而美的前端 MVVM 框架》：[知乎](https://zhuanlan.zhihu.com/p/52510521)、[掘金](https://juejin.im/post/5c160f69e51d4529355b89c8)

《fre 揭秘系列：Function.caller 替代方案》：[github](https://github.com/frontend9/fe9-library/issues/188)

#### License

_MIT_ Inspirated by react / preact
