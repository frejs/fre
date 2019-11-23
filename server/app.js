const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const { renderToString, useEffect, useState, h } = require('fre')
const template = fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8')

const App = props => {
  useEffect(async () => {
    console.log(111)
  }, [])
  return <div>hello world</div>
}
const router = new Router()
const app = new Koa()

router.get('/', async ctx => {
  let content = await renderToString(<App />)
  ctx.body = template.replace(/\{\{fre\}\}/, content)
})

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000,()=>{
  console.log('app start')
})
