<p align="center"><img src="http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg" alt="fre logo" width="180"></p>
<h1 align="center">Fre</h1>
<p align="center">Fast 1kb JavaScript library tiny and perfect.</p>
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

Fre (pronounced `/fri:/`, like free) is a tiny and perfect javascript library


### Install

```shell
yarn add fre -S
```

### Use

```JavaScript
import{ render, html, useState } from './src'

function counter() {
  const state = useState({
    count: 0
  })

  return html`
    <div>
      <h1>${state.count}</h1>
      <button onclick=${() => {state.count++}}>+</button>
      <button onclick=${() => {state.count--}}>-</button>
    </div> 
  `
}

render(html`<${counter} />`, document.body)

```

#### functionalComponent

如下，fre 和 vue、react 不同，fre 的组件是无自身状态、可复用的标记代码块

只有跟组件拥有全局状态，但这不妨碍你进行多次 render 创造多个跟组件

更多讨论请点击 >[这里](https://github.com/132yse/fre/issues/5)<

```javaScript
import{ render, html, useState } from 'fre'

function counter() {
  const state = useState({
    count: 0
  })

  return html`
    <div>
      ${html`<${count} count=${state.count} />`}
      <button onclick=${() => {state.count++}}>+</button>
      <button onclick=${() => {state.count--}}>-</button>
    </div> 
  `
}

function count(props){
  return html`
    <h1>${props.count}</h1>
  `
}

render(html`<${counter} />`, document.body)
```

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

#### Article

《Fre：又一个小而美的前端MVVM框架》：[知乎](https://zhuanlan.zhihu.com/p/52510521)、[掘金](https://juejin.im/post/5c160f69e51d4529355b89c8)

《fre 揭秘系列：Function.caller 替代方案》：[github](https://github.com/frontend9/fe9-library/issues/188)

#### License
MIT · Inspirated by react & vue & htm & hyperapp