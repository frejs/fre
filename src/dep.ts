export class Dep {

    subs
    static target

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

    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}

Dep.target = null