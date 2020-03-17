import { scheduleWork } from './reconciler'
import { getHook, getCursor } from './hooks'

let id = 0
let cursor = getCursor()

export function useContext(context) {
  let [hook, current] = getHook(cursor++)
  const provider = current.context[context.id]
  if (!provider) return context.defaultValue
  if (!hook[0]) {
    hook[0] = true
    provider.sub(current)
  }
  return provider.props.value
}

export function createContext(defaultValue) {
  const context = {
    id,
    defaultValue,
    Consumer(props, context) {
      return props.children(context)
    },
    Provider(props) {
      let [hook, current] = getHook(cursor)
      if (!hook[1]) hook[1] = []
      if (props.value !== hook[0]) {
        hook[0] = props.value
        hook[1].forEach(c => scheduleWork(c))
      }
      if (!current.context) {
        current.context = {}
        current.context[id++] = current
        current.sub = c => hook[1].push(c)
      }
      return props.children
    }
  }
  return context
}
