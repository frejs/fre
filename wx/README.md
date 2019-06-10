### fre/wx
> fre for mini programme, learn once write anywhere.
### Use

```js
import { h, useState } from 'fre'
import { render } from 'fre/wx'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  )
}

render(<Counter />, document.getElementById('root'))
```
p.s. fre 默认的 render 方法是 web 环境，操作 dom

转小程序的原理和 RN 类似，位于 fre/wx 目录下，主要是重新实现 render 方法

在微信小程序中，render 方法主要用来生成 page，然后先走 fre 自身的 reconcile 逻辑，拿到 rootFiber 的 vdom

然后将 fre 生成的 vdom 附加给微信小程序的 vdom ，进而 setData

