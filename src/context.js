import { useState, useEffect } from './hooks'

let context = {}
const defaultReducer = (state, data) => data

class Store {
  constructor (name, store, useReducer) {
    this.name = name
    useReducer
      ? (this.dispatch = store.setState)
      : (this.setState = store.setState)
    this.getState = () => store.state
  }
  setState () {}
  dispatch () {}
}

export const getContext = key => context[key instanceof Store ? key.name : key]

export function createContext (name, state = {}, reducer = defaultReducer) {
  if (typeof name !== 'string') throw 'context name must be a string'
  if (store[name]) throw 'context already exists'

  const store = {
    state,
    reducer,
    setState (action) {
      this.state = this.reducer(this.state, action)
      this.subs.forEach(s => s(this.state))
    },
    subs: []
  }

  store.setState = store.setState.bind(store)
  store.out = new Store(name, store, reducer !== defaultReducer)

  context = { ...context, ...{ [name]: store } }
  return store.out
}

export function useContext (key) {
  const store = getContext(key)
  if (!store) throw 'context does not exists'

  const [state, set] = useState(context.state)

  useEffect(() => {
    store.setters = store.setters.filter(s => s !== set)
  }, [])

  if (!store.setters.includes(set)) store.setters.push(set)

  return [state, store.setState]
}
