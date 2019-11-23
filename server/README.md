# fre/server

> server rendering for fre, It is still in the experimental stage, do not use it for production environment.

### Use

```js
const { h } = require('fre')
const { renderToString, useAction } = require('fre/server')

function App() {
  const [posts, setPosts] = useState([])
  useAction(async () => {
    await axios.get('https://api.clicli.us/rank').then(res => {
      setPosts(res.data.posts)
    })
  })
  return (
    <div>
      {posts.map(item => (
        <li>{item.title}</li>
      ))}
    </div>
  )
}

router.get('/', async ctx => {
  let content = await renderToString(<App />)
  ctx.body = template.replace('<!-- fre -->', content)
})
```

### RenderToString

```js
let content = await renderToString(<App />)
ctx.body = template.replace('<!-- fre -->', content)
```

`renderToString` will return html strings, you can render with Koa or any other frameworks.

### UseAction

```js
useAction(async () => {
  await axios.get('https://api.clicli.us/rank').then(res => {
    // do somethins
  })
})
```
`useAction` is more like `useEffect`, but it has no cleanups, and it receives a promise function. the requests will excutes in server side.

