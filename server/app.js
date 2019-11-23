/** @jsx h */

const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const { h, useState } = require('./fre-cjs')
const Koa = require('koa')
const { renderToString, useAction } = require('./index')
const template = fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8')
const axios = require('axios')

function App () {
  const [posts, setPosts] = useState([])
  useAction(async () => {
    await axios.get('https://api.clicli.us/rank').then(res => {
      setPosts(res.data.posts)
    })
  })
  return <div>{posts.map(item => <li>{item.title}</li>)}</div>
}
const router = new Router()
const app = new Koa()

router.get('/', async ctx => {
  let content = await renderToString(<App />)
  ctx.body = template.replace('<!-- fre -->', content)
})

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000, () => {
  console.log('app start')
})
