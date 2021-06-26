import { h, render, useEffect, useState } from '../src/index'

export const testRender = jsx =>
  new Promise(resolve => {
    document.body.innerHTML = ''
    render(jsx, document.body, {
      done: () => resolve([...document.body.childNodes])
    })
  })

export const testUpdates = async updates => {
  let effect = () => { }
  let setContent

  const Component = () => {
    const [content, _setContent] = useState(updates[0].content)

    setContent = _setContent

    useEffect(effect)
    return content
  }

  const run = (index, body) => {
    updates[index].test(body)
  }

  const body = await testRender(<Component />)

  await run(0, body)

  for (let i = 1; i < updates.length; i++) {
    await new Promise(resolve => {
      effect = () => {
        run(i, body)
        resolve('')
      }

      setContent(updates[i].content)
    })
  }

}