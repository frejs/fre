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
      ${html`<${count} count=${state.count} />`}
      <button onclick=${() => {state.count++}}>+</button>
      <button onclick=${() => {state.count--}}>-</button>
    </div> 
  `
}

function count(props){
  const state = useState({
    sex:'boy'
  })
  return html`
    <div>
      <p>${props.count}</p>
      <p>${state.sex}</p>
      <button onclick=${()=>{state.sex=state.sex==='boy'?'girl':'boy'}}>x</button>
    </div>
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
    ["transform-react-jsx", { "pragma":"fre.h" }]
  ]
}
```

#### Article

《Fre：又一个小而美的前端MVVM框架》：[知乎](https://zhuanlan.zhihu.com/p/52510521)、[掘金](https://juejin.im/post/5c160f69e51d4529355b89c8)

#### License
MIT 

Inspirated by react & vue & htm