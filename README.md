<p align="center"><img src="http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg" alt="fre logo" width="180"></p>
<h1 align="center">Fre</h1>
<p align="center">Fast 1kb JavaScript library reactive and no combile.</p>
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

其实，free 是一部动漫名，也是我最喜欢的番没有之一，haru 是我儿子！ [参见c站]()

### Install

```shell
yarn add fre -S
```

### Use

```JavaScript
import{ observe, html, mount } from './src'

function counter() {
  const data = observe({
    count: 0
  })

  return html`
    <div>
      <h1>${data.count}</h1>
      <button onclick=${() => {data.count++}}>+</button>
      <button onclick=${() => {data.count--}}>-</button>
    </div> 
  `
}

mount(html`<${counter} />`, document.body)

```
#### Proxy

```JavaScript
const data = observe({
  count: 0
})
```
会生成一个全递归的 Proxy 对象，会自动去`observe`，data 更新会自动触发 rerender，这个更新是准确

#### tagged template

fre 提供 JSX-like 的 tagged template 语法，浏览器原生支持，无需编译

建议根据场景选择，webpack 下 JSX 比较合适，浏览器环境肯定要 tagged template（如后端语言的模板引擎）

```javascript
html`
  <div>
    <h1>${data.count}</h1>
    <button onclick=${() => {data.count++}}>+</button>
    <button onclick=${() => {data.count--}}>-</button>
  </div> 
`
```
和 jsx 一样，最终会被转换成 h 函数，进而生成 vdom tree

性能不会差，可以粗略理解为 vue 的 compile 过程，如果使用 jsx ，将直接省略这个过程

#### hooks API

其实这里应该叫做`functionalCompoent`比较合适，一种新的组件化方案

如下，fre 和 vue、react 不同，fre 的组件是无自身状态、可复用的标记代码块

只有跟组件拥有全局状态，但这不妨碍你进行多次 render 创造多个跟组件

更多讨论请点击 >[这里](https://github.com/132yse/fre/issues/5)<

```javaScript
import{ mount, html, observe } from 'fre'

function counter() {
  const data = observe({
    count: 0
  })

  return html`
    <div>
      ${html`<${count} count=${data.count} />`}
      <button onclick=${() => {data.count++}}>+</button>
      <button onclick=${() => {data.count--}}>-</button>
    </div> 
  `
}

function count(props){
  return html`
    <h1>${props.count}</h1>
  `
}

mount(html`<${counter} />`, document.body)
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

#### keyed-diff-patch

fre 使用的是 preact 的 diff 方案，vdom 直接和 dom 比对，然后操作 dom，同时 children 还会根据 key 进行重复利用

#### Article

《Fre：又一个小而美的前端MVVM框架》：[知乎](https://zhuanlan.zhihu.com/p/52510521)、[掘金](https://juejin.im/post/5c160f69e51d4529355b89c8)

《fre 揭秘系列：Function.caller 替代方案》：[github](https://github.com/frontend9/fe9-library/issues/188)

#### License
*MIT* Inspirated by vue & react & htm & hyperapp