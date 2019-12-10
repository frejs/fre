/** @jsx h */
import { h, render, useEffect, useState } from '../src'

export const testRender = jsx =>
  new Promise(resolve => {
    document.body.innerHTML = ''

    render(jsx, document.body, () => resolve([...document.body.childNodes]))
  })

export const testUpdates = async updates => {
  let effect = () => {}
  let setContent

  const Component = () => {
    const [content, _setContent] = useState(updates[0].content)

    setContent = _setContent

    useEffect(effect)
    return content
  }

  const run = index => updates[index].test([...document.body.childNodes])

  await testRender(<Component />)

  run(0)

  for (let i = 1; i < updates.length; i++) {
    await new Promise(resolve => {
      effect = () => {
        run(i)
        resolve()
      }

      setContent(updates[i].content)
    })
  }
}
