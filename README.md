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
import { useState, html, mount } from 'fre'

function counter() {
  const state = useState({
    count: 0
  })

  return html`
    <div>
      <p>${state.count}</p>
      <button onclick=${() => {state.count++}}>+</button>
      <button onclick=${() => {state.count--}}>-</button>
    </div> 
  `
}

mount(html`<${counter}/>`, document.body)

```

### JSX

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

### p.s.

* 为什么是 tagged template 而不是 JSX 或 模板引擎

我一直在寻找一个无需编译的、浏览器自动运行的写法，诚然 vue 的模板引擎是可以的，然而那种感觉宛如穿越到上个世纪
所以我大胆的使用了 `模板字符串`，出乎意料的是，除了带来 JSX 类似的体验外，还能支持 html 自身的特性：

比如支持 `<i class=icon>` 无需引号、自闭合，还能和 js 隔离，不再担心 calss 和 calssName 的问题

* hooks 风格

其实这次写框架，最初就是因为 hooks，因为 hooks 让所有事情变得简单，function 可以跨越整个世界

* Proxy

这次的 Proxy 写的比较简单，其实它能做的事情很多，甚至 diff 也可以由它来实现，后面满满补充

* vodm diff

伪需求，只是为了更好的抽象，暂时除了减小 dom 操作并没有其他卵用

