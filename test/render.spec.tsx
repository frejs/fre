import { h } from '../src/index'
import { test } from 'zora'
import { diff } from './diff'
import { update, handler, style, dom } from './update'
import { ref, refer } from './ref'
import { once, change, every } from './effect'
import { svg } from './svg'

test('render', async (t) => {
    await diff(t)
    await update(t)
    await handler(t)
    await style(t)
    await dom(t)
    await ref(t)
    await refer(t)
    await change(t)
    await once(t)
    await every(t)
    await svg(t)
})
