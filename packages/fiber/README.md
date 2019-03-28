### fre-fiber

fiber 的另类实现，包含两部分：

##### scheduler

极小的优先级调度器实现，和 react 不同的是，fre 通过 promise 实现的调度

```javascript
const sm = new Scheduler()
const call = key => sm.wrap(() => console.log(key))

const highTask = async () => {
  await call('high task')
}

const lowTask = async i => {
  await call(i)
}

const runHigh = async () => {
  await highTask()
}
const runLow = async () => {
  let i = 0
  while (i < length) {
    await sm.requestIdlePromise() //等待空闲时间
    await new Promise(res => setTimeout(res, 500))
    await lowTask(i)
    i++
  }
}
runLow()

document.querySelector('#myButton').onclick = runHigh()
```