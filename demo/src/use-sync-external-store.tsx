import { useState, useEffect, useLayoutEffect } from '../../src'

export function useSyncExternalStore(subscribe, getSnapshot) {
  const value = getSnapshot()
  const [{ inst }, forceUpdate] = useState({ inst: { value, getSnapshot } })
  useLayoutEffect(() => {
    inst.value = value
    inst.getSnapshot = getSnapshot

    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst })
    }
  }, [subscribe, value, getSnapshot])

  useEffect(() => {
    if (checkIfSnapshotChanged(inst)) {
      forceUpdate({ inst })
    }
    const handleStoreChange = () => {
      if (checkIfSnapshotChanged(inst)) {
        forceUpdate({ inst })
      }
    }
    return subscribe(handleStoreChange)
  }, [subscribe])

  return value
}

function checkIfSnapshotChanged(inst) {
  const latestGetSnapshot = inst.getSnapshot
  const prevValue = inst.value
  try {
    const nextValue = latestGetSnapshot()
    return !Object.is(prevValue, nextValue)
  } catch (error) {
    return true
  }
}
