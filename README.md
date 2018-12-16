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
    <p>${props.count}</p>
  `
}

render(h`<${counter} />`, document.body)

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

知乎分享：[Fre：又一个小而美的前端MVVM框架](https://zhuanlan.zhihu.com/p/52510521)

#### License
MIT 

Inspirated by react & vue & htm