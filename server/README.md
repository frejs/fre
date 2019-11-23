# fre/server
> server rendering for fre

### Use
```js
function App() {
  useAction(async () => {
    await axios.get('https://api.clicli.us/rank').then(res=>{
      return res.data
    })
  })
  return <div>{

  }</div>
}

router.get('/', async ctx => {
  let content = await renderToString(<App />)
  ctx.body = template.replace('<!-- fre -->', content)
})
```