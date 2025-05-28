// import { h, render, useState, Fragment } from "../../src/index"
// function App() {
//     const [bool, setbool] = useState(true)

//     return <div onClick={() => setbool(!bool)}>
//         {bool ? <ul>
//             <li class="foo2" />
//             <li className="bar2" />
//             <li data-something="baz2" tabIndex={99} />
//         </ul> : <div>removed</div>}</div>
// }

// function Li() {
//     return <li>111</li>
// }

// render(<App />, document.getElementById("app"))
import { h, render, useEffect, useState } from '../../src/index'

export const testRender = jsx => {
    return new Promise(resolve => {
        const Wrapper = () => {
            useEffect(() => {
                resolve([...document.body.childNodes])
            }, [])
            return jsx
        }
        document.body.innerHTML = ''
        render(<Wrapper />, document.body)
    })
}

export const testUpdates = async updates => {
    let effect = () => { 

    }
    let setContent

    const Component = () => {
        console.log(444)
        const [vdom, setVdom] = useState(updates[0].content)

        setContent = setVdom

        useEffect(effect)
        return vdom
    }

    const run = index => {
        // setTimeout(()=>{
            updates[index].test([...document.body.childNodes])
        // },1000)
        
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

export const dom = async (t) => {
    let lastChildren = []

    await testUpdates([
        {
            content: (
                <ul>
                    111
                </ul>
            ),
            test: (elements) => {
                console.log(elements)
            },
        },
        // {
        //     content: (
        //         <ul>
        //             <li class="foo2" />
        //             <li className="bar2" />
        //             <li data-something="baz2" tabIndex={99} />
        //         </ul>
        //     ),
        //     test: (elements) => {
        //         console.log(elements)
        //     },
        // },
        {
            content: 'removed',
            test: (text) => {
                console.log(111, text)
                // t.eq(text.textContent, "removed")
            },
        },
    ])
}

dom()
