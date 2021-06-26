import { h } from '../src/index'
import { test } from 'zora'
import {diff} from './diff'

test('render', async (t) => {
  await diff(t)
})