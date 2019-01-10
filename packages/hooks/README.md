## Fre.use

> 40 lines 的 hooks API 方案，性价比高的一比

#### 原理

通过 use 包裹函数使其成为可以使用 hooks 的函数

```javascript
import { use, useState } from 'fre'

function counter() {
  const [count, setCount] = useState(0)
  setCount(count + 1)
  document.querySelector('h1').innerHTML = count
}

counter = use(counter)
```
