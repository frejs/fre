/** @jsx h */

const Router = require('koa-router')
const path = require('path')
const fs = require('fs')
const { h } = require('../dist/fre.js')
const Koa = require('koa')
const { renderToString, useAction } = require('./index')
const template = fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8')

const App = props => {
  useAction(async () => {
    console.log(111)
  })
  return (<div>hello world</div>)
}
const router = new Router()
const app = new Koa()

router.get('/', async ctx => {
  let content = await renderToString(<App />)
  ctx.body = template.replace('<!-- fre -->', content)
})

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(3000,()=>{
  console.log('app start')
})
