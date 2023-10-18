<p align="center"><img src="https://user-images.githubusercontent.com/44045911/147237798-174728c9-7399-4b47-be39-78ef69198a0d.png" alt="fre logo" width="130"></p>
<h1 align="center">Fre</h1>
<p align="center">👻 Tiny Concurrent UI library with Fiber.</p>
<p align="center">
<a href="https://github.com/yisar/fre/actions"><img src="https://img.shields.io/github/actions/workflow/status/yisar/fre/main.yml" alt="Build Status"></a>
<a href="https://codecov.io/gh/yisar/fre"><img src="https://img.shields.io/codecov/c/github/frejs/fre.svg" alt="Code Coverage"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/v/fre.svg" alt="npm-v"></a>
<a href="https://npmjs.com/package/fre"><img src="https://img.shields.io/npm/dt/fre.svg" alt="npm-d"></a>
<a href="https://bundlephobia.com/result?p=fre"><img src="http://img.badgesize.io/https://unpkg.com/fre/dist/fre.js?compression=brotli&label=brotli" alt="brotli"></a>
</p>

- **Concurrent Mode** — This is an amazing idea, which implements the coroutine scheduler in JavaScript, it also called **Time slicing**.

- **Keyed reconcilation algorithm** — Fre has a minimal longest-common-subsequence algorithm, It supported keyed, pre-process.

- **Do more with less** — After tree shaking, project of hello world is only 1KB, but it has most features, virtual DOM, hooks API, Fragments, Fre.memo and so on.

### Contributors

<a href="https://github.com/yisar/fre/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=yisar/fre" />
</a>

### Usage

```shell
yarn add fre
```

```js
import { render, useState } from 'fre'

function App() {
  const [count, setCount] = useState(0)
  return <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </>
}

render(<App/>, document.body)
```
#### License

MIT @yisar


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fyisar%2Ffre.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fyisar%2Ffre?ref=badge_large)
 
