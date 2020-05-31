# fre/compat

> Something that can be implemanted in userland.

### Suspense

Suspsnese is a API for promises, it throws a promise and catch it sync.

```js
import { Suspense, lazy } from 'fre/compat'

const A = lazy(() => {
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          default: function Hello() {
            return <div>A</div>
          }
        }),
      1000
    )
  )
})

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <A />
    </Suspense>
  )
}
```
