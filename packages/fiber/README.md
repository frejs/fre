## fre-fiber

从这次重构开始，不再跟进 react，此处为 fiber 的另类实现，包含两部分：

### scheduler

极小的优先级调度器实现，和 react 不同的是，fre 通过 promise 实现的调度

它负责做的事情很简单，就是负责高优先级的任务尽可能快的执行，低优先级的任务有空就执行

```javascript
const sm = new Scheduler()
const call = key => sm.wrap(() => console.log(key))

const highTask = async () => {
  await call('high task')
}

const lowTask = async i => {
  await call(i)
}
const runLow = async () => {
  while (sm.isIdle()) { //isIdle 作为循环条件
    await sm.requestIdlePromise() //等待空闲时间
    await new Promise(res => setTimeout(res, 500))
    await lowTask(i)
  }
}

const runHigh = async () => {
  await highTask()
}

runLow()

document.querySelector('button').onclick = runHigh()
```

### reconciler

调和器的极小实现，也是 fre 的主逻辑，主要负责遍历链表、更新状态、操作 dom

重要概念：

work 和 commit，两个阶段，work 会进行状态更新和 diff，commit 是操作 dom

WIP 是 work in progress，正在进行的工作

这个方法的两个方法，diff 和 dom 属性更新，将会在 core 包实现