import { h, useState } from '../src/index'
import { test } from 'zora'
import { testUpdates } from './test-util'

// test('batch updates', async (t) => {
//   console.log()
//   let updates = 0

//   const Component = () => {
//     const [count, setState] = useState(0)
//     updates++
//     const asyncUp = () => {
//       for (let i = 0; i <= 10; i++) {
//         setState(i)
//       }
//     }
//     return <button onClick={asyncUp}>{count}</button>
//   }

//   await testUpdates([
//     {
//       content: <Component />,
//       test: ([button]) => {
//         t.eq(+button.textContent, 0)
//         t.eq(updates, 1)
//         updates = 0
//         button.click()
//       }
//     },
//     {
//       content: <Component />,
//       test: ([button]) => {
//         t.eq(+button.textContent, 10)
//         t.eq(updates, 2)
//       }
//     }
//   ])
// })

// test('render/update object properties and DOM attributes', async (t) => {
//   let lastChildren = []

//   await testUpdates([
//     {
//       content: (
//         <ul>
//           <li class="foo" />
//           <li className="bar" />
//           <li data-something="baz" data-remove-me tabIndex={123} />
//         </ul>
//       ),
//       test: elements => {
//         t.eq(elements[0].tagName, 'UL')
//         t.eq(elements[0].children.length, 3)
//         t.eq(elements[0].children[0].getAttribute('class'), 'foo')
//         t.eq(elements[0].children[1].className, 'bar')
//         t.eq(elements[0].children[2].getAttribute('data-something'), 'baz')
//         t.eq(elements[0].children[2].hasAttribute('data-remove-me'), true)
//         t.eq(elements[0].children[2].tabIndex, 123)

//         lastChildren = [...elements[0].children]
//       }
//     },
//     {
//       content: (
//         <ul>
//           <li class="foo2" />
//           <li className="bar2" />
//           <li data-something="baz2" tabIndex={99} />
//         </ul>
//       ),
//       test: elements => {
//         t.eq(elements[0].tagName, 'UL')
//         t.eq(elements[0].children.length, 3)
//         t.eq(elements[0].children[0].getAttribute('class'), 'foo2')
//         t.eq(elements[0].children[1].className, 'bar2')
//         t.eq(elements[0].children[2].getAttribute('data-something'), 'baz2')
//         t.eq(elements[0].children[2].hasAttribute('data-remove-me'), false)
//         t.eq(elements[0].children[2].tabIndex, 99)

//         lastChildren.forEach((lastChild, index) =>
//           t.eq(elements[0].children[index], lastChild)
//         )
//       }
//     },
//     {
//       content: 'removed',
//       test: ([text]) => {
//         t.eq(text.textContent, 'removed')
//       }
//     }
//   ])
// })