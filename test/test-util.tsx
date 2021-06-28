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
    const [vdom, setVdom] = useState(updates[0].content)

    setContent = setVdom

    useEffect(effect)
    return vdom
  }

  const run = index => {
    updates[index].test([...document.body.childNodes])
  }

  await testRender(<Component />)

  await run(0)

  for (let i = 1; i < updates.length; i++) {
    await new Promise(resolve => {
      effect = () => {
        run(i)
        resolve(null)
      }
      setContent(updates[i].content)
    })
  }

}
