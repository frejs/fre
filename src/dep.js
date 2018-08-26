export class Dep {
  constructor() {
    this.subs = []
    this.add = this.add.bind(this)
    this.notify = this.notify.bind(this)
  }

  add(watcher) {
    this.subs.push(watcher)
  }

  clean() {
    this.subs = []
  }

  notify(val, newVal) {
    this.subs.forEach(watcher => watcher.update(val,newVal))
  }
}

Dep.target = null
