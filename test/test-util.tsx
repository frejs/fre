import { h, render, useEffect, useState } from '../src/index'

export const testRender = jsx =>
  new Promise(resolve => {
    document.body.innerHTML = ''

    render(jsx, document.body, () => resolve([...document.body.childNodes as any]))
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
  const run = index => updates[index].test([...document.body.childNodes as any])

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
