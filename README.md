<p align="center"><img src="http://wx2.sinaimg.cn/mw690/0060lm7Tly1ftpm5b3ihfj3096097aaj.jpg" alt="fre logo" width="180"></p>
<h1 align="center">Fre</h1>
<p align="center">Fast 1kb JavaScript library like both React and Vue.</p>
<p align="center">
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/v/fre.svg?style=flat-square" alt="npm-v"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/dm/fre.svg?style=flat-square" alt="npm-d"></a>
</p>

### Feature

- :tada: React-like Component solution with JSX
- :zap: Vue-like Reactivity

### Introduction

Fre (pronounced `/friː/`, like free) is a react-vue-like javascript library

### Install

```shell
yarn add fre -S
```

### Build

```shell
npm run build
```

### Use

```JavaScript
import Fre from 'fre'

class App extends Fre.Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 1
    }
  }

  up() {
    this.state.count++
  }

  down() {
    this.state.count--
  }

  render() {
    return (
      <div>
        <h1>{this.state.count}</h1>
        <button onClick={() => this.up()}>+</button>
        <button onClick={() => this.down()}>-</button>
      </div>
    )
  }
}

Fre.render(<App />, document.body)
```

#### Progress

- [x] JSX
- [x] 虚拟 dom
- [x] diff
- [x] 对象劫持
- [x] 生命周期
- [x] 事件机制
- [ ] nextTick
- [ ] hoc

### p.s.

啊，我实在编不出来英文了，换中文先

Fre 是我“欲”开发的一个前端 mvvm 框架，集 react 和 vue 的优点，以下：

- 拥有和 react 一致的组件化方案，包括 jsx 、类的组件声明方式，生命周期等
- 拥有和 vue 一致的响应式机制，就对象劫持

好吧，其实就是劫持版的 react，也算是 jsx 版本的 vue

接下来我会继续完善，暂时只是一个理想模型，不能用于生产

还有就是

logo！！！终于！！！不 H 了！！！


### ...
暂时比较鸡肋，不能用于线上生产

diff 部分的代码来自：[simple-react](https://github.com/hujiulong/simple-react) ，感谢作者的文章
