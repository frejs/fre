const enum Flag {
  Place = 1 << 1,
  Update = 1 << 2,
  Remove = 1 << 3,
  Replace = 1 << 4,
}
export function diff(newArray, oldArray, newStart = 0, newEnd = newArray.length - 1, oldStart = 0, oldEnd = oldArray.length - 1) {
    console.log(newArray,oldArray)
  let keyMap = {},
    unkeyed = [],
    idxUnkeyed = 0,
    ch,
    item,
    k,
    idxInOld,
    key

  let newLen = newEnd - newStart + 1
  let oldLen = oldEnd - oldStart + 1
  let minLen = Math.min(newLen, oldLen)
  let tresh = Array(minLen + 1)
  tresh[0] = -1
  for (var i = 1; i < tresh.length; i++) {
    tresh[i] = oldEnd + 1
  }
  let link = Array(minLen)

  for (i = oldStart; i <= oldEnd; i++) {
    item = oldArray[i]
    key = item.key
    if (key != null) {
      keyMap[key] = i
    } else {
      unkeyed.push(i)
    }
  }

  for (i = newStart; i <= newEnd; i++) {
    ch = newArray[i]
    idxInOld = ch.key == null ? unkeyed[idxUnkeyed++] : keyMap[ch.key]
    if (idxInOld != null) {
      k = findK(tresh, idxInOld)
      if (k >= 0) {
        tresh[k] = idxInOld
        link[k] = { newi: i, oldi: idxInOld, prev: link[k - 1] }
      }
    }
  }

  k = tresh.length - 1
  while (tresh[k] > oldEnd) k--

  let ptr = link[k]
  let diff = Array(oldLen + newLen - k)
  let curNewi = newEnd,
    curOldi = oldEnd
  let d = diff.length - 1
  while (ptr) {
    const { newi, oldi } = ptr
    while (curNewi > newi) {
      diff[d--] = Flag.Replace
      curNewi--
    }
    while (curOldi > oldi) {
      diff[d--] = Flag.Remove
      curOldi--
    }
    diff[d--] = Flag.Update
    curNewi--
    curOldi--
    ptr = ptr.prev
  }
  while (curNewi >= newStart) {
    diff[d--] = Flag.Replace
    curNewi--
  }
  while (curOldi >= oldStart) {
    diff[d--] = Flag.Remove
    curOldi--
  }

  return {
    diff,
    keyMap,
  }
}

function findK(ktr, j) {
  let lo = 1
  let hi = ktr.length - 1
  while (lo <= hi) {
    let mid = (lo + hi) >>> 1
    if (j < ktr[mid]) hi = mid - 1
    else lo = mid + 1
  }
  return lo
}
